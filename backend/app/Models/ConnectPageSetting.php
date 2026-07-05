<?php

namespace App\Models;

use App\Concerns\HasUuid;
use Illuminate\Database\Eloquent\Model;

class ConnectPageSetting extends Model
{
    use HasUuid;

    protected $fillable = [
        'hero',
        'tagline',
        'links',
    ];

    protected function casts(): array
    {
        return [
            'hero' => 'array',
            'links' => 'array',
        ];
    }
}
