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
        Schema::create('metrik_dampak_digital', function (Blueprint $table) {
            $table->id();
            $table->foreignId('sistem_csr_id')->constrained('sistem_csr')->cascadeOnDelete();
            $table->string('nama_metrik', 150);
            $table->string('kategori_label', 100);
            $table->string('api_endpoint_path', 255)->nullable();
            $table->string('api_response_field', 100)->nullable();
            $table->decimal('nilai_cached', 12, 2)->default(0);
            $table->string('satuan', 50);
            $table->string('sub_satuan', 50)->nullable();
            $table->string('suffix', 10)->nullable();
            $table->enum('format_angka', ['integer', 'decimal'])->default('integer');
            $table->text('deskripsi')->nullable();
            $table->integer('urutan')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamp('last_synced_at')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('metrik_dampak_digital');
    }
};
