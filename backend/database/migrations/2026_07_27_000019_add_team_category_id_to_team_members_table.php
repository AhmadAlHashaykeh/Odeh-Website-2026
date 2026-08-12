<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('team_members', function (Blueprint $table) {
            $table->uuid('team_category_id')->nullable()->after('category');

            $table->foreign('team_category_id')
                ->references('id')
                ->on('team_categories')
                ->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('team_members', function (Blueprint $table) {
            $table->dropForeign(['team_category_id']);
            $table->dropColumn('team_category_id');
        });
    }
};
