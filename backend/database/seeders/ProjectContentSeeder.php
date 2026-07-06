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
                    'project_type' => $project['type'] ?? null,
                    'area' => $project['area'] ?? null,
                    'services' => $project['services'] ?? null,
                    'completion_status' => $project['status'] ?? null,
                    'year' => isset($project['year']) ? (int) $project['year'] : null,
                    'status' => ProjectStatus::Published,
                    'is_featured' => in_array($project['slug'], ['himmeh-resort', 'leen-park', 'fairmont-hotel'], true),
                    'display_order' => $index + 1,
                ],
            );
        }
    }
}
