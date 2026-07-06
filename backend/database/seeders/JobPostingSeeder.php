<?php

namespace Database\Seeders;

use App\Enums\JobStatus;
use App\Models\Job;
use Illuminate\Database\Seeder;

class JobPostingSeeder extends Seeder
{
    public function run(): void
    {
        $items = require __DIR__.'/data/jobs.php';

        foreach ($items as $item) {
            Job::query()->updateOrCreate(
                ['slug' => $item['slug']],
                [
                    'title' => $item['title'],
                    'department' => $item['department'] ?? null,
                    'location' => $item['location'] ?? null,
                    'employment_type' => $item['type'] ?? null,
                    'work_mode' => $item['workMode'] ?? null,
                    'experience_level' => $item['experienceLevel'] ?? null,
                    'posted_date' => $item['postedDate'] ?? null,
                    'closing_date' => $item['closingDate'] ?? null,
                    'short_description' => $item['shortDescription'] ?? null,
                    'full_description' => $item['description'] ?? null,
                    'responsibilities' => $item['responsibilities'] ?? [],
                    'requirements' => $item['requirements'] ?? [],
                    'benefits' => $item['benefits'] ?? [],
                    'status' => ($item['status'] ?? 'open') === 'open' ? JobStatus::Open : JobStatus::Closed,
                ],
            );
        }
    }
}
