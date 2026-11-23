<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureUserRole
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     * @param  string  ...$roles
     */
    public function handle(Request $request, Closure $next, string ...$roles): Response
    {
        $user = $request->user();

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Akses ditolak. Pengguna belum diautentikasi.',
            ], 401);
        }

        // Jika tidak ada batasan role spesifik atau role user cocok dengan salah satu allowed roles
        if (!empty($roles) && !in_array($user->role, $roles, true)) {
            return response()->json([
                'success' => false,
                'message' => 'Akses ditolak. Role akun Anda (' . $user->role . ') tidak memiliki izin untuk mengakses fitur ini.',
            ], 403);
        }

        return $next($request);
    }
}

