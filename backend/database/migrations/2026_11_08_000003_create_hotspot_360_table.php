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
        Schema::create('hotspot_360', function (Blueprint $table) {
            $table->id();
            $table->foreignId('scene_id')->constrained('scene_360')->onDelete('cascade');
            $table->enum('tipe', ['direct', 'popup_only', 'popup_then_move'])->default('direct');
            $table->float('pitch');
            $table->float('yaw');
            $table->foreignId('target_scene_id')->nullable()->constrained('scene_360')->nullOnDelete();
            $table->float('target_pitch')->nullable();
            $table->float('target_yaw')->nullable();
            $table->foreignId('program_id')->nullable()->constrained('program_csr')->nullOnDelete();
            $table->string('judul_hotspot', 255)->nullable();
            $table->text('deskripsi_hotspot')->nullable();
            $table->string('gambar_popup', 255)->nullable();
            $table->string('teks_tombol', 100)->nullable();
            $table->string('ikon_hotspot', 50)->default('arrow');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('hotspot_360');
    }
};

