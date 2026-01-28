<?php

namespace App\Http\Controllers\Api\Berkas;

use App\Http\Controllers\Controller;
use App\Models\Berkas;
use App\Models\User;
use Illuminate\Http\Request;

class SkJabatanController extends Controller
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
        
        $files = is_array($berkas?->sk_jabatan) ? $berkas->sk_jabatan : [];

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
            'sk_jabatan' => 'required|file|mimes:pdf,doc,docx|max:5120',
        ]);

        $pegawai = auth('pegawai')->user();
        $admin = User::where('role', 'admin_sikap')->first();

        $path = $request->file('sk_jabatan')->store('berkas/sk_jabatan', 'public');

        $newFile = $this->formatFile($path, 1);

        $berkas = Berkas::updateOrCreate(
            ['pegawais_id' => $pegawai->id],
            [
                'users_id'   => $admin?->id,
                'status'     => 'berkas terkirim',
                'sk_jabatan' => [$newFile],
            ]
        );

        return response()->json([
            'status'  => 'success',
            'message' => 'SK Jabatan berhasil diupload',
            'data'    => $newFile,
        ], 201);
    }

    public function update(Request $request)
    {
        $request->validate([
            'sk_jabatan' => 'required|file|mimes:pdf,doc,docx|max:5120',
        ]);

        $pegawai = auth('pegawai')->user();
        $berkas = Berkas::where('pegawais_id', $pegawai->id)->firstOrFail();

        $existingFiles = $berkas->sk_jabatan ?? [];

        // 🔥 hitung auto increment ID
        $lastId = collect($existingFiles)->max('id') ?? 0;
        $nextId = $lastId + 1;

        $path = $request->file('sk_jabatan')->store('berkas/sk_jabatan', 'public');

        $existingFiles[] = $this->formatFile($path, $nextId);

        $berkas->update([
            'sk_jabatan' => $existingFiles,
        ]);

        return response()->json([
            'status'  => 'success',
            'message' => 'SK Jabatan berhasil ditambahkan',
            'data'    => end($existingFiles),
        ]);
    }

}
