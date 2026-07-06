<?php

namespace Tests\Feature\Auth;

use App\Models\Role;
use App\Models\User;
use Database\Seeders\RoleSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class AuthenticatedUserTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed(RoleSeeder::class);
    }

    public function test_authenticated_user_endpoint_returns_user_and_role(): void
    {
        $role = Role::query()->where('slug', 'super-admin')->firstOrFail();
        $user = User::factory()->create(['role_id' => $role->id]);

        Sanctum::actingAs($user);

        $response = $this->getJson('/api/auth/user');

        $response->assertOk()
            ->assertJsonPath('data.user.email', $user->email)
            ->assertJsonPath('data.role.slug', 'super-admin');
    }
}
