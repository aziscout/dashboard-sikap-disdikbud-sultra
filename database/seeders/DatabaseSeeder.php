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
        User::factory()->create([
            'name' => 'Admin SIKAP',
            'email' => 'adminsikap@gmail.com',
            'password' => Hash::make('12345678'),
            'role' => 'admin_sikap',
        ]);
    }
}
