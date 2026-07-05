<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Api\Admin\Concerns\HandlesAdminListing;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\UpdateSeoPageRequest;
use App\Http\Resources\SeoPageResource;
use App\Models\SeoPage;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SeoPageController extends Controller
{
    use HandlesAdminListing;

    public function index(Request $request): JsonResponse
    {
        $query = SeoPage::query();

        $this->applySearch($query, $request->query('search'), [
            'page_name', 'route', 'page_type', 'meta_title', 'meta_description',
        ]);

        if ($contentModule = $request->query('content_module')) {
            $query->where('content_module', $contentModule);
        }

        if ($pageType = $request->query('page_type')) {
            $query->where('page_type', $pageType);
        }

        $this->applySort($query, $request->query('sort'), [
            'page_name' => 'page_name',
            'pageName' => 'page_name',
            'route' => 'route',
            'page_type' => 'page_type',
            'pageType' => 'page_type',
            'updated_at' => 'updated_at',
            'lastUpdated' => 'updated_at',
        ], 'page_name');

        $paginator = $query->paginate($this->perPage($request));

        return $this->paginatedResponse($paginator, SeoPageResource::class);
    }

    public function show(SeoPage $seoPage): JsonResponse
    {
        return $this->singleResponse(new SeoPageResource($seoPage));
    }

    public function update(UpdateSeoPageRequest $request, SeoPage $seoPage): JsonResponse
    {
        $seoPage->update($request->validated());

        return $this->singleResponse(new SeoPageResource($seoPage->fresh()));
    }
}
