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
        Schema::create('laporan_kegiatan', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->string('judul');
            $table->string('deskripsi');
            $table->string('lokasi');
            $table->string('penyelenggara');
            $table->string('file')->nullable();
            $table->foreignId('bidangs_id')->constrained('users')->onDelete('cascade');
            // $table->foreignId('medias_id')->constrained('medias')->onDelete('cascade');
            $table->foreignId('medias_id')->nullable()->constrained('medias')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('laporan_kegiatan');
    }
};