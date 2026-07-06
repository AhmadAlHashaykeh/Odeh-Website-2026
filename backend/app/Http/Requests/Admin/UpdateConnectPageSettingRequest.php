<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class UpdateConnectPageSettingRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation(): void
    {
        if ($this->has('links') && is_array($this->input('links')) && ! array_is_list($this->input('links'))) {
            return;
        }

        if ($this->has('links') && is_array($this->input('links'))) {
            $payload = ['items' => $this->input('links')];

            if ($this->has('meta')) {
                $payload['meta'] = $this->input('meta');
            }

            $this->merge(['links' => $payload]);
        } elseif ($this->has('meta')) {
            $existingLinks = $this->input('links', []);
            $payload = is_array($existingLinks) && array_is_list($existingLinks)
                ? ['items' => $existingLinks, 'meta' => $this->input('meta')]
                : array_merge($existingLinks ?: [], ['meta' => $this->input('meta')]);

            $this->merge(['links' => $payload]);
        }
    }

    public function rules(): array
    {
        return [
            'hero' => ['sometimes', 'nullable', 'array'],
            'tagline' => ['sometimes', 'nullable', 'string'],
            'links' => ['sometimes', 'nullable', 'array'],
            'meta' => ['sometimes', 'nullable', 'array'],
        ];
    }
}
