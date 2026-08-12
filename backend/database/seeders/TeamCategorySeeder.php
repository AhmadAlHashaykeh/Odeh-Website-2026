<?php

namespace Database\Seeders;

use App\Models\TeamCategory;
use App\Models\TeamMember;
use Illuminate\Database\Seeder;

class TeamCategorySeeder extends Seeder
{
    public function run(): void
    {
        $items = require __DIR__.'/data/team_categories.php';
        $keepSlugs = [];

        foreach ($items as $item) {
            $keepSlugs[] = $item['slug'];

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

        $fallback = TeamCategory::query()->where('slug', 'team-members')->first();

        // Reassign members from removed/legacy categories, then delete those categories.
        TeamCategory::query()
            ->whereNotIn('slug', $keepSlugs)
            ->each(function (TeamCategory $category) use ($fallback): void {
                if ($fallback && $category->members()->exists()) {
                    TeamMember::query()
                        ->where('team_category_id', $category->id)
                        ->each(function (TeamMember $member) use ($fallback): void {
                            $member->forceFill([
                                'team_category_id' => $fallback->id,
                                'category' => $fallback->name,
                                'department' => $fallback->name,
                            ])->saveQuietly();
                        });
                }

                $category->delete();
            });

        if (! $fallback) {
            return;
        }

        TeamMember::query()
            ->where(function ($query): void {
                $query->whereNull('team_category_id')
                    ->orWhereDoesntHave('teamCategory');
            })
            ->each(function (TeamMember $member) use ($fallback): void {
                $member->forceFill([
                    'team_category_id' => $fallback->id,
                    'category' => $fallback->name,
                    'department' => $fallback->name,
                ])->saveQuietly();
            });
    }
}
