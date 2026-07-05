<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Api\Admin\Concerns\AuthorizesCmsModule;
use App\Http\Controllers\Api\Admin\Concerns\HandlesAdminListing;
use App\Http\Controllers\Api\Admin\Concerns\HandlesSingletonSetting;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\UpdateAboutPageSettingRequest;
use App\Http\Resources\AboutPageSettingResource;
use App\Models\AboutPageSetting;
use App\Support\CmsModules;
use Illuminate\Http\JsonResponse;

class AboutPageSettingController extends Controller
{
    use AuthorizesCmsModule, HandlesAdminListing, HandlesSingletonSetting;

    public function show(): JsonResponse
    {
        $this->authorizeModuleView(CmsModules::ABOUT_PAGES);

        $setting = $this->resolveSingleton(AboutPageSetting::class);

        return $this->singleResponse(new AboutPageSettingResource($setting));
    }

    public function update(UpdateAboutPageSettingRequest $request): JsonResponse
    {
        $this->authorizeModuleUpdate(CmsModules::ABOUT_PAGES);

        $setting = $this->resolveSingleton(AboutPageSetting::class);
        $setting->update($request->validated());

        return $this->singleResponse(new AboutPageSettingResource($setting->fresh()));
    }
}
