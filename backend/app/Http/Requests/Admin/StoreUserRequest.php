<?php

namespace App\Http\Requests\Admin;

use App\Enums\RoleStatus;
use App\Enums\UserStatus;
use App\Http\Requests\Concerns\MapsCamelCaseInput;
use App\Models\Role;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Validator;

class StoreUserRequest extends FormRequest
{
    use MapsCamelCaseInput;

    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation(): void
    {
        $this->mapCamelCaseInput([
            'fullName' => 'full_name',
            'roleId' => 'role_id',
            'accessScope' => 'access_scope',
            'twoFactorEnabled' => 'two_factor_enabled',
        ]);

        if ($this->has('two_factor_enabled')) {
            $this->merge([
                'two_factor_enabled' => $this->normalizeBoolean($this->input('two_factor_enabled')),
            ]);
        }
    }

    public function rules(): array
    {
        return [
            'full_name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', 'unique:users,email'],
            'password' => ['required', 'string', 'min:8'],
            'role_id' => ['required', 'uuid', 'exists:roles,id'],
            'department' => ['nullable', 'string', 'max:255'],
            'status' => ['nullable', Rule::enum(UserStatus::class)],
            'access_scope' => ['nullable', 'string', 'max:255'],
            'two_factor_enabled' => ['nullable', 'boolean'],
        ];
    }

    public function withValidator(Validator $validator): void
    {
        $validator->after(function (Validator $validator): void {
            $roleId = $this->input('role_id');

            if ($roleId === null) {
                return;
            }

            $role = Role::query()->find($roleId);

            if ($role !== null && $role->status !== RoleStatus::Active) {
                $validator->errors()->add('role_id', 'The selected role is not active.');
            }
        });
    }
}
