<?php

namespace App\Http\Controllers\Api\Public;

use App\Enums\TeamMemberStatus;
use App\Http\Controllers\Api\Admin\Concerns\HandlesSingletonSetting;
use App\Http\Controllers\Api\Public\Concerns\RespondsWithJson;
use App\Http\Controllers\Controller;
use App\Http\Resources\AboutPageSettingResource;
use App\Http\Resources\TeamMemberResource;
use App\Models\AboutPageSetting;
use App\Models\TeamMember;
use Illuminate\Http\JsonResponse;

class TeamMemberController extends Controller
{
    use HandlesSingletonSetting, RespondsWithJson;

    public function index(): JsonResponse
    {
        $about = $this->resolveSingleton(AboutPageSetting::class);
        $members = TeamMember::query()
            ->where('status', TeamMemberStatus::Active)
            ->orderBy('display_order')
            ->get();

        return response()->json([
            'data' => [
                'page' => $about->team ?? [],
                'members' => TeamMemberResource::collection($members),
            ],
        ]);
    }
}
