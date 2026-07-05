<?php

namespace App\Http\Requests\Admin;

use App\Enums\JobStatus;
use App\Http\Requests\Concerns\MapsCamelCaseInput;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateJobRequest extends FormRequest
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
        $id = $this->route('job') ?? $this->route('id');

        return [
            'title' => ['sometimes', 'required', 'string', 'max:255'],
            'slug' => ['sometimes', 'nullable', 'string', 'max:255', Rule::unique('job_postings', 'slug')->ignore($id)],
            'department' => ['sometimes', 'nullable', 'string', 'max:255'],
            'location' => ['sometimes', 'nullable', 'string', 'max:255'],
            'employment_type' => ['sometimes', 'nullable', 'string', 'max:255'],
            'work_mode' => ['sometimes', 'nullable', 'string', 'max:255'],
            'experience_level' => ['sometimes', 'nullable', 'string', 'max:255'],
            'posted_date' => ['sometimes', 'nullable', 'date'],
            'closing_date' => ['sometimes', 'nullable', 'date'],
            'short_description' => ['sometimes', 'nullable', 'string'],
            'full_description' => ['sometimes', 'nullable', 'string'],
            'responsibilities' => ['sometimes', 'nullable', 'array'],
            'responsibilities.*' => ['string'],
            'requirements' => ['sometimes', 'nullable', 'array'],
            'requirements.*' => ['string'],
            'benefits' => ['sometimes', 'nullable', 'array'],
            'benefits.*' => ['string'],
            'status' => ['sometimes', Rule::enum(JobStatus::class)],
        ];
    }
}
