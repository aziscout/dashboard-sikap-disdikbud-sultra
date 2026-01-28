<?php

namespace App\Http\Controllers\Api\Berkas;

use App\Http\Controllers\Controller;
use App\Models\Berkas;
use App\Models\User;
use Illuminate\Http\Request;

class FileSkController extends Controller
{
    public function show()
    {
        $pegawai = auth('pegawai')->user();
        if (!$pegawai) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $berkas = Berkas::where('pegawais_id', $pegawai->id)->first();
        
        $files = is_array($berkas?->file_sk) ? $berkas->file_sk : [];

        $dataResponse = collect($files)->map(function ($item) {
            return [
                'created_at' => $item['created_at'],
                'file'       => asset('storage/' . $item['file']),
            ];
        });

        return response()->json([
            'status' => 'success',
            'data'   => $dataResponse,
        ]);
    }

}
