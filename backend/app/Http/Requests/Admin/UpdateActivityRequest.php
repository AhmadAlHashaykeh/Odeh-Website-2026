<?php

namespace App\Http\Requests\Admin;

use App\Enums\ActivityStatus;
use App\Http\Requests\Concerns\MapsCamelCaseInput;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateActivityRequest extends FormRequest
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
            'activityDate' => 'activity_date',
            'displayOrder' => 'display_order',
            'isFeatured' => 'is_featured',
        ]);

        if ($this->has('featured')) {
            $this->merge(['is_featured' => $this->normalizeBoolean($this->input('featured'))]);
        }
    }

    public function rules(): array
    {
        $id = $this->route('activity') ?? $this->route('id');

        return [
            'title' => ['sometimes', 'required', 'string', 'max:255'],
            'slug' => ['sometimes', 'nullable', 'string', 'max:255', Rule::unique('activities', 'slug')->ignore($id)],
            'location' => ['sometimes', 'nullable', 'string', 'max:255'],
            'description' => ['sometimes', 'nullable', 'string'],
            'cover_image' => ['sometimes', 'nullable', 'string', 'max:2048'],
            'gallery' => ['sometimes', 'nullable', 'array'],
            'gallery.*.src' => ['required_with:gallery', 'string'],
            'gallery.*.alt' => ['nullable', 'string'],
            'activity_date' => ['sometimes', 'nullable', 'string', 'max:255'],
            'status' => ['sometimes', Rule::enum(ActivityStatus::class)],
            'is_featured' => ['sometimes', 'boolean'],
            'display_order' => ['sometimes', 'integer', 'min:0'],
        ];
    }
}
