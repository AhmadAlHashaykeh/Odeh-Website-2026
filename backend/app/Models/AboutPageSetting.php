<?php

namespace App\Models;

use App\Concerns\HasUuid;
use Illuminate\Database\Eloquent\Model;

class AboutPageSetting extends Model
{
    use HasUuid;

    protected $fillable = [
        'overview',
        'approach',
        'history',
    ];

    protected function casts(): array
    {
        return [
            'overview' => 'array',
            'approach' => 'array',
            'history' => 'array',
        ];
    }
}
