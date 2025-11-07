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
            $notificationPeriods = [3, 2, 1];
            
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
        // })->everyMinute(); 
        })->dailyAt('19:20'); 

        $schedule->call(function () {
            $delayIncrementSeconds = 180;
            $currentTime = now();

            $eligiblePegawais = DataDiri::whereNotNull('tmt_golongan')
                ->whereNotNull('pegawais_id')
                ->get()
                ->filter(function ($dataDiri) {
                    $tmtGolongan = Carbon::parse($dataDiri->tmt_golongan);
                    // $nextKGB = $tmtGolongan->copy()->addYears(2);
                    // return $nextKGB->isToday();
                    $today = Carbon::today();
                    $years = $tmtGolongan->diffInYears($today);

                    return $years > 0 && $years % 2 == 0 &&
                        $tmtGolongan->copy()->addYears($years)->isSameDay($today);
                });

            $eligiblePegawais = $eligiblePegawais->sortBy('pegawais_id');

            $eligiblePegawais->each(function ($dataDiri) use (&$currentTime, $delayIncrementSeconds) {
                $pegawai = Pegawai::find($dataDiri->pegawais_id);
                if (!$pegawai || !$pegawai->nomor) return;

                $existingJob = Notifikasi::where('pegawais_id', $pegawai->id)
                    ->where('status', 'gaji')
                    ->whereDate('created_at', today())
                    ->exists();
                if ($existingJob) return;

                // Hitung gaji baru (contoh: naik 200.000)
                $gajiBaru = $dataDiri->gaji_pokok + 200000;

                $message = "Halo {$pegawai->nama},\n\n"
                    ."Selamat! Anda telah memenuhi masa kerja 2 tahun sejak TMT Golongan terakhir.\n"
                    ."Gaji pokok Anda mengalami kenaikan berkala menjadi Rp " . number_format($gajiBaru, 0, ',', '.') . ".\n\n"
                    ."Terima kasih atas dedikasi Anda. 🙏";

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
        // })->everyMinute();
        })->dailyAt('19:23');
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