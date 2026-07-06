<?php

namespace App\Http\Requests\Admin;

use App\Enums\ProjectCategoryStatus;
use App\Http\Requests\Concerns\MapsCamelCaseInput;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreProjectCategoryRequest extends FormRequest
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
        return [
            'title' => ['required', 'string', 'max:255'],
            'slug' => ['nullable', 'string', 'max:255', 'unique:project_categories,slug'],
            'description' => ['nullable', 'string'],
            'cover_image' => ['nullable', 'string', 'max:2048'],
            'featured_image' => ['nullable', 'string', 'max:2048'],
            'status' => ['nullable', Rule::enum(ProjectCategoryStatus::class)],
            'display_order' => ['nullable', 'integer', 'min:0'],
        ];
    }
}
