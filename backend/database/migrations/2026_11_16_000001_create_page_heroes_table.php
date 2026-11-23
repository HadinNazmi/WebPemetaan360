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
        Schema::create('page_heroes', function (Blueprint $table) {
            $table->id();
            $table->string('page_key', 50)->unique(); // misal: 'katalog_produk', 'direktori_umkm', 'tentang_kami'
            $table->string('page_name', 100);         // Nama label halaman: 'Katalog Produk', 'Direktori UMKM', dll.
            $table->string('title', 255);             // Judul utama banner
            $table->string('subtitle', 255)->nullable(); // Subjudul / eyebrow
            $table->string('background_image', 500)->nullable(); // Path atau URL gambar background
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('page_heroes');
    }
};
