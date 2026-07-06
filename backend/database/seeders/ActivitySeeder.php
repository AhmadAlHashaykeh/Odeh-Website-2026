<?php

namespace Database\Seeders;

use App\Enums\ActivityStatus;
use App\Models\Activity;
use Illuminate\Database\Seeder;

class ActivitySeeder extends Seeder
{
    public function run(): void
    {
        $items = require __DIR__.'/data/activities.php';

        foreach ($items as $index => $item) {
            $description = $item['description'] ?? '';
            if (is_array($description)) {
                $description = implode("\n\n", $description);
            }

            Activity::query()->updateOrCreate(
                ['slug' => $item['slug']],
                [
                    'title' => $item['title'],
                    'location' => $item['location'] ?? null,
                    'description' => $description,
                    'cover_image' => $item['coverImage'] ?? null,
                    'gallery' => $item['gallery'] ?? [],
                    'activity_date' => $item['date'] ?? null,
                    'status' => ActivityStatus::Published,
                    'is_featured' => false,
                    'display_order' => $index + 1,
                ],
            );
        }
    }
}
