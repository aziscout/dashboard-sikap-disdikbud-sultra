<?php

namespace App\Jobs;

use App\Models\Notifikasi;
use App\Models\Pegawai;
use App\Services\FonnteService;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class SendWaNotification implements ShouldQueue
{
    use Queueable,Dispatchable, InteractsWithQueue, SerializesModels;

    protected $pegawai;
    protected $message;
    protected $notifikasi; // Tambahkan properti untuk objek Notifikasi

    /**
     * Create a new job instance.
     */
    public function __construct(Pegawai $pegawai, Notifikasi $notifikasi, string $message)
    {
        $this->pegawai = $pegawai;
        $this->notifikasi = $notifikasi; // Simpan objek Notifikasi
        $this->message = $message;
    }

    /**
     * Execute the job.
     */
    public function handle(FonnteService $fonnteService): void
    {
        $pegawai = $this->pegawai;
        $notifikasi = $this->notifikasi;

        if ($pegawai->nomor) {
            // 1. Kirim pesan WA melalui FonnteService
            $response = $fonnteService->sendMessage($pegawai->nomor, $this->message);

            // 2. Cek status pengiriman (Asumsi Fonnte mengembalikan 'success' atau 'status' yang menandakan berhasil)
            // Anda perlu menyesuaikan logika pengecekan respons Fonnte di sini.
            $isSuccess = isset($response['status']) && $response['status'] === 'success';

            if ($isSuccess) {
                // 3. HAPUS data dari tabel notifikasis jika berhasil
                // $notifikasi->delete();
                Log::info("Notifikasi WA berhasil dikirim. Pegawai ID: {$pegawai->id}");

            } else {
                // Jika gagal, Job akan otomatis dicoba ulang (retry) atau gagal (failed job)
                Log::error("Pengiriman WA GAGAL. Data NOTIFIKASI tidak dihapus. Pegawai ID: {$pegawai->id}");
            }
        }
    }
}
