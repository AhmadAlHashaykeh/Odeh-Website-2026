<?php

namespace Database\Factories;

use App\Enums\JobApplicationStatus;
use App\Models\Job;
use App\Models\JobApplication;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<JobApplication>
 */
class JobApplicationFactory extends Factory
{
    protected $model = JobApplication::class;

    public function definition(): array
    {
        return [
            'job_id' => Job::factory(),
            'full_name' => fake()->name(),
            'email' => fake()->safeEmail(),
            'phone' => fake()->phoneNumber(),
            'location' => fake()->city(),
            'years_of_experience' => fake()->numberBetween(0, 15),
            'linkedin_url' => 'https://linkedin.com/in/'.fake()->userName(),
            'cover_letter' => fake()->paragraph(),
            'cv_path' => 'cv/'.fake()->uuid().'.pdf',
            'cv_original_name' => fake()->lastName().'-CV.pdf',
            'cv_size' => fake()->numberBetween(100_000, 2_000_000),
            'status' => JobApplicationStatus::New,
            'admin_notes' => null,
        ];
    }
}
