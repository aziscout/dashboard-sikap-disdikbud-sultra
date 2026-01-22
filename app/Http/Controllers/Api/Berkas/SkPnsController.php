<?php

namespace App\Http\Controllers\Api\Berkas;

use App\Http\Controllers\Controller;
use App\Models\Berkas;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class SkPnsController extends Controller
{
    public function show()
    {
        $pegawai = auth('pegawai')->user();

        $berkas = Berkas::where('pegawais_id', $pegawai->id)->first();

        return response()->json([
            'status' => 'success',
            'data' => [
                'sk_pns' => $berkas?->sk_pns
                    ? asset('storage/' . $berkas->sk_pns)
                    : null,
            ],
        ]);
    }
    public function store(Request $request)
    {
        $request->validate([
            'sk_pns' => 'nullable|file|mimes:pdf,doc,docx|max:5120',
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
        if ($berkas->sk_pns) {
            Storage::disk('public')->delete($berkas->sk_pns);
        }

        $berkas->sk_pns = $request->file('sk_pns')
            ->store('berkas/sk_pns', 'public');

        $berkas->save();

        return response()->json([
            'status' => 'success',
            'message' => 'SK PNS berhasil diupload',
            'data' => [
                'sk_pns' => asset('storage/' . $berkas->sk_pns),
            ],
        ], 201);
    }

    public function update(Request $request)
    {
        $request->validate([
            'sk_pns' => 'nullable|file|mimes:pdf,doc,docx|max:5120',
        ]);

        $pegawai = auth('pegawai')->user();

        $berkas = Berkas::where('pegawais_id', $pegawai->id)->firstOrFail();

        // Hapus file lama
        if ($berkas->sk_pns) {
            Storage::disk('public')->delete($berkas->sk_pns);
        }

        // Simpan file baru
        $berkas->sk_pns = $request->file('sk_pns')
            ->store('berkas/sk_pns', 'public');

        $berkas->save();

        return response()->json([
            'status' => 'success',
            'message' => 'SK PNS berhasil diperbarui',
            'data' => [
                'sk_pns' => asset('storage/' . $berkas->sk_pns),
            ],
        ]);
    }
}
