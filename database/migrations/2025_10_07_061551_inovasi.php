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
        Schema::create('inovasis', function (Blueprint $table) {
            $table->id();
            $table->foreignId('medias_id')->constrained('medias')->onDelete('cascade');
            $table->string('judul');
            $table->text('deskripsi');
            $table->string('cover_image');
            $table->string('lokasi');
            $table->string('tabel')->default('inovasi');
            $table->enum('category',['foto','video'])->nullable();
            $table->enum('instansi',['umum','sma','smk','slb']);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('inovasis');
    }
};
