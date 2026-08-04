<?php

namespace App\Http\Resources;

use App\Models\SeoPage;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin SeoPage */
class SeoPageResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'pageName' => $this->page_name,
            'route' => $this->route,
            'pageType' => $this->page_type,
            'contentModule' => $this->content_module,
            'metaTitle' => $this->meta_title,
            'metaDescription' => $this->meta_description,
            'seoStatus' => $this->seoStatus(),
            'lastUpdated' => $this->updated_at?->toIso8601String(),
        ];
    }
}
