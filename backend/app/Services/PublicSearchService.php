<?php

namespace App\Services;

use App\Enums\ActivityStatus;
use App\Enums\JobStatus;
use App\Enums\LegalPagePublicationStatus;
use App\Enums\ProjectCategoryStatus;
use App\Enums\ProjectStatus;
use App\Enums\ServiceStatus;
use App\Enums\TeamMemberStatus;
use App\Models\AboutPageSetting;
use App\Models\Activity;
use App\Models\Job;
use App\Models\LegalPage;
use App\Models\NavigationFooterSetting;
use App\Models\Project;
use App\Models\ProjectCategory;
use App\Models\Service;
use App\Models\TeamMember;

class PublicSearchService
{
    /**
     * @return array<int, array<string, mixed>>
     */
    public function search(?string $query, int $limit = 50): array
    {
        if ($query === null || trim($query) === '') {
            return [];
        }

        $term = mb_strtolower(trim($query));
        $results = [];

        foreach ($this->staticPages() as $item) {
            if ($this->matches($item, $term)) {
                $results[] = $item;
            }
        }

        Project::query()
            ->with('category')
            ->where('status', ProjectStatus::Published)
            ->orderBy('display_order')
            ->get()
            ->each(function (Project $project) use (&$results, $term): void {
                $item = [
                    'id' => 'project-'.$project->id,
                    'type' => 'project',
                    'typeLabel' => 'Project',
                    'title' => $project->title,
                    'subtitle' => $project->location,
                    'path' => $this->projectPath($project),
                    'keywords' => [
                        $project->project_type,
                        $project->location,
                        $project->description,
                        $project->services,
                        $project->completion_status,
                    ],
                ];

                if ($this->matches($item, $term)) {
                    $results[] = $item;
                }
            });

        ProjectCategory::query()
            ->where('status', ProjectCategoryStatus::Published)
            ->orderBy('display_order')
            ->get()
            ->each(function (ProjectCategory $category) use (&$results, $term): void {
                $item = [
                    'id' => 'category-'.$category->slug,
                    'type' => 'project',
                    'typeLabel' => 'Category',
                    'title' => $category->title,
                    'subtitle' => 'Selected Projects',
                    'path' => '/projects/'.$category->slug,
                    'keywords' => [$category->description, $category->title, 'category', 'projects'],
                ];

                if ($this->matches($item, $term)) {
                    $results[] = $item;
                }
            });

        Service::query()
            ->where('status', ServiceStatus::Published)
            ->orderBy('display_order')
            ->get()
            ->each(function (Service $service) use (&$results, $term): void {
                $item = [
                    'id' => 'service-'.$service->id,
                    'type' => 'service',
                    'typeLabel' => 'Service',
                    'title' => $service->title,
                    'subtitle' => 'Engineering Service',
                    'path' => '/services/'.$service->slug,
                    'keywords' => [$service->description, 'service', 'engineering'],
                ];

                if ($this->matches($item, $term)) {
                    $results[] = $item;
                }
            });

        Activity::query()
            ->where('status', ActivityStatus::Published)
            ->orderByDesc('activity_date')
            ->get()
            ->each(function (Activity $activity) use (&$results, $term): void {
                $item = [
                    'id' => 'activity-'.$activity->id,
                    'type' => 'activity',
                    'typeLabel' => 'Activity',
                    'title' => $activity->title,
                    'subtitle' => $activity->location,
                    'path' => '/about/activities/'.$activity->slug,
                    'keywords' => [$activity->description, $activity->location, 'activity', 'event'],
                ];

                if ($this->matches($item, $term)) {
                    $results[] = $item;
                }
            });

        Job::query()
            ->where('status', JobStatus::Open)
            ->orderByDesc('posted_date')
            ->get()
            ->each(function (Job $job) use (&$results, $term): void {
                $item = [
                    'id' => 'job-'.$job->id,
                    'type' => 'career',
                    'typeLabel' => 'Career',
                    'title' => $job->title,
                    'subtitle' => $job->department,
                    'path' => '/careers/'.$job->slug,
                    'keywords' => [
                        $job->department,
                        $job->location,
                        $job->short_description,
                        'career',
                        'job',
                    ],
                ];

                if ($this->matches($item, $term)) {
                    $results[] = $item;
                }
            });

        TeamMember::query()
            ->where('status', TeamMemberStatus::Active)
            ->orderBy('display_order')
            ->get()
            ->each(function (TeamMember $member) use (&$results, $term): void {
                $item = [
                    'id' => 'team-'.$member->id,
                    'type' => 'about',
                    'typeLabel' => 'Team',
                    'title' => $member->full_name,
                    'subtitle' => $member->position,
                    'path' => '/about/team-members',
                    'keywords' => [$member->position, $member->department, 'team', 'member'],
                ];

                if ($this->matches($item, $term)) {
                    $results[] = $item;
                }
            });

        LegalPage::query()
            ->where('publication_status', LegalPagePublicationStatus::Published)
            ->get()
            ->each(function (LegalPage $page) use (&$results, $term): void {
                $item = [
                    'id' => 'legal-'.$page->slug,
                    'type' => 'page',
                    'typeLabel' => 'Page',
                    'title' => $page->title,
                    'subtitle' => 'Legal',
                    'path' => '/'.$page->slug,
                    'keywords' => [$page->title, 'legal', 'policy', 'terms'],
                ];

                if ($this->matches($item, $term)) {
                    $results[] = $item;
                }
            });

        return array_slice($results, 0, $limit);
    }

    /**
     * @return array<int, array<string, mixed>>
     */
    public function suggestions(int $limit = 8): array
    {
        $items = $this->staticPages();

        Project::query()
            ->where('status', ProjectStatus::Published)
            ->orderBy('display_order')
            ->limit(5)
            ->get()
            ->each(function (Project $project) use (&$items): void {
                $items[] = [
                    'id' => 'project-'.$project->id,
                    'type' => 'project',
                    'typeLabel' => 'Project',
                    'title' => $project->title,
                    'subtitle' => $project->location,
                    'path' => $this->projectPath($project),
                    'keywords' => [],
                ];
            });

        return array_slice($items, 0, $limit);
    }

    /**
     * @return array<int, array<string, mixed>>
     */
    private function staticPages(): array
    {
        $pages = [
            ['id' => 'home', 'type' => 'about', 'typeLabel' => 'Page', 'title' => 'Home', 'subtitle' => 'ODEH & PARTNERS DESIGN', 'path' => '/', 'keywords' => ['home', 'odeh', 'engineering']],
            ['id' => 'projects-list', 'type' => 'project', 'typeLabel' => 'Project', 'title' => 'Selected Projects', 'subtitle' => 'Explore our portfolio', 'path' => '/projects', 'keywords' => ['projects', 'portfolio']],
            ['id' => 'careers-list', 'type' => 'career', 'typeLabel' => 'Career', 'title' => 'Careers', 'subtitle' => 'Join our team', 'path' => '/careers', 'keywords' => ['careers', 'jobs']],
            ['id' => 'reach-out', 'type' => 'page', 'typeLabel' => 'Page', 'title' => 'Reach Out', 'subtitle' => 'Contact us', 'path' => '/reach-out', 'keywords' => ['contact', 'reach out']],
            ['id' => 'connect', 'type' => 'page', 'typeLabel' => 'Page', 'title' => 'Connect', 'subtitle' => 'Stay connected', 'path' => '/connect', 'keywords' => ['connect', 'social']],
            ['id' => 'search', 'type' => 'page', 'typeLabel' => 'Page', 'title' => 'Search', 'subtitle' => 'Find content', 'path' => '/search', 'keywords' => ['search']],
        ];

        $about = AboutPageSetting::query()->first();
        if ($about) {
            foreach (['overview', 'approach', 'history'] as $section) {
                $content = $about->{$section} ?? null;
                if (! is_array($content)) {
                    continue;
                }

                $hero = $content['hero'] ?? [];
                $pages[] = [
                    'id' => 'about-'.$section,
                    'type' => 'about',
                    'typeLabel' => 'About',
                    'title' => (string) ($hero['title'] ?? ucfirst($section)),
                    'subtitle' => 'About Us',
                    'path' => '/about/'.$section,
                    'keywords' => [$content['meta']['description'] ?? '', 'about', $section],
                ];
            }
        }

        $navigation = NavigationFooterSetting::query()->first();
        if ($navigation) {
            foreach ($navigation->navigation_items ?? [] as $item) {
                if (! is_array($item) || empty($item['path'])) {
                    continue;
                }

                $pages[] = [
                    'id' => 'nav-'.md5((string) $item['path']),
                    'type' => 'page',
                    'typeLabel' => 'Page',
                    'title' => (string) ($item['label'] ?? ''),
                    'subtitle' => 'Navigation',
                    'path' => (string) $item['path'],
                    'keywords' => [(string) ($item['label'] ?? ''), 'navigation'],
                ];
            }
        }

        return $pages;
    }

    /**
     * @param  array<string, mixed>  $item
     */
    private function matches(array $item, string $term): bool
    {
        $haystack = mb_strtolower(implode(' ', array_filter([
            $item['title'] ?? '',
            $item['subtitle'] ?? '',
            ...((array) ($item['keywords'] ?? [])),
        ])));

        return str_contains($haystack, $term);
    }

    private function projectPath(Project $project): string
    {
        $categorySlug = $project->category?->slug ?? 'uncategorized';

        return '/projects/'.$categorySlug.'/'.$project->slug;
    }
}
