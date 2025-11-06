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
            $delayIncrementSeconds = 180;
            $notificationPeriods = [3, 2, 1]; // bulan sebelum 4 tahun TMT
            
            // Gunakan satu instance Carbon untuk delay kumulatif
            $currentTime = now();

            foreach ($notificationPeriods as $months) {
                $eligiblePegawais = DataDiri::whereNotNull('tmt_golongan')
                    ->whereNotNull('pegawais_id')
                    ->get()
                    ->filter(function ($dataDiri) use ($months) {
                        $tmtGolongan = Carbon::parse($dataDiri->tmt_golongan);
                        $fourYearDate = $tmtGolongan->copy()->addYears(4);
                        $notificationDate = $fourYearDate->copy()->subMonths($months)->startOfDay();

                        return $notificationDate->isToday();
                    });

                // Urutkan pegawai berdasarkan ID agar konsisten
                $eligiblePegawais = $eligiblePegawais->sortBy('pegawais_id');

                $eligiblePegawais->each(function ($dataDiri) use (&$currentTime, $delayIncrementSeconds) {

                    $pegawai = Pegawai::find($dataDiri->pegawais_id);

                    if (!$pegawai || !$pegawai->nomor) {
                        return;
                    }

                    $existingJob = Notifikasi::where('pegawais_id', $pegawai->id)
                                            ->where('status', 'pangkat')
                                            ->whereDate('created_at', today())
                                            ->exists();

                    if ($existingJob) {
                        return;
                    }

                    // Buat pesan WA
                    $message = "Halo {$pegawai->nama},\n\n"
                        ."Kami ingin mengingatkan bahwa masa kenaikan pangkat Anda sudah dekat.\n"
                        ."Silakan cek data dan dokumen Anda di sistem ASN:\n"
                        ."👉 https://asndigital.bkn.go.id\n\n"
                        ."Terima kasih 🙏";

                    // Simpan notifikasi
                    $notifikasi = Notifikasi::create([
                        'pegawais_id' => $pegawai->id,
                        'pesan' => $message,
                        'status' => 'pangkat',
                    ]);

                    // Tambahkan delay kumulatif
                    $currentTime->addSeconds($delayIncrementSeconds);

                    // Dispatch job ke queue WA
                    SendWaNotification::dispatch($pegawai, $notifikasi, $message)
                        ->onConnection('database')
                        ->onQueue('wa-messages')
                        ->delay($currentTime);
                });
            }
        })->everyMinute(); // atau dailyAt('08:00') jika ingin jam tertentu
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