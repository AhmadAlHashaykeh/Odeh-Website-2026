<?php

namespace App\Models;

use App\Concerns\HasUuid;
use App\Enums\JobStatus;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Job extends Model
{
    use HasFactory, HasUuid;

    protected $table = 'job_postings';

    protected $fillable = [
        'title',
        'slug',
        'department',
        'location',
        'employment_type',
        'work_mode',
        'experience_level',
        'posted_date',
        'closing_date',
        'short_description',
        'full_description',
        'responsibilities',
        'requirements',
        'benefits',
        'status',
    ];

    protected function casts(): array
    {
        return [
            'responsibilities' => 'array',
            'requirements' => 'array',
            'benefits' => 'array',
            'posted_date' => 'date',
            'closing_date' => 'date',
            'status' => JobStatus::class,
        ];
    }
}
