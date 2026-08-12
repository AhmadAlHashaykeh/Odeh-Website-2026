<?php

namespace App\Http\Requests\Admin;

use App\Enums\ProjectStatus;
use App\Http\Requests\Concerns\MapsCamelCaseInput;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateProjectRequest extends FormRequest
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
            'completionStatus' => 'completion_status',
            'displayOrder' => 'display_order',
            'isFeatured' => 'is_featured',
        ]);

        if ($this->has('featured')) {
            $this->merge(['is_featured' => $this->normalizeBoolean($this->input('featured'))]);
        }
    }

    public function rules(): array
    {
        /** @var \App\Models\Project|null $project */
        $project = $this->route('project');
        $projectId = $project?->id ?? $this->route('id');
        $categoryId = $this->input('project_category_id', $project?->project_category_id);

        return [
            'title' => ['sometimes', 'required', 'string', 'max:255'],
            'slug' => [
                'sometimes',
                'nullable',
                'string',
                'max:255',
                Rule::unique('projects', 'slug')
                    ->ignore($projectId)
                    ->where(function ($query) use ($categoryId) {
                        return $categoryId === null
                            ? $query->whereNull('project_category_id')
                            : $query->where('project_category_id', $categoryId);
                    }),
            ],
            'project_category_id' => ['sometimes', 'nullable', 'uuid', 'exists:project_categories,id'],
            'description' => ['sometimes', 'nullable', 'string'],
            'cover_image' => ['sometimes', 'nullable', 'string', 'max:2048'],
            'gallery' => ['sometimes', 'nullable', 'array'],
            'gallery.*.src' => ['required_with:gallery', 'string'],
            'gallery.*.alt' => ['nullable', 'string'],
            'location' => ['sometimes', 'nullable', 'string', 'max:255'],
            'architect' => ['sometimes', 'nullable', 'string', 'max:255'],
            'project_type' => ['sometimes', 'nullable', 'string', 'max:255'],
            'area' => ['sometimes', 'nullable', 'string', 'max:255'],
            'services' => ['sometimes', 'nullable', 'string', 'max:255'],
            'completion_status' => ['sometimes', 'nullable', 'string', 'max:255'],
            'year' => ['sometimes', 'nullable', 'integer', 'min:1900', 'max:2100'],
            'status' => ['sometimes', Rule::enum(ProjectStatus::class)],
            'is_featured' => ['sometimes', 'boolean'],
            'display_order' => ['sometimes', 'integer', 'min:0'],
        ];
    }
}
