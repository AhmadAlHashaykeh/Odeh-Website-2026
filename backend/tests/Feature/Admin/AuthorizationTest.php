<?php

namespace Tests\Feature\Admin;

use App\Models\Role;
use App\Models\User;
use Database\Seeders\RolePermissionSeeder;
use Database\Seeders\RoleSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class AuthorizationTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed(RoleSeeder::class);
        $this->seed(RolePermissionSeeder::class);
    }

    private function actingAsRole(string $slug): User
    {
        $role = Role::query()->where('slug', $slug)->firstOrFail();
        $user = User::factory()->create(['role_id' => $role->id]);

        Sanctum::actingAs($user);

        return $user;
    }

    public function test_viewer_cannot_create_projects(): void
    {
        $this->actingAsRole('viewer');

        $this->postJson('/api/admin/projects', [
            'title' => 'Unauthorized Project',
            'status' => 'published',
        ])->assertForbidden();
    }

    public function test_seo_manager_cannot_edit_projects(): void
    {
        $this->actingAsRole('seo-manager');

        $this->postJson('/api/admin/projects', [
            'title' => 'Unauthorized Project',
            'status' => 'published',
        ])->assertForbidden();

        $this->getJson('/api/admin/projects')->assertForbidden();
    }

    public function test_hr_manager_cannot_edit_services(): void
    {
        $this->actingAsRole('hr-manager');

        $this->postJson('/api/admin/services', [
            'title' => 'Unauthorized Service',
            'status' => 'published',
        ])->assertForbidden();

        $this->getJson('/api/admin/services')->assertForbidden();
    }

    public function test_super_admin_bypasses_module_restrictions(): void
    {
        $role = Role::query()->where('slug', 'super-admin')->firstOrFail();
        Sanctum::actingAs(User::factory()->create(['role_id' => $role->id]));

        $this->getJson('/api/admin/projects')->assertOk();
        $this->getJson('/api/admin/services')->assertOk();
        $this->getJson('/api/admin/seo')->assertOk();
        $this->getJson('/api/admin/users')->assertOk();
    }

    public function test_content_manager_can_create_projects(): void
    {
        $this->actingAsRole('content-manager');

        $this->postJson('/api/admin/projects', [
            'title' => 'Authorized Project',
            'status' => 'published',
        ])->assertCreated();
    }

    public function test_hr_manager_can_manage_jobs(): void
    {
        $this->actingAsRole('hr-manager');

        $this->getJson('/api/admin/jobs')->assertOk();

        $this->postJson('/api/admin/jobs', [
            'title' => 'HR Posted Job',
            'status' => 'open',
        ])->assertCreated();
    }

    public function test_seo_manager_can_update_seo_pages(): void
    {
        $this->actingAsRole('seo-manager');

        $this->getJson('/api/admin/seo')->assertOk();
    }
}
