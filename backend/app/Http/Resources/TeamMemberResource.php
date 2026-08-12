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

        $categoryPayload = null;

        if ($this->relationLoaded('teamCategory') && $this->teamCategory) {
            $categoryPayload = [
                'id' => $this->teamCategory->id,
                'name' => $this->teamCategory->name,
                'slug' => $this->teamCategory->slug,
                'borderColor' => $this->teamCategory->border_color,
                'displayOrder' => $this->teamCategory->display_order,
                'description' => $this->teamCategory->description,
                'isActive' => (bool) $this->teamCategory->is_active,
            ];
        }

        $rankPayload = null;

        if ($this->relationLoaded('teamRank') && $this->teamRank) {
            $rankPayload = [
                'id' => $this->teamRank->id,
                'name' => $this->teamRank->name,
                'slug' => $this->teamRank->slug,
                'color' => $this->teamRank->color,
                'displayOrder' => $this->teamRank->display_order,
                'isActive' => (bool) $this->teamRank->is_active,
            ];
        }

        return [
            'id' => $this->id,
            'slug' => $this->slug,
            'fullName' => $this->full_name,
            'position' => $this->position,
            'department' => $this->department,
            'category' => $categoryPayload,
            'categoryLabel' => $this->teamCategory?->name ?? $this->category,
            'teamCategoryId' => $this->team_category_id,
            'rank' => $rankPayload,
            'teamRankId' => $this->team_rank_id,
            'experience' => $this->experience,
            'experienceYears' => $experienceYears,
            'photo' => PublicMediaUrl::reference($this->photo),
            'email' => $this->email,
            'linkedinUrl' => $this->linkedin_url,
            'status' => $this->status->value,
            'displayOrder' => $this->display_order,
            'lastUpdated' => $this->updated_at?->toIso8601String(),
            'createdAt' => $this->created_at?->toIso8601String(),
        ];
    }
}
