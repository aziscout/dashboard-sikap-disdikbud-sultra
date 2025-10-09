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
        Schema::table('laporan_kegiatan', function (Blueprint $table) {
            $table->string('coverImage')->nullable()->after('deskripsi');
            $table->string('tabel')->nullable()->after('coverImage');
            $table->enum('instansi', ['umum', 'sma', 'smk', 'slb'])->nullable()->after('tabel');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('laporan_kegiatan', function (Blueprint $table) {
            $table->dropColumn(['coverImage', 'tabel', 'instansi']);
        });
    }
};
