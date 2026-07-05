<?php

namespace App\Models;

use App\Concerns\HasUuid;
use App\Enums\LegalPagePublicationStatus;
use Illuminate\Database\Eloquent\Model;

class LegalPage extends Model
{
    use HasUuid;

    protected $fillable = [
        'slug',
        'title',
        'hero',
        'sections',
        'publication_status',
    ];

    protected function casts(): array
    {
        return [
            'hero' => 'array',
            'sections' => 'array',
            'publication_status' => LegalPagePublicationStatus::class,
        ];
    }

    public function getRouteKeyName(): string
    {
        return 'slug';
    }
}
