<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('about_page_settings', function (Blueprint $table) {
            $table->json('team')->nullable()->after('history');
            $table->json('activities')->nullable()->after('team');
        });

        Schema::table('website_settings', function (Blueprint $table) {
            $table->json('public_pages')->nullable()->after('integrations_maps');
        });

        Schema::table('projects', function (Blueprint $table) {
            $table->string('services')->nullable()->after('area');
            $table->string('completion_status')->nullable()->after('services');
        });
    }

    public function down(): void
    {
        Schema::table('projects', function (Blueprint $table) {
            $table->dropColumn(['services', 'completion_status']);
        });

        Schema::table('website_settings', function (Blueprint $table) {
            $table->dropColumn('public_pages');
        });

        Schema::table('about_page_settings', function (Blueprint $table) {
            $table->dropColumn(['team', 'activities']);
        });
    }
};
