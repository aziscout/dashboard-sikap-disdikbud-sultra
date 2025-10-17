<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{

    public function up(): void
    {
        Schema::create('inovasis', function (Blueprint $table) {
            $table->id();
            $table->string('judul');
            $table->text('deskripsi');
            $table->string('cover_image');
            $table->string('lokasi');
            $table->string('category');
            $table->string('tabel');
            $table->enum('instansi',['umum','sma','smk','slb'])->default('umum');
            $table->timestamps();
            $table->foreignId('medias_id')->constrained('medias')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('inovasis');
    }
};