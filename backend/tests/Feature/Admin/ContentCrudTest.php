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
            ['/api/admin/team-categories'],
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
            ->assertJsonPath('data.title', 'Fairmont Hotel Amman')
            ->assertJsonPath('data.slug', 'fairmont-hotel');

        $this->deleteJson("/api/admin/projects/{$id}")
            ->assertNoContent();

        $this->assertDatabaseMissing('projects', ['id' => $id]);
    }

    public function test_project_completion_status_persists_on_create_and_update(): void
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
            'completionStatus' => 'Completed, 2023',
            'status' => 'published',
        ]);

        $create->assertCreated()
            ->assertJsonPath('data.completionStatus', 'Completed, 2023');

        $id = $create->json('data.id');

        $this->assertDatabaseHas('projects', [
            'id' => $id,
            'completion_status' => 'Completed, 2023',
        ]);

        $this->putJson("/api/admin/projects/{$id}", [
            'completionStatus' => 'In Progress',
        ])->assertOk()
            ->assertJsonPath('data.completionStatus', 'In Progress');

        $this->assertDatabaseHas('projects', [
            'id' => $id,
            'completion_status' => 'In Progress',
        ]);
    }

    public function test_project_slug_is_preserved_unless_explicitly_changed(): void
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
        ]);

        $create->assertCreated()->assertJsonPath('data.slug', 'fairmont-hotel');
        $id = $create->json('data.id');

        $this->putJson("/api/admin/projects/{$id}", [
            'title' => 'Fairmont Hotel Amman',
        ])->assertOk()
            ->assertJsonPath('data.slug', 'fairmont-hotel');

        $this->putJson("/api/admin/projects/{$id}", [
            'slug' => 'fairmont-amman',
        ])->assertOk()
            ->assertJsonPath('data.slug', 'fairmont-amman');
    }

    public function test_project_duplicate_slug_in_same_category_fails_validation(): void
    {
        Sanctum::actingAs($this->user);

        $category = ProjectCategory::query()->create([
            'title' => 'Hospitality',
            'slug' => 'hospitality',
            'status' => 'published',
        ]);

        Project::query()->create([
            'title' => 'Existing Project',
            'slug' => 'shared-slug',
            'project_category_id' => $category->id,
            'status' => 'published',
        ]);

        $this->postJson('/api/admin/projects', [
            'title' => 'Another Project',
            'slug' => 'shared-slug',
            'projectCategoryId' => $category->id,
            'status' => 'published',
        ])->assertUnprocessable()
            ->assertJsonValidationErrors(['slug']);

        $create = $this->postJson('/api/admin/projects', [
            'title' => 'Editable Project',
            'projectCategoryId' => $category->id,
            'status' => 'published',
        ])->assertCreated();

        $this->putJson('/api/admin/projects/'.$create->json('data.id'), [
            'slug' => 'shared-slug',
        ])->assertUnprocessable()
            ->assertJsonValidationErrors(['slug']);
    }

    public function test_job_slug_is_preserved_unless_explicitly_changed(): void
    {
        Sanctum::actingAs($this->user);

        $create = $this->postJson('/api/admin/jobs', [
            'title' => 'Structural Engineer',
            'status' => 'open',
        ]);

        $create->assertCreated()->assertJsonPath('data.slug', 'structural-engineer');
        $id = $create->json('data.id');

        $this->putJson("/api/admin/jobs/{$id}", [
            'title' => 'Senior Structural Engineer',
        ])->assertOk()
            ->assertJsonPath('data.slug', 'structural-engineer');

        $this->putJson("/api/admin/jobs/{$id}", [
            'slug' => 'senior-structural-engineer',
        ])->assertOk()
            ->assertJsonPath('data.slug', 'senior-structural-engineer');
    }

    public function test_job_duplicate_slug_fails_validation(): void
    {
        Sanctum::actingAs($this->user);

        Job::query()->create([
            'title' => 'Existing Role',
            'slug' => 'existing-role',
            'status' => 'open',
        ]);

        $this->postJson('/api/admin/jobs', [
            'title' => 'Another Role',
            'slug' => 'existing-role',
            'status' => 'open',
        ])->assertUnprocessable()
            ->assertJsonValidationErrors(['slug']);

        $create = $this->postJson('/api/admin/jobs', [
            'title' => 'Editable Role',
            'status' => 'open',
        ])->assertCreated();

        $this->putJson('/api/admin/jobs/'.$create->json('data.id'), [
            'slug' => 'existing-role',
        ])->assertUnprocessable()
            ->assertJsonValidationErrors(['slug']);
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

        $category = \App\Models\TeamCategory::query()->create([
            'name' => 'Structural Engineering',
            'slug' => 'structural-engineering-test',
            'border_color' => '#00a8c9',
            'display_order' => 1,
            'is_active' => true,
        ]);

        $rank = \App\Models\TeamRank::query()->create([
            'name' => 'Senior Engineer',
            'slug' => 'senior-engineer-test',
            'color' => '#E85A78',
            'display_order' => 1,
            'is_active' => true,
        ]);

        $create = $this->postJson('/api/admin/team-members', [
            'fullName' => 'Ahmad Odeh',
            'position' => 'Managing Director',
            'teamCategoryId' => $category->id,
            'teamRankId' => $rank->id,
            'status' => 'active',
        ]);

        $create->assertCreated()
            ->assertJsonPath('data.fullName', 'Ahmad Odeh')
            ->assertJsonPath('data.slug', 'ahmad-odeh')
            ->assertJsonPath('data.teamCategoryId', $category->id)
            ->assertJsonPath('data.teamRankId', $rank->id)
            ->assertJsonPath('data.category.name', 'Structural Engineering')
            ->assertJsonPath('data.rank.name', 'Senior Engineer');

        $id = $create->json('data.id');

        $this->putJson("/api/admin/team-members/{$id}", [
            'department' => 'Leadership',
        ])->assertOk()
            ->assertJsonPath('data.department', 'Leadership');

        $this->deleteJson("/api/admin/team-members/{$id}")
            ->assertNoContent();
    }

    public function test_team_category_crud_and_delete_guard_work(): void
    {
        Sanctum::actingAs($this->user);

        $create = $this->postJson('/api/admin/team-categories', [
            'name' => 'Founders & Executive Leadership',
            'borderColor' => '#c9a66b',
            'status' => 'active',
        ]);

        $create->assertCreated()
            ->assertJsonPath('data.name', 'Founders & Executive Leadership')
            ->assertJsonPath('data.borderColor', '#c9a66b')
            ->assertJsonPath('data.isActive', true);

        $id = $create->json('data.id');

        $this->putJson("/api/admin/team-categories/{$id}", [
            'description' => 'Strategic leadership guiding the practice.',
        ])->assertOk()
            ->assertJsonPath('data.description', 'Strategic leadership guiding the practice.');

        $member = TeamMember::query()->create([
            'full_name' => 'Test Member',
            'slug' => 'test-member',
            'team_category_id' => $id,
            'status' => 'active',
            'display_order' => 1,
        ]);

        $this->deleteJson("/api/admin/team-categories/{$id}")
            ->assertUnprocessable()
            ->assertJsonFragment(['message' => 'Cannot delete "Founders & Executive Leadership" because it still has 1 team member(s). Reassign or remove those members first.']);

        $member->delete();

        $this->deleteJson("/api/admin/team-categories/{$id}")
            ->assertNoContent();
    }

    public function test_team_category_reorder_updates_display_order(): void
    {
        Sanctum::actingAs($this->user);

        $first = \App\Models\TeamCategory::query()->create([
            'name' => 'Alpha',
            'slug' => 'alpha',
            'border_color' => '#c9a66b',
            'display_order' => 1,
            'is_active' => true,
        ]);
        $second = \App\Models\TeamCategory::query()->create([
            'name' => 'Beta',
            'slug' => 'beta',
            'border_color' => '#4a7ab0',
            'display_order' => 2,
            'is_active' => true,
        ]);

        $this->postJson('/api/admin/team-categories/reorder', [
            'orderedIds' => [$second->id, $first->id],
        ])->assertOk();

        $this->assertSame(1, $second->fresh()->display_order);
        $this->assertSame(2, $first->fresh()->display_order);
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
                    'seoComplete' => 0,
                    'seoPending' => 4,
                ],
            ]);
    }
}
