<?php

namespace App\Http\Requests\Admin;

use App\Enums\ProjectCategoryStatus;
use App\Http\Requests\Concerns\MapsCamelCaseInput;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateProjectCategoryRequest extends FormRequest
{
    use MapsCamelCaseInput;

    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation(): void
    {
        $this->mapCamelCaseInput([
            'coverImage' => 'cover_image',
            'featuredImage' => 'featured_image',
            'displayOrder' => 'display_order',
        ]);
    }

    public function rules(): array
    {
        $id = $this->route('project_category') ?? $this->route('id');

        return [
            'title' => ['sometimes', 'required', 'string', 'max:255'],
            'slug' => ['sometimes', 'nullable', 'string', 'max:255', Rule::unique('project_categories', 'slug')->ignore($id)],
            'description' => ['sometimes', 'nullable', 'string'],
            'cover_image' => ['sometimes', 'nullable', 'string', 'max:2048'],
            'featured_image' => ['sometimes', 'nullable', 'string', 'max:2048'],
            'status' => ['sometimes', Rule::enum(ProjectCategoryStatus::class)],
            'display_order' => ['sometimes', 'integer', 'min:0'],
        ];
    }
}
