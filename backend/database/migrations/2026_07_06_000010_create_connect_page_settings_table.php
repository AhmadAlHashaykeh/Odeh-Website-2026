<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('connect_page_settings', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->json('hero')->nullable();
            $table->text('tagline')->nullable();
            $table->json('links')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('connect_page_settings');
    }
};
