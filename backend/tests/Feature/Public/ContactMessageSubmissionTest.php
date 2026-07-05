<?php

namespace Tests\Feature\Public;

use App\Models\ContactMessage;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ContactMessageSubmissionTest extends TestCase
{
    use RefreshDatabase;

    public function test_contact_message_can_be_submitted_successfully(): void
    {
        $response = $this->postJson('/api/public/contact', [
            'fullName' => 'Rami Khoury',
            'email' => 'rami.khoury@example.com',
            'phone' => '+962 79 234 5678',
            'company' => 'Al-Sharq Development',
            'subject' => 'Project inquiry',
            'message' => 'We would like to discuss structural engineering services.',
        ]);

        $response->assertCreated()
            ->assertJson([
                'message' => 'Your message has been submitted successfully.',
            ]);

        $this->assertDatabaseHas('contact_messages', [
            'full_name' => 'Rami Khoury',
            'email' => 'rami.khoury@example.com',
            'subject' => 'Project inquiry',
            'status' => 'new',
            'priority' => 'normal',
        ]);
    }

    public function test_contact_message_validation_failure(): void
    {
        $response = $this->postJson('/api/public/contact', [
            'fullName' => '',
            'email' => 'not-an-email',
            'phone' => '',
            'subject' => '',
            'message' => '',
        ]);

        $response->assertUnprocessable()
            ->assertJsonValidationErrors(['full_name', 'email', 'phone', 'subject', 'message']);

        $this->assertDatabaseCount('contact_messages', 0);
    }

    public function test_submitted_contact_message_appears_in_admin_listing(): void
    {
        ContactMessage::factory()->create([
            'full_name' => 'Nadia Rahhal',
            'email' => 'nadia.rahhal@example.com',
        ]);

        $role = \App\Models\Role::query()->where('slug', 'super-admin')->firstOrFail();
        $user = \App\Models\User::factory()->create(['role_id' => $role->id]);

        \Laravel\Sanctum\Sanctum::actingAs($user);

        $response = $this->getJson('/api/admin/contact-messages');

        $response->assertOk()
            ->assertJsonPath('meta.total', 1)
            ->assertJsonPath('data.0.fullName', 'Nadia Rahhal')
            ->assertJsonPath('data.0.email', 'nadia.rahhal@example.com');
    }

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed(\Database\Seeders\RoleSeeder::class);
    }
}
