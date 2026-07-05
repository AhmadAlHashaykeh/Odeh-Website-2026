<?php

namespace App\Http\Requests\Admin;

use App\Enums\ServiceStatus;
use App\Http\Requests\Concerns\MapsCamelCaseInput;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreServiceRequest extends FormRequest
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
        return [
            'title' => ['required', 'string', 'max:255'],
            'slug' => ['nullable', 'string', 'max:255', 'unique:services,slug'],
            'description' => ['nullable', 'string'],
            'image' => ['nullable', 'string', 'max:2048'],
            'icon' => ['nullable', 'string', 'max:2048'],
            'used_on_homepage' => ['nullable', 'boolean'],
            'display_order' => ['nullable', 'integer', 'min:0'],
            'status' => ['nullable', Rule::enum(ServiceStatus::class)],
        ];
    }
}
