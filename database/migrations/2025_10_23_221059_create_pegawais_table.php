<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('pegawais', function (Blueprint $table) {
            $table->id();
            $table->string('nip');
            $table->string('nama');
            $table->string('email');
            $table->string('password');
            $table->string('agama')->nullable();
            $table->enum('jenis_kelamin', ['Laki-laki', 'Perempuan'])->nullable();
            $table->string('nomor');
            $table->string('alamat')->nullable();
            $table->date('tempat_lahir')->nullable();
            $table->unsignedBigInteger('notifikasis_id')->nullable();
            $table->timestamps();

            $table->foreign('notifikasis_id')->references('id')->on('notifikasis')->onDelete('set null');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('pegawais');
    }
};
