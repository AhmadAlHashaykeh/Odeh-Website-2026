<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Api\Admin\Concerns\HandlesAdminListing;
use App\Http\Controllers\Api\Admin\Concerns\HandlesSingletonSetting;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\UpdateHomePageSettingRequest;
use App\Http\Resources\HomePageSettingResource;
use App\Models\HomePageSetting;
use Illuminate\Http\JsonResponse;

class HomePageSettingController extends Controller
{
    use HandlesAdminListing, HandlesSingletonSetting;

    public function show(): JsonResponse
    {
        $setting = $this->resolveSingleton(HomePageSetting::class);

        return $this->singleResponse(new HomePageSettingResource($setting));
    }

    public function update(UpdateHomePageSettingRequest $request): JsonResponse
    {
        $setting = $this->resolveSingleton(HomePageSetting::class);
        $setting->update($request->validated());

        return $this->singleResponse(new HomePageSettingResource($setting->fresh()));
    }
}
