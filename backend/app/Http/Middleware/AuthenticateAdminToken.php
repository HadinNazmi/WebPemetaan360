<?php

namespace App\Http\Middleware;

use App\Models\UserToken;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class AuthenticateAdminToken
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        $token = $request->bearerToken();

        if (!$token) {
            return response()->json([
                'success' => false,
                'message' => 'Akses ditolak. Token autentikasi tidak ditemukan.',
            ], 401);
        }

        $hashedToken = hash('sha256', $token);
        $tokenRecord = UserToken::with('user')->where('token', $hashedToken)->first();

        if (!$tokenRecord || ($tokenRecord->expires_at && $tokenRecord->expires_at->isPast())) {
            if ($tokenRecord) {
                $tokenRecord->delete();
            }
            return response()->json([
                'success' => false,
                'message' => 'Sesi login telah berakhir atau token tidak valid. Silakan login kembali.',
            ], 401);
        }

        $user = $tokenRecord->user;
        if (!$user || !$user->is_active) {
            return response()->json([
                'success' => false,
                'message' => 'Akun admin tidak ditemukan atau telah dinonaktifkan.',
            ], 403);
        }

        // Perbarui last_used_at jika sudah lebih dari 5 menit untuk efisiensi
        if (!$tokenRecord->last_used_at || $tokenRecord->last_used_at->diffInMinutes(now()) >= 5) {
            $tokenRecord->update(['last_used_at' => now()]);
        }

        // Set user & token record pada request
        $request->setUserResolver(fn () => $user);
        $request->attributes->set('current_token_record', $tokenRecord);

        return $next($request);
    }
}

