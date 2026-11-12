<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    /**
     * Login admin dengan perlindungan Rate Limiter (Brute Force Protection).
     */
    public function login(Request $request): JsonResponse
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required|string',
        ]);

        $ip = $request->ip();
        $rateLimitKey = 'login:'.$ip;

        // Maksimal 5 percobaan gagal per 1 menit
        if (RateLimiter::tooManyAttempts($rateLimitKey, 5)) {
            $seconds = RateLimiter::availableIn($rateLimitKey);
            return response()->json([
                'success' => false,
                'message' => "Terlalu banyak percobaan login gagal. Silakan coba kembali dalam {$seconds} detik.",
            ], 429);
        }

        $user = User::where('email', $request->email)->first();

        if (! $user || ! Hash::check($request->password, $user->password)) {
            RateLimiter::hit($rateLimitKey, 60);
            return response()->json([
                'success' => false,
                'message' => 'Email atau kata sandi yang Anda masukkan tidak sesuai.',
            ], 422);
        }

        if (! $user->is_active) {
            return response()->json([
                'success' => false,
                'message' => 'Akun admin ini telah dinonaktifkan. Silakan hubungi Super Admin.',
            ], 403);
        }

        // Login sukses, bersihkan counter rate limit
        RateLimiter::clear($rateLimitKey);

        // Masa berlaku token aktif selama 30 hari di browser
        $expiresAt = now()->addDays(30);

        $plainToken = $user->createAccessToken('browser-session', $expiresAt);

        return response()->json([
            'success' => true,
            'message' => 'Login berhasil. Selamat datang kembali, '.$user->name,
            'data' => [
                'token' => $plainToken,
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'role' => $user->role,
                ],
                'expires_at' => $expiresAt->toIso8601String(),
            ],
        ]);
    }

    /**
     * Cek status profil admin yang sedang login.
     */
    public function me(Request $request): JsonResponse
    {
        $user = $request->user();

        return response()->json([
            'success' => true,
            'data' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role,
                'is_active' => $user->is_active,
            ],
        ]);
    }

    /**
     * Logout dan cabut (revoke) token yang sedang digunakan.
     */
    public function logout(Request $request): JsonResponse
    {
        $tokenRecord = $request->attributes->get('current_token_record');

        if ($tokenRecord) {
            $tokenRecord->delete();
        }

        return response()->json([
            'success' => true,
            'message' => 'Sesi admin berhasil diakhiri.',
        ]);
    }

    /**
     * Dapatkan daftar pengguna admin (Khusus Superadmin).
     */
    public function getUsers(Request $request): JsonResponse
    {
        $users = User::select('id', 'name', 'email', 'role', 'is_active', 'created_at')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $users,
        ]);
    }

    /**
     * Tambah admin baru.
     */
    public function storeUser(Request $request): JsonResponse
    {
        $currentUser = $request->user();
        if ($currentUser->role !== 'superadmin') {
            return response()->json([
                'success' => false,
                'message' => 'Hanya Super Admin yang diizinkan menambahkan admin baru.',
            ], 403);
        }

        $validated = $request->validate([
            'name' => 'required|string|max:100',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:6',
            'role' => 'nullable|string|in:superadmin,admin',
        ]);

        $newUser = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role' => $validated['role'] ?? 'admin',
            'created_by' => $currentUser->id,
            'is_active' => true,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Pengguna admin berhasil ditambahkan.',
            'data' => [
                'id' => $newUser->id,
                'name' => $newUser->name,
                'email' => $newUser->email,
                'role' => $newUser->role,
                'is_active' => $newUser->is_active,
            ],
        ], 201);
    }

    /**
     * Hapus admin.
     */
    public function deleteUser(Request $request, int $id): JsonResponse
    {
        $currentUser = $request->user();
        if ($currentUser->role !== 'superadmin') {
            return response()->json([
                'success' => false,
                'message' => 'Hanya Super Admin yang diizinkan menghapus akun admin.',
            ], 403);
        }

        if ($currentUser->id === $id) {
            return response()->json([
                'success' => false,
                'message' => 'Anda tidak dapat menghapus akun Anda sendiri saat sedang aktif.',
            ], 400);
        }

        $targetUser = User::find($id);
        if (! $targetUser) {
            return response()->json([
                'success' => false,
                'message' => 'Pengguna admin tidak ditemukan.',
            ], 404);
        }

        $targetUser->delete();

        return response()->json([
            'success' => true,
            'message' => 'Akun admin berhasil dihapus.',
        ]);
    }
}

