<?php

namespace App\Models;

use App\Concerns\HasUuid;
use App\Concerns\SyncsSeoRegistry;
use App\Enums\ProjectStatus;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Project extends Model
{
    use HasFactory, HasUuid, SyncsSeoRegistry;

    protected $fillable = [
        'project_category_id',
        'title',
        'slug',
        'description',
        'cover_image',
        'gallery',
        'location',
        'architect',
        'project_type',
        'area',
        'services',
        'completion_status',
        'year',
        'status',
        'is_featured',
        'display_order',
    ];

    protected function casts(): array
    {
        return [
            'gallery' => 'array',
            'status' => ProjectStatus::class,
            'is_featured' => 'boolean',
            'year' => 'integer',
            'display_order' => 'integer',
        ];
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(ProjectCategory::class, 'project_category_id');
    }
}
