<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Api\Admin\Concerns\HandlesAdminListing;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreProjectCategoryRequest;
use App\Http\Requests\Admin\UpdateProjectCategoryRequest;
use App\Http\Resources\ProjectCategoryResource;
use App\Models\ProjectCategory;
use App\Support\SlugGenerator;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ProjectCategoryController extends Controller
{
    use HandlesAdminListing;

    public function index(Request $request): JsonResponse
    {
        $query = ProjectCategory::query()->withCount('projects');

        $this->applySearch($query, $request->query('search'), ['title', 'slug', 'description']);

        if ($status = $request->query('status')) {
            $query->where('status', $status);
        }

        $this->applySort($query, $request->query('sort'), [
            'display_order' => 'display_order',
            'title' => 'title',
            'updated_at' => 'updated_at',
            'lastUpdated' => 'updated_at',
            'displayOrder' => 'display_order',
        ]);

        $paginator = $query->paginate($this->perPage($request));

        return $this->paginatedResponse($paginator, ProjectCategoryResource::class);
    }

    public function store(StoreProjectCategoryRequest $request): JsonResponse
    {
        $data = $request->validated();
        $data['slug'] = $this->resolveSlug($data, new ProjectCategory);

        $category = ProjectCategory::query()->create($data);
        $category->loadCount('projects');

        return $this->singleResponse(new ProjectCategoryResource($category), 201);
    }

    public function show(ProjectCategory $projectCategory): JsonResponse
    {
        $projectCategory->loadCount('projects');

        return $this->singleResponse(new ProjectCategoryResource($projectCategory));
    }

    public function update(UpdateProjectCategoryRequest $request, ProjectCategory $projectCategory): JsonResponse
    {
        $data = $request->validated();

        if (array_key_exists('title', $data) || array_key_exists('slug', $data)) {
            $slugInput = $data;
            if (! array_key_exists('title', $slugInput)) {
                $slugInput['title'] = $projectCategory->title;
            }

            $data['slug'] = $this->resolveSlug($slugInput, $projectCategory, $projectCategory->id);
        }

        $projectCategory->update($data);
        $projectCategory->loadCount('projects');

        return $this->singleResponse(new ProjectCategoryResource($projectCategory));
    }

    public function destroy(ProjectCategory $projectCategory): JsonResponse
    {
        $projectCategory->delete();

        return response()->json(null, 204);
    }

    /**
     * @param  array<string, mixed>  $data
     */
    private function resolveSlug(array $data, ProjectCategory $model, ?string $exceptId = null): string
    {
        $baseSlug = (array_key_exists('slug', $data) && filled($data['slug']))
            ? SlugGenerator::normalize($data['slug'])
            : SlugGenerator::fromTitle($data['title'] ?? $model->title);

        return SlugGenerator::unique($baseSlug, $model, $exceptId);
    }
}
