<?php

namespace App\Models;

use App\Concerns\HasUuid;
use Illuminate\Database\Eloquent\Model;

class SeoPage extends Model
{
    use HasUuid;

    protected $fillable = [
        'route',
        'page_name',
        'page_type',
        'content_module',
        'content_uuid',
        'meta_title',
        'meta_description',
    ];

    public function isComplete(): bool
    {
        return filled(trim((string) $this->meta_title))
            && filled(trim((string) $this->meta_description));
    }

    public function seoStatus(): string
    {
        return $this->isComplete() ? 'complete' : 'pending';
    }
}
