<?php

namespace Database\Seeders;

use App\Enums\TeamMemberStatus;
use App\Models\TeamCategory;
use App\Models\TeamMember;
use App\Support\TeamMemberCategoryMapper;
use Illuminate\Database\Seeder;

class TeamMemberSeeder extends Seeder
{
    public function run(): void
    {
        $items = require __DIR__.'/data/team_members.php';
        $categoriesBySlug = TeamCategory::query()->get()->keyBy('slug');

        foreach ($items as $index => $item) {
            $slug = TeamMemberCategoryMapper::resolveSlug(
                $item['title'] ?? null,
                $item['department'] ?? null,
                $item['category'] ?? null,
            );
            $category = $categoriesBySlug->get($slug) ?? $categoriesBySlug->get('other-team-members');

            TeamMember::query()->updateOrCreate(
                ['slug' => $item['slug']],
                [
                    'full_name' => $item['name'],
                    'position' => $item['title'] ?? null,
                    'department' => $item['department'] ?? null,
                    'category' => $category?->name,
                    'team_category_id' => $category?->id,
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
