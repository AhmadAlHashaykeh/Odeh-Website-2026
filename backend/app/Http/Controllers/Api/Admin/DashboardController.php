<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;

class DashboardController extends Controller
{
    public function stats(): JsonResponse
    {
        return response()->json([
            'data' => [
                'projects' => 0,
                'categories' => 0,
                'teamMembers' => 0,
                'services' => 0,
                'activities' => 0,
                'careers' => 0,
                'applications' => 0,
                'contactMessages' => 0,
            ],
        ]);
    }
}
