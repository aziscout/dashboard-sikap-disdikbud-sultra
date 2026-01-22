<?php

namespace App\Http\Controllers\Api\Berkas;

use App\Http\Controllers\Controller;
use App\Models\Berkas;
use App\Models\User;
use Illuminate\Http\Request;

class SkPangkatTerakhirController extends Controller
{
    public function show()
    {
        $pegawai = auth('pegawai')->user();

        if (!$pegawai) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $berkas = Berkas::where('pegawais_id', $pegawai->id)->first();

        $files = is_array($berkas?->sk_pangkat_terakhir)
            ? $berkas->sk_pangkat_terakhir
            : [];

        return response()->json([
            'status' => 'success',
            'data' => collect($files)->map(fn ($file) => asset('storage/' . $file)),
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'sk_pangkat_terakhir' => 'nullable|file|mimes:pdf,doc,docx|max:5120',
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

        $path = $request->file('sk_pangkat_terakhir')
            ->store('berkas/sk_pangkat_terakhir', 'public');

        $berkas->sk_pangkat_terakhir = [$path];
        $berkas->save();

        return response()->json([
            'status'  => 'success',
            'message' => 'SK Pangkat Terakhir berhasil diupload',
            'data'    => asset('storage/' . $path),
        ], 201);
    }

    public function update(Request $request)
    {
        $request->validate([
            'sk_pangkat_terakhir' => 'nullable|file|mimes:pdf,doc,docx|max:5120',
        ]);

        $pegawai = auth('pegawai')->user();

        if (!$pegawai) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $berkas = Berkas::where('pegawais_id', $pegawai->id)->firstOrFail();

        $files = is_array($berkas->sk_pangkat_terakhir)
            ? $berkas->sk_pangkat_terakhir
            : [];

        $path = $request->file('sk_pangkat_terakhir')
            ->store('berkas/sk_pangkat_terakhir', 'public');

        $files[] = $path;

        $berkas->sk_pangkat_terakhir = $files;
        $berkas->save();

        return response()->json([
            'status'  => 'success',
            'message' => 'SK Pangkat Terakhir berhasil diupdate',
            'data'    => asset('storage/' . $path),
        ]);
    }
}
