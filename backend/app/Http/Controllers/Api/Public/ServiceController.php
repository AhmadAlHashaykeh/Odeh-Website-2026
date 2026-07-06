<?php

namespace App\Http\Controllers\Api\Public;

use App\Enums\ServiceStatus;
use App\Http\Controllers\Api\Public\Concerns\RespondsWithJson;
use App\Http\Controllers\Controller;
use App\Http\Resources\ServiceResource;
use App\Models\Service;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ServiceController extends Controller
{
    use RespondsWithJson;

    public function index(Request $request): JsonResponse
    {
        $query = Service::query()
            ->where('status', ServiceStatus::Published)
            ->orderBy('display_order');

        if ($request->boolean('homepage')) {
            $query->where('used_on_homepage', true);
        }

        return $this->collectionResponse($query->get(), ServiceResource::class);
    }
}
