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
        // })->everyMinute();
        })->dailyAt('20:39');

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

        // $schedule->call(function () {
        //     $delayIncrementSeconds = 180;
        //     $currentTime = now();

        //     // Ambil semua pegawai yang memiliki data diri
        //     $eligiblePegawais = DataDiri::whereNotNull('pegawais_id')
        //         ->get()
        //         ->filter(function ($dataDiri) {
        //             // Gunakan tanggal data diri diinput sebagai acuan awal
        //             $tanggalInput = Carbon::parse($dataDiri->created_at);

        //             // Hitung selisih tahun dari tanggal input ke hari ini
        //             $today = Carbon::today();
        //             $years = $tanggalInput->diffInYears($today);

        //             // Kirim notifikasi setiap kelipatan 2 tahun (2, 4, 6, dst)
        //             return $years > 0 && $years % 2 == 0 &&
        //                 $tanggalInput->copy()->addYears($years)->isSameDay($today);
        //         });

        //     $eligiblePegawais = $eligiblePegawais->sortBy('pegawais_id');

        //     $eligiblePegawais->each(function ($dataDiri) use (&$currentTime, $delayIncrementSeconds) {
        //         $pegawai = Pegawai::find($dataDiri->pegawais_id);
        //         if (!$pegawai || !$pegawai->nomor) return;

        //         // Hindari notifikasi ganda di hari yang sama
        //         $existingJob = Notifikasi::where('pegawais_id', $pegawai->id)
        //             ->where('status', 'gaji')
        //             ->whereDate('created_at', today())
        //             ->exists();
        //         if ($existingJob) return;

        //         // Hitung gaji baru (contoh kenaikan 200.000)
        //         $gajiBaru = ($dataDiri->gaji_pokok ?? 0) + 200000;

        //         // Format pesan WhatsApp
        //         $message = "Halo {$pegawai->nama},\n\n"
        //             ."Selamat! Gaji pokok Anda mengalami kenaikan berkala menjadi Rp " . number_format($gajiBaru, 0, ',', '.') . ".\n\n"
        //             ."Terima kasih atas dedikasi Anda. 🙏";

        //         // Simpan notifikasi di database
        //         $notifikasi = Notifikasi::create([
        //             'pegawais_id' => $pegawai->id,
        //             'pesan' => $message,
        //             'status' => 'gaji',
        //         ]);

        //         // Tambahkan jeda agar job tidak menumpuk bersamaan
        //         $currentTime->addSeconds($delayIncrementSeconds);

        //         // Kirim pesan via job queue (database queue)
        //         SendWaNotification::dispatch($pegawai, $notifikasi, $message)
        //             ->onConnection('database')
        //             ->onQueue('wa-messages')
        //             ->delay($currentTime);
        //     });
        //     // Jalankan tiap hari jam 19:23
        // // })->dailyAt('19:23');
        // })->everyMinute();

        // $schedule->call(function () {
        //     $delayIncrementSeconds = 180;
        //     $currentTime = now();

        //     // Ambil semua pegawai yang memiliki data diri dan masa_gk
        //     $eligiblePegawais = DataDiri::whereNotNull('pegawais_id')
        //         ->whereNotNull('masa_gk_tahunan')
        //         ->whereNotNull('masa_gk_bulanan')
        //         ->get()
        //         ->filter(function ($dataDiri) {
        //             $masaGKTahun = (int) $dataDiri->masa_gk_tahunan;
        //             $masaGKbulan = (int) $dataDiri->masa_gk_bulanan;

        //             // Asumsikan masa_gk_tahunan dan masa_gk_bulanan adalah masa kerja saat ini
        //             // Maka tanggal awal dihitung mundur dari hari ini
        //             $tanggalMulaiKGB = Carbon::today()
        //                 ->copy()
        //                 ->subYears($masaGKTahun)
        //                 ->subMonths($masaGKbulan)
        //                 ->startOfDay();

        //             // Hitung selisih tahun dari tanggal awal ke hari ini
        //             $today = Carbon::today();
        //             $years = $tanggalMulaiKGB->diffInYears($today);

        //             // Kirim notifikasi setiap 2 tahun (2, 4, 6, dst)
        //             return $years > 0 && $years % 2 == 0 &&
        //                 $tanggalMulaiKGB->copy()->addYears($years)->isSameDay($today);
        //         });

        //     $eligiblePegawais = $eligiblePegawais->sortBy('pegawais_id');

        //     $eligiblePegawais->each(function ($dataDiri) use (&$currentTime, $delayIncrementSeconds) {
        //         $pegawai = Pegawai::find($dataDiri->pegawais_id);
        //         if (!$pegawai || !$pegawai->nomor) return;

        //         // Cegah pengiriman ganda di hari yang sama
        //         $existingJob = Notifikasi::where('pegawais_id', $pegawai->id)
        //             ->where('status', 'gaji')
        //             ->whereDate('created_at', today())
        //             ->exists();
        //         if ($existingJob) return;

        //         // Hitung gaji baru (contoh kenaikan 200.000)
        //         $gajiBaru = ($dataDiri->gaji_pokok ?? 0) + 200000;

        //         // Format pesan WA
        //         $message = "Halo {$pegawai->nama},\n\n"
        //             ."Selamat! Anda telah mencapai masa kerja 2 tahun berikutnya sejak masa gaji terakhir Anda.\n"
        //             ."Gaji pokok Anda kini mengalami kenaikan berkala menjadi Rp " . number_format($gajiBaru, 0, ',', '.') . ".\n\n"
        //             ."Terima kasih atas dedikasi dan kerja keras Anda. 🙏";

        //         // Simpan notifikasi
        //         $notifikasi = Notifikasi::create([
        //             'pegawais_id' => $pegawai->id,
        //             'pesan' => $message,
        //             'status' => 'gaji',
        //         ]);

        //         // Tambah jeda antar job
        //         $currentTime->addSeconds($delayIncrementSeconds);

        //         // Dispatch job ke queue
        //         SendWaNotification::dispatch($pegawai, $notifikasi, $message)
        //             ->onConnection('database')
        //             ->onQueue('wa-messages')
        //             ->delay($currentTime);
        //     });

        // // })->everyMinute();
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