<?php

namespace Database\Seeders;

use App\Enums\ServiceStatus;
use App\Models\Service;
use Illuminate\Database\Seeder;

class ServiceSeeder extends Seeder
{
    public function run(): void
    {
        $items = require __DIR__.'/data/services.php';

        foreach ($items as $index => $item) {
            Service::query()->updateOrCreate(
                ['slug' => $item['slug']],
                [
                    'title' => $item['title'],
                    'description' => $item['description'] ?? null,
                    'image' => $item['image'] ?? null,
                    'icon' => null,
                    'used_on_homepage' => true,
                    'display_order' => $index + 1,
                    'status' => ServiceStatus::Published,
                ],
            );
        }
    }
}
