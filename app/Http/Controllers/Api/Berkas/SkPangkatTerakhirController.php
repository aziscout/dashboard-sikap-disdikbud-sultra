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

        $berkas = Berkas::where('pegawais_id', $pegawai->id)->first();
        
        // Cek jika berkas ada dan kolom sk_pangkat_terakhir tidak null
        $path = $berkas?->sk_pangkat_terakhir;

        return response()->json([
            'status' => 'success',
            'data'   => $path ? asset('storage/' . $path) : null,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'sk_pangkat_terakhir' => 'required|file|mimes:pdf,doc,docx|max:5120',
        ]);

        $pegawai = auth('pegawai')->user();
        $admin = User::where('role', 'admin_sikap')->first();

        // Simpan file dan ambil path-nya saja (String)
        $path = $request->file('sk_pangkat_terakhir')->store('berkas/sk_pangkat_terakhir', 'public');

        $berkas = Berkas::updateOrCreate(
            ['pegawais_id' => $pegawai->id],
            [
                'users_id' => $admin?->id,
                'status'   => false,
                'sk_pangkat_terakhir'  => $path, // Simpan string path
            ]
        );

        return response()->json([
            'status'  => 'success',
            'message' => 'SK Pangkat Terakhir berhasil diupload',
            'data'    => asset('storage/' . $path),
        ], 201);
    }

    public function update(Request $request)
    {
        $request->validate([
            'sk_pangkat_terakhir' => 'required|file|mimes:pdf,doc,docx|max:5120',
        ]);

        $pegawai = auth('pegawai')->user();
        $berkas = Berkas::where('pegawais_id', $pegawai->id)->firstOrFail();

        // Hapus file lama jika ada agar storage tidak penuh
        if ($berkas->sk_pangkat_terakhir) {
            Storage::disk('public')->delete($berkas->sk_pangkat_terakhir);
        }

        $path = $request->file('sk_pangkat_terakhir')->store('berkas/sk_pangkat_terakhir', 'public');

        $berkas->update([
            'sk_pangkat_terakhir' => $path, // Update dengan string path baru
        ]);

        return response()->json([
            'status'  => 'success',
            'message' => 'SK Pangkat Terakhir berhasil diperbarui',
            'data'    => asset('storage/' . $path),
        ]);
    }
}
