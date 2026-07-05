<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin \App\Models\Job */
class JobResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $responsibilities = $this->responsibilities ?? [];
        $requirements = $this->requirements ?? [];
        $benefits = $this->benefits ?? [];

        return [
            'id' => $this->id,
            'title' => $this->title,
            'slug' => $this->slug,
            'department' => $this->department,
            'location' => $this->location,
            'employmentType' => $this->employment_type,
            'workMode' => $this->work_mode,
            'experienceLevel' => $this->experience_level,
            'postedDate' => $this->posted_date?->format('Y-m-d'),
            'closingDate' => $this->closing_date?->format('Y-m-d'),
            'shortDescription' => $this->short_description,
            'fullDescription' => $this->full_description,
            'responsibilities' => $responsibilities,
            'requirements' => $requirements,
            'benefits' => $benefits,
            'responsibilitiesCount' => count($responsibilities),
            'requirementsCount' => count($requirements),
            'benefitsCount' => count($benefits),
            'status' => $this->status->value,
            'lastUpdated' => $this->updated_at?->toIso8601String(),
            'createdAt' => $this->created_at?->toIso8601String(),
        ];
    }
}
