<?php

namespace App\Http\Controllers;

use App\Models\DataDiri;
use App\Models\Pegawai;
use Illuminate\Http\Request;

class DataDiriController extends Controller
{
    /**
     * Menampilkan semua data_diri
     */
    public function index()
    {
        $data = DataDiri::with('pegawai')->get();
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
        $validated = $request->validate([
            'pegawai_id' => 'required|exists:pegawai,id',
            'nip' => 'required|string|max:50',
            'tanggal_sk' => 'required|date',
            'nomor_sk' => 'required|string|max:100',
            'tempat_lahir' => 'required|string|max:100',
            'tanggal_lahir' => 'required|date',
            'tmt_golongan' => 'required|date',
            'agama' => 'required|in:islam,kristen,katolik,hindu,budha,konghucu',
            'jenis_kelamin' => 'required|in:Laki-laki,Perempuan',
            'alamat' => 'required|string|max:255',
            'nomor_kepring_bkn' => 'required|string|max:100',
            'masa_gk_bulanan' => 'required|string|max:50',
            'masa_gk_tahunan' => 'required|string|max:50',
            'golongan_ruang' => 'required|string|max:50'
        ]);

        $existing = DataDiri::where('pegawai_id', $validated ['pegawai_id'])->first();
        if ($existing){ 
            return  response()->json([
                 'succes' => false,
                 'massage' => 'Pegawai ini sudah memiliki Data Diri'

            ]);
        }

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
    public function show($id)
    {
        $data = DataDiri::with('pegawai')->find($id);

        if (!$data) {
            return response()->json([
                'success' => false,
                'message' => 'Data Diri tidak ditemukan'
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
        $data = DataDiri::find($id);

        if (!$data) {
            return response()->json([
                'success' => false,
                'message' => 'Data Diri tidak ditemukan'
            ], 404);
        }

        $validated = $request->validate([
            'nip' => 'sometimes|string|max:50',
            'tanggal_sk' => 'sometimes|date',
            'nomor_sk' => 'sometimes|string|max:100',
            'tempat_lahir' => 'sometimes|string|max:100',
            'tanggal_lahir' => 'sometimes|date',
            'tmt_golongan' => 'sometimes|date',
            'agama' => 'sometimes|in:islam,kristen,katolik,hindu,budha,konghucu',
            'jenis_kelamin' => 'sometimes|in:Laki-laki,Perempuan',
            'alamat' => 'sometimes|string|max:255',
            'nomor_kepring_bkn' => 'sometimes|string|max:100',
            'masa_gk_bulanan' => 'sometimes|string|max:50',
            'masa_gk_tahunan' => 'sometimes|string|max:50',
            'golongan_ruang' => 'nullable|string'
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
    public function destroy($id)
    {
        $data = DataDiri::find($id);

        if (!$data) {
            return response()->json([
                'success' => false,
                'message' => 'Data Diri tidak ditemukan'
            ], 404);
        }

        $data->delete();

        return response()->json([
            'success' => true,
            'message' => 'Data Diri berhasil dihapus'
        ]);
    }
}
