<?php

namespace App\Http\Controllers\Api\Admin\Concerns;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

trait HandlesAdminListing
{
    protected function perPage(Request $request): int
    {
        $perPage = (int) $request->query('per_page', 12);

        return min(max($perPage, 1), 50);
    }

    protected function paginatedResponse(mixed $paginator, string $resourceClass): \Illuminate\Http\JsonResponse
    {
        return response()->json([
            'data' => $resourceClass::collection($paginator->items()),
            'meta' => [
                'currentPage' => $paginator->currentPage(),
                'perPage' => $paginator->perPage(),
                'total' => $paginator->total(),
                'lastPage' => $paginator->lastPage(),
            ],
        ]);
    }

    protected function singleResponse(JsonResource $resource, int $status = 200): \Illuminate\Http\JsonResponse
    {
        return response()->json(['data' => $resource], $status);
    }

    /**
     * @param  array<int, string>  $columns
     */
    protected function applySearch(Builder $query, ?string $search, array $columns): Builder
    {
        if ($search === null || $search === '') {
            return $query;
        }

        $term = '%'.$search.'%';

        return $query->where(function (Builder $builder) use ($columns, $term): void {
            foreach ($columns as $column) {
                $builder->orWhere($column, 'like', $term);
            }
        });
    }

    /**
     * @param  array<string, string>  $allowedSorts
     */
    protected function applySort(Builder $query, ?string $sort, array $allowedSorts, string $default = 'display_order'): Builder
    {
        if ($sort === null || $sort === '') {
            return $query->orderBy($default)->orderByDesc('updated_at');
        }

        $direction = 'asc';
        $field = $sort;

        if (str_starts_with($sort, '-')) {
            $direction = 'desc';
            $field = substr($sort, 1);
        }

        $column = $allowedSorts[$field] ?? $allowedSorts[$default] ?? $default;

        return $query->orderBy($column, $direction);
    }
}
