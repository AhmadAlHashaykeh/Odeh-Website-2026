<?php

namespace App\Http\Controllers\Api\Public;

use App\Enums\JobStatus;
use App\Http\Controllers\Api\Admin\Concerns\HandlesSingletonSetting;
use App\Http\Controllers\Api\Public\Concerns\RespondsWithJson;
use App\Http\Controllers\Controller;
use App\Http\Resources\JobResource;
use App\Models\Job;
use App\Models\WebsiteSetting;
use Illuminate\Http\JsonResponse;

class JobController extends Controller
{
    use HandlesSingletonSetting, RespondsWithJson;

    public function index(): JsonResponse
    {
        $jobs = Job::query()
            ->where('status', JobStatus::Open)
            ->orderByDesc('posted_date')
            ->get();

        return $this->collectionResponse($jobs, JobResource::class);
    }

    public function show(Job $job): JsonResponse
    {
        abort_unless($job->status === JobStatus::Open, 404);

        return $this->singleResponse(new JobResource($job));
    }

    public function page(): JsonResponse
    {
        $settings = $this->resolveSingleton(WebsiteSetting::class);
        $publicPages = $settings->public_pages ?? [];
        $careersPage = $publicPages['careers'] ?? [];

        return response()->json([
            'data' => [
                'page' => $careersPage,
                'jobs' => JobResource::collection(
                    Job::query()
                        ->where('status', JobStatus::Open)
                        ->orderByDesc('posted_date')
                        ->get()
                ),
            ],
        ]);
    }
}
