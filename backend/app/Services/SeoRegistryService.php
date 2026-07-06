<?php

namespace App\Services;

use App\Models\Activity;
use App\Models\Job;
use App\Models\Project;
use App\Models\ProjectCategory;
use App\Models\SeoPage;
use App\Models\Service;
use Illuminate\Database\Eloquent\Model;

class SeoRegistryService
{
    /**
     * @return array<int, array{route: string, page_name: string, page_type: string, content_module: string}>
     */
    public function staticPageDefinitions(): array
    {
        return require database_path('seeders/data/seo_static_pages.php');
    }

    public function registerStaticPages(): void
    {
        foreach ($this->staticPageDefinitions() as $page) {
            SeoPage::query()->updateOrCreate(
                ['route' => $page['route']],
                [
                    'page_name' => $page['page_name'],
                    'page_type' => $page['page_type'],
                    'content_module' => $page['content_module'],
                    'content_uuid' => null,
                ],
            );
        }
    }

    public function registerModel(Model $model): void
    {
        $definition = $this->definitionFor($model);

        if ($definition === null) {
            return;
        }

        SeoPage::query()->updateOrCreate(
            ['content_uuid' => $model->getKey()],
            [
                'route' => $definition['route'],
                'page_name' => $definition['page_name'],
                'page_type' => $definition['page_type'],
                'content_module' => $definition['content_module'],
            ],
        );
    }

    public function syncModel(Model $model): void
    {
        if ($model instanceof Project && $model->project_category_id === null) {
            SeoPage::query()
                ->where('content_uuid', $model->getKey())
                ->delete();

            return;
        }

        if ($model instanceof ProjectCategory && $model->wasChanged('slug')) {
            $this->syncProjectCategoryRoutes($model);

            return;
        }

        $seoPage = SeoPage::query()
            ->where('content_uuid', $model->getKey())
            ->first();

        if ($seoPage === null) {
            $this->registerModel($model);

            return;
        }

        $updates = [];

        if ($model->wasChanged('title')) {
            $updates['page_name'] = $model->title;
        }

        if ($this->routeChanged($model)) {
            $definition = $this->definitionFor($model);

            if ($definition !== null) {
                $updates['route'] = $definition['route'];
            }
        }

        if ($updates !== []) {
            $seoPage->update($updates);
        }
    }

    public function removeModel(Model $model): void
    {
        SeoPage::query()
            ->where('content_uuid', $model->getKey())
            ->delete();
    }

    /**
     * @return array{route: string, page_name: string, page_type: string, content_module: string}|null
     */
    private function definitionFor(Model $model): ?array
    {
        return match ($model::class) {
            Project::class => $this->canRegisterProject($model) ? [
                'route' => $this->routeForProject($model),
                'page_name' => $model->title,
                'page_type' => 'project-detail',
                'content_module' => 'projects',
            ] : null,
            ProjectCategory::class => [
                'route' => $this->routeForProjectCategory($model),
                'page_name' => $model->title,
                'page_type' => 'project-category',
                'content_module' => 'projects',
            ],
            Activity::class => [
                'route' => $this->routeForActivity($model),
                'page_name' => $model->title,
                'page_type' => 'activity-detail',
                'content_module' => 'activities',
            ],
            Service::class => [
                'route' => $this->routeForService($model),
                'page_name' => $model->title,
                'page_type' => 'service',
                'content_module' => 'services',
            ],
            Job::class => [
                'route' => $this->routeForJob($model),
                'page_name' => $model->title,
                'page_type' => 'career-detail',
                'content_module' => 'careers',
            ],
            default => null,
        };
    }

    private function routeForProject(Project $project): string
    {
        $project->loadMissing('category');

        if ($project->category === null) {
            throw new \RuntimeException('Project category is required to build an SEO route.');
        }

        return '/projects/'.$project->category->slug.'/'.$project->slug;
    }

    private function canRegisterProject(Project $project): bool
    {
        if ($project->project_category_id === null) {
            return false;
        }

        $project->loadMissing('category');

        return $project->category !== null;
    }

    private function routeForProjectCategory(ProjectCategory $category): string
    {
        return '/projects/'.$category->slug;
    }

    private function routeForActivity(Activity $activity): string
    {
        return '/about/activities/'.$activity->slug;
    }

    private function routeForService(Service $service): string
    {
        return '/services/'.$service->slug;
    }

    private function routeForJob(Job $job): string
    {
        return '/careers/'.$job->slug;
    }

    private function routeChanged(Model $model): bool
    {
        return match ($model::class) {
            Project::class => $model->wasChanged(['slug', 'project_category_id']),
            ProjectCategory::class, Activity::class, Service::class, Job::class => $model->wasChanged('slug'),
            default => false,
        };
    }

    private function syncProjectCategoryRoutes(ProjectCategory $category): void
    {
        SeoPage::query()
            ->where('content_uuid', $category->getKey())
            ->update([
                'route' => $this->routeForProjectCategory($category),
                'page_name' => $category->title,
            ]);

        $category->load('projects');

        foreach ($category->projects as $project) {
            if (! $this->canRegisterProject($project)) {
                continue;
            }

            SeoPage::query()
                ->where('content_uuid', $project->getKey())
                ->update([
                    'route' => $this->routeForProject($project),
                ]);
        }
    }
}
