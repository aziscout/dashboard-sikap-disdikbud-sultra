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
                'sk_cpns' => $berkas->sk_cpns ? asset('storage/' . $berkas->sk_cpns) : null,
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
            'sk_cpns' => 'required|file|mimes:pdf,doc,docx|max:5120',
        ]);

        $pegawai = auth('pegawai')->user();
        $admin = User::where('role', 'admin_sikap')->first();
        $path = $request->file('sk_cpns')->store('berkas/sk_cpns', 'public');

        $berkas = Berkas::where('pegawais_id', $pegawai->id)
                        ->whereNull('sk_cpns')
                        ->latest()
                        ->first();

        if ($berkas) {
            $berkas->update(['sk_cpns' => $path]);
        } else {
            $berkas = Berkas::create([
                'pegawais_id' => $pegawai->id,
                'users_id'    => $admin?->id,
                'sk_cpns'      => $path,
            ]);
        }

        return response()->json([
            'status'  => 'success',
            'message' => 'SK CPNS berhasil diupload',
            'data'    => [
                'file_url' => asset('storage/' . $path),
                'created_at' => $berkas->created_at->format('d/m/Y H:i:s'), 
            ],
        ], 201);
    }

    public function update(Request $request)
    {
        $request->validate([
            'sk_cpns' => 'required|file|mimes:pdf,doc,docx|max:5120',
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

        if ($berkas->sk_cpns) {
            Storage::disk('public')->delete($berkas->sk_cpns);
        }

        $path = $request->file('sk_cpns')->store('berkas/sk_cpns', 'public');
        $berkas->update(['sk_cpns' => $path]);

        return response()->json([
            'status' => 'success',
            'message' => 'SK CPNS berhasil diperbarui',
            'data' => asset('storage/' . $path),
        ]);
    }
}
