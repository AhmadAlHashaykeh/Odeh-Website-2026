<?php

namespace App\Http\Controllers\Api\Public;

use App\Enums\ActivityStatus;
use App\Http\Controllers\Api\Admin\Concerns\HandlesSingletonSetting;
use App\Http\Controllers\Api\Public\Concerns\RespondsWithJson;
use App\Http\Controllers\Controller;
use App\Http\Resources\ActivityResource;
use App\Models\AboutPageSetting;
use App\Models\Activity;
use Illuminate\Http\JsonResponse;

class ActivityController extends Controller
{
    use HandlesSingletonSetting, RespondsWithJson;

    public function index(): JsonResponse
    {
        $about = $this->resolveSingleton(AboutPageSetting::class);
        $activities = Activity::query()
            ->where('status', ActivityStatus::Published)
            ->orderByDesc('activity_date')
            ->orderBy('display_order')
            ->get();

        return response()->json([
            'data' => [
                'page' => $about->activities ?? [],
                'activities' => ActivityResource::collection($activities),
            ],
        ]);
    }

    public function show(Activity $activity): JsonResponse
    {
        abort_unless($activity->status === ActivityStatus::Published, 404);

        $about = $this->resolveSingleton(AboutPageSetting::class);
        $allActivities = Activity::query()
            ->where('status', ActivityStatus::Published)
            ->orderByDesc('activity_date')
            ->orderBy('display_order')
            ->get();

        $index = $allActivities->search(fn (Activity $item) => $item->id === $activity->id);
        $prev = $index !== false && $index > 0 ? $allActivities[$index - 1] : null;
        $next = $index !== false && $index < $allActivities->count() - 1 ? $allActivities[$index + 1] : null;
        $related = $allActivities->where('id', '!=', $activity->id)->take(3)->values();

        return response()->json([
            'data' => [
                'activity' => new ActivityResource($activity),
                'navigation' => [
                    'prev' => $prev ? new ActivityResource($prev) : null,
                    'next' => $next ? new ActivityResource($next) : null,
                ],
                'related' => ActivityResource::collection($related),
            ],
        ]);
    }
}
