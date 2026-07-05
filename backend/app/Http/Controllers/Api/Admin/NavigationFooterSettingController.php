<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Api\Admin\Concerns\HandlesAdminListing;
use App\Http\Controllers\Api\Admin\Concerns\HandlesSingletonSetting;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\UpdateNavigationFooterSettingRequest;
use App\Http\Resources\NavigationFooterSettingResource;
use App\Models\NavigationFooterSetting;
use Illuminate\Http\JsonResponse;

class NavigationFooterSettingController extends Controller
{
    use HandlesAdminListing, HandlesSingletonSetting;

    public function show(): JsonResponse
    {
        $setting = $this->resolveSingleton(NavigationFooterSetting::class);

        return $this->singleResponse(new NavigationFooterSettingResource($setting));
    }

    public function update(UpdateNavigationFooterSettingRequest $request): JsonResponse
    {
        $setting = $this->resolveSingleton(NavigationFooterSetting::class);
        $setting->update($request->validated());

        return $this->singleResponse(new NavigationFooterSettingResource($setting->fresh()));
    }
}
