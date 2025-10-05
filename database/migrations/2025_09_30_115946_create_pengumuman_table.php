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
        Schema::create('pengumuman', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
             $table->string('judul');
            $table->enum('category',['foto','video'])->default('foto');
            $table->enum('instansi',['umum','slb','smk','sma'])->default('umum');
            $table->string('penyelenggara');
            $table->string('lokasi');
            $table->string('tabel');
            $table->string('deskripsi');
            $table->foreignId('documents_id')->constrained('documents')->onDelete('cascade');
            $table->foreignId('bidangs_id')->constrained('users')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('pengumuman');
    }
};
