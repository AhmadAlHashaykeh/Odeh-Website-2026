<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Api\Admin\Concerns\AuthorizesCmsModule;
use App\Http\Controllers\Api\Admin\Concerns\HandlesAdminListing;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreRoleRequest;
use App\Http\Requests\Admin\UpdateRoleRequest;
use App\Http\Resources\RoleResource;
use App\Models\Role;
use App\Models\RolePermission;
use App\Support\CmsModules;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpKernel\Exception\HttpException;

class RoleController extends Controller
{
    use AuthorizesCmsModule, HandlesAdminListing;

    public function index(Request $request): JsonResponse
    {
        $this->authorizeModuleView(CmsModules::USERS_ROLES);

        $query = Role::query()->withCount('users');

        $this->applySearch($query, $request->query('search'), [
            'name', 'slug', 'description',
        ]);

        if ($status = $request->query('status')) {
            $query->where('status', $status);
        }

        $query->orderBy('name');

        $paginator = $query->paginate($this->perPage($request));

        return $this->paginatedResponse($paginator, RoleResource::class);
    }

    public function store(StoreRoleRequest $request): JsonResponse
    {
        $this->authorizeModuleCreate(CmsModules::USERS_ROLES);

        $role = Role::query()->create($request->validated());

        foreach (CmsModules::all() as $module) {
            RolePermission::query()->create([
                'role_id' => $role->id,
                'module' => $module,
                'can_view' => false,
                'can_create' => false,
                'can_update' => false,
                'can_delete' => false,
            ]);
        }

        $role->loadCount('users');

        return $this->singleResponse(new RoleResource($role), 201);
    }

    public function show(Role $role): JsonResponse
    {
        $this->authorizeModuleView(CmsModules::USERS_ROLES);

        $role->loadCount('users');

        return $this->singleResponse(new RoleResource($role));
    }

    public function update(UpdateRoleRequest $request, Role $role): JsonResponse
    {
        $this->authorizeModuleUpdate(CmsModules::USERS_ROLES);

        $role->update($request->validated());
        $role->loadCount('users');

        return $this->singleResponse(new RoleResource($role));
    }

    public function destroy(Role $role): JsonResponse
    {
        $this->authorizeModuleDelete(CmsModules::USERS_ROLES);

        if ($role->isSuperAdmin()) {
            throw new HttpException(422, 'The Super Admin role cannot be deleted.');
        }

        $role->delete();

        return response()->json(null, 204);
    }
}
