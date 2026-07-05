<?php

namespace Database\Factories;

use App\Enums\JobStatus;
use App\Models\Job;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<Job>
 */
class JobFactory extends Factory
{
    protected $model = Job::class;

    public function definition(): array
    {
        $title = fake()->jobTitle();

        return [
            'title' => $title,
            'slug' => Str::slug($title).'-'.fake()->unique()->numerify('###'),
            'department' => fake()->word(),
            'location' => fake()->city(),
            'employment_type' => 'Full-time',
            'work_mode' => 'On-site',
            'experience_level' => 'Mid-level',
            'posted_date' => now()->toDateString(),
            'closing_date' => now()->addMonth()->toDateString(),
            'short_description' => fake()->sentence(),
            'full_description' => fake()->paragraph(),
            'responsibilities' => [fake()->sentence()],
            'requirements' => [fake()->sentence()],
            'benefits' => [fake()->sentence()],
            'status' => JobStatus::Open,
        ];
    }
}
