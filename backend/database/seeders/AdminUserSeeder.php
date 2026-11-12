<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::updateOrCreate(
            ['email' => 'admin@csr.pertamina.com'],
            [
                'name' => 'Super Admin CSR',
                'password' => Hash::make('123456'),
                'role' => 'superadmin',
                'created_by' => null,
                'is_active' => true,
            ]
        );
    }
}
