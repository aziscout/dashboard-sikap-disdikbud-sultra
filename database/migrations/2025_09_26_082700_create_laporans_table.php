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
        Schema::create('laporans', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->string('judul');
            $table->string('peserta')->nullable();
            $table->enum('instansi',['umum','slb','smk','sma'])->default('umum');
            $table->string('penyelenggara');
            $table->string('lokasi');
            $table->string('tabel');
            $table->text('deskripsi');
            $table->foreignId('dokumens_id')->constrained('dokumens')->onDelete('cascade');
            $table->foreignId('bidangs_id')->constrained('users')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('laporans');
    }
};
