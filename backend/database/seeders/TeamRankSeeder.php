<?php

namespace Database\Seeders;

use App\Models\TeamRank;
use Illuminate\Database\Seeder;

class TeamRankSeeder extends Seeder
{
    public function run(): void
    {
        $items = require __DIR__.'/data/team_ranks.php';

        foreach ($items as $item) {
            TeamRank::query()->updateOrCreate(
                ['slug' => $item['slug']],
                [
                    'name' => $item['name'],
                    'color' => $item['color'],
                    'display_order' => $item['display_order'],
                    'is_active' => true,
                ],
            );
        }
    }
}
