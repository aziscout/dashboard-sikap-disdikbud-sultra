<?php

namespace App\Http\Controllers\Api\Berkas;

use App\Http\Controllers\Controller;
use App\Models\Berkas;
use Illuminate\Http\Request;

class StatusBerkasController extends Controller
{
    public function update(Request $request)
    {
        $request->validate([
            'status' => 'required|boolean',
        ]);

        $pegawai = auth('pegawai')->user();
        if (!$pegawai) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $berkas = Berkas::where('pegawais_id', $pegawai->id)
                        ->where('status', false)
                        ->latest()
                        ->first();

        if (!$berkas) {
            return response()->json(['message' => 'Berkas not found'], 404);
        }

        $berkas->status = $request->input('status');
        $berkas->save();

        return response()->json([
            'status'  => 'success',
            'message' => 'Status berkas berhasil diperbarui',
            'data'    => [
                'id_berkas' => $berkas->id,
                'status' => $berkas->status,
            ],
        ]);
    }

    public function show()
    {
        $pegawai = auth('pegawai')->user();
        if (!$pegawai) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $berkas = Berkas::where('pegawais_id', $pegawai->id)
                        ->where('status', false)
                        ->latest()
                        ->first();

        if (!$berkas) {
            return response()->json(['message' => 'Berkas not found'], 404);
        }

        return response()->json([
            'status' => 'success',
            'data'   => [
                'id_berkas' => $berkas->id,
                'status' => $berkas->status,
            ],
        ]);
    }
}
