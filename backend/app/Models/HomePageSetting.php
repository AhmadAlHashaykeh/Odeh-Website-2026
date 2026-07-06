<?php

namespace App\Models;

use App\Concerns\HasUuid;
use Illuminate\Database\Eloquent\Model;

class HomePageSetting extends Model
{
    use HasUuid;

    protected $fillable = [
        'hero',
        'about',
        'services',
        'projects',
    ];

    protected function casts(): array
    {
        return [
            'hero' => 'array',
            'about' => 'array',
            'services' => 'array',
            'projects' => 'array',
        ];
    }
}
