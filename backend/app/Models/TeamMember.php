<?php

namespace App\Models;

use App\Concerns\HasUuid;
use App\Enums\TeamMemberStatus;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TeamMember extends Model
{
    use HasFactory, HasUuid;

    protected $fillable = [
        'full_name',
        'slug',
        'position',
        'department',
        'category',
        'team_category_id',
        'team_rank_id',
        'experience',
        'photo',
        'email',
        'linkedin_url',
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

    public function teamCategory(): BelongsTo
    {
        return $this->belongsTo(TeamCategory::class);
    }

    public function teamRank(): BelongsTo
    {
        return $this->belongsTo(TeamRank::class);
    }
}
