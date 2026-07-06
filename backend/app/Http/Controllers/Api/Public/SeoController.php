<?php

namespace App\Http\Controllers\Api\Public;

use App\Http\Controllers\Api\Public\Concerns\RespondsWithJson;
use App\Http\Controllers\Controller;
use App\Http\Resources\SeoPageResource;
use App\Models\SeoPage;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SeoController extends Controller
{
    use RespondsWithJson;

    public function index(): JsonResponse
    {
        $pages = SeoPage::query()->orderBy('route')->get();

        return $this->collectionResponse($pages, SeoPageResource::class);
    }

    public function byRoute(Request $request): JsonResponse
    {
        $route = $request->query('route');

        abort_unless(is_string($route) && $route !== '', 404);

        $page = SeoPage::query()->where('route', $route)->firstOrFail();

        return $this->singleResponse(new SeoPageResource($page));
    }
}
