<?php

namespace App\Mail;

use App\Models\Layanan;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class LayananReceived extends Mailable
{
    use Queueable, SerializesModels;

    public $layanan;

    public function __construct(Layanan $layanan)
    {
        $this->layanan = $layanan;
    }

    public function build()
    {
        return $this->subject('Kode Tracking Laporan Anda')
                    ->markdown('emails.layanan.received');
    }
}
