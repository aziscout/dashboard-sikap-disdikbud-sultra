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
                ['role'=> 'admin', 'feature' => 'Dashboard', 'created_at' => now() ],
                ['role'=> 'admin', 'feature' => 'Dashboard Pangkat', 'created_at' => now() ],
                ['role'=> 'admin', 'feature' => 'Profile','created_at' => now() ],
                ['role'=> 'admin', 'feature' => 'Pengumuman','created_at' => now() ],
                ['role'=> 'admin', 'feature' => 'Laporan','created_at' => now() ],
                ['role'=> 'admin', 'feature' => 'Agenda','created_at' => now() ],
                ['role'=> 'admin', 'feature' => 'Berita','created_at' => now() ],
                ['role'=> 'admin', 'feature' => 'Inovasi','created_at' => now() ],
                ['role'=> 'admin', 'feature' => 'Layanan','created_at' => now() ],
                ['role'=> 'admin', 'feature' => 'Produk Hukum','created_at' => now() ],
                ['role'=> 'admin', 'feature' => 'Bidang','created_at' => now() ],
                ['role'=> 'admin', 'feature' => 'PPID','created_at' => now() ],
                ['role'=> 'admin', 'feature' => 'Pegawai','created_at' => now() ],
                ['role'=> 'admin', 'feature' => 'Usulan Pangkat','created_at' => now() ],
                ['role'=> 'admin', 'feature' => 'Riwayat','created_at' => now() ],


                //bidang
                ['role'=> 'bidang', 'feature' => 'Dashboard','created_at' => now() ],
                ['role'=> 'bidang', 'feature' => 'Laporan','created_at' => now() ],
                ['role'=> 'bidang', 'feature' => 'Layanan','created_at' => now() ],
            ];

            DB::table('permissions')->insert($permissions);
    }
}
