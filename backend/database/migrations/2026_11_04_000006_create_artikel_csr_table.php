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
        Schema::create('artikel_csr', function (Blueprint $table) {
            $table->id();
            $table->string('judul_artikel', 255);
            $table->string('kategori_tag', 100)->default('SIARAN PERS');
            $table->string('gambar_cover', 255);
            $table->string('url_media', 500);
            $table->string('sumber_media', 100)->nullable();
            $table->date('tanggal_publikasi');
            $table->boolean('is_featured')->default(false);
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
        Schema::dropIfExists('artikel_csr');
    }
};
