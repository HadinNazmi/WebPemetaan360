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
        Schema::create('kelompok_umkm', function (Blueprint $table) {
            $table->id();
            $table->string('nama_kelompok');
            $table->string('slug')->unique();
            $table->string('nama_ketua');
            $table->string('nomor_wa');
            $table->string('tahun_berdiri', 10)->nullable();
            $table->string('angkatan', 50)->nullable();
            $table->unsignedInteger('jumlah_anggota')->default(0);
            $table->string('kecamatan');
            $table->text('alamat_lengkap')->nullable();
            $table->longText('deskripsi')->nullable();
            $table->string('foto_cover')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            $table->index('kecamatan');
            $table->index('is_active');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('kelompok_umkm');
    }
};

