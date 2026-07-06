<?php

namespace App\Http\Controllers\Api\Public\Concerns;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\JsonResource;

trait RespondsWithJson
{
    protected function singleResponse(JsonResource $resource, int $status = 200): JsonResponse
    {
        return response()->json(['data' => $resource], $status);
    }

    /**
     * @param  iterable<mixed>  $items
     * @param  class-string<JsonResource>  $resourceClass
     */
    protected function collectionResponse(iterable $items, string $resourceClass): JsonResponse
    {
        return response()->json([
            'data' => $resourceClass::collection($items),
        ]);
    }
}
