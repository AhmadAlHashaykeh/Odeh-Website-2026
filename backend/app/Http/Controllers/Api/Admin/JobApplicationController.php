<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Api\Admin\Concerns\HandlesAdminListing;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\UpdateJobApplicationRequest;
use App\Http\Resources\JobApplicationResource;
use App\Models\JobApplication;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\StreamedResponse;

class JobApplicationController extends Controller
{
    use HandlesAdminListing;

    public function index(Request $request): JsonResponse
    {
        $query = JobApplication::query()->with('job');

        if ($search = $request->query('search')) {
            $term = '%'.$search.'%';

            $query->where(function ($builder) use ($term): void {
                $builder->where('full_name', 'like', $term)
                    ->orWhere('email', 'like', $term)
                    ->orWhere('phone', 'like', $term)
                    ->orWhere('location', 'like', $term)
                    ->orWhere('cover_letter', 'like', $term)
                    ->orWhere('linkedin_url', 'like', $term)
                    ->orWhereHas('job', function ($jobQuery) use ($term): void {
                        $jobQuery->where('title', 'like', $term);
                    });
            });
        }

        if ($status = $request->query('status')) {
            $query->where('status', $status);
        }

        if ($job = $request->query('job')) {
            $query->where('job_id', $job);
        }

        $query->orderByDesc('created_at');

        $paginator = $query->paginate($this->perPage($request));

        return $this->paginatedResponse($paginator, JobApplicationResource::class);
    }

    public function show(JobApplication $jobApplication): JsonResponse
    {
        $jobApplication->load('job');

        return $this->singleResponse(new JobApplicationResource($jobApplication));
    }

    public function update(UpdateJobApplicationRequest $request, JobApplication $jobApplication): JsonResponse
    {
        $jobApplication->update($request->validated());
        $jobApplication->load('job');

        return $this->singleResponse(new JobApplicationResource($jobApplication));
    }

    public function downloadCv(JobApplication $jobApplication): StreamedResponse|JsonResponse
    {
        if (! Storage::disk('private')->exists($jobApplication->cv_path)) {
            return response()->json(['message' => 'CV file not found.'], 404);
        }

        return Storage::disk('private')->download(
            $jobApplication->cv_path,
            $jobApplication->cv_original_name,
        );
    }
}
