<?php

namespace App\Http\Controllers\Api\Berkas;

use App\Http\Controllers\Controller;
use App\Models\Berkas;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class SkCpnsController extends Controller
{
    public function show()
    {
        $pegawai = auth('pegawai')->user();

        $berkas = Berkas::where('pegawais_id', $pegawai->id)->first();

        return response()->json([
            'status' => 'success',
            'data' => [
                'sk_cpns' => $berkas?->sk_cpns
                    ? asset('storage/' . $berkas->sk_cpns)
                    : null,
            ],
        ]);
    }

    /**
     * CREATE SK CPNS
     */
    public function store(Request $request)
    {
        $request->validate([
            'sk_cpns' => 'nullable|file|mimes:pdf,doc,docx|max:5120',
        ]);

        $pegawai = auth('pegawai')->user();
        $admin = User::where('role', 'admin')->first();

        $berkas = Berkas::firstOrCreate(
            ['pegawais_id' => $pegawai->id],
            [
                'users_id' => $admin?->id,
                'status' => 'berkas terkirim',
            ]
        );

        // Jika sebelumnya sudah ada → hapus
        if ($berkas->sk_cpns) {
            Storage::disk('public')->delete($berkas->sk_cpns);
        }

        $berkas->sk_cpns = $request->file('sk_cpns')
            ->store('berkas/sk_cpns', 'public');

        $berkas->save();

        return response()->json([
            'status' => 'success',
            'message' => 'SK CPNS berhasil diupload',
            'data' => [
                'sk_cpns' => asset('storage/' . $berkas->sk_cpns),
            ],
        ], 201);
    }

    /**
     * UPDATE SK CPNS (REPLACE)
     */
    public function update(Request $request)
    {
        $request->validate([
            'sk_cpns' => 'nullable|file|mimes:pdf,doc,docx|max:5120',
        ]);

        $pegawai = auth('pegawai')->user();

        $berkas = Berkas::where('pegawais_id', $pegawai->id)->firstOrFail();

        // Hapus file lama
        if ($berkas->sk_cpns) {
            Storage::disk('public')->delete($berkas->sk_cpns);
        }

        // Simpan file baru
        $berkas->sk_cpns = $request->file('sk_cpns')
            ->store('berkas/sk_cpns', 'public');

        $berkas->save();

        return response()->json([
            'status' => 'success',
            'message' => 'SK CPNS berhasil diperbarui',
            'data' => [
                'sk_cpns' => asset('storage/' . $berkas->sk_cpns),
            ],
        ]);
    }
}
