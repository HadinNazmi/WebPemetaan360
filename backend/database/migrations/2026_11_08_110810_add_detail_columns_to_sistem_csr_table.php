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
        Schema::table('sistem_csr', function (Blueprint $table) {
            $table->string('badge_label', 100)->default('SISTEM DIGITAL CSR')->after('nama_sistem');
            $table->string('gambar_cover', 255)->nullable()->after('deskripsi');
            $table->longText('deskripsi_lengkap')->nullable()->after('gambar_cover');
            $table->string('url_portal', 500)->nullable()->after('deskripsi_lengkap');
            $table->json('fitur_keunggulan')->nullable()->after('url_portal');
            $table->string('logo_url', 255)->nullable()->after('fitur_keunggulan');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('sistem_csr', function (Blueprint $table) {
            $table->dropColumn([
                'badge_label',
                'gambar_cover',
                'deskripsi_lengkap',
                'url_portal',
                'fitur_keunggulan',
                'logo_url',
            ]);
        });
    }
};
