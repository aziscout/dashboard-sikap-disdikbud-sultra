<?php

namespace App\Console\Commands;

use App\Models\Arsip;
use App\Models\Berkas;
use Illuminate\Console\Command;
use Illuminate\Support\Carbon;

class ArsipBerkas extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:arsip-berkas';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Memindahkan berkas arsip pangkat dan kgb ke tabel arsip';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $duaBulanLalu = Carbon::now()->subMonths(2);

        $berkasLama = Berkas::where('created_at', '<', $duaBulanLalu)->get();

        foreach ($berkasLama as $berkas) {
            Arsip::create([
                'sk_cpns' => $berkas->sk_cpns,
                'sk_pns' => $berkas->sk_pns,
                'sk_gaji_berkala' => $berkas->sk_gaji_berkala,
                'sk_pangkat_terakhir' => $berkas->sk_pangkat_terakhir,
                'sk_jabatan' => $berkas->sk_jabatan,
                'pegawais_id' => $berkas->pegawais_id,
            ]);

            $berkas->delete();
        }

        $this->info('Berkas dipindahkan: '.$berkasLama->count());
    }
}
