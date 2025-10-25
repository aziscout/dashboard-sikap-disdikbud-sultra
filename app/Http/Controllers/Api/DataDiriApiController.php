<?php

namespace App\Http\Controllers\Api;

use App\Models\DataDiri;
use App\Http\Controllers\Controller;
use App\Models\Pegawai;
use Illuminate\Http\Request;

class DataDiriApiController extends Controller
{
    /**
     * Menampilkan semua data_diri
     */
    public function index(Request $request)
    {
        $user = $request->user(); 

        $data = DataDiri::with('pegawai')->where('pegawais_id', $user->id)->get();
        return response()->json([
            'success' => true,
            'message' => 'Data Diri berhasil diambil',
            'data' => $data
        ]);
    }

    /**
     * Menambahkan data baru ke tabel data_diri
     */
    public function store(Request $request)
    {
        $user = $request->user(); 

        // Check if user already has data diri
        $existing = DataDiri::where('pegawais_id', $user->id)->first();
        if ($existing) {
            return response()->json([
                'success' => false,
                'message' => 'Anda sudah memiliki Data Diri. Gunakan metode PUT untuk mengupdate data.'
            ], 409); 
        }

        $validated = $request->validate([
            'tanggal_sk' => 'required|date',
            'nomor_sk' => 'required|string|max:100',
            'tmt_golongan' => 'required|string|max:100',
            'nomor_pertek_bkn' => 'required|string|max:100',
            'tanggal_pertek_bkn' => 'required|string|max:100',
            'masa_gk_bulanan' => 'required|string|max:50',
            'masa_gk_tahunan' => 'required|string|max:50',
            'golongan_ruang' => 'required|string|max:50',
            'jenis_kp' => 'required|string|max:20'
        ]);

        // Add pegawais_id from authenticated user
        $validated['pegawais_id'] = $user->id;

        $data = DataDiri::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Data Diri berhasil ditambahkan',
            'data' => $data
        ], 201);
    }

    /**
     * Menampilkan data diri berdasarkan ID
     */
    public function show(Request $request, $id)
    {
        $user = $request->user(); // Get authenticated user

        $data = DataDiri::with('pegawai')->where('id', $id)->where('pegawais_id', $user->id)->first();

        if (!$data) {
            return response()->json([
                'success' => false,
                'message' => 'Data Diri tidak ditemukan atau Anda tidak memiliki akses'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $data
        ]);
    }

    /**
     * Mengupdate data diri berdasarkan ID
     */
    public function update(Request $request, $id)
    {
        $user = $request->user(); // Get authenticated user

        $data = DataDiri::where('id', $id)->where('pegawais_id', $user->id)->first();

        if (!$data) {
            return response()->json([
                'success' => false,
                'message' => 'Data Diri tidak ditemukan atau Anda tidak memiliki akses'
            ], 404);
        }

        $validated = $request->validate([
            'tanggal_sk' => 'sometimes|date',
            'nomor_sk' => 'sometimes|string|max:100',
            'tmt_golongan' => 'sometimes|string|max:100',
            'nomor_pertek_bkn' => 'sometimes|string|max:100',
            'tanggal_pertek_bkn' => 'required|string|max:100',
            'masa_gk_bulanan' => 'sometimes|string|max:50',
            'masa_gk_tahunan' => 'sometimes|string|max:50',
            'golongan_ruang' => 'sometimes|string|max:50',
            'jenis_kp' => 'sometimes|string|max:20'
        ]);

        $data->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Data Diri berhasil diperbarui',
            'data' => $data
        ]);
    }

    /**
     * Menghapus data diri
     */
    public function destroy(Request $request, $id)
    {
        $user = $request->user(); // Get authenticated user

        $data = DataDiri::where('id', $id)->where('pegawais_id', $user->id)->first();

        if (!$data) {
            return response()->json([
                'success' => false,
                'message' => 'Data Diri tidak ditemukan atau Anda tidak memiliki akses'
            ], 404);
        }

        $data->delete();

        return response()->json([
            'success' => true,
            'message' => 'Data Diri berhasil dihapus'
        ]);
    }
}
