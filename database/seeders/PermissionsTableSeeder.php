<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class PermissionsTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $permissions = [
                ['role'=> 'admin_sikap', 'feature' => 'Dashboard Pangkat', 'created_at' => now() ],
                ['role'=> 'admin_sikap', 'feature' => 'Pegawai','created_at' => now() ],
                ['role'=> 'admin_sikap', 'feature' => 'Kenaikan Pangkat','created_at' => now() ],
                ['role'=> 'admin_sikap', 'feature' => 'Kenaikan Gaji Berkala','created_at' => now() ],
                ['role'=> 'admin_sikap', 'feature' => 'Pensiun','created_at' => now() ],
            ];

            foreach ($permissions as $permission) {
                DB::table('permissions')->updateOrInsert(
                    ['role' => $permission['role'], 'feature' => $permission['feature']],
                    ['created_at' => $permission['created_at'], 'updated_at' => now()]
                );
            }
    }
}
