<?php

namespace App\Http\Controllers\Api\Public;

use App\Http\Controllers\Api\Admin\Concerns\HandlesSingletonSetting;
use App\Http\Controllers\Api\Public\Concerns\RespondsWithJson;
use App\Http\Controllers\Controller;
use App\Http\Resources\HomePageSettingResource;
use App\Models\HomePageSetting;
use Illuminate\Http\JsonResponse;

class HomePageController extends Controller
{
    use HandlesSingletonSetting, RespondsWithJson;

    public function show(): JsonResponse
    {
        $setting = $this->resolveSingleton(HomePageSetting::class);

        return $this->singleResponse(new HomePageSettingResource($setting));
    }
}
