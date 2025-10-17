<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Dokumen;
use App\Models\ProdukHukum;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ProdukHukumController extends Controller
{
    public function index() {
        $produk_hukum = ProdukHukum::all();
        return Inertia::render("produk-hukum/index", compact('produk_hukum'));
    }

    public function create() {
        return Inertia::render("produk-hukum/create",[]);
    }

    public function store(Request $request) 
    {
        $request->validate([
            'judul' => 'required|string|max:255', 
            'deskripsi' => 'required|string|max:255', 
            'category' => 'required|string|max:255', 
            'dokumen' => 'nullable|mimes:pdf|max:20240',
        ]);

        $dokumenId = null;

        if ($request->hasFile('dokumen')) {
            // Simpan file ke storage/app/public/produk-hukum
            $path = $request->file('dokumen')->store('produk-hukum', 'public');

            // Simpan ke tabel dokumens
            $dokumen = Dokumen::create([
                'dokumen' => $path,
            ]);

            $dokumenId = $dokumen->id;
        }

        // Simpan ke produk_hukums dengan foreign key dokumens_id
        ProdukHukum::create([
            'judul' => $request->judul,
            'deskripsi' => $request->deskripsi,
            'category' => $request->category,
            'dokumens_id' => $dokumenId,
        ]);

        return redirect()->route('produk-hukum.index')->with('message', 'Produk hukum berhasil ditambahkan');
    }

    public function edit($id) 
    {
        $produkHukum = ProdukHukum::with('dokumens')->findOrFail($id);
        
        return Inertia::render('produk-hukum/edit', compact('produkHukum'));
    }

    // public function update(Request $request, ProdukHukum $produkHukum) {
    //     // dd($request->all());
    //     $request->validate([
    //         'judul' => 'required|string|max:255', 
    //         'deskripsi' => 'required|string|max:255', 
    //         'file' => 'required|string|max:255', 
    //     ]);

    //     $produkHukum->update(attributes: [
    //         'judul' => $request->input('judul'),
    //         'deskripsi' => $request->input('deskripsi'),
    //         'file' => $request->input('file'),
    //     ]);

    //     return redirect()->route('produk-hukum.index')->with('message', 'Produk hukum berhasil diedit');
    // }

    public function update(Request $request, $id)
    {
        $request->validate([
            'judul' => 'required|string|max:255',
            'deskripsi' => 'required|string',
            'category' => 'required|string',
            'dokumen' => 'nullable|mimes:pdf|max:20240',
        ]);

        $produkHukum = ProdukHukum::findOrFail($id);

        // update field biasa
        $produkHukum->judul = $request->judul;
        $produkHukum->deskripsi = $request->deskripsi;
        $produkHukum->save();

        // ambil dokumen lama (kalau ada)
        $dokumen = $produkHukum->dokumens()->first();

        if ($request->hasFile('dokumen')) {
            // hapus file lama dari storage
            if ($dokumen && Storage::disk('public')->exists($dokumen->dokumen)) {
                Storage::disk('public')->delete($dokumen->dokumen);
            }

            // simpan file baru
            $path = $request->file('dokumen')->store('produk-hukum', 'public');

            if ($dokumen) {
                // update record lama
                $dokumen->update([
                    'dokumen' => $path,
                ]);
            } else {
                // bikin record baru
                $produkHukum->dokumens()->create([
                    'dokumen' => $path,
                ]);
            }
        }

        return redirect()->route('produk-hukum.index')->with('success', 'Produk hukum berhasil diperbarui.');
    }



    public function destroy(ProdukHukum $produkHukum) 
    {
        $produkHukum->delete();
        return redirect()->route('produk-hukum.index')->with('message',' Produk hukum berhasil dihapus');
    }

}