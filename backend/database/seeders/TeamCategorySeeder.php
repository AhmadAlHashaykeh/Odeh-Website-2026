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

        // Remove legacy categories that are no longer on the org chart.
        TeamCategory::query()
            ->whereNotIn('slug', $keepSlugs)
            ->each(function (TeamCategory $category): void {
                if ($category->members()->exists()) {
                    $category->forceFill(['is_active' => false])->saveQuietly();

                    return;
                }

                $category->delete();
            });

        // Clean empty inactive leftovers from earlier seed runs.
        TeamCategory::query()
            ->where('is_active', false)
            ->whereNotIn('slug', $keepSlugs)
            ->whereDoesntHave('members')
            ->delete();

        $fallback = TeamCategory::query()->where('slug', 'other-team-members')->first();

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
                ])->saveQuietly();
            });
    }
}
