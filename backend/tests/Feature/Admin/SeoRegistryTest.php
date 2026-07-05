<?php

namespace Tests\Feature\Admin;

use App\Models\Activity;
use App\Models\Job;
use App\Models\Project;
use App\Models\ProjectCategory;
use App\Models\Role;
use App\Models\SeoPage;
use App\Models\Service;
use App\Models\User;
use Database\Seeders\RoleSeeder;
use Database\Seeders\SeoPageSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class SeoRegistryTest extends TestCase
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

    public function test_static_pages_are_seeded(): void
    {
        $this->seed(SeoPageSeeder::class);

        $this->assertDatabaseCount('seo_pages', 13);
        $this->assertDatabaseHas('seo_pages', [
            'route' => '/',
            'page_name' => 'Home',
            'page_type' => 'static',
            'content_module' => 'website-pages',
            'content_uuid' => null,
        ]);
        $this->assertDatabaseHas('seo_pages', [
            'route' => '/projects',
            'page_name' => 'Selected Projects',
            'page_type' => 'listing',
            'content_module' => 'projects',
        ]);
        $this->assertDatabaseHas('seo_pages', [
            'route' => '/search',
            'page_type' => 'utility',
            'content_module' => 'utility',
        ]);
    }

    public function test_project_creation_creates_seo_page(): void
    {
        Sanctum::actingAs($this->user);

        $category = ProjectCategory::query()->create([
            'title' => 'Hospitality',
            'slug' => 'hospitality',
            'status' => 'published',
        ]);

        $response = $this->postJson('/api/admin/projects', [
            'title' => 'Fairmont Hotel',
            'projectCategoryId' => $category->id,
            'status' => 'published',
        ]);

        $response->assertCreated();

        $projectId = $response->json('data.id');

        $this->assertDatabaseHas('seo_pages', [
            'content_uuid' => $projectId,
            'route' => '/projects/hospitality/fairmont-hotel',
            'page_name' => 'Fairmont Hotel',
            'page_type' => 'project-detail',
            'content_module' => 'projects',
        ]);
    }

    public function test_activity_creation_creates_seo_page(): void
    {
        Sanctum::actingAs($this->user);

        $response = $this->postJson('/api/admin/activities', [
            'title' => 'Community Workshop',
            'status' => 'published',
        ]);

        $response->assertCreated();

        $activityId = $response->json('data.id');

        $this->assertDatabaseHas('seo_pages', [
            'content_uuid' => $activityId,
            'route' => '/about/activities/community-workshop',
            'page_name' => 'Community Workshop',
            'page_type' => 'activity-detail',
            'content_module' => 'activities',
        ]);
    }

    public function test_service_creation_creates_seo_page(): void
    {
        Sanctum::actingAs($this->user);

        $response = $this->postJson('/api/admin/services', [
            'title' => 'BIM Services',
            'status' => 'published',
        ]);

        $response->assertCreated();

        $serviceId = $response->json('data.id');

        $this->assertDatabaseHas('seo_pages', [
            'content_uuid' => $serviceId,
            'route' => '/services/bim-services',
            'page_name' => 'BIM Services',
            'page_type' => 'service',
            'content_module' => 'services',
        ]);
    }

    public function test_job_creation_creates_seo_page(): void
    {
        Sanctum::actingAs($this->user);

        $response = $this->postJson('/api/admin/jobs', [
            'title' => 'Structural Engineer',
            'status' => 'open',
        ]);

        $response->assertCreated();

        $jobId = $response->json('data.id');

        $this->assertDatabaseHas('seo_pages', [
            'content_uuid' => $jobId,
            'route' => '/careers/structural-engineer',
            'page_name' => 'Structural Engineer',
            'page_type' => 'career-detail',
            'content_module' => 'careers',
        ]);
    }

    public function test_category_creation_creates_seo_page(): void
    {
        Sanctum::actingAs($this->user);

        $response = $this->postJson('/api/admin/project-categories', [
            'title' => 'Commercial Projects',
            'status' => 'published',
        ]);

        $response->assertCreated();

        $categoryId = $response->json('data.id');

        $this->assertDatabaseHas('seo_pages', [
            'content_uuid' => $categoryId,
            'route' => '/projects/commercial-projects',
            'page_name' => 'Commercial Projects',
            'page_type' => 'project-category',
            'content_module' => 'projects',
        ]);
    }

    public function test_deleting_content_removes_seo_page(): void
    {
        Sanctum::actingAs($this->user);

        $create = $this->postJson('/api/admin/services', [
            'title' => 'Design Review',
            'status' => 'published',
        ]);

        $serviceId = $create->json('data.id');

        $this->deleteJson("/api/admin/services/{$serviceId}")
            ->assertNoContent();

        $this->assertDatabaseMissing('seo_pages', [
            'content_uuid' => $serviceId,
        ]);
    }

    public function test_slug_update_updates_route(): void
    {
        Sanctum::actingAs($this->user);

        $create = $this->postJson('/api/admin/activities', [
            'title' => 'Annual Gala',
            'status' => 'published',
        ]);

        $activityId = $create->json('data.id');

        $this->putJson("/api/admin/activities/{$activityId}", [
            'slug' => 'annual-charity-gala',
        ])->assertOk();

        $this->assertDatabaseHas('seo_pages', [
            'content_uuid' => $activityId,
            'route' => '/about/activities/annual-charity-gala',
        ]);
    }

    public function test_project_category_slug_update_updates_project_routes(): void
    {
        Sanctum::actingAs($this->user);

        $category = ProjectCategory::query()->create([
            'title' => 'Hospitality',
            'slug' => 'hospitality',
            'status' => 'published',
        ]);

        $project = Project::query()->create([
            'project_category_id' => $category->id,
            'title' => 'Fairmont Hotel',
            'slug' => 'fairmont-hotel',
            'status' => 'published',
        ]);

        $this->putJson("/api/admin/project-categories/{$category->id}", [
            'slug' => 'hotels',
        ])->assertOk();

        $this->assertDatabaseHas('seo_pages', [
            'content_uuid' => $category->id,
            'route' => '/projects/hotels',
        ]);

        $this->assertDatabaseHas('seo_pages', [
            'content_uuid' => $project->id,
            'route' => '/projects/hotels/fairmont-hotel',
        ]);
    }

    public function test_patch_updates_metadata(): void
    {
        Sanctum::actingAs($this->user);
        $this->seed(SeoPageSeeder::class);

        $page = SeoPage::query()->where('route', '/')->firstOrFail();

        $response = $this->patchJson("/api/admin/seo/{$page->id}", [
            'metaTitle' => 'ODEH & PARTNERS DESIGN',
            'metaDescription' => 'Innovative structural engineering across the Middle East.',
        ]);

        $response->assertOk()
            ->assertJsonPath('data.metaTitle', 'ODEH & PARTNERS DESIGN')
            ->assertJsonPath('data.metaDescription', 'Innovative structural engineering across the Middle East.')
            ->assertJsonPath('data.seoStatus', 'complete');

        $this->assertDatabaseHas('seo_pages', [
            'id' => $page->id,
            'meta_title' => 'ODEH & PARTNERS DESIGN',
            'meta_description' => 'Innovative structural engineering across the Middle East.',
        ]);
    }

    public function test_seo_status_calculation(): void
    {
        Sanctum::actingAs($this->user);
        $this->seed(SeoPageSeeder::class);

        $page = SeoPage::query()->where('route', '/connect')->firstOrFail();

        $this->getJson("/api/admin/seo/{$page->id}")
            ->assertOk()
            ->assertJsonPath('data.seoStatus', 'pending');

        $this->patchJson("/api/admin/seo/{$page->id}", [
            'metaTitle' => 'Connect With Us',
        ])->assertOk()
            ->assertJsonPath('data.seoStatus', 'pending');

        $this->patchJson("/api/admin/seo/{$page->id}", [
            'metaDescription' => 'Reach ODEH & PARTNERS DESIGN through our connect page.',
        ])->assertOk()
            ->assertJsonPath('data.seoStatus', 'complete');
    }

    public function test_seo_listing_supports_filters_and_pagination(): void
    {
        Sanctum::actingAs($this->user);
        $this->seed(SeoPageSeeder::class);

        $response = $this->getJson('/api/admin/seo?content_module=website-pages&page_type=about&search=overview');

        $response->assertOk()
            ->assertJsonStructure([
                'data' => [
                    '*' => [
                        'id',
                        'pageName',
                        'route',
                        'pageType',
                        'contentModule',
                        'metaTitle',
                        'metaDescription',
                        'seoStatus',
                        'lastUpdated',
                    ],
                ],
                'meta' => ['currentPage', 'perPage', 'total', 'lastPage'],
            ])
            ->assertJsonPath('data.0.route', '/about/overview');
    }

    public function test_dashboard_counts_include_seo_stats(): void
    {
        Sanctum::actingAs($this->user);
        $this->seed(SeoPageSeeder::class);

        $page = SeoPage::query()->where('route', '/')->firstOrFail();
        $page->update([
            'meta_title' => 'Home Title',
            'meta_description' => 'Home description for search engines.',
        ]);

        $response = $this->getJson('/api/admin/dashboard/stats');

        $response->assertOk()
            ->assertJsonPath('data.seoComplete', 1)
            ->assertJsonPath('data.seoPending', 12);
    }

    public function test_seo_endpoints_require_authentication(): void
    {
        $this->getJson('/api/admin/seo')->assertUnauthorized();
        $this->patchJson('/api/admin/seo/'.fake()->uuid(), [])->assertUnauthorized();
    }
}
