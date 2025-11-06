<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Dokumen;
use App\Models\Ppid;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class PpidController extends Controller
{
    /**
     * Menampilkan semua data PPID.
     */
    public function index()
    {
        // Menggunakan 'dokumens' (plural) sesuai Model
        $ppid_data = Ppid::with('dokumens')->get();

        $ppid_data->transform(function ($item) {
            // Sesuaikan pemanggilan relasi
            $item->dokumen_path = $item->dokumens->dokumen ?? null;
            return $item;
        });

        return Inertia::render("ppid/index", compact('ppid_data'));
    }

    /**
     * Menampilkan form untuk membuat data baru.
     */
    public function create()
    {
        return Inertia::render("ppid/create");
    }

    /**
     * Menyimpan data PPID baru ke database.
     */
    public function store(Request $request)
    {
        $request->validate([
            'judul' => 'required|string|max:255',
            'tahun' => 'required|digits:4',
            'informasi' => 'required|in:Berkala,Setiap Saat,Serta Merta,Dikecualikan',
            'file' => 'required|mimes:pdf|max:5120', // 5MB
        ]);

        $dokumenId = null;

        if ($request->hasFile('file')) {
            $path = $request->file('file')->store('dokumen/ppid', 'public');

            $dokumen = Dokumen::create([
                'dokumen' => $path,
            ]);

            $dokumenId = $dokumen->id;
        }

        Ppid::create([
            'judul' => $request->judul,
            'tahun' => $request->tahun,
            'informasi' => $request->informasi,
            'dokumens_id' => $dokumenId,
        ]);

        return redirect()->route('ppid.index')->with('success', 'Data PPID berhasil ditambahkan.');
    }

    /**
     * Menampilkan form untuk mengedit data.
     */
    public function edit($id)
    {
        // Menggunakan 'dokumens' (plural) sesuai Model
        $ppid = Ppid::with('dokumens')->findOrFail($id);

        // Kirim path dokumen agar preview tampil
        // Sesuaikan pemanggilan relasi
        $ppid->dokumen_path = $ppid->dokumens->dokumen ?? null;

        return Inertia::render('ppid/edit', compact('ppid'));
    }

    /**
     * Memperbarui data PPID di database.
     */
    public function update(Request $request, $id)
    {
        $request->validate([
            'judul' => 'nullable|string|max:255',
            'tahun' => 'nullable|digits:4',
            'informasi' => 'nullable|in:Berkala,Setiap Saat,Serta Merta,Dikecualikan',
            'file' => 'nullable|mimes:pdf|max:5120', // 5MB
        ]);

        $ppid = Ppid::findOrFail($id);
        $dokumen = $ppid->dokumens; // Sesuaikan pemanggilan relasi

        // Update data teks
        $ppid->update($request->only(['judul', 'tahun', 'informasi']));

        // Handle file jika ada file baru yang diupload
        if ($request->hasFile('file')) {
            // Hapus file lama jika ada
            if ($dokumen && Storage::disk('public')->exists($dokumen->dokumen)) {
                Storage::disk('public')->delete($dokumen->dokumen);
            }

            // Simpan file baru
            $path = $request->file('file')->store('dokumen/ppid', 'public');

            // Update path di tabel dokumens, atau buat baru jika belum ada
            if ($dokumen) {
                $dokumen->update(['dokumen' => $path]);
            } else {
                // Buat relasi baru jika sebelumnya tidak ada dokumen
                $newDokumen = Dokumen::create(['dokumen' => $path]);
                $ppid->update(['dokumens_id' => $newDokumen->id]);
            }
        }

        return redirect()->route('ppid.index')->with('success', 'Data PPID berhasil diperbarui.');
    }

    /**
     * Menghapus data PPID dari database.
     */
    public function destroy($id)
    {
        $ppid = Ppid::findOrFail($id);
        $dokumen = $ppid->dokumens; // Sesuaikan pemanggilan relasi

        // Hapus file dari storage jika ada
        if ($dokumen && Storage::disk('public')->exists($dokumen->dokumen)) {
            Storage::disk('public')->delete($dokumen->dokumen);
        }

        // Hapus record dokumen jika ada
        if ($dokumen) {
            $dokumen->delete();
        }

        // Hapus record ppid
        $ppid->delete();

        return redirect()->route('ppid.index')->with('success', 'Data PPID berhasil dihapus.');
    }
}