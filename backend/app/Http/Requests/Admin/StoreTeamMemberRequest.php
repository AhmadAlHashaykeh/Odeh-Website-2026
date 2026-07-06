<?php

namespace App\Http\Requests\Admin;

use App\Enums\TeamMemberStatus;
use App\Http\Requests\Concerns\MapsCamelCaseInput;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreTeamMemberRequest extends FormRequest
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
            'displayOrder' => 'display_order',
        ]);
    }

    public function rules(): array
    {
        return [
            'full_name' => ['required', 'string', 'max:255'],
            'slug' => ['nullable', 'string', 'max:255', 'unique:team_members,slug'],
            'position' => ['nullable', 'string', 'max:255'],
            'department' => ['nullable', 'string', 'max:255'],
            'category' => ['nullable', 'string', 'max:255'],
            'experience' => ['nullable', 'string', 'max:255'],
            'photo' => ['nullable', 'string', 'max:2048'],
            'email' => ['nullable', 'email', 'max:255'],
            'status' => ['nullable', Rule::enum(TeamMemberStatus::class)],
            'display_order' => ['nullable', 'integer', 'min:0'],
        ];
    }
}
