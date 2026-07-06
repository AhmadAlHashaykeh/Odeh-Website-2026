<?php

namespace App\Http\Controllers\Api\Public;

use App\Http\Controllers\Api\Admin\Concerns\HandlesSingletonSetting;
use App\Http\Controllers\Api\Public\Concerns\RespondsWithJson;
use App\Http\Controllers\Controller;
use App\Http\Resources\AboutPageSettingResource;
use App\Models\AboutPageSetting;
use Illuminate\Http\JsonResponse;

class AboutPageController extends Controller
{
    use HandlesSingletonSetting, RespondsWithJson;

    public function show(): JsonResponse
    {
        $setting = $this->resolveSingleton(AboutPageSetting::class);

        return $this->singleResponse(new AboutPageSettingResource($setting));
    }
}
