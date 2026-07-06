<?php

namespace App\Models;

use App\Concerns\HasUuid;
use App\Enums\TeamMemberStatus;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TeamMember extends Model
{
    use HasFactory, HasUuid;

    protected $fillable = [
        'full_name',
        'slug',
        'position',
        'department',
        'category',
        'experience',
        'photo',
        'email',
        'status',
        'display_order',
    ];

    protected function casts(): array
    {
        return [
            'status' => TeamMemberStatus::class,
            'display_order' => 'integer',
        ];
    }
}
