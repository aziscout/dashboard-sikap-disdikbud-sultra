<?php

namespace App\Services;

use GuzzleHttp\Client;
use Illuminate\Support\Facades\Log;

class FonnteService
{
    protected $client;
    protected $token;
    protected $apiUrl = 'https://api.fonnte.com/send';

    public function __construct()
    {
        $this->token = env('FONNTE_TOKEN');
        $this->client = new Client();
    }

    /**
     * Mengirim pesan WhatsApp melalui Fonnte.
     * @param string $target Nomor tujuan (e.g., 6281xxxx)
     * @param string $message Isi pesan
     * @return array Respon dari Fonnte
     */
    public function sendMessage(string $target, string $message): array
    {
        // Hilangkan karakter non-angka dan pastikan format 62
        $target = preg_replace('/[^0-9]/', '', $target);
        if (substr($target, 0, 2) !== '62') {
            if (substr($target, 0, 1) === '0') {
                $target = '62' . substr($target, 1);
            } else {
                // Asumsi jika tidak ada 0 atau 62, tambahkan 62
                $target = '62' . $target;
            }
        }

        try {
            $response = $this->client->request('POST', $this->apiUrl, [
                'headers' => [
                    'Authorization' => $this->token,
                ],
                'form_params' => [
                    'target' => $target, 
                    'message' => $message,
                ],
                'timeout' => 60, // Timeout 15 detik
            ]);

            $body = json_decode($response->getBody()->getContents(), true);
            Log::info("Fonnte WA sent to {$target}: ", $body);
            
            return $body;
        } catch (\Exception $e) {
            Log::error("Fonnte WA failed to {$target}: " . $e->getMessage());
            return ['status' => 'error', 'reason' => $e->getMessage()];
        }
    }
}