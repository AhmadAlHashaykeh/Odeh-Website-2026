<?php

namespace App\Http\Requests\Admin;

use App\Http\Requests\Concerns\MapsCamelCaseInput;
use App\Support\CmsModules;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Validator;

class UpdateRolePermissionsRequest extends FormRequest
{
    use MapsCamelCaseInput;

    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation(): void
    {
        $payload = $this->json()->all();

        if ($payload !== [] && array_is_list($payload)) {
            $normalized = [];

            foreach ($payload as $entry) {
                if (! is_array($entry)) {
                    continue;
                }

                $mapped = $entry;

                if (array_key_exists('canView', $entry)) {
                    $mapped['can_view'] = $entry['canView'];
                }
                if (array_key_exists('canCreate', $entry)) {
                    $mapped['can_create'] = $entry['canCreate'];
                }
                if (array_key_exists('canUpdate', $entry)) {
                    $mapped['can_update'] = $entry['canUpdate'];
                }
                if (array_key_exists('canDelete', $entry)) {
                    $mapped['can_delete'] = $entry['canDelete'];
                }

                $normalized[] = $mapped;
            }

            $this->merge(['permissions' => $normalized]);
        }
    }

    public function rules(): array
    {
        return [
            'permissions' => ['required', 'array'],
            'permissions.*.module' => ['required', 'string', Rule::in(CmsModules::all())],
            'permissions.*.can_view' => ['required', 'boolean'],
            'permissions.*.can_create' => ['required', 'boolean'],
            'permissions.*.can_update' => ['required', 'boolean'],
            'permissions.*.can_delete' => ['required', 'boolean'],
        ];
    }

    public function withValidator(Validator $validator): void
    {
        $validator->after(function (Validator $validator): void {
            $permissions = $this->input('permissions', []);
            $modules = collect($permissions)->pluck('module');

            if ($modules->duplicates()->isNotEmpty()) {
                $validator->errors()->add('permissions', 'Duplicate module entries are not allowed.');
            }

            $missing = collect(CmsModules::all())->diff($modules);

            if ($missing->isNotEmpty()) {
                $validator->errors()->add('permissions', 'All modules must be included when replacing permissions.');
            }
        });
    }
}
