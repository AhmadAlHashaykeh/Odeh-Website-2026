<?php

namespace App\Http\Requests\Admin;

use App\Enums\ContactMessagePriority;
use App\Enums\ContactMessageStatus;
use App\Http\Requests\Concerns\MapsCamelCaseInput;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateContactMessageRequest extends FormRequest
{
    use MapsCamelCaseInput;

    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation(): void
    {
        $this->mapCamelCaseInput([
            'assignedUserId' => 'assigned_user_id',
            'adminNotes' => 'admin_notes',
        ]);
    }

    public function rules(): array
    {
        return [
            'status' => ['sometimes', Rule::enum(ContactMessageStatus::class)],
            'priority' => ['sometimes', Rule::enum(ContactMessagePriority::class)],
            'assigned_user_id' => ['sometimes', 'nullable', 'uuid', 'exists:users,id'],
            'admin_notes' => ['sometimes', 'nullable', 'string'],
        ];
    }
}
