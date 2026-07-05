<?php

namespace Tests\Feature\Admin;

use App\Models\Activity;
use App\Models\Job;
use App\Models\Project;
use App\Models\ProjectCategory;
use App\Models\Role;
use App\Models\Service;
use App\Models\TeamMember;
use App\Models\User;
use Database\Seeders\RoleSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class ContentCrudTest extends TestCase
{
    use RefreshDatabase;

    private User $user;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed(RoleSeeder::class);

        $role = Role::query()->where('slug', 'super-admin')->firstOrFail();
        $this->user = User::factory()->create(['role_id' => $role->id]);
    }

    /**
     * @return array<int, string>
     */
    public static function listEndpointsProvider(): array
    {
        return [
            ['/api/admin/project-categories'],
            ['/api/admin/projects'],
            ['/api/admin/services'],
            ['/api/admin/activities'],
            ['/api/admin/team-members'],
            ['/api/admin/jobs'],
        ];
    }

    /**
     * @dataProvider listEndpointsProvider
     */
    public function test_authenticated_user_can_list_each_module(string $endpoint): void
    {
        Sanctum::actingAs($this->user);

        $response = $this->getJson($endpoint);

        $response->assertOk()
            ->assertJsonStructure([
                'data',
                'meta' => ['currentPage', 'perPage', 'total', 'lastPage'],
            ]);
    }

    /**
     * @dataProvider listEndpointsProvider
     */
    public function test_unauthenticated_user_cannot_access_admin_crud(string $endpoint): void
    {
        $this->getJson($endpoint)->assertUnauthorized();
        $this->postJson($endpoint, [])->assertUnauthorized();
    }

    public function test_project_category_crud_works(): void
    {
        Sanctum::actingAs($this->user);

        $create = $this->postJson('/api/admin/project-categories', [
            'title' => 'Commercial Projects',
            'status' => 'published',
            'displayOrder' => 1,
        ]);

        $create->assertCreated()
            ->assertJsonPath('data.title', 'Commercial Projects')
            ->assertJsonPath('data.slug', 'commercial-projects')
            ->assertJsonPath('data.status', 'published');

        $id = $create->json('data.id');

        $this->putJson("/api/admin/project-categories/{$id}", [
            'title' => 'Commercial Portfolio',
        ])->assertOk()
            ->assertJsonPath('data.title', 'Commercial Portfolio')
            ->assertJsonPath('data.slug', 'commercial-portfolio');

        $this->deleteJson("/api/admin/project-categories/{$id}")
            ->assertNoContent();

        $this->assertDatabaseMissing('project_categories', ['id' => $id]);
    }

    public function test_project_crud_works(): void
    {
        Sanctum::actingAs($this->user);

        $category = ProjectCategory::query()->create([
            'title' => 'Hospitality',
            'slug' => 'hospitality',
            'status' => 'published',
        ]);

        $create = $this->postJson('/api/admin/projects', [
            'title' => 'Fairmont Hotel',
            'projectCategoryId' => $category->id,
            'status' => 'published',
            'featured' => 'Yes',
            'year' => 2024,
        ]);

        $create->assertCreated()
            ->assertJsonPath('data.title', 'Fairmont Hotel')
            ->assertJsonPath('data.slug', 'fairmont-hotel')
            ->assertJsonPath('data.featured', true)
            ->assertJsonPath('data.category', 'Hospitality');

        $id = $create->json('data.id');

        $this->putJson("/api/admin/projects/{$id}", [
            'title' => 'Fairmont Hotel Amman',
        ])->assertOk()
            ->assertJsonPath('data.slug', 'fairmont-hotel-amman');

        $this->deleteJson("/api/admin/projects/{$id}")
            ->assertNoContent();

        $this->assertDatabaseMissing('projects', ['id' => $id]);
    }

    public function test_service_crud_works(): void
    {
        Sanctum::actingAs($this->user);

        $create = $this->postJson('/api/admin/services', [
            'title' => 'BIM Services',
            'status' => 'published',
            'usedOnHomepage' => 'Yes',
        ]);

        $create->assertCreated()
            ->assertJsonPath('data.slug', 'bim-services')
            ->assertJsonPath('data.usedOnHomepage', true);

        $id = $create->json('data.id');

        $this->putJson("/api/admin/services/{$id}", [
            'status' => 'hidden',
        ])->assertOk()
            ->assertJsonPath('data.status', 'hidden');

        $this->deleteJson("/api/admin/services/{$id}")
            ->assertNoContent();
    }

    public function test_activity_crud_works(): void
    {
        Sanctum::actingAs($this->user);

        $create = $this->postJson('/api/admin/activities', [
            'title' => 'University Lecture',
            'location' => 'Amman',
            'activityDate' => 'September 2023',
            'status' => 'draft',
        ]);

        $create->assertCreated()
            ->assertJsonPath('data.slug', 'university-lecture')
            ->assertJsonPath('data.activityDate', 'September 2023');

        $id = $create->json('data.id');

        $this->putJson("/api/admin/activities/{$id}", [
            'status' => 'published',
            'featured' => true,
        ])->assertOk()
            ->assertJsonPath('data.status', 'published')
            ->assertJsonPath('data.featured', true);

        $this->deleteJson("/api/admin/activities/{$id}")
            ->assertNoContent();
    }

    public function test_team_member_crud_works(): void
    {
        Sanctum::actingAs($this->user);

        $create = $this->postJson('/api/admin/team-members', [
            'fullName' => 'Ahmad Odeh',
            'position' => 'Managing Director',
            'status' => 'active',
        ]);

        $create->assertCreated()
            ->assertJsonPath('data.fullName', 'Ahmad Odeh')
            ->assertJsonPath('data.slug', 'ahmad-odeh');

        $id = $create->json('data.id');

        $this->putJson("/api/admin/team-members/{$id}", [
            'department' => 'Leadership',
        ])->assertOk()
            ->assertJsonPath('data.department', 'Leadership');

        $this->deleteJson("/api/admin/team-members/{$id}")
            ->assertNoContent();
    }

    public function test_job_crud_works(): void
    {
        Sanctum::actingAs($this->user);

        $create = $this->postJson('/api/admin/jobs', [
            'title' => 'Structural Engineer',
            'department' => 'Structural Engineering',
            'employmentType' => 'Full-time',
            'workMode' => 'On-site',
            'status' => 'open',
            'responsibilities' => ['Design review', 'Site visits'],
        ]);

        $create->assertCreated()
            ->assertJsonPath('data.slug', 'structural-engineer')
            ->assertJsonPath('data.employmentType', 'Full-time')
            ->assertJsonPath('data.responsibilitiesCount', 2);

        $id = $create->json('data.id');

        $this->putJson("/api/admin/jobs/{$id}", [
            'status' => 'closed',
        ])->assertOk()
            ->assertJsonPath('data.status', 'closed');

        $this->deleteJson("/api/admin/jobs/{$id}")
            ->assertNoContent();
    }

    public function test_validation_failure_for_required_fields(): void
    {
        Sanctum::actingAs($this->user);

        $this->postJson('/api/admin/project-categories', [])
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['title']);

        $this->postJson('/api/admin/projects', [])
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['title']);

        $this->postJson('/api/admin/services', [])
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['title']);

        $this->postJson('/api/admin/activities', [])
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['title']);

        $this->postJson('/api/admin/team-members', [])
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['full_name']);

        $this->postJson('/api/admin/jobs', [])
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['title']);
    }

    public function test_dashboard_stats_returns_real_content_counts(): void
    {
        Sanctum::actingAs($this->user);

        ProjectCategory::query()->create(['title' => 'Cat A', 'slug' => 'cat-a']);
        Project::query()->create(['title' => 'Proj A', 'slug' => 'proj-a']);
        Service::query()->create(['title' => 'Svc A', 'slug' => 'svc-a']);
        Activity::query()->create(['title' => 'Act A', 'slug' => 'act-a']);
        TeamMember::query()->create(['full_name' => 'Member A', 'slug' => 'member-a']);
        Job::query()->create(['title' => 'Job A', 'slug' => 'job-a']);

        $response = $this->getJson('/api/admin/dashboard/stats');

        $response->assertOk()
            ->assertJson([
                'data' => [
                    'projects' => 1,
                    'categories' => 1,
                    'teamMembers' => 1,
                    'services' => 1,
                    'activities' => 1,
                    'careers' => 1,
                    'applications' => 0,
                    'contactMessages' => 0,
                ],
            ]);
    }
}
