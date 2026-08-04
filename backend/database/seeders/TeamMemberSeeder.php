<?php

namespace Database\Seeders;

use App\Enums\TeamMemberStatus;
use App\Models\TeamCategory;
use App\Models\TeamMember;
use App\Models\TeamRank;
use Illuminate\Database\Seeder;

class TeamMemberSeeder extends Seeder
{
    public function run(): void
    {
        $items = require __DIR__.'/data/team_members.php';
        $categoriesBySlug = TeamCategory::query()->get()->keyBy('slug');
        $ranksBySlug = TeamRank::query()->get()->keyBy('slug');
        $keepSlugs = [];

        foreach ($items as $index => $item) {
            $keepSlugs[] = $item['slug'];

            $category = $categoriesBySlug->get($item['category_slug'] ?? '')
                ?? $categoriesBySlug->get('other-team-members');
            $rank = $ranksBySlug->get($item['rank_slug'] ?? '');

            TeamMember::query()->updateOrCreate(
                ['slug' => $item['slug']],
                [
                    'full_name' => $item['name'],
                    'position' => $item['title'] ?? null,
                    'department' => $category?->name,
                    'category' => $category?->name,
                    'team_category_id' => $category?->id,
                    'team_rank_id' => $rank?->id,
                    'experience' => $item['experience'] ?? null,
                    'photo' => null,
                    'email' => $item['email'] ?? null,
                    'linkedin_url' => $item['linkedin'] ?? $item['linkedin_url'] ?? null,
                    'status' => TeamMemberStatus::Active,
                    'display_order' => $index + 1,
                ],
            );
        }

        // Remove legacy placeholder members that are not on the org chart.
        TeamMember::query()
            ->whereNotIn('slug', $keepSlugs)
            ->delete();
    }
}
