<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class UpdateAboutPageSettingRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'overview' => ['sometimes', 'nullable', 'array'],
            'approach' => ['sometimes', 'nullable', 'array'],
            'history' => ['sometimes', 'nullable', 'array'],
        ];
    }
}
