<?php

namespace App\Http\Controllers;

use App\Models\Pengumuman;
use App\Models\Document;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class PengumumanController extends Controller
{
    public function index()
{
    $user = Auth::user();

    if ($user->role === 'admin') {
        // Admin can see all pengumuman
        $pengumuman = Pengumuman::latest()->get();
    } else {
        // Bidang can only see their own pengumuman
        $pengumuman = Pengumuman::where('bidangs_id', $user->id)->latest()->get();
    }

    return Inertia::render("pengumuman/index", compact("pengumuman"));
}


    public function create()
    {
        return Inertia::render("pengumuman/create");
    }

    public function store(Request $request)
    {
        $rules = [
            'judul'         => 'required|string|max:255',
            'deskripsi'     => 'required|string|max:2000',
            'penyelenggara' => 'nullable|string|max:255',
            'lokasi'        => 'nullable|string|max:255',
            'category'      => 'required|in:foto,video',
            'instansi'      => 'required|in:umum,slb,smk,sma',
        ];

        if ($request->category === 'foto') {
            $rules['file'] = 'required|image|mimes:jpg,jpeg,png,gif,svg,webp,bmp,tiff|max:20480';
        } elseif ($request->category === 'video') {
            $rules['youtube'] = 'required|url';
        }

        $request->validate($rules);

        // simpan file lampiran (jika ada)
        $filePath = null;
        if ($request->hasFile('file')) {
            $filePath = $request->file('file')->store('pengumuman/file', 'public');
        } elseif ($request->category === 'video') {
            $filePath = $request->youtube;
        }

        // Create document
        $document = Document::create([
            'file' => $filePath ? [$filePath] : [],
        ]);

        Pengumuman::create([
            'judul'         => $request->judul,
            'deskripsi'     => $request->deskripsi,
            'penyelenggara' => $request->penyelenggara,
            'lokasi'        => $request->lokasi,
            'category'      => $request->category,
            'instansi'      => $request->instansi,
            'tabel'         => $filePath, // hanya satu file atau url
            'documents_id'  => $document->id,
            'bidangs_id'  => Auth::id(),
        ]);

        return redirect()->route('pengumuman.index')
            ->with('message', 'Pengumuman berhasil ditambahkan');
    }

    public function edit($id)
    {
        $pengumuman = Pengumuman::findOrFail($id);
        return Inertia::render("pengumuman/edit", compact('pengumuman'));
    }

    public function update(Request $request, Pengumuman $pengumuman)
    {
        $rules = [
            'judul'         => 'required|string|max:255',
            'deskripsi'     => 'required|string|max:2000',
            'penyelenggara' => 'nullable|string|max:255',
            'lokasi'        => 'nullable|string|max:255',
            'category'      => 'required|in:foto,video',
            'instansi'      => 'required|in:umum,slb,smk,sma',
        ];

        if ($request->category === 'foto') {
            $rules['file'] = 'nullable|image|mimes:jpg,jpeg,png,gif,svg,webp,bmp,tiff|max:20480';
        } elseif ($request->category === 'video') {
            $rules['youtube'] = 'nullable|url';
        }

        $request->validate($rules);

        // update file or youtube
        $filePath = $pengumuman->tabel;
        if ($request->hasFile('file')) {
            if ($pengumuman->tabel && !filter_var($pengumuman->tabel, FILTER_VALIDATE_URL) && Storage::disk('public')->exists($pengumuman->tabel)) {
                Storage::disk('public')->delete($pengumuman->tabel);
            }
            $filePath = $request->file('file')->store('pengumuman/file', 'public');
        } elseif ($request->category === 'video' && $request->youtube) {
            if ($pengumuman->tabel && !filter_var($pengumuman->tabel, FILTER_VALIDATE_URL) && Storage::disk('public')->exists($pengumuman->tabel)) {
                Storage::disk('public')->delete($pengumuman->tabel);
            }
            $filePath = $request->youtube;
        }

        $pengumuman->update([
            'judul'         => $request->judul,
            'deskripsi'     => $request->deskripsi,
            'penyelenggara' => $request->penyelenggara,
            'lokasi'        => $request->lokasi,
            'category'      => $request->category,
            'instansi'      => $request->instansi,
            'tabel'         => $filePath,
        ]);

        // Update document file
        if ($pengumuman->document) {
            $pengumuman->document->update(['file' => $filePath ? [$filePath] : []]);
        }

        return redirect()->route('pengumuman.index')
            ->with('message', 'Pengumuman berhasil diperbarui');
    }

    public function destroy($id)
    {
        $pengumuman = Pengumuman::findOrFail($id);

        // hapus file
        if ($pengumuman->tabel && Storage::disk('public')->exists($pengumuman->tabel)) {
            Storage::disk('public')->delete($pengumuman->tabel);
        }

        // Delete document
        if ($pengumuman->document) {
            $pengumuman->document->delete();
        }

        $pengumuman->delete();

        return redirect()->route('pengumuman.index')
            ->with('message', 'Pengumuman berhasil dihapus');
    }
}
