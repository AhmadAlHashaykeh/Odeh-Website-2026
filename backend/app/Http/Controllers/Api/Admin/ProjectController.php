<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Api\Admin\Concerns\HandlesAdminListing;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreProjectRequest;
use App\Http\Requests\Admin\UpdateProjectRequest;
use App\Http\Resources\ProjectResource;
use App\Models\Project;
use App\Support\SlugGenerator;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ProjectController extends Controller
{
    use HandlesAdminListing;

    public function index(Request $request): JsonResponse
    {
        $query = Project::query()->with('category');

        $this->applySearch($query, $request->query('search'), [
            'title', 'slug', 'location', 'project_type', 'description',
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
        $data = $request->validated();
        $data['slug'] = $this->resolveSlug($data, new Project);

        $project = Project::query()->create($data);
        $project->load('category');

        return $this->singleResponse(new ProjectResource($project), 201);
    }

    public function show(Project $project): JsonResponse
    {
        $project->load('category');

        return $this->singleResponse(new ProjectResource($project));
    }

    public function update(UpdateProjectRequest $request, Project $project): JsonResponse
    {
        $data = $request->validated();

        if (array_key_exists('title', $data) || array_key_exists('slug', $data) || array_key_exists('project_category_id', $data)) {
            $slugInput = $data;
            if (! array_key_exists('title', $slugInput)) {
                $slugInput['title'] = $project->title;
            }

            $data['slug'] = $this->resolveSlug(
                $slugInput,
                $project,
                $project->id,
            );
        }

        $project->update($data);
        $project->load('category');

        return $this->singleResponse(new ProjectResource($project));
    }

    public function destroy(Project $project): JsonResponse
    {
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
