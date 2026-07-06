<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin \App\Models\HomePageSetting */
class HomePageSettingResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'hero' => $this->hero,
            'about' => $this->about,
            'services' => $this->services,
            'projects' => $this->projects,
            'lastUpdated' => $this->updated_at?->toIso8601String(),
        ];
    }
}
