<?php

namespace App\Http\Controllers\Api\Berkas;

use App\Http\Controllers\Controller;
use App\Models\Berkas;
use App\Models\User;
use Illuminate\Http\Request;

class SkJabatanController extends Controller
{
    public function show()
    {
        $pegawai = auth('pegawai')->user();

        if (!$pegawai) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $berkas = Berkas::where('pegawais_id', $pegawai->id)->first();

        $files = is_array($berkas?->sk_jabatan)
            ? $berkas->sk_jabatan
            : [];

        return response()->json([
            'status' => 'success',
            'data' => collect($files)->map(fn ($file) => asset('storage/' . $file)),
        ]);
    }

    /**
     * STORE – Upload pertama
     */
    public function store(Request $request)
    {
        $request->validate([
            'sk_jabatan' => 'nullable|file|mimes:pdf,doc,docx|max:5120',
        ]);

        $pegawai = auth('pegawai')->user();
        $admin   = User::where('role', 'admin')->first();

        if (!$pegawai) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $berkas = Berkas::firstOrCreate(
            ['pegawais_id' => $pegawai->id],
            [
                'users_id' => $admin?->id,
                'status'   => 'berkas terkirim',
            ]
        );

        $path = $request->file('sk_jabatan')
            ->store('berkas/sk_jabatan', 'public');

        $berkas->sk_jabatan = [$path];
        $berkas->save();

        return response()->json([
            'status'  => 'success',
            'message' => 'SK Gaji Berkala berhasil diupload',
            'data'    => asset('storage/' . $path),
        ], 201);
    }

    /**
     * UPDATE – Tambah file baru (append)
     */
    public function update(Request $request)
    {
        $request->validate([
            'sk_jabatan' => 'nullable|file|mimes:pdf,doc,docx|max:5120',
        ]);

        $pegawai = auth('pegawai')->user();

        if (!$pegawai) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $berkas = Berkas::where('pegawais_id', $pegawai->id)->firstOrFail();

        $files = is_array($berkas->sk_jabatan)
            ? $berkas->sk_jabatan
            : [];

        $path = $request->file('sk_jabatan')
            ->store('berkas/sk_jabatan', 'public');

        $files[] = $path;

        $berkas->sk_jabatan = $files;
        $berkas->save();

        return response()->json([
            'status'  => 'success',
            'message' => 'SK Jabatan berhasil diupdate',
            'data'    => asset('storage/' . $path),
        ]);
    }
}
