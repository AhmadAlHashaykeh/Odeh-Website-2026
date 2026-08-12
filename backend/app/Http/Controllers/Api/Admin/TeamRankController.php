<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Api\Admin\Concerns\AuthorizesCmsModule;
use App\Http\Controllers\Api\Admin\Concerns\HandlesAdminListing;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreTeamRankRequest;
use App\Http\Requests\Admin\UpdateTeamRankRequest;
use App\Http\Resources\TeamRankResource;
use App\Models\TeamRank;
use App\Support\CmsModules;
use App\Support\SlugGenerator;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class TeamRankController extends Controller
{
    use AuthorizesCmsModule, HandlesAdminListing;

    public function index(Request $request): JsonResponse
    {
        $this->authorizeModuleView(CmsModules::TEAM_CATEGORIES);

        $query = TeamRank::query()->withCount('members');

        $this->applySearch($query, $request->query('search'), ['name', 'slug']);

        if ($request->query('status') === 'active') {
            $query->where('is_active', true);
        } elseif ($request->query('status') === 'inactive') {
            $query->where('is_active', false);
        }

        $this->applySort($query, $request->query('sort'), [
            'display_order' => 'display_order',
            'displayOrder' => 'display_order',
            'name' => 'name',
            'updated_at' => 'updated_at',
            'lastUpdated' => 'updated_at',
        ]);

        $paginator = $query->paginate($this->perPage($request));

        return $this->paginatedResponse($paginator, TeamRankResource::class);
    }

    public function store(StoreTeamRankRequest $request): JsonResponse
    {
        $this->authorizeModuleCreate(CmsModules::TEAM_CATEGORIES);

        $data = $request->validated();
        $data['slug'] = $this->resolveSlug($data, new TeamRank);
        $data['is_active'] = array_key_exists('is_active', $data) ? (bool) $data['is_active'] : true;
        $data['display_order'] = $data['display_order'] ?? ((int) TeamRank::query()->max('display_order') + 1);

        $rank = TeamRank::query()->create($data);
        $rank->loadCount('members');

        return $this->singleResponse(new TeamRankResource($rank), 201);
    }

    public function show(TeamRank $teamRank): JsonResponse
    {
        $this->authorizeModuleView(CmsModules::TEAM_CATEGORIES);
        $teamRank->loadCount('members');

        return $this->singleResponse(new TeamRankResource($teamRank));
    }

    public function update(UpdateTeamRankRequest $request, TeamRank $teamRank): JsonResponse
    {
        $this->authorizeModuleUpdate(CmsModules::TEAM_CATEGORIES);

        $data = $request->validated();

        if (array_key_exists('name', $data) || array_key_exists('slug', $data)) {
            $slugInput = $data;
            if (! array_key_exists('name', $slugInput)) {
                $slugInput['name'] = $teamRank->name;
            }

            $data['slug'] = $this->resolveSlug($slugInput, $teamRank, $teamRank->id);
        }

        $teamRank->update($data);
        $teamRank->loadCount('members');

        return $this->singleResponse(new TeamRankResource($teamRank));
    }

    public function destroy(TeamRank $teamRank): JsonResponse
    {
        $this->authorizeModuleDelete(CmsModules::TEAM_CATEGORIES);

        $membersCount = $teamRank->members()->count();

        if ($membersCount > 0) {
            return response()->json([
                'message' => "Cannot delete \"{$teamRank->name}\" because it still has {$membersCount} team member(s). Reassign or remove those members first.",
                'errors' => [
                    'teamRank' => [
                        "This rank still contains {$membersCount} team member(s).",
                    ],
                ],
            ], 422);
        }

        $teamRank->delete();

        return response()->json(null, 204);
    }

    /**
     * @param  array<string, mixed>  $data
     */
    private function resolveSlug(array $data, TeamRank $model, ?string $exceptId = null): string
    {
        $baseSlug = (array_key_exists('slug', $data) && filled($data['slug']))
            ? SlugGenerator::normalize($data['slug'])
            : SlugGenerator::fromTitle($data['name'] ?? $model->name);

        return SlugGenerator::unique($baseSlug, $model, $exceptId);
    }
}
