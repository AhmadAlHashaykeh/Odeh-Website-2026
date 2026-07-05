<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('navigation_footer_settings', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->json('logo')->nullable();
            $table->json('navigation_items')->nullable();
            $table->json('footer_brand')->nullable();
            $table->json('footer_groups')->nullable();
            $table->json('contact_office')->nullable();
            $table->json('direct_contacts')->nullable();
            $table->json('social_links')->nullable();
            $table->json('copyright')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('navigation_footer_settings');
    }
};
