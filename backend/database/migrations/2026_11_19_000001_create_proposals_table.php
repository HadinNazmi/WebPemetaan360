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
        if (!Schema::hasTable('proposals')) {
            Schema::create('proposals', function (Blueprint $table) {
                $table->id();
                $table->string('nomor_surat', 100)->unique();
                $table->string('nama_pengaju', 200)->nullable();
                $table->string('judul_proposal', 255)->nullable();
                $table->enum('status', ['diproses', 'diterima', 'ditolak'])->default('diproses');
                $table->text('alasan_tolak')->nullable();
                $table->date('tgl_pengajuan')->nullable();
                $table->date('tgl_verifikasi')->nullable();
                $table->date('tgl_penyaluran')->nullable();
                $table->date('tgl_monitoring')->nullable();
                $table->text('keterangan_tahapan')->nullable();
                $table->timestamps();
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('proposals');
    }
};

