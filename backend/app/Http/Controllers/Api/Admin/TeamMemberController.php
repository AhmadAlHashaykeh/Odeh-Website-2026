<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Api\Admin\Concerns\AuthorizesCmsModule;
use App\Http\Controllers\Api\Admin\Concerns\HandlesAdminListing;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreTeamMemberRequest;
use App\Http\Requests\Admin\UpdateTeamMemberRequest;
use App\Http\Resources\TeamMemberResource;
use App\Models\TeamMember;
use App\Support\CmsModules;
use App\Support\SlugGenerator;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class TeamMemberController extends Controller
{
    use AuthorizesCmsModule, HandlesAdminListing;

    public function index(Request $request): JsonResponse
    {
        $this->authorizeModuleView(CmsModules::TEAM_MEMBERS);

        $query = TeamMember::query();

        $this->applySearch($query, $request->query('search'), [
            'full_name', 'slug', 'position', 'department', 'category', 'email',
        ]);

        if ($status = $request->query('status')) {
            $query->where('status', $status);
        }

        if ($category = $request->query('category')) {
            $query->where('category', $category);
        }

        $this->applySort($query, $request->query('sort'), [
            'display_order' => 'display_order',
            'full_name' => 'full_name',
            'title' => 'full_name',
            'name' => 'full_name',
            'updated_at' => 'updated_at',
            'lastUpdated' => 'updated_at',
            'displayOrder' => 'display_order',
        ]);

        $paginator = $query->paginate($this->perPage($request));

        return $this->paginatedResponse($paginator, TeamMemberResource::class);
    }

    public function store(StoreTeamMemberRequest $request): JsonResponse
    {
        $this->authorizeModuleCreate(CmsModules::TEAM_MEMBERS);

        $data = $request->validated();
        $data['slug'] = $this->resolveSlug($data, new TeamMember);

        $teamMember = TeamMember::query()->create($data);

        return $this->singleResponse(new TeamMemberResource($teamMember), 201);
    }

    public function show(TeamMember $teamMember): JsonResponse
    {
        $this->authorizeModuleView(CmsModules::TEAM_MEMBERS);

        return $this->singleResponse(new TeamMemberResource($teamMember));
    }

    public function update(UpdateTeamMemberRequest $request, TeamMember $teamMember): JsonResponse
    {
        $this->authorizeModuleUpdate(CmsModules::TEAM_MEMBERS);

        $data = $request->validated();

        if (array_key_exists('full_name', $data) || array_key_exists('slug', $data)) {
            $slugInput = $data;
            if (! array_key_exists('full_name', $slugInput)) {
                $slugInput['full_name'] = $teamMember->full_name;
            }

            $data['slug'] = $this->resolveSlug($slugInput, $teamMember, $teamMember->id);
        }

        $teamMember->update($data);

        return $this->singleResponse(new TeamMemberResource($teamMember));
    }

    public function destroy(TeamMember $teamMember): JsonResponse
    {
        $this->authorizeModuleDelete(CmsModules::TEAM_MEMBERS);

        $teamMember->delete();

        return response()->json(null, 204);
    }

    /**
     * @param  array<string, mixed>  $data
     */
    private function resolveSlug(array $data, TeamMember $model, ?string $exceptId = null): string
    {
        $baseSlug = (array_key_exists('slug', $data) && filled($data['slug']))
            ? SlugGenerator::normalize($data['slug'])
            : SlugGenerator::fromTitle($data['full_name'] ?? $model->full_name);

        return SlugGenerator::unique($baseSlug, $model, $exceptId);
    }
}
