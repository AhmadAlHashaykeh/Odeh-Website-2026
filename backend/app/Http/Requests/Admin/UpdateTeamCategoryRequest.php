<?php

namespace App\Http\Requests\Admin;

use App\Http\Requests\Concerns\MapsCamelCaseInput;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateTeamCategoryRequest extends FormRequest
{
    use MapsCamelCaseInput;

    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation(): void
    {
        $this->mapCamelCaseInput([
            'borderColor' => 'border_color',
            'displayOrder' => 'display_order',
            'isActive' => 'is_active',
            'parentId' => 'parent_id',
        ]);

        if ($this->has('is_active')) {
            $this->merge([
                'is_active' => $this->normalizeBoolean($this->input('is_active')),
            ]);
        }

        if ($this->has('status') && ! $this->has('is_active')) {
            $status = strtolower((string) $this->input('status'));
            $this->merge([
                'is_active' => in_array($status, ['active', '1', 'true', 'yes'], true),
            ]);
        }
    }

    public function rules(): array
    {
        $id = $this->route('team_category') ?? $this->route('id');

        return [
            'name' => ['sometimes', 'required', 'string', 'max:255'],
            'slug' => ['sometimes', 'nullable', 'string', 'max:255', Rule::unique('team_categories', 'slug')->ignore($id)],
            'description' => ['sometimes', 'nullable', 'string'],
            'border_color' => ['sometimes', 'required', 'string', 'max:32', 'regex:/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/'],
            'icon' => ['sometimes', 'nullable', 'string', 'max:2048'],
            'parent_id' => [
                'sometimes',
                'nullable',
                'uuid',
                'exists:team_categories,id',
                Rule::notIn([$id]),
            ],
            'display_order' => ['sometimes', 'integer', 'min:0'],
            'is_active' => ['sometimes', 'boolean'],
        ];
    }

    public function messages(): array
    {
        return [
            'border_color.regex' => 'Border colour must be a valid hex colour (e.g. #c9a66b).',
            'parent_id.not_in' => 'A category cannot be its own parent.',
        ];
    }
}
