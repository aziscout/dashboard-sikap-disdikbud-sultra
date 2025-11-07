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
use Illuminate\Support\Facades\Cache; // 🛑 Wajib ditambahkan

class SendWaNotification implements ShouldQueue
{
    use Queueable, Dispatchable, InteractsWithQueue, SerializesModels;

    protected $pegawai;
    protected $message;
    protected $notifikasi;

    public function __construct(Pegawai $pegawai, Notifikasi $notifikasi, string $message)
    {
        $this->pegawai = $pegawai;
        $this->notifikasi = $notifikasi;
        $this->message = $message;
    }

    /**
     * Execute the job.
     */
    public function handle(FonnteService $fonnteService): void
    {
        $pegawai = $this->pegawai;
        $notifikasi = $this->notifikasi;

        if (!$pegawai->nomor) {
            Log::warning("Pengiriman WA dilewati: Nomor pegawai tidak ditemukan. ID Pegawai: {$pegawai->id}");
            return;
        }

        try {
            // 2. Kirim pesan WA melalui FonnteService
            $response = $fonnteService->sendMessage($pegawai->nomor, $this->message);

            // 3. Cek status pengiriman
            $status = $response['status'] ?? null;
            $isSuccess = $status === 'success' || $status === true;

            if ($isSuccess) {
                // 4. Sukses: HAPUS data notifikasi
                $notifikasi->delete(); 
                Log::info("Notifikasi WA berhasil dikirim & Dihapus. Pegawai ID: {$pegawai->id}.");

            } else {
                // 5. Gagal
                Log::error("Pengiriman WA GAGAL. Response Fonnte: " . json_encode($response));
                throw new \Exception("Fonnte API GAGAL: " . ($response['reason'] ?? 'Unknown API Error'));
            }
        } catch (\Exception $e) {
            // 6. Exception Guzzle/Koneksi
            Log::critical("Job Failed for Pegawai ID: {$pegawai->id}. Exception: " . $e->getMessage());
            throw $e; 
        }
    }
}