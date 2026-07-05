<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Api\Admin\Concerns\HandlesAdminListing;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\UpdateLegalPageRequest;
use App\Http\Resources\LegalPageResource;
use App\Models\LegalPage;
use Illuminate\Http\JsonResponse;

class LegalPageController extends Controller
{
    use HandlesAdminListing;

    public function index(): JsonResponse
    {
        $pages = LegalPage::query()->orderBy('slug')->get();

        return response()->json([
            'data' => LegalPageResource::collection($pages),
        ]);
    }

    public function show(LegalPage $legalPage): JsonResponse
    {
        return $this->singleResponse(new LegalPageResource($legalPage));
    }

    public function update(UpdateLegalPageRequest $request, LegalPage $legalPage): JsonResponse
    {
        $data = $request->validated();

        if (array_key_exists('sections', $data) && is_array($data['sections'])) {
            $data['sections'] = array_merge($legalPage->sections ?? [], $data['sections']);
        }

        $legalPage->update($data);

        return $this->singleResponse(new LegalPageResource($legalPage->fresh()));
    }
}
