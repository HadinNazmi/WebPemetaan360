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
        Schema::create('program_csr', function (Blueprint $table) {
            $table->id();
            $table->string('nama_program', 255);
            $table->string('slug', 255)->unique();
            $table->string('pilar_kategori', 100);
            $table->string('gambar_cover', 255);
            $table->text('ringkasan');
            $table->longText('deskripsi_lengkap');
            $table->json('galeri_foto')->nullable();
            $table->string('lokasi', 150)->nullable();
            $table->string('link_eksternal', 255)->nullable();
            $table->integer('urutan')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('program_csr');
    }
};
