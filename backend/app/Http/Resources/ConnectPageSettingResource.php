<?php

namespace App\Http\Resources;

use App\Support\PublicMediaUrl;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin \App\Models\ConnectPageSetting */
class ConnectPageSettingResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $linksPayload = $this->links ?? [];

        return PublicMediaUrl::transformPayload([
            'meta' => $linksPayload['meta'] ?? null,
            'hero' => $this->hero,
            'tagline' => $this->tagline,
            'links' => $linksPayload['items'] ?? [],
            'lastUpdated' => $this->updated_at?->toIso8601String(),
        ]);
    }
}
