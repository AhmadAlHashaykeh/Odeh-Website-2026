<?php

namespace App\Models;

use App\Concerns\HasUuid;
use App\Concerns\SyncsSeoRegistry;
use App\Enums\ActivityStatus;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Activity extends Model
{
    use HasFactory, HasUuid, SyncsSeoRegistry;

    protected $fillable = [
        'title',
        'slug',
        'location',
        'description',
        'cover_image',
        'gallery',
        'activity_date',
        'status',
        'is_featured',
        'display_order',
    ];

    protected function casts(): array
    {
        return [
            'gallery' => 'array',
            'status' => ActivityStatus::class,
            'is_featured' => 'boolean',
            'display_order' => 'integer',
        ];
    }
}
