<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin \App\Models\Project */
class ProjectResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $gallery = $this->gallery ?? [];

        return [
            'id' => $this->id,
            'title' => $this->title,
            'slug' => $this->slug,
            'description' => $this->description,
            'coverImage' => $this->cover_image,
            'gallery' => $gallery,
            'galleryCount' => count($gallery),
            'location' => $this->location,
            'projectType' => $this->project_type,
            'area' => $this->area,
            'year' => $this->year,
            'status' => $this->status->value,
            'published' => $this->status->value === 'published',
            'featured' => $this->is_featured,
            'displayOrder' => $this->display_order,
            'category' => $this->category?->title,
            'categorySlug' => $this->category?->slug,
            'projectCategoryId' => $this->project_category_id,
            'lastUpdated' => $this->updated_at?->toIso8601String(),
            'createdAt' => $this->created_at?->toIso8601String(),
        ];
    }
}
