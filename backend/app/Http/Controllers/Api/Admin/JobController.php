<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Api\Admin\Concerns\HandlesAdminListing;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreJobRequest;
use App\Http\Requests\Admin\UpdateJobRequest;
use App\Http\Resources\JobResource;
use App\Models\Job;
use App\Support\SlugGenerator;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class JobController extends Controller
{
    use HandlesAdminListing;

    public function index(Request $request): JsonResponse
    {
        $query = Job::query();

        $this->applySearch($query, $request->query('search'), [
            'title', 'slug', 'department', 'location', 'short_description',
            'full_description', 'employment_type', 'work_mode', 'experience_level',
        ]);

        if ($status = $request->query('status')) {
            $query->where('status', $status);
        }

        if ($employmentType = $request->query('employment_type')) {
            $query->where('employment_type', $employmentType);
        }

        if ($workMode = $request->query('work_mode')) {
            $query->where('work_mode', $workMode);
        }

        if ($experienceLevel = $request->query('experience_level')) {
            $query->where('experience_level', $experienceLevel);
        }

        $this->applySort($query, $request->query('sort'), [
            'title' => 'title',
            'updated_at' => 'updated_at',
            'posted_date' => 'posted_date',
            'closing_date' => 'closing_date',
            'lastUpdated' => 'updated_at',
            'postedDate' => 'posted_date',
            'closingDate' => 'closing_date',
        ], 'posted_date');

        $paginator = $query->paginate($this->perPage($request));

        return $this->paginatedResponse($paginator, JobResource::class);
    }

    public function store(StoreJobRequest $request): JsonResponse
    {
        $data = $request->validated();
        $data['slug'] = $this->resolveSlug($data, new Job);

        $job = Job::query()->create($data);

        return $this->singleResponse(new JobResource($job), 201);
    }

    public function show(Job $job): JsonResponse
    {
        return $this->singleResponse(new JobResource($job));
    }

    public function update(UpdateJobRequest $request, Job $job): JsonResponse
    {
        $data = $request->validated();

        if (array_key_exists('title', $data) || array_key_exists('slug', $data)) {
            $slugInput = $data;
            if (! array_key_exists('title', $slugInput)) {
                $slugInput['title'] = $job->title;
            }

            $data['slug'] = $this->resolveSlug($slugInput, $job, $job->id);
        }

        $job->update($data);

        return $this->singleResponse(new JobResource($job));
    }

    public function destroy(Job $job): JsonResponse
    {
        $job->delete();

        return response()->json(null, 204);
    }

    /**
     * @param  array<string, mixed>  $data
     */
    private function resolveSlug(array $data, Job $model, ?string $exceptId = null): string
    {
        $baseSlug = (array_key_exists('slug', $data) && filled($data['slug']))
            ? SlugGenerator::normalize($data['slug'])
            : SlugGenerator::fromTitle($data['title'] ?? $model->title);

        return SlugGenerator::unique($baseSlug, $model, $exceptId);
    }
}
