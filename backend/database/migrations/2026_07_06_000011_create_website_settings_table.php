<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('website_settings', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->json('general_identity')->nullable();
            $table->json('branding_favicon')->nullable();
            $table->json('search_placeholders')->nullable();
            $table->json('search_limits')->nullable();
            $table->json('integrations_maps')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('website_settings');
    }
};
