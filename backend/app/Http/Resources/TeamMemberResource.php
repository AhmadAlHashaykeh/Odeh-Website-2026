<?php

namespace App\Http\Resources;

use App\Support\PublicMediaUrl;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin \App\Models\TeamMember */
class TeamMemberResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $experienceYears = null;

        if ($this->experience && preg_match('/(\d+)/', $this->experience, $matches)) {
            $experienceYears = (int) $matches[1];
        }

        return [
            'id' => $this->id,
            'slug' => $this->slug,
            'fullName' => $this->full_name,
            'position' => $this->position,
            'department' => $this->department,
            'category' => $this->category,
            'experience' => $this->experience,
            'experienceYears' => $experienceYears,
            'photo' => PublicMediaUrl::reference($this->photo),
            'email' => $this->email,
            'status' => $this->status->value,
            'displayOrder' => $this->display_order,
            'lastUpdated' => $this->updated_at?->toIso8601String(),
            'createdAt' => $this->created_at?->toIso8601String(),
        ];
    }
}
