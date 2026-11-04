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
        Schema::create('visi_misi_csr', function (Blueprint $table) {
            $table->id();
            $table->string('eyebrow')->default('VISI & MISI CSR');
            $table->string('judul_utama');
            $table->text('deskripsi_pengantar')->nullable();
            $table->text('visi');
            $table->text('misi');
            $table->string('logo_url')->nullable();
            $table->string('url_selengkapnya')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('visi_misi_csr');
    }
};
