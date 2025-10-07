@component('mail::message')
<table width="100%" cellpadding="0" cellspacing="0" style="text-align:center; margin-bottom: 10px;">
    <tr>
        <td>
            <img src="{{ asset('logo.png') }}" alt="Logo Dikbud Sultra" width="100" style="margin-bottom: 20px;">
        </td>
    </tr>
</table>

# Terima Kasih Telah Mengirim Laporan

Halo {{ $layanan->nama_pengirim }},

Laporan Anda telah kami terima dengan rincian sebagai berikut:

- **Judul:** {{ $layanan->judul }}
- **Deskripsi:** {{ $layanan->deskripsi }}
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