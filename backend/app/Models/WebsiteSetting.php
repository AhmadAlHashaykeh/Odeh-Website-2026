<?php

namespace App\Models;

use App\Concerns\HasUuid;
use Illuminate\Database\Eloquent\Model;

class WebsiteSetting extends Model
{
    use HasUuid;

    protected $fillable = [
        'general_identity',
        'branding_favicon',
        'search_placeholders',
        'search_limits',
        'integrations_maps',
        'public_pages',
    ];

    protected function casts(): array
    {
        return [
            'general_identity' => 'array',
            'branding_favicon' => 'array',
            'search_placeholders' => 'array',
            'search_limits' => 'array',
            'integrations_maps' => 'array',
            'public_pages' => 'array',
        ];
    }
}
