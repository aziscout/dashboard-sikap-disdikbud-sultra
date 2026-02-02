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

        $berkas = Berkas::where('pegawais_id', $pegawai->id)->first();
        
        // Cek jika berkas ada dan kolom sk_gaji_berkala tidak null
        $path = $berkas?->sk_gaji_berkala;

        return response()->json([
            'status' => 'success',
            'data'   => $path ? asset('storage/' . $path) : null,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'sk_gaji_berkala' => 'required|file|mimes:pdf,doc,docx|max:5120',
        ]);

        $pegawai = auth('pegawai')->user();
        $admin = User::where('role', 'admin_sikap')->first();

        // Simpan file dan ambil path-nya saja (String)
        $path = $request->file('sk_gaji_berkala')->store('berkas/sk_gaji_berkala', 'public');

        $berkas = Berkas::updateOrCreate(
            ['pegawais_id' => $pegawai->id],
            [
                'users_id' => $admin?->id,
                'status'   => false,
                'sk_gaji_berkala'  => $path, // Simpan string path
            ]
        );

        return response()->json([
            'status'  => 'success',
            'message' => 'SK Gaji Berkala berhasil diupload',
            'data'    => asset('storage/' . $path),
        ], 201);
    }

    public function update(Request $request)
    {
        $request->validate([
            'sk_gaji_berkala' => 'required|file|mimes:pdf,doc,docx|max:5120',
        ]);

        $pegawai = auth('pegawai')->user();
        $berkas = Berkas::where('pegawais_id', $pegawai->id)->firstOrFail();

        // Hapus file lama jika ada agar storage tidak penuh
        if ($berkas->sk_gaji_berkala) {
            Storage::disk('public')->delete($berkas->sk_gaji_berkala);
        }

        $path = $request->file('sk_gaji_berkala')->store('berkas/sk_gaji_berkala', 'public');

        $berkas->update([
            'sk_gaji_berkala' => $path, // Update dengan string path baru
        ]);

        return response()->json([
            'status'  => 'success',
            'message' => 'SK Gaji Berkala berhasil diperbarui',
            'data'    => asset('storage/' . $path),
        ]);
    }
}
