<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Api\Admin\Concerns\AuthorizesCmsModule;
use App\Http\Controllers\Api\Admin\Concerns\HandlesAdminListing;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreProjectRequest;
use App\Http\Requests\Admin\UpdateProjectRequest;
use App\Http\Resources\ProjectResource;
use App\Models\Project;
use App\Support\CmsModules;
use App\Support\SlugGenerator;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ProjectController extends Controller
{
    use AuthorizesCmsModule, HandlesAdminListing;

    public function index(Request $request): JsonResponse
    {
        $this->authorizeModuleView(CmsModules::PROJECTS);
        $query = Project::query()->with('category');

        $this->applySearch($query, $request->query('search'), [
            'title', 'location', 'architect', 'area',
        ]);

        if ($status = $request->query('status')) {
            $query->where('status', $status);
        }

        if ($request->has('featured')) {
            $query->where('is_featured', filter_var($request->query('featured'), FILTER_VALIDATE_BOOLEAN));
        }

        if ($category = $request->query('category')) {
            $query->where(function ($builder) use ($category): void {
                $builder->where('project_category_id', $category)
                    ->orWhereHas('category', function ($categoryQuery) use ($category): void {
                        $categoryQuery->where('slug', $category)->orWhere('title', $category);
                    });
            });
        }

        if ($year = $request->query('year')) {
            $query->where('year', $year);
        }

        if ($projectType = $request->query('project_type')) {
            $query->where('project_type', $projectType);
        }

        $this->applySort($query, $request->query('sort'), [
            'display_order' => 'display_order',
            'title' => 'title',
            'updated_at' => 'updated_at',
            'year' => 'year',
            'lastUpdated' => 'updated_at',
            'displayOrder' => 'display_order',
        ]);

        $paginator = $query->paginate($this->perPage($request));

        return $this->paginatedResponse($paginator, ProjectResource::class);
    }

    public function store(StoreProjectRequest $request): JsonResponse
    {
        $this->authorizeModuleCreate(CmsModules::PROJECTS);
        $data = $request->validated();
        $data['slug'] = $this->resolveSlug($data, new Project);

        $project = Project::query()->create($data);
        $project->load('category');

        return $this->singleResponse(new ProjectResource($project), 201);
    }

    public function show(Project $project): JsonResponse
    {
        $this->authorizeModuleView(CmsModules::PROJECTS);
        $project->load('category');

        return $this->singleResponse(new ProjectResource($project));
    }

    public function update(UpdateProjectRequest $request, Project $project): JsonResponse
    {
        $this->authorizeModuleUpdate(CmsModules::PROJECTS);
        $data = $request->validated();

        if (array_key_exists('slug', $data) && filled($data['slug'])) {
            $slugInput = $data;
            if (! array_key_exists('title', $slugInput)) {
                $slugInput['title'] = $project->title;
            }

            $data['slug'] = $this->resolveSlug(
                $slugInput,
                $project,
                $project->id,
            );
        } else {
            unset($data['slug']);
        }

        $project->update($data);
        $project->load('category');

        return $this->singleResponse(new ProjectResource($project));
    }

    public function destroy(Project $project): JsonResponse
    {
        $this->authorizeModuleDelete(CmsModules::PROJECTS);
        $project->delete();

        return response()->json(null, 204);
    }

    /**
     * @param  array<string, mixed>  $data
     */
    private function resolveSlug(array $data, Project $model, ?string $exceptId = null): string
    {
        $baseSlug = (array_key_exists('slug', $data) && filled($data['slug']))
            ? SlugGenerator::normalize($data['slug'])
            : SlugGenerator::fromTitle($data['title'] ?? $model->title);

        return SlugGenerator::unique(
            $baseSlug,
            $model,
            $exceptId,
            ['project_category_id' => $data['project_category_id'] ?? $model->project_category_id],
        );
    }
}
