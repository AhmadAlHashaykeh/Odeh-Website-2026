<?php

namespace Tests\Feature\Admin;

use App\Models\Role;
use App\Models\User;
use App\Support\CmsModules;
use Database\Seeders\RolePermissionSeeder;
use Database\Seeders\RoleSeeder;
use Database\Seeders\SuperAdminSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class UsersRolesManagementTest extends TestCase
{
    use RefreshDatabase;

    private User $superAdmin;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed(RoleSeeder::class);
        $this->seed(RolePermissionSeeder::class);
        $this->seed(SuperAdminSeeder::class);

        $this->superAdmin = User::query()->where('email', 'admin@odeh.local')->firstOrFail();
    }

    public function test_users_crud_works_for_super_admin(): void
    {
        Sanctum::actingAs($this->superAdmin);

        $role = Role::query()->where('slug', 'viewer')->firstOrFail();

        $create = $this->postJson('/api/admin/users', [
            'fullName' => 'Test User',
            'email' => 'test.user@example.com',
            'password' => 'password123',
            'roleId' => $role->id,
            'department' => 'Engineering',
            'status' => 'active',
        ]);

        $create->assertCreated()
            ->assertJsonPath('data.fullName', 'Test User')
            ->assertJsonPath('data.email', 'test.user@example.com');

        $userId = $create->json('data.id');

        $this->getJson('/api/admin/users')->assertOk()->assertJsonPath('meta.total', 2);

        $this->getJson("/api/admin/users/{$userId}")
            ->assertOk()
            ->assertJsonPath('data.fullName', 'Test User');

        $this->putJson("/api/admin/users/{$userId}", [
            'department' => 'Operations',
        ])->assertOk()->assertJsonPath('data.department', 'Operations');

        $this->deleteJson("/api/admin/users/{$userId}")->assertNoContent();

        $this->assertDatabaseMissing('users', ['id' => $userId]);
    }

    public function test_roles_crud_works_for_super_admin(): void
    {
        Sanctum::actingAs($this->superAdmin);

        $create = $this->postJson('/api/admin/roles', [
            'name' => 'Custom Role',
            'slug' => 'custom-role',
            'description' => 'A custom role for testing.',
            'status' => 'active',
        ]);

        $create->assertCreated()
            ->assertJsonPath('data.name', 'Custom Role')
            ->assertJsonPath('data.slug', 'custom-role');

        $roleId = $create->json('data.id');

        $this->getJson('/api/admin/roles')->assertOk();

        $this->getJson("/api/admin/roles/{$roleId}")
            ->assertOk()
            ->assertJsonPath('data.slug', 'custom-role');

        $this->putJson("/api/admin/roles/{$roleId}", [
            'description' => 'Updated description',
        ])->assertOk()->assertJsonPath('data.description', 'Updated description');

        $this->deleteJson("/api/admin/roles/{$roleId}")->assertNoContent();
    }

    public function test_role_permissions_can_be_replaced(): void
    {
        Sanctum::actingAs($this->superAdmin);

        $role = Role::query()->where('slug', 'viewer')->firstOrFail();

        $payload = collect(CmsModules::all())->map(fn (string $module) => [
            'module' => $module,
            'canView' => $module === CmsModules::PROJECTS,
            'canCreate' => false,
            'canUpdate' => false,
            'canDelete' => false,
        ])->values()->all();

        $response = $this->putJson("/api/admin/roles/{$role->id}/permissions", $payload);

        $response->assertOk();

        $projects = collect($response->json())->firstWhere('module', CmsModules::PROJECTS);
        $this->assertTrue($projects['canView']);
        $this->assertFalse($projects['canCreate']);
    }

    public function test_cannot_delete_super_admin_role(): void
    {
        Sanctum::actingAs($this->superAdmin);

        $role = Role::query()->where('slug', 'super-admin')->firstOrFail();

        $this->deleteJson("/api/admin/roles/{$role->id}")
            ->assertStatus(422);
    }

    public function test_cannot_delete_own_account(): void
    {
        Sanctum::actingAs($this->superAdmin);

        $this->deleteJson("/api/admin/users/{$this->superAdmin->id}")
            ->assertStatus(422);
    }

    public function test_cannot_delete_last_super_admin_user(): void
    {
        Sanctum::actingAs($this->superAdmin);

        $this->deleteJson("/api/admin/users/{$this->superAdmin->id}")
            ->assertStatus(422);

        $this->assertDatabaseHas('users', ['id' => $this->superAdmin->id]);
    }

    public function test_cannot_demote_last_super_admin(): void
    {
        Sanctum::actingAs($this->superAdmin);

        $viewerRole = Role::query()->where('slug', 'viewer')->firstOrFail();

        $this->putJson("/api/admin/users/{$this->superAdmin->id}", [
            'roleId' => $viewerRole->id,
        ])->assertUnprocessable()
            ->assertJsonValidationErrors(['role_id']);
    }
}
