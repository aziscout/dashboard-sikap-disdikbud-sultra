<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Arsip;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ArsipApiController extends Controller
{
    public function show(Request $request)
    {
        $pegawai = Auth::user();

        $arsip = Arsip::where('pegawais_id', $pegawai->id)
            ->with(['pegawai.dataDiri'])
            ->get(); 

        if ($arsip->isEmpty()) {
            return response()->json([
                'status' => 'success',
                'data' => [],
                'message' => 'Belum ada arsip untuk pegawai ini.',
            ], 200);
        }

        $responseData = [
            'status' => 'success',
            'data' => $arsip->map(function ($arsip) {
                return [
                    'id' => $arsip->id,
                    'sk_cpns' => $arsip->sk_cpns,
                    'sk_pns' => $arsip->sk_pns,
                    'sk_gaji_berkala' => $arsip->sk_gaji_berkala,
                    'sk_pangkat_terakhir' => $arsip->sk_pangkat_terakhir,
                    'sk_jabatan' => $arsip->sk_jabatan,
                    'pegawais_id' => $arsip->pegawais_id,
                    'created_at' => $arsip->created_at->format('d/m/Y H:i:s'),
                    'updated_at' => $arsip->updated_at->format('d/m/Y H:i:s'),
                ];
            }),
        ];

        return response()->json($responseData, 200);
    }
}