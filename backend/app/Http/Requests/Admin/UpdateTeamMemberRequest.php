<?php

namespace App\Http\Requests\Admin;

use App\Enums\TeamMemberStatus;
use App\Http\Requests\Concerns\MapsCamelCaseInput;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateTeamMemberRequest extends FormRequest
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
            'teamCategoryId' => 'team_category_id',
            'teamRankId' => 'team_rank_id',
            'linkedinUrl' => 'linkedin_url',
        ]);
    }

    public function rules(): array
    {
        $id = $this->route('team_member') ?? $this->route('id');

        return [
            'full_name' => ['sometimes', 'required', 'string', 'max:255'],
            'slug' => ['sometimes', 'nullable', 'string', 'max:255', Rule::unique('team_members', 'slug')->ignore($id)],
            'position' => ['sometimes', 'nullable', 'string', 'max:255'],
            'department' => ['sometimes', 'nullable', 'string', 'max:255'],
            'category' => ['sometimes', 'nullable', 'string', 'max:255'],
            'team_category_id' => ['sometimes', 'required', 'uuid', 'exists:team_categories,id'],
            'team_rank_id' => ['sometimes', 'required', 'uuid', 'exists:team_ranks,id'],
            'experience' => ['sometimes', 'nullable', 'string', 'max:255'],
            'photo' => ['sometimes', 'nullable', 'string', 'max:2048'],
            'email' => ['sometimes', 'nullable', 'email', 'max:255'],
            'linkedin_url' => ['sometimes', 'nullable', 'url', 'max:2048'],
            'status' => ['sometimes', Rule::enum(TeamMemberStatus::class)],
            'display_order' => ['sometimes', 'integer', 'min:0'],
        ];
    }
}
