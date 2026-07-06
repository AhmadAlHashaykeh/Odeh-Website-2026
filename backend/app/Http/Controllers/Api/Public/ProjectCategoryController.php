<?php

namespace App\Http\Controllers\Api\Public;

use App\Enums\ProjectCategoryStatus;
use App\Http\Controllers\Api\Public\Concerns\RespondsWithJson;
use App\Http\Controllers\Controller;
use App\Http\Resources\ProjectCategoryResource;
use App\Models\ProjectCategory;
use Illuminate\Http\JsonResponse;

class ProjectCategoryController extends Controller
{
    use RespondsWithJson;

    public function index(): JsonResponse
    {
        $categories = ProjectCategory::query()
            ->where('status', ProjectCategoryStatus::Published)
            ->withCount('projects')
            ->orderBy('display_order')
            ->get();

        return $this->collectionResponse($categories, ProjectCategoryResource::class);
    }
}
