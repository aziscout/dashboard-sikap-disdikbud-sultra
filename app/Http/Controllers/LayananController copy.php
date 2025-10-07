<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Auth;
use App\Models\Layanan;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

class LayananController extends Controller
{
    /**
     * API – Masyarakat membuat laporan
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'judul'          => 'required|string|max:255',
            'deskripsi'      => 'required|string',
            'bidang'         => 'required|string|max:255', // dipilih oleh masyarakat
            'nama_pengirim'  => 'required|string|max:255',
            'email_pengirim' => 'required|email|max:255',
            'media_id'       => 'nullable|exists:medias,id',
            'document_id'    => 'nullable|exists:documents,id',
        ]);

        // Buat singkatan bidang (ambil huruf kapital saja)
        $singkatanBidang = strtoupper(implode('', array_map(fn ($word) => $word[0], explode(' ', $validated['bidang']))));

        // Buat tanggal hari ini
        $tanggal = date('Ymd');

        // Hitung auto increment untuk hari & bidang ini
        $jumlahHariIni = Layanan::where('bidang', $validated['bidang'])
            ->whereDate('created_at', now()->toDateString())
            ->count() + 1;

        // Format auto increment 4 digit
        $increment = str_pad($jumlahHariIni, 4, '0', STR_PAD_LEFT);

        // Gabungkan kode tracking
        $validated['kode_tracking'] = "{$singkatanBidang}-{$tanggal}-{$increment}";
        $validated['status'] = 'Diterima';

        $layanan = Layanan::create($validated);

        return response()->json([
            'message' => 'Laporan berhasil dikirim',
            'data'    => $layanan,
        ], 201);
    }

    /**
     * API – Masyarakat cek status laporan
     */
    public function status($kode_tracking)
    {
        $layanan = Layanan::where('kode_tracking', $kode_tracking)->first();

        if (!$layanan) {
            return response()->json(['message' => 'Laporan tidak ditemukan'], 404);
        }

        return response()->json([
            'judul'      => $layanan->judul,
            'status'     => $layanan->status,
            'bidang'     => $layanan->bidang,
            'created_at' => $layanan->created_at,
        ]);
    }

    /**
     * Web – Bidang melihat daftar laporan sesuai bidangnya
     */
    public function index()
    {
        $user = Auth::user();
        $layanans = Layanan::query();

        if ($user->role === 'bidang') {
            $layanans->where('bidang', $user->username ?? $user->name);
        }

        $data = $layanans->latest()->get();

        return Inertia::render('layanan/index', [
            'layanans' => $data
        ]);
    }

    /**
     * Web – Lihat detail laporan
     */
    public function show($id)
    {
        $layanan = Layanan::findOrFail($id);

        return inertia('layanan/show', [
            'layanan' => $layanan,
        ]);
    }

    /**
     * Web – Update laporan (ubah status atau bidang)
     */
    public function update(Request $request, $id)
    {
        $layanan = Layanan::findOrFail($id);

        $validated = $request->validate([
            'judul'       => 'sometimes|string|max:255',
            'deskripsi'   => 'sometimes|string',
            'bidang'      => 'sometimes|string|max:255',
            'status'      => 'sometimes|in:Diterima,Diproses,Selesai,Ditolak',
            'media_id'    => 'nullable|exists:medias,id',
            'document_id' => 'nullable|exists:documents,id',
        ]);

        $layanan->update($validated);

        return redirect()->back()->with('success', 'Data layanan berhasil diperbarui');
    }

    /**
     * Web – Hapus laporan
     */
    public function destroy($id)
    {
        $layanan = Layanan::findOrFail($id);
        $layanan->delete();

        return redirect()->back()->with('success', 'Data layanan berhasil dihapus');
    }
}
