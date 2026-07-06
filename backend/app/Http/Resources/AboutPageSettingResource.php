<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin \App\Models\AboutPageSetting */
class AboutPageSettingResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'overview' => $this->overview,
            'approach' => $this->approach,
            'history' => $this->history,
            'team' => $this->team,
            'activities' => $this->activities,
            'lastUpdated' => $this->updated_at?->toIso8601String(),
        ];
    }
}
