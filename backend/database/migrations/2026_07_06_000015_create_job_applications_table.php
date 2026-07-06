<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('job_applications', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('job_id')->constrained('job_postings')->cascadeOnDelete();
            $table->string('full_name');
            $table->string('email');
            $table->string('phone');
            $table->string('location');
            $table->unsignedInteger('years_of_experience');
            $table->string('linkedin_url');
            $table->text('cover_letter');
            $table->string('cv_path');
            $table->string('cv_original_name');
            $table->unsignedBigInteger('cv_size');
            $table->enum('status', ['new', 'reviewing', 'shortlisted', 'rejected', 'hired'])->default('new');
            $table->text('admin_notes')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('job_applications');
    }
};
