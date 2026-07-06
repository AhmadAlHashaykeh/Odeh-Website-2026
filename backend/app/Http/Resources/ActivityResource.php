<?php

namespace App\Http\Resources;

use App\Support\PublicMediaUrl;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin \App\Models\Activity */
class ActivityResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $gallery = PublicMediaUrl::transformGallery($this->gallery ?? []);
        $activityYear = null;

        if ($this->activity_date && preg_match('/\d{4}/', $this->activity_date, $matches)) {
            $activityYear = (int) $matches[0];
        }

        return [
            'id' => $this->id,
            'title' => $this->title,
            'slug' => $this->slug,
            'location' => $this->location,
            'description' => $this->description,
            'descriptionPreview' => $this->description,
            'fullDescription' => $this->description,
            'coverImage' => PublicMediaUrl::reference($this->cover_image),
            'gallery' => $gallery,
            'galleryCount' => count($gallery),
            'activityDate' => $this->activity_date,
            'activityYear' => $activityYear,
            'status' => $this->status->value,
            'publicationStatus' => $this->status->value,
            'published' => $this->status->value === 'published',
            'featured' => $this->is_featured,
            'displayOrder' => $this->display_order,
            'lastUpdated' => $this->updated_at?->toIso8601String(),
            'createdAt' => $this->created_at?->toIso8601String(),
        ];
    }
}
