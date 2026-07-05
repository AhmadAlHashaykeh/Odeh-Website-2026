<?php

namespace App\Models;

use App\Concerns\HasUuid;
use App\Enums\ServiceStatus;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Service extends Model
{
    use HasFactory, HasUuid;

    protected $fillable = [
        'title',
        'slug',
        'description',
        'image',
        'icon',
        'used_on_homepage',
        'display_order',
        'status',
    ];

    protected function casts(): array
    {
        return [
            'used_on_homepage' => 'boolean',
            'display_order' => 'integer',
            'status' => ServiceStatus::class,
        ];
    }
}
