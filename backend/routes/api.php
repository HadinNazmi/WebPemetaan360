<?php

use App\Http\Controllers\Api\AdminContentController;
use App\Http\Controllers\Api\PublicContentController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Public API Routes (Frontend Web Pemetaan 360)
|--------------------------------------------------------------------------
*/

Route::prefix('v1')->group(function () {
    // Bundle semua data halaman beranda dalam 1 request
    Route::get('/home', [PublicContentController::class, 'getHomeBundle']);

    // Endpoint per modul / seksi publik
    Route::get('/visi-misi', [PublicContentController::class, 'getVisiMisi']);
    Route::get('/metrik-dampak', [PublicContentController::class, 'getMetrikDampak']);
    Route::get('/program', [PublicContentController::class, 'getProgram']);
    Route::get('/program/{slug}', [PublicContentController::class, 'getProgramDetail']);
    Route::get('/bantuan', [PublicContentController::class, 'getBantuan']);
    Route::get('/artikel', [PublicContentController::class, 'getArtikel']);

    // ==========================================
    // Admin CRUD Routes (CMS Dashboard)
    // ==========================================
    Route::prefix('admin')->group(function () {
        // Overview Stats
        Route::get('/stats', [AdminContentController::class, 'getDashboardStats']);

        // 1. Hero & Visi Misi
        Route::get('/visi-misi', [AdminContentController::class, 'getVisiMisi']);
        Route::post('/visi-misi', [AdminContentController::class, 'updateVisiMisi']);

        // 2. Metrik Dampak Digital
        Route::get('/metrik-dampak', [AdminContentController::class, 'getMetrikDampak']);
        Route::post('/metrik-dampak', [AdminContentController::class, 'storeMetrikDampak']);
        Route::put('/metrik-dampak/{id}', [AdminContentController::class, 'updateMetrikDampak']);
        Route::delete('/metrik-dampak/{id}', [AdminContentController::class, 'deleteMetrikDampak']);

        // 3. Program Unggulan CSR
        Route::get('/program', [AdminContentController::class, 'getPrograms']);
        Route::post('/program', [AdminContentController::class, 'storeProgram']);
        Route::put('/program/{id}', [AdminContentController::class, 'updateProgram']);
        Route::delete('/program/{id}', [AdminContentController::class, 'deleteProgram']);

        // 4. Penyaluran Bantuan CSR
        Route::get('/bantuan', [AdminContentController::class, 'getBantuan']);
        Route::post('/bantuan', [AdminContentController::class, 'storeBantuan']);
        Route::put('/bantuan/{id}', [AdminContentController::class, 'updateBantuan']);
        Route::delete('/bantuan/{id}', [AdminContentController::class, 'deleteBantuan']);

        // 5. Artikel & Publikasi Media
        Route::get('/artikel', [AdminContentController::class, 'getArtikel']);
        Route::post('/artikel', [AdminContentController::class, 'storeArtikel']);
        Route::put('/artikel/{id}', [AdminContentController::class, 'updateArtikel']);
        Route::delete('/artikel/{id}', [AdminContentController::class, 'deleteArtikel']);

        // 6. Kelola Pengguna Admin
        Route::get('/users', [AdminContentController::class, 'getUsers']);
        Route::post('/users', [AdminContentController::class, 'storeUser']);
        Route::delete('/users/{id}', [AdminContentController::class, 'deleteUser']);
    });
});

// Fallback alias tanpa prefix v1 untuk fleksibilitas frontend
Route::get('/home', [PublicContentController::class, 'getHomeBundle']);
Route::get('/visi-misi', [PublicContentController::class, 'getVisiMisi']);
Route::get('/metrik-dampak', [PublicContentController::class, 'getMetrikDampak']);
Route::get('/program', [PublicContentController::class, 'getProgram']);
Route::get('/program/{slug}', [PublicContentController::class, 'getProgramDetail']);
Route::get('/bantuan', [PublicContentController::class, 'getBantuan']);
Route::get('/artikel', [PublicContentController::class, 'getArtikel']);
