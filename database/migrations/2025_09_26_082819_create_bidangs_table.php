<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('bidangs', function (Blueprint $table) {
            $table->id();
            // $table->foreignId('laporans_id')->constrained('laporans')->onDelete('cascade');
            $table->foreignId('laporans_id')->constrained('laporans')->onDelete('cascade');
            $table->string('nama');
            $table->string('email');
            $table->integer('nomor');
            $table->enum('role',['admin','bidang']);
            $table->timestamps();
            $table->string('name');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('bidangs');
    }
};
