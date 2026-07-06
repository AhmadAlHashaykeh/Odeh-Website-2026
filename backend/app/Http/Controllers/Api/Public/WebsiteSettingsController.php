<?php

namespace App\Http\Controllers\Api\Public;

use App\Http\Controllers\Api\Admin\Concerns\HandlesSingletonSetting;
use App\Http\Controllers\Api\Public\Concerns\RespondsWithJson;
use App\Http\Controllers\Controller;
use App\Http\Resources\WebsiteSettingResource;
use App\Models\WebsiteSetting;
use Illuminate\Http\JsonResponse;

class WebsiteSettingsController extends Controller
{
    use HandlesSingletonSetting, RespondsWithJson;

    public function show(): JsonResponse
    {
        $setting = $this->resolveSingleton(WebsiteSetting::class);

        return $this->singleResponse(new WebsiteSettingResource($setting));
    }
}
