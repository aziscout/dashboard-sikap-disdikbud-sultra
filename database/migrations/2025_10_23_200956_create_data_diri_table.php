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
        Schema::create('data_diri', function (Blueprint $table) {
            $table->id();
            $table->foreignId('pegawai_id')->constrained('pegawai')->onDelete('cascade');
            $table->string('nip');
            $table->date('tanggal_sk');
            $table->string('nomor_sk');
            $table->string('tempat_lahir');
            $table->date('tanggal_lahir');
            $table->timestamp('tmt_golongan');
            $table->enum('agama', ['islam', 'kristen', 'katolik', 'hindu', 'budha', 'konghucu']);
            $table->enum('jenis_kelamin',['Laki-laki', 'Perempuan']);
            $table->string('alamat');
            $table->string('nomor_kepring_bkn');
            $table->string('masa_gk_bulanan');
            $table->string('masa_gk_tahunan');
            $table->string('golongan_ruang');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('data_diri');
    }
};
