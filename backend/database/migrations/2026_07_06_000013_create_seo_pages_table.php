<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('seo_pages', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('route')->unique();
            $table->string('page_name');
            $table->string('page_type');
            $table->string('content_module')->nullable();
            $table->uuid('content_uuid')->nullable();
            $table->string('meta_title')->nullable();
            $table->text('meta_description')->nullable();
            $table->timestamps();

            $table->index('content_uuid');
            $table->index('content_module');
            $table->index('page_type');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('seo_pages');
    }
};
