<?php

namespace App\Http\Controllers\Api\Berkas;

use App\Http\Controllers\Controller;
use App\Models\Berkas;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class SkGajiBerkalaController extends Controller
{
    public function show()
    {
        $pegawai = auth('pegawai')->user();
        if (!$pegawai) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $riwayatBerkas = Berkas::where('pegawais_id', $pegawai->id)
            ->orderBy('created_at', 'desc')
            ->get();

        $dataMapped = $riwayatBerkas->map(function ($berkas) {
            return [
                'id' => $berkas->id,
                'status_usulan' => $berkas->status ? 'Selesai' : 'Sedang Diproses',
                'is_locked' => (bool)$berkas->status,
                'tanggal_upload' => $berkas->created_at->translatedFormat('d F Y'),
                'sk_gaji_berkala' => $berkas->sk_gaji_berkala ? asset('storage/' . $berkas->sk_gaji_berkala) : null,
            ];
        });

        return response()->json([
            'status' => 'success',
            'total_berkas' => $dataMapped->count(),
            'data' => $dataMapped,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'sk_gaji_berkala' => 'required|file|mimes:pdf,doc,docx|max:5120',
        ]);

        $pegawai = auth('pegawai')->user();
        $admin = User::where('role', 'admin_sikap')->first();
        $path = $request->file('sk_gaji_berkala')->store('berkas/sk_gaji_berkala', 'public');

        $berkas = Berkas::where('pegawais_id', $pegawai->id)
                        ->where('status', false)
                        ->first();

        if ($berkas) {
            if ($berkas->sk_gaji_berkala) {
                Storage::disk('public')->delete($berkas->sk_gaji_berkala);
            }
            $berkas->update(['sk_gaji_berkala' => $path]);
        } else {
            $berkas = Berkas::create([
                'pegawais_id' => $pegawai->id,
                'users_id'    => $admin?->id,
                'status'      => false,
                'sk_gaji_berkala'     => $path,
            ]);
        }

        return response()->json([
            'status'  => 'success',
            'message' => 'SK Gaji Berkala berhasil diupload ke usulan baru',
            'data'    => asset('storage/' . $path),
        ], 201);
    }

    public function update(Request $request)
    {
        $request->validate([
            'sk_gaji_berkala' => 'required|file|mimes:pdf,doc,docx|max:5120',
        ]);

        $pegawai = auth('pegawai')->user();

        $berkas = Berkas::where('pegawais_id', $pegawai->id)
                        ->where('status', false)
                        ->first();

        if (!$berkas) {
            return response()->json([
                'status' => 'error',
                'message' => 'Tidak ada usulan aktif. Silahkan upload untuk membuat usulan baru.'
            ], 404);
        }

        if ($berkas->sk_gaji_berkala) {
            Storage::disk('public')->delete($berkas->sk_gaji_berkala);
        }

        $path = $request->file('sk_gaji_berkala')->store('berkas/sk_gaji_berkala', 'public');
        $berkas->update(['sk_gaji_berkala' => $path]);

        return response()->json([
            'status' => 'success',
            'message' => 'SK Gaji Berkala pada usulan aktif berhasil diperbarui',
            'data' => asset('storage/' . $path),
        ]);
    }
}
