<?php

namespace App\Http\Resources;

use App\Support\CmsModules;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin \App\Models\User */
class AuthenticatedUserResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'user' => new UserResource($this),
            'role' => $this->when(
                $this->relationLoaded('role') && $this->role !== null,
                fn () => new RoleResource($this->role),
            ),
            'permissions' => $this->resolvePermissions(),
        ];
    }

    /**
     * @return array<string, array{view: bool, create: bool, edit: bool, delete: bool}>
     */
    private function resolvePermissions(): array
    {
        if ($this->isSuperAdmin()) {
            return $this->allModulesGranted();
        }

        if (! $this->relationLoaded('role') || $this->role === null) {
            return $this->allModulesDenied();
        }

        if (! $this->role->relationLoaded('permissions')) {
            $this->role->load('permissions');
        }

        $permissions = $this->allModulesDenied();

        foreach ($this->role->permissions as $permission) {
            $permissions[$permission->module] = [
                'view' => (bool) $permission->can_view,
                'create' => (bool) $permission->can_create,
                'edit' => (bool) $permission->can_update,
                'delete' => (bool) $permission->can_delete,
            ];
        }

        return $permissions;
    }

    /**
     * @return array<string, array{view: bool, create: bool, edit: bool, delete: bool}>
     */
    private function allModulesGranted(): array
    {
        $permissions = [];

        foreach (CmsModules::all() as $module) {
            $permissions[$module] = [
                'view' => true,
                'create' => true,
                'edit' => true,
                'delete' => true,
            ];
        }

        return $permissions;
    }

    /**
     * @return array<string, array{view: bool, create: bool, edit: bool, delete: bool}>
     */
    private function allModulesDenied(): array
    {
        $permissions = [];

        foreach (CmsModules::all() as $module) {
            $permissions[$module] = [
                'view' => false,
                'create' => false,
                'edit' => false,
                'delete' => false,
            ];
        }

        return $permissions;
    }
}
