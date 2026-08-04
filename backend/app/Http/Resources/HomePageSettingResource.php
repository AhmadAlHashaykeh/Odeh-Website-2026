<?php

namespace App\Http\Resources;

use App\Models\HomePageSetting;
use App\Support\PublicMediaUrl;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin HomePageSetting */
class HomePageSettingResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return PublicMediaUrl::transformPayload([
            'hero' => $this->hero,
            'about' => $this->about,
            'services' => $this->services,
            'projects' => $this->projects,
            'lastUpdated' => $this->updated_at?->toIso8601String(),
        ]);
    }
}
