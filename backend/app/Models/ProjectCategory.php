<?php

namespace App\Models;

use App\Concerns\HasUuid;
use App\Enums\ProjectCategoryStatus;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ProjectCategory extends Model
{
    use HasFactory, HasUuid;

    protected $fillable = [
        'title',
        'slug',
        'description',
        'cover_image',
        'featured_image',
        'status',
        'display_order',
    ];

    protected function casts(): array
    {
        return [
            'status' => ProjectCategoryStatus::class,
            'display_order' => 'integer',
        ];
    }

    public function projects(): HasMany
    {
        return $this->hasMany(Project::class);
    }
}
