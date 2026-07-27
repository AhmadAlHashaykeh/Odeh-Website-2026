<?php

namespace Tests\Feature\Public;

use App\Models\Job;
use App\Models\JobApplication;
use App\Models\Role;
use App\Models\User;
use Database\Seeders\RoleSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class JobApplicationSubmissionTest extends TestCase
{
    use RefreshDatabase;

    private Job $job;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed(RoleSeeder::class);
        Storage::fake('private');

        $this->job = Job::factory()->create([
            'slug' => 'senior-structural-engineer',
            'title' => 'Senior Structural Engineer',
        ]);
    }

    public function test_job_application_can_be_submitted_successfully(): void
    {
        $cv = UploadedFile::fake()->create('john-doe-cv.pdf', 500, 'application/pdf');

        $response = $this->post("/api/public/jobs/{$this->job->slug}/applications", [
            'fullName' => 'John Doe',
            'email' => 'john.doe@example.com',
            'phone' => '+962 79 123 4567',
            'location' => 'Amman, Jordan',
            'yearsOfExperience' => 5,
            'linkedin' => 'https://linkedin.com/in/johndoe',
            'coverLetter' => 'I am excited to apply for this role.',
            'cv' => $cv,
        ], ['Accept' => 'application/json']);

        $response->assertCreated()
            ->assertJson([
                'message' => 'Application submitted successfully.',
            ]);

        $this->assertDatabaseHas('job_applications', [
            'job_id' => $this->job->id,
            'full_name' => 'John Doe',
            'email' => 'john.doe@example.com',
            'cv_original_name' => 'john-doe-cv.pdf',
            'status' => 'new',
        ]);
    }

    public function test_invalid_cv_is_rejected(): void
    {
        $cv = UploadedFile::fake()->create('resume.txt', 100, 'text/plain');

        $response = $this->post("/api/public/jobs/{$this->job->slug}/applications", [
            'fullName' => 'John Doe',
            'email' => 'john.doe@example.com',
            'phone' => '+962 79 123 4567',
            'location' => 'Amman, Jordan',
            'yearsOfExperience' => 5,
            'linkedin' => 'https://linkedin.com/in/johndoe',
            'coverLetter' => 'I am excited to apply for this role.',
            'cv' => $cv,
        ], ['Accept' => 'application/json']);

        $response->assertUnprocessable()
            ->assertJsonValidationErrors(['cv']);

        $this->assertDatabaseCount('job_applications', 0);
    }

    public function test_cv_is_stored_on_private_disk(): void
    {
        $cv = UploadedFile::fake()->create('jane-smith-cv.pdf', 500, 'application/pdf');

        $this->post("/api/public/jobs/{$this->job->slug}/applications", [
            'fullName' => 'Jane Smith',
            'email' => 'jane.smith@example.com',
            'phone' => '+962 78 234 5678',
            'location' => 'Irbid, Jordan',
            'yearsOfExperience' => 3,
            'linkedin' => 'https://linkedin.com/in/janesmith',
            'coverLetter' => 'Please find my application attached.',
            'cv' => $cv,
        ], ['Accept' => 'application/json']);

        $application = JobApplication::query()->firstOrFail();

        Storage::disk('private')->assertExists($application->cv_path);
        $this->assertStringStartsWith('cv/', $application->cv_path);
    }

    public function test_job_application_appears_in_admin_listing(): void
    {
        JobApplication::factory()->create([
            'job_id' => $this->job->id,
            'full_name' => 'Ahmad Al-Khatib',
        ]);

        $role = Role::query()->where('slug', 'super-admin')->firstOrFail();
        Sanctum::actingAs(User::factory()->create(['role_id' => $role->id]));

        $response = $this->getJson('/api/admin/job-applications');

        $response->assertOk()
            ->assertJsonPath('meta.total', 1)
            ->assertJsonPath('data.0.fullName', 'Ahmad Al-Khatib')
            ->assertJsonPath('data.0.jobTitle', 'Senior Structural Engineer');
    }

    public function test_admin_can_update_job_application(): void
    {
        $application = JobApplication::factory()->create([
            'job_id' => $this->job->id,
            'status' => 'new',
        ]);

        $role = Role::query()->where('slug', 'super-admin')->firstOrFail();
        Sanctum::actingAs(User::factory()->create(['role_id' => $role->id]));

        $response = $this->patchJson("/api/admin/job-applications/{$application->id}", [
            'status' => 'reviewing',
            'adminNotes' => 'Strong candidate for follow-up.',
        ]);

        $response->assertOk()
            ->assertJsonPath('data.status', 'reviewing')
            ->assertJsonPath('data.adminNotes', 'Strong candidate for follow-up.');

        $this->assertDatabaseHas('job_applications', [
            'id' => $application->id,
            'status' => 'reviewing',
            'admin_notes' => 'Strong candidate for follow-up.',
        ]);
    }

    public function test_admin_can_download_cv_with_original_filename(): void
    {
        Storage::fake('private');

        $cv = UploadedFile::fake()->create('original-cv.pdf', 500, 'application/pdf');
        $storedPath = $cv->store('cv', 'private');

        $application = JobApplication::factory()->create([
            'job_id' => $this->job->id,
            'cv_path' => $storedPath,
            'cv_original_name' => 'original-cv.pdf',
        ]);

        $role = Role::query()->where('slug', 'super-admin')->firstOrFail();
        Sanctum::actingAs(User::factory()->create(['role_id' => $role->id]));

        $response = $this->get("/api/admin/job-applications/{$application->id}/cv");

        $response->assertOk();
        $this->assertStringContainsString('original-cv.pdf', $response->headers->get('content-disposition'));
    }

    public function test_unsupported_job_application_statuses_are_rejected(): void
    {
        $application = JobApplication::factory()->create([
            'job_id' => $this->job->id,
            'status' => 'new',
        ]);

        $role = Role::query()->where('slug', 'super-admin')->firstOrFail();
        Sanctum::actingAs(User::factory()->create(['role_id' => $role->id]));

        foreach (['reviewed', 'read', 'archived', 'pending'] as $invalidStatus) {
            $response = $this->patchJson("/api/admin/job-applications/{$application->id}", [
                'status' => $invalidStatus,
            ]);

            $response->assertUnprocessable()
                ->assertJsonValidationErrors(['status']);
        }

        $this->assertDatabaseHas('job_applications', [
            'id' => $application->id,
            'status' => 'new',
        ]);
    }

    public function test_admin_can_transition_through_supported_application_statuses(): void
    {
        $application = JobApplication::factory()->create([
            'job_id' => $this->job->id,
            'status' => 'new',
        ]);

        $role = Role::query()->where('slug', 'super-admin')->firstOrFail();
        Sanctum::actingAs(User::factory()->create(['role_id' => $role->id]));

        foreach (['reviewing', 'shortlisted', 'hired'] as $status) {
            $response = $this->patchJson("/api/admin/job-applications/{$application->id}", [
                'status' => $status,
            ]);

            $response->assertOk()
                ->assertJsonPath('data.status', $status);

            $this->assertDatabaseHas('job_applications', [
                'id' => $application->id,
                'status' => $status,
            ]);
        }

        $response = $this->patchJson("/api/admin/job-applications/{$application->id}", [
            'status' => 'rejected',
        ]);

        $response->assertOk()
            ->assertJsonPath('data.status', 'rejected');
    }

    public function test_missing_cv_returns_404(): void
    {
        $application = JobApplication::factory()->create([
            'job_id' => $this->job->id,
            'cv_path' => 'cv/missing-file.pdf',
        ]);

        $role = Role::query()->where('slug', 'super-admin')->firstOrFail();
        Sanctum::actingAs(User::factory()->create(['role_id' => $role->id]));

        $response = $this->getJson("/api/admin/job-applications/{$application->id}/cv");

        $response->assertNotFound()
            ->assertJson(['message' => 'CV file not found.']);
    }
}
