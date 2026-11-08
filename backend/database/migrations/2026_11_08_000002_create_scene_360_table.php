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
        Schema::create('scene_360', function (Blueprint $table) {
            $table->id();
            $table->foreignId('wilayah_id')->constrained('wilayah_360')->onDelete('cascade');
            $table->string('nama_scene', 255);
            $table->string('slug', 255)->nullable();
            $table->string('foto_panorama', 255);
            $table->float('default_pitch')->default(0.0);
            $table->float('default_yaw')->default(0.0);
            $table->float('default_hfov')->default(100.0);
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
        Schema::dropIfExists('scene_360');
    }
};
