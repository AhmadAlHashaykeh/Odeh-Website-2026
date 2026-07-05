<?php

namespace App\Http\Resources;

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
        ];
    }
}
