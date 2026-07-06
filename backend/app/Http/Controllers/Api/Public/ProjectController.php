<?php

namespace App\Http\Controllers\Api\Public;

use App\Enums\ProjectCategoryStatus;
use App\Enums\ProjectStatus;
use App\Http\Controllers\Api\Admin\Concerns\HandlesSingletonSetting;
use App\Http\Controllers\Api\Public\Concerns\RespondsWithJson;
use App\Http\Controllers\Controller;
use App\Http\Resources\ProjectCategoryResource;
use App\Http\Resources\PublicProjectResource;
use App\Models\Project;
use App\Models\ProjectCategory;
use App\Models\WebsiteSetting;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ProjectController extends Controller
{
    use HandlesSingletonSetting, RespondsWithJson;

    public function index(Request $request): JsonResponse
    {
        $settings = $this->resolveSingleton(WebsiteSetting::class);
        $publicPages = $settings->public_pages ?? [];
        $pageShell = $publicPages['projects'] ?? [];

        $categories = ProjectCategory::query()
            ->where('status', ProjectCategoryStatus::Published)
            ->withCount(['projects' => function ($query): void {
                $query->where('status', ProjectStatus::Published);
            }])
            ->orderBy('display_order')
            ->get();

        $projectsQuery = Project::query()
            ->with('category')
            ->where('status', ProjectStatus::Published)
            ->orderBy('display_order');

        if ($request->boolean('featured')) {
            $projectsQuery->where('is_featured', true);
        }

        if ($categorySlug = $request->query('category')) {
            $projectsQuery->whereHas('category', function ($query) use ($categorySlug): void {
                $query->where('slug', $categorySlug);
            });
        }

        $projects = $projectsQuery->get();

        return response()->json([
            'data' => [
                'page' => $pageShell,
                'categories' => ProjectCategoryResource::collection($categories),
                'projects' => PublicProjectResource::collection($projects),
            ],
        ]);
    }

    public function show(string $categorySlug, string $slug): JsonResponse
    {
        $project = Project::query()
            ->with('category')
            ->where('slug', $slug)
            ->where('status', ProjectStatus::Published)
            ->whereHas('category', function ($query) use ($categorySlug): void {
                $query->where('slug', $categorySlug);
            })
            ->firstOrFail();

        return $this->singleResponse(new PublicProjectResource($project));
    }
}
