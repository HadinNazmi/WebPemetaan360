<?php

namespace App\Models;

use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'created_by',
        'is_active',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'is_active' => 'boolean',
        ];
    }

    /**
     * Relasi ke admin yang membuat akun ini.
     */
    public function createdBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    /**
     * Relasi ke token autentikasi user.
     */
    public function tokens(): HasMany
    {
        return $this->hasMany(UserToken::class);
    }

    /**
     * Buat access token baru untuk user ini (mirip Laravel Sanctum).
     */
    public function createAccessToken(string $name = 'admin-token', ?\DateTimeInterface $expiresAt = null): string
    {
        $plainToken = \Illuminate\Support\Str::random(64);
        $hashedToken = hash('sha256', $plainToken);

        $this->tokens()->create([
            'name' => $name,
            'token' => $hashedToken,
            'expires_at' => $expiresAt ?? now()->addDays(7),
        ]);

        return $plainToken;
    }

    /**
     * Relasi ke daftar admin yang dibuat oleh user ini.
     */
    public function createdUsers(): HasMany
    {
        return $this->hasMany(User::class, 'created_by');
    }
}
