<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
       Schema::create('layanans', function (Blueprint $table) {
    $table->id();
    $table->string('judul');
    $table->text('deskripsi');
    $table->string('bidang'); // tujuan bidang
    $table->string('nama_pengirim');
    $table->string('email_pengirim');
    $table->unsignedBigInteger('media_id')->nullable();
    $table->unsignedBigInteger('document_id')->nullable();
    $table->string('kode_tracking')->unique();
    $table->enum('status', ['Diterima', 'Diproses', 'Selesai', "Ditolak"])->default('Diterima');
    $table->timestamps();

    // perbaikan: tabelnya 'medias'
    $table->foreign('media_id')->references('id')->on('medias')->onDelete('set null');
    $table->foreign('document_id')->references('id')->on('documents')->onDelete('set null');
});


    }

    public function down(): void
    {
        Schema::dropIfExists('layanans');
    }
};
