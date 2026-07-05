<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin \App\Models\WebsiteSetting */
class WebsiteSettingResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $general = $this->general_identity ?? [];
        $branding = $this->branding_favicon ?? [];
        $placeholders = $this->search_placeholders ?? [];
        $limits = $this->search_limits ?? [];
        $integrations = $this->integrations_maps ?? [];

        return [
            'general' => $general,
            'branding' => $branding,
            'search' => array_merge($placeholders, $limits),
            'integrations' => $integrations,
            'lastUpdated' => $this->updated_at?->toIso8601String(),
        ];
    }
}
