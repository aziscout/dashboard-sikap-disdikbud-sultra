<?php

namespace App\Http\Controllers\Api\Berkas;

use App\Http\Controllers\Controller;
use App\Models\Berkas;
use App\Models\User;
use Illuminate\Http\Request;

class SkPangkatTerakhirController extends Controller
{
    private function formatFile(string $path, int $nextId): array
    {
        return [
            'id' => $nextId,
            'created_at' => now()->format('Y-m-d H:i:s'),
            'file' => $path,
        ];
    }

    public function show()
    {
        $pegawai = auth('pegawai')->user();
        if (!$pegawai) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $berkas = Berkas::where('pegawais_id', $pegawai->id)->first();
        
        $files = is_array($berkas?->sk_pangkat_terakhir) ? $berkas->sk_pangkat_terakhir : [];

        $dataResponse = collect($files)->map(function ($item) {
            return [
                'id' => $item['id'],
                'created_at' => $item['created_at'],
                'file'       => asset('storage/' . $item['file']),
            ];
        });

        return response()->json([
            'status' => 'success',
            'data'   => $dataResponse,
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

        $newFile = $this->formatFile($path, 1);

        $berkas = Berkas::updateOrCreate(
            ['pegawais_id' => $pegawai->id],
            [
                'users_id'   => $admin?->id,
                'status'     => 'berkas terkirim',
                'sk_pangkat_terakhir' => [$newFile],
            ]
        );

        return response()->json([
            'status'  => 'success',
            'message' => 'SK Pangkat Terakhir berhasil diupload',
            'data'    => $newFile,
        ], 201);
    }

    public function update(Request $request)
    {
        $request->validate([
            'sk_pangkat_terakhir' => 'required|file|mimes:pdf,doc,docx|max:5120',
        ]);

        $pegawai = auth('pegawai')->user();
        $berkas = Berkas::where('pegawais_id', $pegawai->id)->firstOrFail();

        $existingFiles = $berkas->sk_pangkat_terakhir ?? [];

        // 🔥 hitung auto increment ID
        $lastId = collect($existingFiles)->max('id') ?? 0;
        $nextId = $lastId + 1;

        $path = $request->file('sk_pangkat_terakhir')->store('berkas/sk_pangkat_terakhir', 'public');

        $existingFiles[] = $this->formatFile($path, $nextId);

        $berkas->update([
            'sk_pangkat_terakhir' => $existingFiles,
        ]);

        return response()->json([
            'status'  => 'success',
            'message' => 'SK Pangkat Terakhir berhasil ditambahkan',
            'data'    => end($existingFiles),
        ]);
    }
}
