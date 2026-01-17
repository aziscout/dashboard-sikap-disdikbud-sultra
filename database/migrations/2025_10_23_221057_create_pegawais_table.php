<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('pegawais', function (Blueprint $table) {
            $table->id();
            $table->string('nama');
            $table->string('email')->nullable();
            $table->string('password');
            $table->char('nip', 18)->unique();
            $table->enum('agama',['islam','kristen protestan','katolik','buddha', 'hindu', 'konghucu'])->nullable();
            $table->enum('jenis_kelamin',['laki-laki','perempuan'])->nullable();
            $table->char('nomor')->unique()->nullable();
            $table->string('alamat')->nullable();
            $table->date('tanggal_lahir')->nullable();
            $table->string('tempat_lahir')->nullable();
            $table->string('unit_kerja')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('pegawais');
    }
};
