<?php

namespace Tests\Feature\Auth;

use App\Models\Role;
use App\Models\User;
use Database\Seeders\RoleSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class LoginTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed(RoleSeeder::class);
    }

    public function test_login_succeeds_with_valid_credentials(): void
    {
        $role = Role::query()->where('slug', 'super-admin')->firstOrFail();

        User::factory()->create([
            'email' => 'admin@odeh.local',
            'password' => Hash::make('OdehLocalDev2026!'),
            'role_id' => $role->id,
        ]);

        $response = $this->postJson('/api/auth/login', [
            'email' => 'admin@odeh.local',
            'password' => 'OdehLocalDev2026!',
        ]);

        $response->assertOk()
            ->assertJsonStructure([
                'data' => [
                    'token',
                    'tokenType',
                    'user' => ['id', 'fullName', 'email'],
                    'role' => ['id', 'name', 'slug'],
                ],
            ]);
    }

    public function test_login_fails_validation_with_invalid_payload(): void
    {
        $response = $this->postJson('/api/auth/login', [
            'email' => 'not-an-email',
        ]);

        $response->assertUnprocessable()
            ->assertJsonValidationErrors(['email', 'password']);
    }
}
