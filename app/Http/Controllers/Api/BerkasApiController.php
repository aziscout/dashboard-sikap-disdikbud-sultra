<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Berkas;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class BerkasApiController extends Controller
{
    public function index()
    {
        $pegawai = auth('pegawai')->user();
        $admin   = auth('sanctum')->user();

        if ($pegawai) {
            $berkas = Berkas::where('pegawais_id', $pegawai->id)
                ->with('pegawai')
                ->get();

            return response()->json([
                'status' => 'success',
                'message' => 'Data berkas pegawai yang sedang login',
                'data' => $berkas,
            ]);
        }

        if ($admin && $admin->role === 'admin') {
            $berkas = Berkas::with(['pegawai'])->latest()->get();

            return response()->json([
                'status' => 'success',
                'message' => 'Data semua berkas pegawai',
                'data' => $berkas,
            ]);
        }

        return response()->json([
            'status' => 'error',
            'message' => 'Tidak diizinkan mengakses data berkas.',
        ], 403);
    }
    


    public function update(Request $request, $id)
    {
        $berkas = Berkas::find($id);

        if (!$berkas) {
            return response()->json([
                'status' => 'error',
                'message' => 'Data berkas tidak ditemukan',
            ], 404);
        }

        $pegawai = auth('pegawai')->user();
        $admin   = auth('sanctum')->user();

        // Validasi input
        $validated = $request->validate([
            'sk_cpns' => 'nullable|file|mimes:pdf,doc,docx|max:5120',
            'sk_pns' => 'nullable|file|mimes:pdf,doc,docx|max:5120',
            'sk_gaji_berkala' => 'nullable|file|mimes:pdf,doc,docx|max:5120',
            'sk_pangkat_terakhir' => 'nullable|file|mimes:pdf,doc,docx|max:5120',
            'sk_jabatan' => 'nullable|file|mimes:pdf,doc,docx|max:5120',
            // 'file_sk' => 'nullable|file|mimes:pdf,doc,docx|max:5120',
            'status' => 'nullable|in:Telah dikirim ke BKD,Telah dikirim ke BKN,SK telah terbit',
        ]);

        // Cek hak akses
        if ($pegawai && $berkas->pegawais_id !== $pegawai->id) {
            return response()->json([
                'status' => 'error',
                'message' => 'Anda tidak diizinkan mengubah berkas ini',
            ], 403);
        }

        if (!$pegawai && (!$admin || $admin->role !== 'admin')) {
            return response()->json([
                'status' => 'error',
                'message' => 'Akses ditolak.',
            ], 403);
        }

        // Update file jika dikirim
        foreach (['sk_cpns', 'sk_pns', 'sk_gaji_berkala', 'sk_pangkat_terakhir', 'sk_jabatan'] as $field) {
            if ($request->hasFile($field)) {

                // hapus file lama
                if ($berkas->$field && Storage::disk('public')->exists($berkas->$field)) {
                    Storage::disk('public')->delete($berkas->$field);
                }

                // simpan file baru
                $path = $request->file($field)->store('berkas', 'public');
                $berkas->$field = $path;
            }
        }

        // Admin boleh ubah status
        if ($admin && $admin->role === 'admin' && $request->filled('status')) {
            $berkas->status = $request->status;
        }

        // Pegawai juga bisa ubah status ke "Telah dikirim ke BKD" (jika kamu izinkan)
        if ($pegawai && $request->filled('status') && $request->status === 'Telah dikirim ke BKD') {
            $berkas->status = $request->status;
        }

        // Simpan perubahan
        $berkas->save();

        return response()->json([
            'status' => 'success',
            'message' => 'Berkas berhasil diperbarui',
            'data' => $berkas->fresh(),
        ], 200);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'sk_cpns' => 'required|file|mimes:pdf,doc,docx|max:5120',
            'sk_pns' => 'required|file|mimes:pdf,doc,docx|max:5120',
            'sk_gaji_berkala' => 'required|file|mimes:pdf,doc,docx|max:5120',
            'sk_pangkat_terakhir' => 'required|file|mimes:pdf,doc,docx|max:5120',
            'sk_jabatan' => 'required|file|mimes:pdf,doc,docx|max:5120',
            // 'file_sk' => 'nullable|file|mimes:pdf,doc,docx|max:5120',
        ]);

        // Simpan semua file ke storage
        $paths = [];
        foreach (['sk_cpns', 'sk_pns', 'sk_gaji_berkala', 'sk_pangkat_terakhir', 'sk_jabatan', 'file_sk'] as $field) {
            if ($request->hasFile($field)) {
                $paths[$field] = $request->file($field)->store('berkas', 'public');
            }
        }

        $pegawai = auth('pegawai')->user();

        // Cari user admin (bisa juga pakai firstWhere)
        $admin = User::where('role', 'admin')->first();

        // Buat data berkas baru
        $berkas = Berkas::create([
            'sk_cpns' => $paths['sk_cpns'] ?? null,
            'sk_pns' => $paths['sk_pns'] ?? null,
            'sk_gaji_berkala' => $paths['sk_gaji_berkala'] ?? null,
            'sk_pangkat_terakhir' => $paths['sk_pangkat_terakhir'] ?? null,
            'sk_jabatan' => $paths['sk_jabatan'] ?? null,
            // 'file_sk' => $paths['file_sk'] ?? null,
            'status' => 'Telah dikirim ke BKD', // default status
            'users_id' => $admin?->id ?? null,
            'pegawais_id' => $pegawai->id,
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Berkas berhasil diupload!',
            'data' => $berkas,
        ], 201);
    }

    public function destroy($id) 
    {
        $pegawai = auth('pegawai')->user();
        $admin   = auth('sanctum')->user();

        $berkas = Berkas::find($id);

        if (!$berkas) {
            return response()->json([
                'status' => 'error',
                'message' => 'Data berkas tidak ditemukan',
            ], 404);
        }

        if ($pegawai && $berkas->pegawais_id !== $pegawai->id) {
            return response()->json([
                'status' => 'error',
                'message' => 'Anda tidak diizinkan menghapus berkas ini',
            ], 403);
        }

        if ($pegawai || ($admin && $admin->role === 'admin')) {
            foreach (['sk_cpns', 'sk_pns', 'sk_gaji_berkala', 'sk_pangkat_terakhir', 'sk_jabatan', 'file_sk'] as $field) {
                if ($berkas->$field && Storage::disk('public')->exists($berkas->$field)) {
                    Storage::disk('public')->delete($berkas->$field);
                }
            }

            $berkas->delete();

            return response()->json([
                'status' => 'success',
                'message' => 'Berkas berhasil dihapus',
            ]);
        }

        return response()->json([
            'status' => 'error',
            'message' => 'Tidak diizinkan menghapus berkas.',
        ], 403);
    }

    public function show($id)
    {
        $pegawai = auth('pegawai')->user();
        $admin   = auth('sanctum')->user();

        // Cari data berkas berdasarkan ID
        $berkas = Berkas::with('pegawai')->find($id);

        if (!$berkas) {
            return response()->json([
                'status' => 'error',
                'message' => 'Data berkas tidak ditemukan.',
            ], 404);
        }

        // Hanya admin atau pegawai pemilik berkas yang boleh melihat
        if ($pegawai && $berkas->pegawais_id !== $pegawai->id) {
            return response()->json([
                'status' => 'error',
                'message' => 'Anda tidak diizinkan melihat berkas ini.',
            ], 403);
        }

        if (!$pegawai && (!$admin || $admin->role !== 'admin')) {
            return response()->json([
                'status' => 'error',
                'message' => 'Akses ditolak.',
            ], 403);
        }

        // Buat URL publik untuk setiap file yang tersedia
        $fields = ['sk_cpns', 'sk_pns', 'sk_gaji_berkala', 'sk_pangkat_terakhir', 'sk_jabatan', 'file_sk'];
        $files = [];

        foreach ($fields as $field) {
            $files[$field] = $berkas->$field ? asset('storage/' . $berkas->$field) : null;
        }

        return response()->json([
            'status' => 'success',
            'message' => 'Detail berkas berhasil diambil.',
            'data' => [
                'id' => $berkas->id,
                'pegawai' => $berkas->pegawai?->nama,
                'status' => $berkas->status,
                'created_at' => $berkas->created_at,
                'updated_at' => $berkas->updated_at,
                'files' => $files,
            ],
        ], 200);
    }

}
