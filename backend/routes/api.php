<?php

use App\Http\Controllers\Api\AdminContentController;
use App\Http\Controllers\Api\PublicContentController;
use App\Http\Controllers\Api\Tour360AdminController;
use App\Http\Controllers\Api\Tour360PublicController;
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
    Route::get('/sistem-csr', [PublicContentController::class, 'getSistemList']);
    Route::get('/sistem-csr/{slug}', [PublicContentController::class, 'getSistemDetail']);
    Route::get('/program', [PublicContentController::class, 'getProgram']);
    Route::get('/program/{slug}', [PublicContentController::class, 'getProgramDetail']);
    Route::get('/bantuan', [PublicContentController::class, 'getBantuan']);
    Route::get('/artikel', [PublicContentController::class, 'getArtikel']);

    // Virtual Tour 360 Public API
    Route::get('/tour-360', [Tour360PublicController::class, 'getWilayahList']);
    Route::get('/tour-360-hero', [Tour360PublicController::class, 'getHeroPanorama']);
    Route::get('/tour-360/{slug}', [Tour360PublicController::class, 'getTourDetail']);

    // ==========================================
    // Admin CRUD Routes (CMS Dashboard)
    // ==========================================
    Route::prefix('admin')->group(function () {
        // Overview Stats
        Route::get('/stats', [AdminContentController::class, 'getDashboardStats']);

        // 1. Hero & Visi Misi
        Route::get('/visi-misi', [AdminContentController::class, 'getVisiMisi']);
        Route::post('/visi-misi', [AdminContentController::class, 'updateVisiMisi']);

        // 2. Metrik Dampak Digital & Profil Sistem CSR
        Route::get('/metrik-dampak', [AdminContentController::class, 'getMetrikDampak']);
        Route::post('/metrik-dampak', [AdminContentController::class, 'storeMetrikDampak']);
        Route::put('/metrik-dampak/{id}', [AdminContentController::class, 'updateMetrikDampak']);
        Route::delete('/metrik-dampak/{id}', [AdminContentController::class, 'deleteMetrikDampak']);
        Route::get('/sistem-csr', [AdminContentController::class, 'getSistemCsr']);
        Route::put('/sistem-csr/{id}', [AdminContentController::class, 'updateSistemCsr']);

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

        // 7. Upload Media (Standar Shared Hosting)
        Route::post('/upload', [AdminContentController::class, 'uploadImage']);

        // 8. Virtual Tour 360 Admin
        Route::prefix('tour-360')->group(function () {
            // Upload media khusus tour 360
            Route::post('/upload', [Tour360AdminController::class, 'uploadMedia']);

            // Panorama Hero Beranda Utama (Kilang Udara 360)
            Route::get('/hero', [Tour360AdminController::class, 'getHeroSettings']);
            Route::put('/hero', [Tour360AdminController::class, 'updateHeroSettings']);

            // Master Wilayah
            Route::get('/wilayah', [Tour360AdminController::class, 'listWilayah']);
            Route::post('/wilayah', [Tour360AdminController::class, 'storeWilayah']);
            Route::get('/wilayah/{id}', [Tour360AdminController::class, 'showWilayah']);
            Route::put('/wilayah/{id}', [Tour360AdminController::class, 'updateWilayah']);
            Route::delete('/wilayah/{id}', [Tour360AdminController::class, 'destroyWilayah']);

            // Scene / Titik Panorama
            Route::get('/wilayah/{wilayahId}/scenes', [Tour360AdminController::class, 'listScenes']);
            Route::post('/wilayah/{wilayahId}/scenes', [Tour360AdminController::class, 'storeScene']);
            Route::get('/scenes/{id}', [Tour360AdminController::class, 'showScene']);
            Route::put('/scenes/{id}', [Tour360AdminController::class, 'updateScene']);
            Route::delete('/scenes/{id}', [Tour360AdminController::class, 'destroyScene']);
            Route::post('/scenes/{id}/set-initial', [Tour360AdminController::class, 'setInitialScene']);

            // Hotspot Interaktif
            Route::get('/scenes/{sceneId}/hotspots', [Tour360AdminController::class, 'listHotspots']);
            Route::post('/scenes/{sceneId}/hotspots', [Tour360AdminController::class, 'storeHotspot']);
            Route::put('/hotspots/{id}', [Tour360AdminController::class, 'updateHotspot']);
            Route::delete('/hotspots/{id}', [Tour360AdminController::class, 'destroyHotspot']);
        });
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
Route::get('/tour-360', [Tour360PublicController::class, 'getWilayahList']);
Route::get('/tour-360-hero', [Tour360PublicController::class, 'getHeroPanorama']);
Route::get('/tour-360/{slug}', [Tour360PublicController::class, 'getTourDetail']);
