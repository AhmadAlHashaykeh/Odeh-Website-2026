<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin \App\Models\JobApplication */
class JobApplicationResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'jobId' => $this->job_id,
            'jobTitle' => $this->whenLoaded('job', fn () => $this->job?->title),
            'jobSlug' => $this->whenLoaded('job', fn () => $this->job?->slug),
            'department' => $this->whenLoaded('job', fn () => $this->job?->department),
            'fullName' => $this->full_name,
            'email' => $this->email,
            'phone' => $this->phone,
            'location' => $this->location,
            'yearsOfExperience' => $this->years_of_experience,
            'linkedinUrl' => $this->linkedin_url,
            'coverLetter' => $this->cover_letter,
            'cvOriginalName' => $this->cv_original_name,
            'cvSize' => $this->cv_size,
            'status' => $this->status->value,
            'adminNotes' => $this->admin_notes,
            'submittedAt' => $this->created_at?->toIso8601String(),
            'lastUpdated' => $this->updated_at?->toIso8601String(),
        ];
    }
}
