<?php

namespace App\Http\Requests\Admin;

use App\Enums\ServiceStatus;
use App\Http\Requests\Concerns\MapsCamelCaseInput;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateServiceRequest extends FormRequest
{
    use MapsCamelCaseInput;

    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation(): void
    {
        $this->mapCamelCaseInput([
            'usedOnHomepage' => 'used_on_homepage',
            'displayOrder' => 'display_order',
        ]);

        if ($this->has('usedOnHomepage') || $this->has('used_on_homepage')) {
            $this->merge([
                'used_on_homepage' => $this->normalizeBoolean(
                    $this->input('used_on_homepage', $this->input('usedOnHomepage'))
                ),
            ]);
        }
    }

    public function rules(): array
    {
        $id = $this->route('service') ?? $this->route('id');

        return [
            'title' => ['sometimes', 'required', 'string', 'max:255'],
            'slug' => ['sometimes', 'nullable', 'string', 'max:255', Rule::unique('services', 'slug')->ignore($id)],
            'description' => ['sometimes', 'nullable', 'string'],
            'image' => ['sometimes', 'nullable', 'string', 'max:2048'],
            'icon' => ['sometimes', 'nullable', 'string', 'max:2048'],
            'used_on_homepage' => ['sometimes', 'boolean'],
            'display_order' => ['sometimes', 'integer', 'min:0'],
            'status' => ['sometimes', Rule::enum(ServiceStatus::class)],
        ];
    }
}
