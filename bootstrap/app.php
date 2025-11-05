<?php

use App\Http\Middleware\HandleAppearance;
use App\Http\Middleware\HandleInertiaRequests;
use App\Jobs\SendWaNotification;
use App\Models\DataDiri;
use App\Models\Notifikasi;
use App\Models\Pegawai;
use Carbon\Carbon;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets;
use Illuminate\Support\Facades\DB;
use Illuminate\Console\Scheduling\Schedule;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withSchedule(function (Schedule $schedule) {
        $schedule->call(function () {
            
            // 1. CARI PEGAWAI YANG MEMENUHI SYARAT HARI INI
            $eligiblePegawais = DataDiri::whereNotNull('tmt_golongan')
                ->get()
                ->filter(function ($dataDiri) {
                    // TMT + 4 tahun
                    $fourYearDate = Carbon::parse($dataDiri->tmt_golongan)->addYears(4);
                    
                    // Tanggal Notifikasi (3 bulan sebelum 4 tahun)
                    // Contoh: TMT 01-01-2020. 4 Tahun = 01-01-2024. Notif = 01-10-2023.
                    $notificationDate = $fourYearDate->subMonths(3)->startOfDay();
                    
                    // Cek apakah Tanggal Notifikasi jatuh tepat hari ini
                    return $notificationDate->isToday();
                });

            // 2. DISPATCH JOB DENGAN SEQUENTIAL DELAY 
            $eligiblePegawais->each(function ($dataDiri) {
                $pegawai = Pegawai::find($dataDiri->pegawais_id);
                
                // Lewati jika nomor tidak ada atau pegawai tidak ditemukan
                if (!$pegawai || !$pegawai->nomor) {
                    return;
                }

                // --- Kalkulasi Sequential Delay ---
                $latestJob = DB::table('jobs')
                                ->where('queue', 'wa-messages')
                                ->orderByDesc('id') 
                                ->first();

                $delayUntil = now(); // Job pertama akan dikirim segera
                $delaySeconds = 60; // Jeda 60 detik antar pengiriman

                if ($latestJob) {
                    // Ambil waktu ketersediaan Job terakhir dan tambahkan 60 detik
                    $latestAvailableTime = Carbon::createFromTimestamp($latestJob->available_at);
                    $scheduleTime = $latestAvailableTime->addSeconds($delaySeconds);

                    // Pastikan delay minimal adalah sekarang (untuk menghindari delay masa lalu)
                    if ($scheduleTime->greaterThan(now())) {
                        $delayUntil = $scheduleTime;
                    }
                }
                
                // --- Buat Pesan dan Simpan Log ---
                $fourYearDate = Carbon::parse($dataDiri->tmt_golongan)->addYears(4);
                // $message = "Halo, {$pegawai->nama}! Ini adalah **PENGINGAT PENTING**.\n\n"
                //         . "TMT Golongan Anda akan genap 4 tahun pada tanggal **{$fourYearDate->format('d F Y')}**."
                //         . " Anda dipersilakan untuk mengajukan kenaikan pangkat. Mohon segera lengkapi berkas yang diperlukan.";

                $message = "Halo, {$pegawai->nama}! \n\n"
                        . "Kami ingin mengingatkan bahwa masa kenaikan pangkat Anda sudah dekat."
                        . "Silakan cek data dan dokumen Anda di sistem ASN agar proses berjalan lancar.";        

                $notifikasi = Notifikasi::create([
                    'pesan' => $message,
                    'status' => 'pangkat', 
                ]);

                // --- Dispatch Job dengan Delay ---
                SendWaNotification::dispatch($pegawai, $notifikasi, $message)
                    ->onConnection('database') 
                    ->onQueue('wa-messages') 
                    ->delay($delayUntil); 
            });
            
        // })->dailyAt('08:00');
        })->everyMinute();
    })
    ->withMiddleware(function (Middleware $middleware) {
        $middleware->encryptCookies(except: ['appearance', 'sidebar_state']);

        $middleware->web(append: [
            HandleAppearance::class,
            HandleInertiaRequests::class,
            AddLinkHeadersForPreloadedAssets::class,
        ]);
        $middleware->alias([
        'permission' => \App\Http\Middleware\CheckPermission::class,
        'role' => \App\Http\Middleware\CheckRole::class,
    ]);
    })
    ->withExceptions(function (Exceptions $exceptions) {
        //
    })->create();
