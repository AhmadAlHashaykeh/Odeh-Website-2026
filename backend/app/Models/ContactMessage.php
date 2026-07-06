<?php

namespace App\Models;

use App\Concerns\HasUuid;
use App\Enums\ContactMessagePriority;
use App\Enums\ContactMessageStatus;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ContactMessage extends Model
{
    use HasFactory, HasUuid;

    protected $fillable = [
        'full_name',
        'email',
        'phone',
        'company',
        'subject',
        'message',
        'status',
        'priority',
        'assigned_user_id',
        'admin_notes',
    ];

    protected function casts(): array
    {
        return [
            'status' => ContactMessageStatus::class,
            'priority' => ContactMessagePriority::class,
        ];
    }

    public function assignedUser(): BelongsTo
    {
        return $this->belongsTo(User::class, 'assigned_user_id');
    }
}
