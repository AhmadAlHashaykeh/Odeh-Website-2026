<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Api\Admin\Concerns\AuthorizesCmsModule;
use App\Http\Controllers\Api\Admin\Concerns\HandlesAdminListing;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\UpdateLegalPageRequest;
use App\Http\Resources\LegalPageResource;
use App\Models\LegalPage;
use App\Support\CmsModules;
use Illuminate\Http\JsonResponse;

class LegalPageController extends Controller
{
    use AuthorizesCmsModule, HandlesAdminListing;

    public function index(): JsonResponse
    {
        $this->authorizeModuleView(CmsModules::LEGAL_PAGES);

        $pages = LegalPage::query()->orderBy('slug')->get();

        return response()->json([
            'data' => LegalPageResource::collection($pages),
        ]);
    }

    public function show(LegalPage $legalPage): JsonResponse
    {
        $this->authorizeModuleView(CmsModules::LEGAL_PAGES);

        return $this->singleResponse(new LegalPageResource($legalPage));
    }

    public function update(UpdateLegalPageRequest $request, LegalPage $legalPage): JsonResponse
    {
        $this->authorizeModuleUpdate(CmsModules::LEGAL_PAGES);

        $data = $request->validated();

        if (array_key_exists('sections', $data) && is_array($data['sections'])) {
            $data['sections'] = array_merge($legalPage->sections ?? [], $data['sections']);
        }

        $legalPage->update($data);

        return $this->singleResponse(new LegalPageResource($legalPage->fresh()));
    }
}
