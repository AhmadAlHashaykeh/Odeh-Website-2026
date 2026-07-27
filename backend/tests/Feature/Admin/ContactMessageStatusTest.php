<?php

namespace Tests\Feature\Admin;

use App\Models\ContactMessage;
use App\Models\Role;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class ContactMessageStatusTest extends TestCase
{
    use RefreshDatabase;

    private User $admin;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed(\Database\Seeders\RoleSeeder::class);

        $role = Role::query()->where('slug', 'super-admin')->firstOrFail();
        $this->admin = User::factory()->create(['role_id' => $role->id]);
    }

    public function test_admin_can_mark_contact_message_in_progress(): void
    {
        Sanctum::actingAs($this->admin);

        $message = ContactMessage::factory()->create(['status' => 'new']);

        $response = $this->patchJson("/api/admin/contact-messages/{$message->id}", [
            'status' => 'in_progress',
        ]);

        $response->assertOk()
            ->assertJsonPath('data.status', 'in_progress');

        $this->assertDatabaseHas('contact_messages', [
            'id' => $message->id,
            'status' => 'in_progress',
        ]);
    }

    public function test_admin_can_mark_contact_message_resolved(): void
    {
        Sanctum::actingAs($this->admin);

        $message = ContactMessage::factory()->create(['status' => 'in_progress']);

        $response = $this->patchJson("/api/admin/contact-messages/{$message->id}", [
            'status' => 'resolved',
        ]);

        $response->assertOk()
            ->assertJsonPath('data.status', 'resolved');

        $this->assertDatabaseHas('contact_messages', [
            'id' => $message->id,
            'status' => 'resolved',
        ]);
    }

    public function test_unsupported_contact_message_statuses_are_rejected(): void
    {
        Sanctum::actingAs($this->admin);

        $message = ContactMessage::factory()->create(['status' => 'new']);

        foreach (['read', 'replied', 'archived', 'reviewed'] as $invalidStatus) {
            $response = $this->patchJson("/api/admin/contact-messages/{$message->id}", [
                'status' => $invalidStatus,
            ]);

            $response->assertUnprocessable()
                ->assertJsonValidationErrors(['status']);
        }

        $this->assertDatabaseHas('contact_messages', [
            'id' => $message->id,
            'status' => 'new',
        ]);
    }
}
