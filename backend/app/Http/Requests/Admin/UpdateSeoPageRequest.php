<?php

namespace App\Http\Requests\Admin;

use App\Http\Requests\Concerns\MapsCamelCaseInput;
use Illuminate\Foundation\Http\FormRequest;

class UpdateSeoPageRequest extends FormRequest
{
    use MapsCamelCaseInput;

    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation(): void
    {
        $this->mapCamelCaseInput([
            'metaTitle' => 'meta_title',
            'metaDescription' => 'meta_description',
        ]);
    }

    public function rules(): array
    {
        return [
            'meta_title' => ['nullable', 'string', 'max:60'],
            'meta_description' => ['nullable', 'string', 'max:160'],
        ];
    }
}
