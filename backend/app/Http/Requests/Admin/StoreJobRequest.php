<?php

namespace App\Http\Requests\Admin;

use App\Enums\JobStatus;
use App\Http\Requests\Concerns\MapsCamelCaseInput;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreJobRequest extends FormRequest
{
    use MapsCamelCaseInput;

    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation(): void
    {
        $this->mapCamelCaseInput([
            'employmentType' => 'employment_type',
            'workMode' => 'work_mode',
            'experienceLevel' => 'experience_level',
            'postedDate' => 'posted_date',
            'closingDate' => 'closing_date',
            'shortDescription' => 'short_description',
            'fullDescription' => 'full_description',
        ]);
    }

    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:255'],
            'slug' => ['nullable', 'string', 'max:255', 'unique:job_postings,slug'],
            'department' => ['nullable', 'string', 'max:255'],
            'location' => ['nullable', 'string', 'max:255'],
            'employment_type' => ['nullable', 'string', 'max:255'],
            'work_mode' => ['nullable', 'string', 'max:255'],
            'experience_level' => ['nullable', 'string', 'max:255'],
            'posted_date' => ['nullable', 'date'],
            'closing_date' => ['nullable', 'date'],
            'short_description' => ['nullable', 'string'],
            'full_description' => ['nullable', 'string'],
            'responsibilities' => ['nullable', 'array'],
            'responsibilities.*' => ['string'],
            'requirements' => ['nullable', 'array'],
            'requirements.*' => ['string'],
            'benefits' => ['nullable', 'array'],
            'benefits.*' => ['string'],
            'status' => ['nullable', Rule::enum(JobStatus::class)],
        ];
    }
}
