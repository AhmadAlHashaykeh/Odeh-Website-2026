<?php

namespace App\Http\Resources;

use App\Models\TeamRank;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin TeamRank */
class TeamRankResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $membersCount = $this->whenCounted('members', $this->members_count ?? null);

        return [
            'id' => $this->id,
            'name' => $this->name,
            'slug' => $this->slug,
            'color' => $this->color,
            'displayOrder' => $this->display_order,
            'isActive' => (bool) $this->is_active,
            'status' => $this->is_active ? 'active' : 'inactive',
            'membersCount' => $membersCount ?? 0,
            'lastUpdated' => $this->updated_at?->toIso8601String(),
            'createdAt' => $this->created_at?->toIso8601String(),
        ];
    }
}
