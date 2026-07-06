<?php

namespace App\Http\Resources;

use App\Support\PublicMediaUrl;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin \App\Models\NavigationFooterSetting */
class NavigationFooterSettingResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $footerGroups = $this->footer_groups ?? [];
        $contactOffice = $this->contact_office ?? [];
        $directContacts = $this->direct_contacts ?? [];

        return PublicMediaUrl::transformPayload([
            'logo' => $this->logo,
            'navigationItems' => $this->navigation_items,
            'footerBrand' => $this->footer_brand,
            'footerNavGroups' => $footerGroups['navGroups'] ?? [],
            'footerQuickLinks' => $footerGroups['quickLinks'] ?? [],
            'contact' => array_merge($contactOffice, $directContacts),
            'socialLinks' => $this->social_links,
            'copyright' => $this->copyright,
            'lastUpdated' => $this->updated_at?->toIso8601String(),
        ]);
    }
}
