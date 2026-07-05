<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin \App\Models\LegalPage */
class LegalPageResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $content = $this->sections ?? [];
        $sections = $content['sections'] ?? [];
        $body = $content['body'] ?? [];
        $meta = $content['meta'] ?? null;
        $lastUpdated = $content['lastUpdated'] ?? $this->updated_at?->toIso8601String();

        return [
            'id' => $this->slug,
            'slug' => $this->slug,
            'path' => '/'.$this->slug,
            'title' => $this->title,
            'hero' => $this->hero,
            'meta' => $meta,
            'sections' => $sections,
            'body' => $body,
            'lastUpdated' => $lastUpdated,
            'publicationStatus' => $this->publication_status->value,
        ];
    }
}
