<?php

namespace Tests\Feature\Admin;

use App\Models\ContactMessage;
use App\Models\JobApplication;
use App\Models\Role;
use App\Models\User;
use Database\Seeders\RoleSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class IntakeDashboardStatsTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed(RoleSeeder::class);
    }

    public function test_dashboard_reports_application_count(): void
    {
        JobApplication::factory()->count(3)->create();

        $role = Role::query()->where('slug', 'super-admin')->firstOrFail();
        Sanctum::actingAs(User::factory()->create(['role_id' => $role->id]));

        $response = $this->getJson('/api/admin/dashboard/stats');

        $response->assertOk()
            ->assertJsonPath('data.applications', 3);
    }

    public function test_dashboard_reports_contact_message_count(): void
    {
        ContactMessage::factory()->count(2)->create();

        $role = Role::query()->where('slug', 'super-admin')->firstOrFail();
        Sanctum::actingAs(User::factory()->create(['role_id' => $role->id]));

        $response = $this->getJson('/api/admin/dashboard/stats');

        $response->assertOk()
            ->assertJsonPath('data.contactMessages', 2);
    }
}
