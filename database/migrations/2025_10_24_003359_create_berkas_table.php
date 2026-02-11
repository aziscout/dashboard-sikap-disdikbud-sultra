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
        Schema::create('berkas', function (Blueprint $table) {
            $table->id();
            $table->string('sk_cpns')->nullable();
            $table->string('sk_pns')->nullable();
            $table->string('sk_gaji_berkala')->nullable();
            $table->string('sk_pangkat_terakhir')->nullable();
            $table->string('sk_jabatan')->nullable();
            $table->foreignId('users_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('pegawais_id')->constrained('pegawais')->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('berkas');
    }
};
