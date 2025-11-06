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
        Schema::create('ppids', function (Blueprint $table) {
            $table->id();
            $table->foreignId('dokumens_id')->constrained('dokumens')->onDelete('cascade');
            $table->string('judul');
            $table->string('tahun');
            $table->enum('informasi',['Berkala', 'Setiap Saat', 'Serta Merta', 'Dikecualikan',]);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ppids');
    }
};
