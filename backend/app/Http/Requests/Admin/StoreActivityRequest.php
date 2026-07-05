<?php

namespace App\Http\Requests\Admin;

use App\Enums\ActivityStatus;
use App\Http\Requests\Concerns\MapsCamelCaseInput;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreActivityRequest extends FormRequest
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
        return [
            'title' => ['required', 'string', 'max:255'],
            'slug' => ['nullable', 'string', 'max:255', 'unique:activities,slug'],
            'location' => ['nullable', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'cover_image' => ['nullable', 'string', 'max:2048'],
            'gallery' => ['nullable', 'array'],
            'gallery.*.src' => ['required_with:gallery', 'string'],
            'gallery.*.alt' => ['nullable', 'string'],
            'activity_date' => ['nullable', 'string', 'max:255'],
            'status' => ['nullable', Rule::enum(ActivityStatus::class)],
            'is_featured' => ['nullable', 'boolean'],
            'display_order' => ['nullable', 'integer', 'min:0'],
        ];
    }
}
