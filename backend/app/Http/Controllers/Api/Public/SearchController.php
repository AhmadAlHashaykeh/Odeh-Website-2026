<?php

namespace App\Http\Controllers\Api\Public;

use App\Services\PublicSearchService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SearchController
{
    public function __construct(private readonly PublicSearchService $searchService) {}

    public function index(Request $request): JsonResponse
    {
        $query = $request->query('q');
        $limit = min(max((int) $request->query('limit', 50), 1), 100);

        return response()->json([
            'data' => $this->searchService->search(is_string($query) ? $query : null, $limit),
        ]);
    }

    public function suggestions(Request $request): JsonResponse
    {
        $limit = min(max((int) $request->query('limit', 8), 1), 20);

        return response()->json([
            'data' => $this->searchService->suggestions($limit),
        ]);
    }
}
