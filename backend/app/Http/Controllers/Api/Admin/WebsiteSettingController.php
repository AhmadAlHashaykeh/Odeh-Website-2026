<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Api\Admin\Concerns\AuthorizesCmsModule;
use App\Http\Controllers\Api\Admin\Concerns\HandlesAdminListing;
use App\Http\Controllers\Api\Admin\Concerns\HandlesSingletonSetting;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\UpdateWebsiteSettingRequest;
use App\Http\Requests\Admin\UpdateWebsiteSettingSectionRequest;
use App\Http\Resources\WebsiteSettingResource;
use App\Models\WebsiteSetting;
use App\Support\CmsModules;
use Illuminate\Http\JsonResponse;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

class WebsiteSettingController extends Controller
{
    use AuthorizesCmsModule, HandlesAdminListing, HandlesSingletonSetting;

    /** @var array<int, string> */
    private const ALLOWED_SECTIONS = [
        'general-identity',
        'branding-favicon',
        'search-placeholders',
        'search-limits',
        'integrations-maps',
    ];

    public function show(): JsonResponse
    {
        $this->authorizeModuleView(CmsModules::WEBSITE_SETTINGS);

        $setting = $this->resolveSingleton(WebsiteSetting::class);

        return $this->singleResponse(new WebsiteSettingResource($setting));
    }

    public function update(UpdateWebsiteSettingRequest $request): JsonResponse
    {
        $this->authorizeModuleUpdate(CmsModules::WEBSITE_SETTINGS);

        $setting = $this->resolveSingleton(WebsiteSetting::class);
        $setting->update($request->validated());

        return $this->singleResponse(new WebsiteSettingResource($setting->fresh()));
    }

    public function updateSection(UpdateWebsiteSettingSectionRequest $request, string $section): JsonResponse
    {
        $this->authorizeModuleUpdate(CmsModules::WEBSITE_SETTINGS);

        if (! in_array($section, self::ALLOWED_SECTIONS, true)) {
            throw new NotFoundHttpException;
        }

        $setting = $this->resolveSingleton(WebsiteSetting::class);
        $payload = $request->sectionPayload();

        match ($section) {
            'general-identity' => $setting->update([
                'general_identity' => array_merge($setting->general_identity ?? [], $payload),
            ]),
            'branding-favicon' => $setting->update([
                'branding_favicon' => $this->mergeBrandingFavicon($setting->branding_favicon ?? [], $payload),
            ]),
            'search-placeholders' => $setting->update([
                'search_placeholders' => array_merge($setting->search_placeholders ?? [], $payload),
            ]),
            'search-limits' => $setting->update([
                'search_limits' => array_merge($setting->search_limits ?? [], $payload),
            ]),
            'integrations-maps' => $setting->update([
                'integrations_maps' => array_merge($setting->integrations_maps ?? [], $payload),
            ]),
        };

        return $this->singleResponse(new WebsiteSettingResource($setting->fresh()));
    }

    /**
     * @param  array<string, mixed>  $existing
     * @param  array<string, mixed>  $payload
     * @return array<string, mixed>
     */
    private function mergeBrandingFavicon(array $existing, array $payload): array
    {
        if (array_key_exists('faviconSrc', $payload)) {
            $existing['favicon'] = array_merge($existing['favicon'] ?? [], [
                'src' => $payload['faviconSrc'],
            ]);
            unset($payload['faviconSrc']);
        }

        if (array_key_exists('favicon', $payload)) {
            $existing['favicon'] = array_merge($existing['favicon'] ?? [], $payload['favicon']);
            unset($payload['favicon']);
        }

        return array_merge($existing, $payload);
    }
}
