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
        Schema::create('produk_umkm', function (Blueprint $table) {
            $table->id();
            $table->foreignId('kelompok_umkm_id')->constrained('kelompok_umkm')->cascadeOnDelete();
            $table->string('nama_produk');
            $table->string('slug')->unique();
            $table->string('kategori');
            $table->unsignedInteger('harga')->default(0);
            $table->string('satuan', 50)->nullable(); // e.g. "per Botol", "per kemasan 150g"
            $table->string('foto_produk')->nullable();
            $table->text('deskripsi_produk')->nullable();
            $table->boolean('is_tersedia')->default(true);
            $table->boolean('is_featured')->default(false);
            $table->timestamps();

            $table->index(['kelompok_umkm_id', 'is_tersedia']);
            $table->index('kategori');
            $table->index('harga');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('produk_umkm');
    }
};

