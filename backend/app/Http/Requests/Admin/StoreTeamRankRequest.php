<?php

namespace App\Http\Requests\Admin;

use App\Http\Requests\Concerns\MapsCamelCaseInput;
use Illuminate\Foundation\Http\FormRequest;

class StoreTeamRankRequest extends FormRequest
{
    use MapsCamelCaseInput;

    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation(): void
    {
        $this->mapCamelCaseInput([
            'displayOrder' => 'display_order',
            'isActive' => 'is_active',
        ]);

        if ($this->has('is_active')) {
            $this->merge([
                'is_active' => $this->normalizeBoolean($this->input('is_active')),
            ]);
        }

        if ($this->has('status') && ! $this->has('is_active')) {
            $status = strtolower((string) $this->input('status'));
            $this->merge([
                'is_active' => in_array($status, ['active', '1', 'true', 'yes'], true),
            ]);
        }
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'slug' => ['nullable', 'string', 'max:255', 'unique:team_ranks,slug'],
            'color' => ['required', 'string', 'max:32', 'regex:/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/'],
            'display_order' => ['nullable', 'integer', 'min:0'],
            'is_active' => ['nullable', 'boolean'],
        ];
    }

    public function messages(): array
    {
        return [
            'color.regex' => 'Rank colour must be a valid hex colour (e.g. #E85A78).',
        ];
    }
}
