<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class UpdateHomePageSettingRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'hero' => ['sometimes', 'nullable', 'array'],
            'about' => ['sometimes', 'nullable', 'array'],
            'services' => ['sometimes', 'nullable', 'array'],
            'projects' => ['sometimes', 'nullable', 'array'],
        ];
    }
}
