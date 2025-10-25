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
            $table->string('email');
            $table->string('password');
            $table->char('nip', 18)->unique();
            $table->enum('agama',['islam','kristen protestan','katolik','buddha', 'hindu', 'konghucu']);
            $table->enum('jenis_kelamin',['laki-laki','perempuan']);
            $table->char('nomor')->unique();
            $table->string('alamat');
            $table->date('tanggal_lahir');
            $table->string('tempat_lahir');
            $table->foreignId('notifikasis_id')->nullable()->constrained('notifikasis')->nullOnDelete();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('pegawais');
    }
};
