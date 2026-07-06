<?php

namespace App\Http\Requests\Admin;

use App\Enums\LegalPagePublicationStatus;
use App\Http\Requests\Concerns\MapsCamelCaseInput;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateLegalPageRequest extends FormRequest
{
    use MapsCamelCaseInput;

    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation(): void
    {
        $this->mapCamelCaseInput([
            'publicationStatus' => 'publication_status',
        ]);

        $sectionsPayload = [];

        if ($this->has('sections') && is_array($this->input('sections')) && array_is_list($this->input('sections'))) {
            $sectionsPayload['sections'] = $this->input('sections');
        }

        if ($this->has('body')) {
            $sectionsPayload['body'] = $this->input('body');
        }

        if ($this->has('meta')) {
            $sectionsPayload['meta'] = $this->input('meta');
        }

        if ($this->has('lastUpdated')) {
            $sectionsPayload['lastUpdated'] = $this->input('lastUpdated');
        }

        if ($sectionsPayload !== []) {
            $this->merge(['sections' => $sectionsPayload]);
        }
    }

    public function rules(): array
    {
        return [
            'title' => ['sometimes', 'required', 'string', 'max:255'],
            'hero' => ['sometimes', 'nullable', 'array'],
            'sections' => ['sometimes', 'nullable', 'array'],
            'publication_status' => ['sometimes', Rule::enum(LegalPagePublicationStatus::class)],
        ];
    }
}
