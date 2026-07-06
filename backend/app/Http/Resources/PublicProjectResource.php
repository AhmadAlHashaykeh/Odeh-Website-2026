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
            'type' => $this->project_type,
            'services' => $this->services,
            'status' => $this->completion_status ?? $this->status->value,
            'gallery' => $gallery,
        ]);
    }
}
