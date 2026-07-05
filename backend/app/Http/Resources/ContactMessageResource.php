<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin \App\Models\ContactMessage */
class ContactMessageResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'fullName' => $this->full_name,
            'email' => $this->email,
            'phone' => $this->phone,
            'company' => $this->company,
            'subject' => $this->subject,
            'message' => $this->message,
            'status' => $this->status->value,
            'priority' => $this->priority->value,
            'assignedUserId' => $this->assigned_user_id,
            'assignedUser' => $this->whenLoaded('assignedUser', fn () => $this->assignedUser ? [
                'id' => $this->assignedUser->id,
                'fullName' => $this->assignedUser->full_name,
                'email' => $this->assignedUser->email,
            ] : null),
            'adminNotes' => $this->admin_notes,
            'submittedAt' => $this->created_at?->toIso8601String(),
            'lastUpdated' => $this->updated_at?->toIso8601String(),
        ];
    }
}
