<?php

namespace Database\Seeders;

use App\Models\TeamCategory;
use App\Models\TeamMember;
use App\Support\TeamMemberCategoryMapper;
use Illuminate\Database\Seeder;

class TeamCategorySeeder extends Seeder
{
    public function run(): void
    {
        $items = require __DIR__.'/data/team_categories.php';

        foreach ($items as $item) {
            TeamCategory::query()->updateOrCreate(
                ['slug' => $item['slug']],
                [
                    'name' => $item['name'],
                    'description' => $item['description'] ?? null,
                    'border_color' => $item['border_color'],
                    'icon' => $item['icon'] ?? null,
                    'parent_id' => null,
                    'display_order' => $item['display_order'],
                    'is_active' => true,
                ],
            );
        }

        $categoriesBySlug = TeamCategory::query()->get()->keyBy('slug');

        TeamMember::query()
            ->where(function ($query): void {
                $query->whereNull('team_category_id')
                    ->orWhereDoesntHave('teamCategory');
            })
            ->each(function (TeamMember $member) use ($categoriesBySlug): void {
                $slug = TeamMemberCategoryMapper::resolveSlug(
                    $member->position,
                    $member->department,
                    $member->category,
                );

                $category = $categoriesBySlug->get($slug) ?? $categoriesBySlug->get('other-team-members');

                if (! $category) {
                    return;
                }

                $member->forceFill([
                    'team_category_id' => $category->id,
                    'category' => $category->name,
                ])->saveQuietly();
            });
    }
}
