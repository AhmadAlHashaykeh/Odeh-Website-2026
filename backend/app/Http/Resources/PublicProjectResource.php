<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;

/** @mixin \App\Models\Project */
class PublicProjectResource extends ProjectResource
{
    public function toArray(Request $request): array
    {
        $data = parent::toArray($request);
        $gallery = $this->gallery ?? [];

        return array_merge($data, [
            'architect' => $this->architect,
            'location' => $this->location,
            'area' => $this->area,
            'category' => $this->category?->title,
            'gallery' => $gallery,
        ]);
    }
}
