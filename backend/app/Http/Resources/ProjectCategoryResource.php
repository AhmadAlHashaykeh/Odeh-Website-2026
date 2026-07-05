<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin \App\Models\ProjectCategory */
class ProjectCategoryResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $projectCount = $this->whenCounted('projects', $this->projects_count ?? null);

        return [
            'id' => $this->id,
            'title' => $this->title,
            'slug' => $this->slug,
            'description' => $this->description,
            'coverImage' => $this->cover_image,
            'featuredImage' => $this->featured_image,
            'status' => $this->status->value,
            'published' => $this->status->value === 'published',
            'publicationStatus' => $this->status->value === 'published' ? 'published' : 'hidden',
            'displayOrder' => $this->display_order,
            'projectCount' => $projectCount ?? 0,
            'lastUpdated' => $this->updated_at?->toIso8601String(),
            'createdAt' => $this->created_at?->toIso8601String(),
        ];
    }
}
