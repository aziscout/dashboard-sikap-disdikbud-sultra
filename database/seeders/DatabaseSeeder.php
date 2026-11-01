<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Run Permissions seeder
        $this->call(PermissionsTableSeeder::class);

        // Create default Admin user
        User::updateOrCreate(
            ['email' => config('services.admin.email', 'adminsikap@gmail.com')],
            [
                'name' => config('services.admin.name', 'Admin SIKAP'),
                'password' => Hash::make(config('services.admin.password', '12345678')),
                'role' => 'admin_sikap',
                'email_verified_at' => now(),
            ]
        );
    }
}
