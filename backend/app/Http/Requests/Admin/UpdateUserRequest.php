<?php

namespace App\Http\Requests\Admin;

use App\Enums\RoleStatus;
use App\Enums\UserStatus;
use App\Http\Requests\Concerns\MapsCamelCaseInput;
use App\Models\Role;
use App\Models\User;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Validator;

class UpdateUserRequest extends FormRequest
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
        /** @var User|null $user */
        $user = $this->route('user');

        return [
            'full_name' => ['sometimes', 'required', 'string', 'max:255'],
            'email' => ['sometimes', 'required', 'email', 'max:255', Rule::unique('users', 'email')->ignore($user?->id)],
            'password' => ['sometimes', 'nullable', 'string', 'min:8'],
            'role_id' => ['sometimes', 'required', 'uuid', 'exists:roles,id'],
            'department' => ['sometimes', 'nullable', 'string', 'max:255'],
            'status' => ['sometimes', Rule::enum(UserStatus::class)],
            'access_scope' => ['sometimes', 'nullable', 'string', 'max:255'],
            'two_factor_enabled' => ['sometimes', 'boolean'],
        ];
    }

    public function withValidator(Validator $validator): void
    {
        $validator->after(function (Validator $validator): void {
            /** @var User|null $user */
            $user = $this->route('user');

            if ($user === null) {
                return;
            }

            if ($this->has('role_id')) {
                $role = Role::query()->find($this->input('role_id'));

                if ($role !== null && $role->status !== RoleStatus::Active) {
                    $validator->errors()->add('role_id', 'The selected role is not active.');
                }

                $user->load('role');

                if ($user->isLastSuperAdmin() && $role !== null && ! $role->isSuperAdmin()) {
                    $validator->errors()->add('role_id', 'Cannot remove the last Super Admin from the system.');
                }
            }
        });
    }
}
