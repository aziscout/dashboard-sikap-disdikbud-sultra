
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
            
            // Definisikan periode notifikasi (dalam bulan sebelum TMT 4 tahun)
            $notificationMonths = [3, 2, 1]; 
            $today = Carbon::today()->startOfDay();

            // 1. CARI PEGAWAI YANG MEMENUHI SYARAT HARI INI
            $eligiblePegawais = DataDiri::whereNotNull('tmt_golongan')
                ->get()
                ->filter(function ($dataDiri) use ($notificationMonths, $today) {
                    
                    $tmtGolongan = Carbon::parse($dataDiri->tmt_golongan);
                    // TMT + 4 tahun
                    $fourYearDate = $tmtGolongan->copy()->addYears(4);
                    
                    foreach ($notificationMonths as $months) {
                        // Hitung tanggal notifikasi untuk periode ini
                        $notificationDate = $fourYearDate->copy()->subMonths($months)->startOfDay();
                        
                        // Cek apakah Tanggal Notifikasi jatuh tepat hari ini
                        if ($notificationDate->isSameDay($today)) {
                            // Cek apakah notifikasi untuk periode ini ("pangkat_Xmonth") sudah pernah dikirim
                            $notifTag = "pangkat_{$months}month";
                            $alreadyNotified = Notifikasi::where('pegawais_id', $dataDiri->pegawais_id)
                                                        ->where('status', $notifTag)
                                                        ->exists();
                                                        
                            // Jika eligible hari ini dan BELUM pernah dikirim, maka dia eligible
                            if (!$alreadyNotified) {
                                $dataDiri->notification_months = $months; // Simpan data temp
                                return true;
                            }
                        }
                    }
                    
                    return false;
                });

            // 2. DISPATCH JOB DENGAN SEQUENTIAL DELAY 
            $delaySeconds = 60; // Jeda 60 detik antar pengiriman
            
            $eligiblePegawais->each(function ($dataDiri) use ($delaySeconds) {
                $pegawai = Pegawai::find($dataDiri->pegawais_id);
                $months = $dataDiri->notification_months ?? 3; // Ambil data temp
                
                if (!$pegawai || !$pegawai->nomor) {
                    return;
                }

                // --- Kalkulasi Sequential Delay ---
                $latestJob = DB::table('jobs')
                                ->where('queue', 'wa-messages')
                                ->orderByDesc('id') 
                                ->first();

                $delayUntil = now(); 

                if ($latestJob) {
                    $latestAvailableTime = Carbon::createFromTimestamp($latestJob->available_at);
                    $scheduleTime = $latestAvailableTime->addSeconds($delaySeconds);
                    
                    if ($scheduleTime->greaterThan(now())) {
                        $delayUntil = $scheduleTime;
                    }
                }
                
                // --- Buat Pesan dan Simpan Log Baru ---
                $tmtGolongan = Carbon::parse($dataDiri->tmt_golongan);
                $fourYearDate = $tmtGolongan->copy()->addYears(4);
                
                // Pesan mencantumkan sisa bulan sebelum jatuh tempo
                $message = "Halo, *{$pegawai->nama}*!\n\n"
                         . "Ini adalah **PENGINGAT PENTING** (Pengingat {$months} bulan sebelum jatuh tempo).\n"
                         . "TMT Golongan Anda akan genap 4 tahun pada tanggal *{$fourYearDate->format('d F Y')}*.\n"
                         . "Mohon segera cek kelengkapan berkas Anda di sistem ASN agar proses kenaikan pangkat berjalan lancar.";        

                // Gunakan status unik untuk menandai periode notifikasi
                $notifStatus = "pangkat_{$months}month"; 

                $notifikasi = Notifikasi::create([
                    'pegawais_id' => $pegawai->id, // Penting untuk cek uniqueness
                    'pesan' => $message,
                    'status' => $notifStatus, // Contoh: pangkat_3month
                ]);

                // --- Dispatch Job dengan Delay ---
                SendWaNotification::dispatch($pegawai, $notifikasi, $message)
                    ->onConnection('database') 
                    ->onQueue('wa-messages') 
                    ->delay($delayUntil); 
            });
            
            // Jadwalkan agar berjalan setiap hari pukul 08:00 (dailyAt('08:00'))
            })->dailyAt('08:00'); 
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
