@component('mail::message')
@php
    // Embed gambar ke email
    $logoCid = $message->embed($imagePath);
@endphp

<table width="100%" style="text-align:center; margin-bottom: 20px;">
  <tr>
    <td>
      <img src="{{ $logoCid }}" alt="Logo" width="90">
    </td>
  </tr>
</table>

# Terima Kasih Telah Mengirim Laporan

Halo {{ $layanan->nama_pengirim }},

Laporan Anda telah kami terima dengan rincian sebagai berikut:

- **Judul:** {{ $layanan->judul }}
{{-- - **Deskripsi:** {{ $layanan->deskripsi }} --}}
- **Tujuan Bidang:** {{ $layanan->bidang }}

Kode tracking laporan Anda adalah:

@component('mail::panel')
**{{ $layanan->kode_tracking }}**
@endcomponent

Gunakan kode ini untuk memantau status laporan Anda di halaman cek status.

@component('mail::button', ['url' => url('/cek-laporan?kode=' . $layanan->kode_tracking)])
Cek Status Laporan
@endcomponent

Terima kasih,  
**Layanan Dikbud Sultra**
@endcomponent