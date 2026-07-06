<?php

namespace App\Http\Resources;

use App\Support\PublicMediaUrl;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin \App\Models\Service */
class ServiceResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'slug' => $this->slug,
            'description' => $this->description,
            'descriptionPreview' => $this->description,
            'fullDescription' => $this->description,
            'image' => PublicMediaUrl::reference($this->image),
            'icon' => PublicMediaUrl::reference($this->icon),
            'status' => $this->status->value,
            'published' => $this->status->value === 'published',
            'usedOnHomepage' => $this->used_on_homepage,
            'displayOrder' => $this->display_order,
            'lastUpdated' => $this->updated_at?->toIso8601String(),
            'createdAt' => $this->created_at?->toIso8601String(),
        ];
    }
}
