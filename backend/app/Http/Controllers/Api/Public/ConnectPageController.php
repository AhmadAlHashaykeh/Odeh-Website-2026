<?php

namespace App\Http\Controllers\Api\Public;

use App\Http\Controllers\Api\Admin\Concerns\HandlesSingletonSetting;
use App\Http\Controllers\Api\Public\Concerns\RespondsWithJson;
use App\Http\Controllers\Controller;
use App\Http\Resources\ConnectPageSettingResource;
use App\Models\ConnectPageSetting;
use Illuminate\Http\JsonResponse;

class ConnectPageController extends Controller
{
    use HandlesSingletonSetting, RespondsWithJson;

    public function show(): JsonResponse
    {
        $setting = $this->resolveSingleton(ConnectPageSetting::class);

        return $this->singleResponse(new ConnectPageSettingResource($setting));
    }
}
