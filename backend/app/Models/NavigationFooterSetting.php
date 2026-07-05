<?php

namespace App\Models;

use App\Concerns\HasUuid;
use Illuminate\Database\Eloquent\Model;

class NavigationFooterSetting extends Model
{
    use HasUuid;

    protected $fillable = [
        'logo',
        'navigation_items',
        'footer_brand',
        'footer_groups',
        'contact_office',
        'direct_contacts',
        'social_links',
        'copyright',
    ];

    protected function casts(): array
    {
        return [
            'logo' => 'array',
            'navigation_items' => 'array',
            'footer_brand' => 'array',
            'footer_groups' => 'array',
            'contact_office' => 'array',
            'direct_contacts' => 'array',
            'social_links' => 'array',
            'copyright' => 'array',
        ];
    }
}
