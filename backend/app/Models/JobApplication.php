<?php

namespace App\Models;

use App\Concerns\HasUuid;
use App\Enums\JobApplicationStatus;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class JobApplication extends Model
{
    use HasFactory, HasUuid;

    protected $fillable = [
        'job_id',
        'full_name',
        'email',
        'phone',
        'location',
        'years_of_experience',
        'linkedin_url',
        'cover_letter',
        'cv_path',
        'cv_original_name',
        'cv_size',
        'status',
        'admin_notes',
    ];

    protected function casts(): array
    {
        return [
            'years_of_experience' => 'integer',
            'cv_size' => 'integer',
            'status' => JobApplicationStatus::class,
        ];
    }

    public function job(): BelongsTo
    {
        return $this->belongsTo(Job::class);
    }
}
