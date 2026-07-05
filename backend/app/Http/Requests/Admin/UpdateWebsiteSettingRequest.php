<?php

namespace App\Http\Requests\Admin;

use App\Http\Requests\Concerns\MapsCamelCaseInput;
use Illuminate\Foundation\Http\FormRequest;

class UpdateWebsiteSettingRequest extends FormRequest
{
    use MapsCamelCaseInput;

    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation(): void
    {
        if ($this->has('general')) {
            $this->merge(['general_identity' => $this->input('general')]);
        }

        if ($this->has('branding')) {
            $this->merge(['branding_favicon' => $this->input('branding')]);
        }

        if ($this->has('search')) {
            $search = $this->input('search', []);

            if (is_array($search)) {
                $this->merge([
                    'search_placeholders' => array_intersect_key($search, array_flip([
                        'pagePlaceholder',
                        'overlayPlaceholder',
                        'overlaySubtitle',
                        'available',
                    ])),
                    'search_limits' => array_intersect_key($search, array_flip([
                        'suggestionsLimit',
                        'resultsLimit',
                    ])),
                ]);
            }
        }

        if ($this->has('integrations')) {
            $this->merge(['integrations_maps' => $this->input('integrations')]);
        }
    }

    public function rules(): array
    {
        return [
            'general_identity' => ['sometimes', 'nullable', 'array'],
            'branding_favicon' => ['sometimes', 'nullable', 'array'],
            'search_placeholders' => ['sometimes', 'nullable', 'array'],
            'search_limits' => ['sometimes', 'nullable', 'array'],
            'integrations_maps' => ['sometimes', 'nullable', 'array'],
        ];
    }
}
