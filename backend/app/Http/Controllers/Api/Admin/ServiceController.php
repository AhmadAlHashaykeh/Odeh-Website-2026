<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Api\Admin\Concerns\HandlesAdminListing;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreServiceRequest;
use App\Http\Requests\Admin\UpdateServiceRequest;
use App\Http\Resources\ServiceResource;
use App\Models\Service;
use App\Support\SlugGenerator;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ServiceController extends Controller
{
    use HandlesAdminListing;

    public function index(Request $request): JsonResponse
    {
        $query = Service::query();

        $this->applySearch($query, $request->query('search'), ['title', 'slug', 'description']);

        if ($status = $request->query('status')) {
            $query->where('status', $status);
        }

        if ($request->has('homepage')) {
            $query->where('used_on_homepage', filter_var($request->query('homepage'), FILTER_VALIDATE_BOOLEAN));
        }

        $this->applySort($query, $request->query('sort'), [
            'display_order' => 'display_order',
            'title' => 'title',
            'updated_at' => 'updated_at',
            'lastUpdated' => 'updated_at',
            'displayOrder' => 'display_order',
        ]);

        $paginator = $query->paginate($this->perPage($request));

        return $this->paginatedResponse($paginator, ServiceResource::class);
    }

    public function store(StoreServiceRequest $request): JsonResponse
    {
        $data = $request->validated();
        $data['slug'] = $this->resolveSlug($data, new Service);

        $service = Service::query()->create($data);

        return $this->singleResponse(new ServiceResource($service), 201);
    }

    public function show(Service $service): JsonResponse
    {
        return $this->singleResponse(new ServiceResource($service));
    }

    public function update(UpdateServiceRequest $request, Service $service): JsonResponse
    {
        $data = $request->validated();

        if (array_key_exists('title', $data) || array_key_exists('slug', $data)) {
            $slugInput = $data;
            if (! array_key_exists('title', $slugInput)) {
                $slugInput['title'] = $service->title;
            }

            $data['slug'] = $this->resolveSlug($slugInput, $service, $service->id);
        }

        $service->update($data);

        return $this->singleResponse(new ServiceResource($service));
    }

    public function destroy(Service $service): JsonResponse
    {
        $service->delete();

        return response()->json(null, 204);
    }

    /**
     * @param  array<string, mixed>  $data
     */
    private function resolveSlug(array $data, Service $model, ?string $exceptId = null): string
    {
        $baseSlug = (array_key_exists('slug', $data) && filled($data['slug']))
            ? SlugGenerator::normalize($data['slug'])
            : SlugGenerator::fromTitle($data['title'] ?? $model->title);

        return SlugGenerator::unique($baseSlug, $model, $exceptId);
    }
}
