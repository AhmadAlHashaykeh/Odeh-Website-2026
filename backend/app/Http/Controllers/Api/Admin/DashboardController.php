<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Enums\LegalPagePublicationStatus;
use App\Models\Activity;
use App\Models\ContactMessage;
use App\Models\Job;
use App\Models\JobApplication;
use App\Models\LegalPage;
use App\Models\Project;
use App\Models\ProjectCategory;
use App\Models\SeoPage;
use App\Models\Service;
use App\Models\TeamMember;
use Illuminate\Http\JsonResponse;

class DashboardController extends Controller
{
    public function stats(): JsonResponse
    {
        $seoComplete = SeoPage::query()
            ->whereNotNull('meta_title')
            ->where('meta_title', '!=', '')
            ->whereNotNull('meta_description')
            ->where('meta_description', '!=', '')
            ->count();

        $seoPending = SeoPage::query()->count() - $seoComplete;

        return response()->json([
            'data' => [
                'projects' => Project::query()->count(),
                'categories' => ProjectCategory::query()->count(),
                'teamMembers' => TeamMember::query()->count(),
                'services' => Service::query()->count(),
                'activities' => Activity::query()->count(),
                'careers' => Job::query()->count(),
                'applications' => JobApplication::query()->count(),
                'contactMessages' => ContactMessage::query()->count(),
                'publicPages' => 4 + LegalPage::query()
                    ->where('publication_status', LegalPagePublicationStatus::Published)
                    ->count(),
                'seoComplete' => $seoComplete,
                'seoPending' => $seoPending,
            ],
        ]);
    }
}
