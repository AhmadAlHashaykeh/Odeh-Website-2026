<?php

namespace App\Http\Requests\Admin;

use App\Enums\ProjectStatus;
use App\Http\Requests\Concerns\MapsCamelCaseInput;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreProjectRequest extends FormRequest
{
    use MapsCamelCaseInput;

    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation(): void
    {
        $this->mapCamelCaseInput([
            'projectCategoryId' => 'project_category_id',
            'categoryId' => 'project_category_id',
            'coverImage' => 'cover_image',
            'projectType' => 'project_type',
            'displayOrder' => 'display_order',
            'isFeatured' => 'is_featured',
        ]);

        if ($this->has('featured')) {
            $this->merge(['is_featured' => $this->normalizeBoolean($this->input('featured'))]);
        }
    }

    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:255'],
            'slug' => ['nullable', 'string', 'max:255'],
            'project_category_id' => ['nullable', 'uuid', 'exists:project_categories,id'],
            'description' => ['nullable', 'string'],
            'cover_image' => ['nullable', 'string', 'max:2048'],
            'gallery' => ['nullable', 'array'],
            'gallery.*.src' => ['required_with:gallery', 'string'],
            'gallery.*.alt' => ['nullable', 'string'],
            'location' => ['nullable', 'string', 'max:255'],
            'project_type' => ['nullable', 'string', 'max:255'],
            'area' => ['nullable', 'string', 'max:255'],
            'services' => ['nullable', 'string', 'max:255'],
            'completion_status' => ['nullable', 'string', 'max:255'],
            'year' => ['nullable', 'integer', 'min:1900', 'max:2100'],
            'status' => ['nullable', Rule::enum(ProjectStatus::class)],
            'is_featured' => ['nullable', 'boolean'],
            'display_order' => ['nullable', 'integer', 'min:0'],
        ];
    }
}
