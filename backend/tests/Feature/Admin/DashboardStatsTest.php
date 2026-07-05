<?php

namespace Tests\Feature\Admin;

use App\Models\Role;
use App\Models\User;
use Database\Seeders\RoleSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class DashboardStatsTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed(RoleSeeder::class);
    }

    public function test_dashboard_stats_requires_authentication(): void
    {
        $response = $this->getJson('/api/admin/dashboard/stats');

        $response->assertUnauthorized();
    }

    public function test_dashboard_stats_works_for_authenticated_super_admin(): void
    {
        $role = Role::query()->where('slug', 'super-admin')->firstOrFail();
        $user = User::factory()->create(['role_id' => $role->id]);

        Sanctum::actingAs($user);

        $response = $this->getJson('/api/admin/dashboard/stats');

        $response->assertOk()
            ->assertJson([
                'data' => [
                    'projects' => 0,
                    'categories' => 0,
                    'teamMembers' => 0,
                    'services' => 0,
                    'activities' => 0,
                    'careers' => 0,
                    'applications' => 0,
                    'contactMessages' => 0,
                ],
            ]);
    }
}
