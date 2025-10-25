<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('data_diri', function (Blueprint $table) {
            $table->id();
            $table->date('tanggal_sk');
            $table->string('nomor_sk');
            $table->string('tmt_golongan');
            $table->string('nomor_pertek_bkn');
            $table->string('tanggal_pertek_bkn');
            $table->string('masa_gk_bulanan');
            $table->string('masa_gk_tahunan');
            $table->string('golongan_ruang');
            $table->string('jenis_jk');
            $table->foreignId('pegawais_id')->unique()->constrained('pegawais')->onDelete('cascade');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('data_diri');
    }
};
