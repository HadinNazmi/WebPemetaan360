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
        Schema::create('sistem_csr', function (Blueprint $table) {
            $table->id();
            $table->string('kode_sistem')->unique(); // siminah, simon_plus, dll
            $table->string('nama_sistem'); // SiMinah, Simon+
            $table->text('deskripsi')->nullable();
            $table->string('api_base_url')->nullable();
            $table->string('api_token_key')->nullable();
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
        Schema::dropIfExists('sistem_csr');
    }
};
