<?php

namespace Database\Factories;

use App\Enums\ContactMessagePriority;
use App\Enums\ContactMessageStatus;
use App\Models\ContactMessage;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<ContactMessage>
 */
class ContactMessageFactory extends Factory
{
    protected $model = ContactMessage::class;

    public function definition(): array
    {
        return [
            'full_name' => fake()->name(),
            'email' => fake()->safeEmail(),
            'phone' => fake()->phoneNumber(),
            'company' => fake()->optional()->company(),
            'subject' => fake()->sentence(),
            'message' => fake()->paragraph(),
            'status' => ContactMessageStatus::New,
            'priority' => ContactMessagePriority::Normal,
            'assigned_user_id' => null,
            'admin_notes' => null,
        ];
    }
}
