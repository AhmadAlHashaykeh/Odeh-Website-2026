<?php

namespace App\Http\Controllers\Api\Public;

use App\Http\Controllers\Controller;
use App\Http\Requests\Public\StoreJobApplicationRequest;
use App\Models\Job;
use App\Models\JobApplication;
use Illuminate\Http\JsonResponse;

class JobApplicationController extends Controller
{
    public function store(StoreJobApplicationRequest $request, string $slug): JsonResponse
    {
        $job = Job::query()->where('slug', $slug)->firstOrFail();

        $cv = $request->file('cv');
        $cvPath = $cv->store('cv', 'private');

        JobApplication::query()->create([
            'job_id' => $job->id,
            'full_name' => $request->validated('full_name'),
            'email' => $request->validated('email'),
            'phone' => $request->validated('phone'),
            'location' => $request->validated('location'),
            'years_of_experience' => (int) $request->validated('years_of_experience'),
            'linkedin_url' => $request->validated('linkedin_url'),
            'cover_letter' => $request->validated('cover_letter'),
            'cv_path' => $cvPath,
            'cv_original_name' => $cv->getClientOriginalName(),
            'cv_size' => $cv->getSize(),
        ]);

        return response()->json([
            'message' => 'Application submitted successfully.',
        ], 201);
    }
}
