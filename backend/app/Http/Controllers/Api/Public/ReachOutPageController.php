<?php

namespace App\Http\Controllers\Api\Public;

use App\Http\Controllers\Api\Admin\Concerns\HandlesSingletonSetting;
use App\Http\Controllers\Api\Public\Concerns\RespondsWithJson;
use App\Http\Controllers\Controller;
use App\Models\WebsiteSetting;
use Illuminate\Http\JsonResponse;

class ReachOutPageController extends Controller
{
    use HandlesSingletonSetting, RespondsWithJson;

    public function show(): JsonResponse
    {
        $settings = $this->resolveSingleton(WebsiteSetting::class);
        $publicPages = $settings->public_pages ?? [];

        return response()->json([
            'data' => $publicPages['reachOut'] ?? [],
        ]);
    }
}
