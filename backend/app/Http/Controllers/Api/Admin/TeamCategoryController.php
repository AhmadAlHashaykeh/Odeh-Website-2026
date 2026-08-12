<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Api\Admin\Concerns\AuthorizesCmsModule;
use App\Http\Controllers\Api\Admin\Concerns\HandlesAdminListing;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\ReorderTeamCategoriesRequest;
use App\Http\Requests\Admin\StoreTeamCategoryRequest;
use App\Http\Requests\Admin\UpdateTeamCategoryRequest;
use App\Http\Resources\TeamCategoryResource;
use App\Models\TeamCategory;
use App\Support\CmsModules;
use App\Support\SlugGenerator;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class TeamCategoryController extends Controller
{
    use AuthorizesCmsModule, HandlesAdminListing;

    public function index(Request $request): JsonResponse
    {
        $this->authorizeModuleView(CmsModules::TEAM_CATEGORIES);

        $query = TeamCategory::query()
            ->with('parent')
            ->withCount('members');

        $this->applySearch($query, $request->query('search'), ['name', 'slug', 'description']);

        if ($request->query('status') === 'active') {
            $query->where('is_active', true);
        } elseif ($request->query('status') === 'inactive') {
            $query->where('is_active', false);
        } elseif ($request->has('is_active')) {
            $query->where('is_active', filter_var($request->query('is_active'), FILTER_VALIDATE_BOOLEAN));
        }

        $this->applySort($query, $request->query('sort'), [
            'display_order' => 'display_order',
            'displayOrder' => 'display_order',
            'name' => 'name',
            'title' => 'name',
            'updated_at' => 'updated_at',
            'lastUpdated' => 'updated_at',
        ]);

        $paginator = $query->paginate($this->perPage($request));

        return $this->paginatedResponse($paginator, TeamCategoryResource::class);
    }

    public function store(StoreTeamCategoryRequest $request): JsonResponse
    {
        $this->authorizeModuleCreate(CmsModules::TEAM_CATEGORIES);

        $data = $request->validated();
        $data['slug'] = $this->resolveSlug($data, new TeamCategory);
        $data['is_active'] = array_key_exists('is_active', $data) ? (bool) $data['is_active'] : true;
        $data['display_order'] = $data['display_order'] ?? ((int) TeamCategory::query()->max('display_order') + 1);

        $category = TeamCategory::query()->create($data);
        $category->load('parent')->loadCount('members');

        return $this->singleResponse(new TeamCategoryResource($category), 201);
    }

    public function show(TeamCategory $teamCategory): JsonResponse
    {
        $this->authorizeModuleView(CmsModules::TEAM_CATEGORIES);
        $teamCategory->load('parent')->loadCount('members');

        return $this->singleResponse(new TeamCategoryResource($teamCategory));
    }

    public function update(UpdateTeamCategoryRequest $request, TeamCategory $teamCategory): JsonResponse
    {
        $this->authorizeModuleUpdate(CmsModules::TEAM_CATEGORIES);

        $data = $request->validated();

        if (array_key_exists('name', $data) || array_key_exists('slug', $data)) {
            $slugInput = $data;
            if (! array_key_exists('name', $slugInput)) {
                $slugInput['name'] = $teamCategory->name;
            }

            $data['slug'] = $this->resolveSlug($slugInput, $teamCategory, $teamCategory->id);
        }

        $teamCategory->update($data);
        $teamCategory->load('parent')->loadCount('members');

        return $this->singleResponse(new TeamCategoryResource($teamCategory));
    }

    public function destroy(TeamCategory $teamCategory): JsonResponse
    {
        $this->authorizeModuleDelete(CmsModules::TEAM_CATEGORIES);

        $membersCount = $teamCategory->members()->count();

        if ($membersCount > 0) {
            return response()->json([
                'message' => "Cannot delete \"{$teamCategory->name}\" because it still has {$membersCount} team member(s). Reassign or remove those members first.",
                'errors' => [
                    'teamCategory' => [
                        "This category still contains {$membersCount} team member(s).",
                    ],
                ],
            ], 422);
        }

        $teamCategory->delete();

        return response()->json(null, 204);
    }

    public function reorder(ReorderTeamCategoriesRequest $request): JsonResponse
    {
        $this->authorizeModuleUpdate(CmsModules::TEAM_CATEGORIES);

        $orderedIds = $request->validated('ordered_ids');

        DB::transaction(function () use ($orderedIds): void {
            foreach ($orderedIds as $index => $id) {
                TeamCategory::query()
                    ->whereKey($id)
                    ->update(['display_order' => $index + 1]);
            }
        });

        $categories = TeamCategory::query()
            ->with('parent')
            ->withCount('members')
            ->orderBy('display_order')
            ->get();

        return response()->json([
            'data' => TeamCategoryResource::collection($categories),
        ]);
    }

    /**
     * @param  array<string, mixed>  $data
     */
    private function resolveSlug(array $data, TeamCategory $model, ?string $exceptId = null): string
    {
        $baseSlug = (array_key_exists('slug', $data) && filled($data['slug']))
            ? SlugGenerator::normalize($data['slug'])
            : SlugGenerator::fromTitle($data['name'] ?? $model->name);

        return SlugGenerator::unique($baseSlug, $model, $exceptId);
    }
}
