<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Named job_postings to avoid conflict with Laravel's queue `jobs` table.
        Schema::create('job_postings', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('title');
            $table->string('slug')->unique();
            $table->string('department')->nullable();
            $table->string('location')->nullable();
            $table->string('employment_type')->nullable();
            $table->string('work_mode')->nullable();
            $table->string('experience_level')->nullable();
            $table->date('posted_date')->nullable();
            $table->date('closing_date')->nullable();
            $table->text('short_description')->nullable();
            $table->text('full_description')->nullable();
            $table->json('responsibilities')->nullable();
            $table->json('requirements')->nullable();
            $table->json('benefits')->nullable();
            $table->enum('status', ['open', 'closed', 'draft'])->default('draft');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('job_postings');
    }
};
