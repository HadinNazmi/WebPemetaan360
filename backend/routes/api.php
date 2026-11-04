<?php

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

    // Endpoint per modul / seksi
    Route::get('/visi-misi', [PublicContentController::class, 'getVisiMisi']);
    Route::get('/metrik-dampak', [PublicContentController::class, 'getMetrikDampak']);
    Route::get('/program', [PublicContentController::class, 'getProgram']);
    Route::get('/program/{slug}', [PublicContentController::class, 'getProgramDetail']);
    Route::get('/bantuan', [PublicContentController::class, 'getBantuan']);
    Route::get('/artikel', [PublicContentController::class, 'getArtikel']);
});

// Fallback alias tanpa prefix v1 untuk fleksibilitas frontend
Route::get('/home', [PublicContentController::class, 'getHomeBundle']);
Route::get('/visi-misi', [PublicContentController::class, 'getVisiMisi']);
Route::get('/metrik-dampak', [PublicContentController::class, 'getMetrikDampak']);
Route::get('/program', [PublicContentController::class, 'getProgram']);
Route::get('/program/{slug}', [PublicContentController::class, 'getProgramDetail']);
Route::get('/bantuan', [PublicContentController::class, 'getBantuan']);
Route::get('/artikel', [PublicContentController::class, 'getArtikel']);
