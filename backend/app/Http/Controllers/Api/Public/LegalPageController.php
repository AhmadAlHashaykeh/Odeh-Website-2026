<?php

namespace App\Http\Controllers\Api\Public;

use App\Enums\LegalPagePublicationStatus;
use App\Http\Controllers\Api\Public\Concerns\RespondsWithJson;
use App\Http\Controllers\Controller;
use App\Http\Resources\LegalPageResource;
use App\Models\LegalPage;
use Illuminate\Http\JsonResponse;

class LegalPageController extends Controller
{
    use RespondsWithJson;

    public function index(): JsonResponse
    {
        $pages = LegalPage::query()
            ->where('publication_status', LegalPagePublicationStatus::Published)
            ->orderBy('title')
            ->get();

        return $this->collectionResponse($pages, LegalPageResource::class);
    }

    public function show(LegalPage $legalPage): JsonResponse
    {
        abort_unless($legalPage->publication_status === LegalPagePublicationStatus::Published, 404);

        return $this->singleResponse(new LegalPageResource($legalPage));
    }
}
