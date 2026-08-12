<?php

namespace Database\Seeders;

use App\Enums\ProjectCategoryStatus;
use App\Enums\ProjectStatus;
use App\Models\Project;
use App\Models\ProjectCategory;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\File;

class ProjectContentSeeder extends Seeder
{
    public function run(): void
    {
        $path = __DIR__.'/data/projects_content.json';
        $payload = json_decode(File::get($path), true, 512, JSON_THROW_ON_ERROR);
        $categoryMap = [];
        $incomingCategorySlugs = collect($payload['categories'])->pluck('slug')->all();
        $incomingProjectKeys = collect($payload['projects'])
            ->map(fn (array $project) => ($project['categorySlug'] ?? '').'|'.$project['slug'])
            ->all();

        foreach ($payload['categories'] as $index => $category) {
            $model = ProjectCategory::query()->updateOrCreate(
                ['slug' => $category['slug']],
                [
                    'title' => $category['title'],
                    'description' => $category['description'] ?? null,
                    'cover_image' => $category['coverImage'] ?? null,
                    'featured_image' => $category['coverImage'] ?? null,
                    'status' => ProjectCategoryStatus::Published,
                    'display_order' => $index + 1,
                ],
            );

            $categoryMap[$category['slug']] = $model->id;
        }

        ProjectCategory::query()
            ->whereNotIn('slug', $incomingCategorySlugs)
            ->delete();

        $featuredSlugs = ['himmeh-resort', 'fairmont-hotel', 'sharaan-resort', 'centennial-park'];

        foreach ($payload['projects'] as $index => $project) {
            $categoryId = $categoryMap[$project['categorySlug']] ?? null;

            Project::query()->updateOrCreate(
                [
                    'project_category_id' => $categoryId,
                    'slug' => $project['slug'],
                ],
                [
                    'title' => $project['title'],
                    'description' => $project['description'] ?? null,
                    'cover_image' => $project['coverImage'] ?? null,
                    'gallery' => $project['gallery'] ?? [],
                    'location' => $project['location'] ?? null,
                    'architect' => $project['architect'] ?? null,
                    'project_type' => $project['type'] ?? null,
                    'area' => $project['area'] ?? null,
                    'services' => $project['services'] ?? null,
                    'completion_status' => $project['status'] ?? null,
                    'year' => isset($project['year']) ? (int) $project['year'] : null,
                    'status' => ProjectStatus::Published,
                    'is_featured' => in_array($project['slug'], $featuredSlugs, true),
                    'display_order' => $index + 1,
                ],
            );
        }

        Project::query()
            ->with('category')
            ->get()
            ->each(function (Project $project) use ($incomingProjectKeys): void {
                $key = ($project->category?->slug ?? '').'|'.$project->slug;
                if (! in_array($key, $incomingProjectKeys, true)) {
                    $project->delete();
                }
            });
    }
}
