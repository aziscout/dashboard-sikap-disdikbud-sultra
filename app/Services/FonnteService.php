<?php

namespace App\Services;

use GuzzleHttp\Client;
use GuzzleHttp\Exception\ClientException; // 🛑 TAMBAHKAN INI
use GuzzleHttp\Exception\ConnectException; // 🛑 TAMBAHKAN INI
use Illuminate\Support\Facades\Log;

class FonnteService
{
    protected $client;
    protected $token;
    protected $apiUrl = 'https://api.fonnte.com/send';

    public function __construct()
    {
        // 🛑 Perbaiki nama ENV jika di .env Anda adalah FONNTE_API_TOKEN
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
        // Logika format nomor telepon tetap sama
        $target = preg_replace('/[^0-9]/', '', $target);
        if (substr($target, 0, 2) !== '62') {
            if (substr($target, 0, 1) === '0') {
                $target = '62' . substr($target, 1);
            } else {
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
                'timeout' => 15, // 🛑 Diubah menjadi 15 detik (nilai yang wajar)
            ]);

            $body = json_decode($response->getBody()->getContents(), true);
            Log::info("Fonnte WA sent success to {$target}: ", $body);
            
            return $body;
        } catch (ClientException $e) {
            // 🛑 Tangkap HTTP 4xx (misalnya 401 Invalid Token)
            $responseBody = $e->getResponse()->getBody()->getContents();
            $body = json_decode($responseBody, true) ?? ['status' => 'error', 'reason' => 'HTTP Client Error (4xx/5xx)'];
            Log::error("Fonnte WA failed (Client Error) to {$target}: " . ($body['reason'] ?? $e->getMessage()));
            return $body;

        } catch (ConnectException $e) {
            // 🛑 Tangkap error koneksi (timeout, DNS error)
            Log::error("Fonnte WA failed (Connection Error) to {$target}: " . $e->getMessage());
            return ['status' => 'error', 'reason' => 'Connection Timeout or DNS Error'];

        } catch (\Exception $e) {
            // Tangkap error umum lainnya
            Log::error("Fonnte WA failed to {$target}: " . $e->getMessage());
            return ['status' => 'error', 'reason' => 'General Error: ' . $e->getMessage()];
        }
    }
}