<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Api\Admin\Concerns\AuthorizesCmsModule;
use App\Http\Controllers\Api\Admin\Concerns\HandlesAdminListing;
use App\Http\Controllers\Api\Admin\Concerns\HandlesSingletonSetting;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\UpdateHomePageSettingRequest;
use App\Http\Resources\HomePageSettingResource;
use App\Models\HomePageSetting;
use App\Support\CmsModules;
use Illuminate\Http\JsonResponse;

class HomePageSettingController extends Controller
{
    use AuthorizesCmsModule, HandlesAdminListing, HandlesSingletonSetting;

    public function show(): JsonResponse
    {
        $this->authorizeModuleView(CmsModules::HOME_PAGE);

        $setting = $this->resolveSingleton(HomePageSetting::class);

        return $this->singleResponse(new HomePageSettingResource($setting));
    }

    public function update(UpdateHomePageSettingRequest $request): JsonResponse
    {
        $this->authorizeModuleUpdate(CmsModules::HOME_PAGE);

        $setting = $this->resolveSingleton(HomePageSetting::class);
        $setting->update($request->validated());

        return $this->singleResponse(new HomePageSettingResource($setting->fresh()));
    }
}
