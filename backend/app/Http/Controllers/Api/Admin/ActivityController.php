<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Api\Admin\Concerns\HandlesAdminListing;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreActivityRequest;
use App\Http\Requests\Admin\UpdateActivityRequest;
use App\Http\Resources\ActivityResource;
use App\Models\Activity;
use App\Support\SlugGenerator;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ActivityController extends Controller
{
    use HandlesAdminListing;

    public function index(Request $request): JsonResponse
    {
        $query = Activity::query();

        $this->applySearch($query, $request->query('search'), [
            'title', 'slug', 'location', 'activity_date', 'description',
        ]);

        if ($status = $request->query('status')) {
            $query->where('status', $status);
        }

        if ($request->has('featured')) {
            $query->where('is_featured', filter_var($request->query('featured'), FILTER_VALIDATE_BOOLEAN));
        }

        $this->applySort($query, $request->query('sort'), [
            'display_order' => 'display_order',
            'title' => 'title',
            'updated_at' => 'updated_at',
            'activity_date' => 'activity_date',
            'lastUpdated' => 'updated_at',
            'displayOrder' => 'display_order',
        ]);

        $paginator = $query->paginate($this->perPage($request));

        return $this->paginatedResponse($paginator, ActivityResource::class);
    }

    public function store(StoreActivityRequest $request): JsonResponse
    {
        $data = $request->validated();
        $data['slug'] = $this->resolveSlug($data, new Activity);

        $activity = Activity::query()->create($data);

        return $this->singleResponse(new ActivityResource($activity), 201);
    }

    public function show(Activity $activity): JsonResponse
    {
        return $this->singleResponse(new ActivityResource($activity));
    }

    public function update(UpdateActivityRequest $request, Activity $activity): JsonResponse
    {
        $data = $request->validated();

        if (array_key_exists('title', $data) || array_key_exists('slug', $data)) {
            $slugInput = $data;
            if (! array_key_exists('title', $slugInput)) {
                $slugInput['title'] = $activity->title;
            }

            $data['slug'] = $this->resolveSlug($slugInput, $activity, $activity->id);
        }

        $activity->update($data);

        return $this->singleResponse(new ActivityResource($activity));
    }

    public function destroy(Activity $activity): JsonResponse
    {
        $activity->delete();

        return response()->json(null, 204);
    }

    /**
     * @param  array<string, mixed>  $data
     */
    private function resolveSlug(array $data, Activity $model, ?string $exceptId = null): string
    {
        $baseSlug = (array_key_exists('slug', $data) && filled($data['slug']))
            ? SlugGenerator::normalize($data['slug'])
            : SlugGenerator::fromTitle($data['title'] ?? $model->title);

        return SlugGenerator::unique($baseSlug, $model, $exceptId);
    }
}
