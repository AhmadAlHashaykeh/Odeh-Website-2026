<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Api\Admin\Concerns\AuthorizesCmsModule;
use App\Http\Controllers\Api\Admin\Concerns\HandlesAdminListing;
use App\Http\Controllers\Api\Admin\Concerns\HandlesSingletonSetting;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\UpdateConnectPageSettingRequest;
use App\Http\Resources\ConnectPageSettingResource;
use App\Models\ConnectPageSetting;
use App\Support\CmsModules;
use Illuminate\Http\JsonResponse;

class ConnectPageSettingController extends Controller
{
    use AuthorizesCmsModule, HandlesAdminListing, HandlesSingletonSetting;

    public function show(): JsonResponse
    {
        $this->authorizeModuleView(CmsModules::CONNECT_PAGE);

        $setting = $this->resolveSingleton(ConnectPageSetting::class);

        return $this->singleResponse(new ConnectPageSettingResource($setting));
    }

    public function update(UpdateConnectPageSettingRequest $request): JsonResponse
    {
        $this->authorizeModuleUpdate(CmsModules::CONNECT_PAGE);

        $setting = $this->resolveSingleton(ConnectPageSetting::class);
        $data = $request->validated();
        unset($data['meta']);

        $setting->update($data);

        return $this->singleResponse(new ConnectPageSettingResource($setting->fresh()));
    }
}
