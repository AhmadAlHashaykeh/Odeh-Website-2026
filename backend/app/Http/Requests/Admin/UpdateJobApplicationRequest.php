<?php

namespace App\Http\Requests\Admin;

use App\Enums\JobApplicationStatus;
use App\Http\Requests\Concerns\MapsCamelCaseInput;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateJobApplicationRequest extends FormRequest
{
    use MapsCamelCaseInput;

    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation(): void
    {
        $this->mapCamelCaseInput([
            'adminNotes' => 'admin_notes',
        ]);
    }

    public function rules(): array
    {
        return [
            'status' => ['sometimes', Rule::enum(JobApplicationStatus::class)],
            'admin_notes' => ['sometimes', 'nullable', 'string'],
        ];
    }
}
