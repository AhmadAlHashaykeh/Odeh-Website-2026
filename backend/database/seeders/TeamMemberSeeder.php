<?php

namespace Database\Seeders;

use App\Enums\TeamMemberStatus;
use App\Models\TeamMember;
use Illuminate\Database\Seeder;

class TeamMemberSeeder extends Seeder
{
    public function run(): void
    {
        $items = require __DIR__.'/data/team_members.php';

        foreach ($items as $index => $item) {
            TeamMember::query()->updateOrCreate(
                ['slug' => $item['slug']],
                [
                    'full_name' => $item['name'],
                    'position' => $item['title'] ?? null,
                    'department' => $item['department'] ?? null,
                    'category' => $item['category'] ?? null,
                    'experience' => $item['experience'] ?? null,
                    'photo' => $item['photo'] ?? null,
                    'email' => $item['email'] ?? null,
                    'status' => TeamMemberStatus::Active,
                    'display_order' => $index + 1,
                ],
            );
        }
    }
}
