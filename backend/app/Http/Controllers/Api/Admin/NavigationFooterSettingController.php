<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Api\Admin\Concerns\AuthorizesCmsModule;
use App\Http\Controllers\Api\Admin\Concerns\HandlesAdminListing;
use App\Http\Controllers\Api\Admin\Concerns\HandlesSingletonSetting;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\UpdateNavigationFooterSettingRequest;
use App\Http\Resources\NavigationFooterSettingResource;
use App\Models\NavigationFooterSetting;
use App\Support\CmsModules;
use Illuminate\Http\JsonResponse;

class NavigationFooterSettingController extends Controller
{
    use AuthorizesCmsModule, HandlesAdminListing, HandlesSingletonSetting;

    public function show(): JsonResponse
    {
        $this->authorizeModuleView(CmsModules::NAVIGATION_FOOTER);

        $setting = $this->resolveSingleton(NavigationFooterSetting::class);

        return $this->singleResponse(new NavigationFooterSettingResource($setting));
    }

    public function update(UpdateNavigationFooterSettingRequest $request): JsonResponse
    {
        $this->authorizeModuleUpdate(CmsModules::NAVIGATION_FOOTER);

        $setting = $this->resolveSingleton(NavigationFooterSetting::class);
        $setting->update($request->validated());

        return $this->singleResponse(new NavigationFooterSettingResource($setting->fresh()));
    }
}
