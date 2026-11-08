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
        Schema::create('hero_panorama_360', function (Blueprint $table) {
            $table->id();
            $table->string('judul', 255)->default('Aerial View Kilang Pertamina 360');
            $table->string('foto_panorama', 255);
            $table->float('default_pitch')->default(0.0);
            $table->float('default_yaw')->default(0.0);
            $table->float('default_hfov')->default(100.0);
            $table->float('auto_rotate_speed')->default(-1.5); // derajat per detik (- = rotasi halus ke kanan, 0 = nonaktif)
            $table->json('pins')->nullable(); // array pin penanda wilayah: [{ wilayah_id, pitch, yaw, label }]
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('hero_panorama_360');
    }
};
