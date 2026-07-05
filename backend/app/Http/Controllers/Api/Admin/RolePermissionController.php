<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Api\Admin\Concerns\AuthorizesCmsModule;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\UpdateRolePermissionsRequest;
use App\Http\Resources\RolePermissionResource;
use App\Models\Role;
use App\Models\RolePermission;
use App\Support\CmsModules;
use Illuminate\Http\JsonResponse;

class RolePermissionController extends Controller
{
    use AuthorizesCmsModule;

    public function index(Role $role): JsonResponse
    {
        $this->authorizeModuleView(CmsModules::USERS_ROLES);

        $permissions = $role->permissions()->orderBy('module')->get();

        return response()->json(RolePermissionResource::collection($permissions)->resolve());
    }

    public function update(UpdateRolePermissionsRequest $request, Role $role): JsonResponse
    {
        $this->authorizeModuleUpdate(CmsModules::USERS_ROLES);

        $role->permissions()->delete();

        foreach ($request->validated('permissions') as $entry) {
            RolePermission::query()->create([
                'role_id' => $role->id,
                'module' => $entry['module'],
                'can_view' => $entry['can_view'],
                'can_create' => $entry['can_create'],
                'can_update' => $entry['can_update'],
                'can_delete' => $entry['can_delete'],
            ]);
        }

        $permissions = $role->permissions()->orderBy('module')->get();

        return response()->json(RolePermissionResource::collection($permissions)->resolve());
    }
}
