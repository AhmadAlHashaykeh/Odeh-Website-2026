<?php

namespace App\Http\Controllers\Api\Public;

use App\Http\Controllers\Api\Admin\Concerns\HandlesSingletonSetting;
use App\Http\Controllers\Api\Public\Concerns\RespondsWithJson;
use App\Http\Controllers\Controller;
use App\Http\Resources\NavigationFooterSettingResource;
use App\Models\NavigationFooterSetting;
use Illuminate\Http\JsonResponse;

class NavigationFooterController extends Controller
{
    use HandlesSingletonSetting, RespondsWithJson;

    public function show(): JsonResponse
    {
        $setting = $this->resolveSingleton(NavigationFooterSetting::class);

        return $this->singleResponse(new NavigationFooterSettingResource($setting));
    }
}
