<?php

namespace App\Http\Requests\Admin;

use App\Support\UploadModuleFields;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Validator;

class StoreImageUploadRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /** @return array<string, mixed> */
    public function rules(): array
    {
        $mimes = 'jpg,jpeg,png,webp';

        if (function_exists('imagecreatefromavif')) {
            $mimes .= ',avif';
        }

        return [
            'image' => ['required', 'file', 'mimes:'.$mimes, 'max:5120'],
            'module' => ['required', 'string', 'max:64'],
            'field' => ['required', 'string', 'max:64'],
        ];
    }

    public function withValidator(Validator $validator): void
    {
        $validator->after(function (Validator $validator): void {
            $module = (string) $this->input('module');
            $field = (string) $this->input('field');

            if (! UploadModuleFields::isValidModule($module)) {
                $validator->errors()->add('module', 'Unsupported upload module.');

                return;
            }

            if (! UploadModuleFields::isValidField($module, $field)) {
                $validator->errors()->add('field', 'Unsupported upload field for this module.');
            }
        });
    }
}
