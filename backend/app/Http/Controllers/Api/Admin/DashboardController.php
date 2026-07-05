<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Enums\LegalPagePublicationStatus;
use App\Models\Activity;
use App\Models\Job;
use App\Models\LegalPage;
use App\Models\Project;
use App\Models\ProjectCategory;
use App\Models\Service;
use App\Models\TeamMember;
use Illuminate\Http\JsonResponse;

class DashboardController extends Controller
{
    public function stats(): JsonResponse
    {
        return response()->json([
            'data' => [
                'projects' => Project::query()->count(),
                'categories' => ProjectCategory::query()->count(),
                'teamMembers' => TeamMember::query()->count(),
                'services' => Service::query()->count(),
                'activities' => Activity::query()->count(),
                'careers' => Job::query()->count(),
                'applications' => 0,
                'contactMessages' => 0,
                'publicPages' => 4 + LegalPage::query()
                    ->where('publication_status', LegalPagePublicationStatus::Published)
                    ->count(),
            ],
        ]);
    }
}
