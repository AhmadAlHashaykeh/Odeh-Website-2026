<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('team_members', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('full_name');
            $table->string('slug')->unique();
            $table->string('position')->nullable();
            $table->string('department')->nullable();
            $table->string('category')->nullable();
            $table->string('experience')->nullable();
            $table->string('photo')->nullable();
            $table->string('email')->nullable();
            $table->enum('status', ['active', 'hidden'])->default('active');
            $table->unsignedInteger('display_order')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('team_members');
    }
};
