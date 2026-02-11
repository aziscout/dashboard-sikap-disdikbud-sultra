<?php

namespace App\Http\Controllers\Api\Berkas;

use App\Http\Controllers\Controller;
use App\Models\Berkas;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class SkPangkatTerakhirController extends Controller
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
                'tanggal_upload' => $berkas->created_at->translatedFormat('d F Y'),
                'sk_pangkat_terakhir' => $berkas->sk_pangkat_terakhir ? asset('storage/' . $berkas->sk_pangkat_terakhir) : null,
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
            'sk_pangkat_terakhir' => 'required|file|mimes:pdf,doc,docx|max:5120',
        ]);

        $pegawai = auth('pegawai')->user();
        $admin = User::where('role', 'admin_sikap')->first();
        $path = $request->file('sk_pangkat_terakhir')->store('berkas/sk_pangkat_terakhir', 'public');

        $berkas = Berkas::where('pegawais_id', $pegawai->id)
                        ->whereNull('sk_pangkat_terakhir')
                        ->latest()
                        ->first();

        if ($berkas) {
            $berkas->update(['sk_pangkat_terakhir' => $path]);
        } else {
            $berkas = Berkas::create([
                'pegawais_id' => $pegawai->id,
                'users_id'    => $admin?->id,
                'sk_pangkat_terakhir'      => $path,
            ]);
        }

        return response()->json([
            'status'  => 'success',
            'message' => 'SK Pangkat Terakhir berhasil diupload',
            'data'    => [
                'file_url' => asset('storage/' . $path),
                'created_at' => $berkas->created_at->format('d/m/Y H:i:s'), 
            ],
        ], 201);
    }

    public function update(Request $request)
    {
        $request->validate([
            'sk_pangkat_terakhir' => 'required|file|mimes:pdf,doc,docx|max:5120',
        ]);

        $pegawai = auth('pegawai')->user();

        $berkas = Berkas::where('pegawais_id', $pegawai->id)
                        ->orderBy('created_at', 'desc')
                        ->first();

        if (!$berkas) {
            return response()->json([
                'status' => 'error',
                'message' => 'Tidak ada berkas yang ditemukan untuk diupdate.'
            ], 404);
        }

        if ($berkas->sk_pangkat_terakhir) {
            Storage::disk('public')->delete($berkas->sk_pangkat_terakhir);
        }

        $path = $request->file('sk_pangkat_terakhir')->store('berkas/sk_pangkat_terakhir', 'public');
        $berkas->update(['sk_pangkat_terakhir' => $path]);

        return response()->json([
            'status' => 'success',
            'message' => 'SK Pangkat Terakhir berhasil diperbarui',
            'data' => asset('storage/' . $path),
        ]);
    }
}
