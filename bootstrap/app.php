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
            $notificationPeriods = [2, 1];
            
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
        })->everyMinute(); 
        // })->dailyAt('19:20'); 

        $schedule->call(function () {

            $delayIncrementSeconds = 180;
            $currentTime = now();

            $eligiblePegawais = DataDiri::whereNotNull('kgb_terakhir')
                ->whereNotNull('pegawais_id')
                ->get()
                ->filter(function ($dataDiri) {

                    try {
                        // SESUAIKAN FORMAT DENGAN DATA ASLI
                        $kgbTerakhir = Carbon::createFromFormat(
                            'd-m-Y', 
                            $dataDiri->kgb_terakhir
                        );
                    } catch (\Exception $e) {
                        return false; // data rusak → skip
                    }

                    $nextKgb = $kgbTerakhir->copy()->addYears(2);
                    $notificationDate = $nextKgb
                        ->copy()
                        ->subMonths(2)
                        ->startOfDay();

                    return $notificationDate->isToday();
                })
                ->sortBy('pegawais_id');

            $eligiblePegawais->each(function ($dataDiri) use (&$currentTime, $delayIncrementSeconds) {

                $pegawai = Pegawai::find($dataDiri->pegawais_id);
                if (!$pegawai || !$pegawai->nomor) return;

                $exists = Notifikasi::where('pegawais_id', $pegawai->id)
                    ->where('status', 'gaji')
                    ->whereDate('created_at', today())
                    ->exists();

                if ($exists) return;

                $gajiBaru = $dataDiri->gaji_pokok + 200000;

                $message =
                    "Halo {$pegawai->nama},\n\n"
                    ."Kami menginformasikan bahwa Anda akan memasuki "
                    ."masa Kenaikan Gaji Berkala (KGB) dalam 2 bulan ke depan.\n\n"
                    ."Perkiraan gaji pokok baru: Rp "
                    . number_format($gajiBaru, 0, ',', '.') . "\n\n"
                    ."Silakan menyiapkan dokumen pendukung.\n\n"
                    ."Terima kasih 🙏";

                $notifikasi = Notifikasi::create([
                    'pegawais_id' => $pegawai->id,
                    'pesan' => $message,
                    'status' => 'gaji',
                ]);

                $currentTime->addSeconds($delayIncrementSeconds);

                SendWaNotification::dispatch($pegawai, $notifikasi, $message)
                    ->onConnection('database')
                    ->onQueue('wa-messages')
                    ->delay($currentTime);
            }); 

        })->everyMinute();
        // })->dailyAt('19:23');

    })
    ->withMiddleware(function (Middleware $middleware) {
        $middleware->encryptCookies(except: ['appearance', 'sidebar_state']);

        $middleware->web(append: [
            HandleAppearance::class,
            HandleInertiaRequests::class,
            AddLinkHeadersForPreloadedAssets::class,
        ]);
            $middleware->alias([
            // 'cors' => \App\Http\Middleware\CorsMiddleware::class,
            'permission' => \App\Http\Middleware\CheckPermission::class,
            'role' => \App\Http\Middleware\CheckRole::class,
        ]);

        $middleware->api(prepend: [
            // \App\Http\Middleware\CorsMiddleware::class,
            \Illuminate\Http\Middleware\HandleCors::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions) {
        //
    })->create();