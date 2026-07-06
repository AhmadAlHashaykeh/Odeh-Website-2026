<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin \App\Models\RolePermission */
class RolePermissionResource extends JsonResource
{
    public static $wrap = null;

    public function toArray(Request $request): array
    {
        return [
            'module' => $this->module,
            'canView' => $this->can_view,
            'canCreate' => $this->can_create,
            'canUpdate' => $this->can_update,
            'canDelete' => $this->can_delete,
        ];
    }
}
