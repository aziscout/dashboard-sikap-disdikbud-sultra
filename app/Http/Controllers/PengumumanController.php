<?php

namespace App\Http\Controllers;

use App\Models\Pengumuman;
use App\Models\Media;
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
            $pengumuman = Pengumuman::latest()->get();
        } else {
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
        $request->validate([
            'judul'         => 'required|string|max:255',
            'penyelenggara' => 'nullable|string|max:255',
            'lokasi'        => 'nullable|string|max:255',
            'instansi'      => 'required|in:umum,slb,smk,sma',
            'deskripsi'     => 'required|string|max:2000',
            'coverImage'    => 'required|image|mimes:jpg,jpeg,png,gif,svg,webp,bmp,tiff|max:20480',
            'files.*'       => 'nullable|mimes:jpg,jpeg,png,mp4,mov,avi|max:50000',
            'video_urls'    => 'nullable|array',
            'video_urls.*'  => 'url',
        ]);

        // Simpan cover image
        $coverPath = $request->file('coverImage')->store('pengumuman/cover', 'public');

        // Kumpulkan file media
        $mediaFiles = [];

        if ($request->hasFile('files')) {
            foreach ($request->file('files') as $file) {
                $path = $file->store('pengumuman/file', 'public');
                $type = in_array($file->extension(), ['mp4', 'mov', 'avi']) ? 'video' : 'foto';
                $mediaFiles[] = ['file' => $path, 'type' => $type];
            }
        }

        if ($request->video_urls) {
            foreach ($request->video_urls as $url) {
                $mediaFiles[] = ['file' => $url, 'type' => 'video'];
            }
        }

        // Simpan media
        $media = Media::create([
            'file' => $mediaFiles
        ]);

        // Simpan pengumuman
        Pengumuman::create([
            'judul'         => $request->judul,
            'deskripsi'     => $request->deskripsi,
            'penyelenggara' => $request->penyelenggara,
            'lokasi'        => $request->lokasi,
            'instansi'      => $request->instansi,
            'coverImage'    => $coverPath,
            'tabel'         => 'pengumuman',
            'medias_id'     => $media->id,
            'bidangs_id'    => Auth::id(),
        ]);

        return redirect()->route('pengumuman.index')
            ->with('message', 'Pengumuman berhasil ditambahkan');
    }

    public function edit($id)
    {
        $pengumuman = Pengumuman::with('medias')->findOrFail($id);
        return Inertia::render("pengumuman/edit", compact('pengumuman'));
    }

    public function update(Request $request, Pengumuman $pengumuman)
    {
        $request->validate([
            'judul'         => 'required|string|max:255',
            'deskripsi'     => 'required|string|max:2000',
            'penyelenggara' => 'nullable|string|max:255',
            'lokasi'        => 'nullable|string|max:255',
            'instansi'      => 'required|in:umum,slb,smk,sma',
            'coverImage'    => 'nullable|image|mimes:jpg,jpeg,png,gif,svg,webp,bmp,tiff|max:20480',
            'files.*'       => 'nullable|mimes:jpg,jpeg,png,mp4,mov,avi|max:50000',
            'video_urls'    => 'nullable|array',
            'video_urls.*'  => 'url',
        ]);

        // Update cover image
        if ($request->hasFile('coverImage')) {
            if ($pengumuman->coverImage && Storage::disk('public')->exists($pengumuman->coverImage)) {
                Storage::disk('public')->delete($pengumuman->coverImage);
            }
            $coverPath = $request->file('coverImage')->store('pengumuman/cover', 'public');
            $pengumuman->coverImage = $coverPath;
        }

        // Update media
        $mediaFiles = [];

        if ($request->hasFile('files')) {
            foreach ($request->file('files') as $file) {
                $path = $file->store('pengumuman/file', 'public');
                $type = in_array($file->extension(), ['mp4', 'mov', 'avi']) ? 'video' : 'foto';
                $mediaFiles[] = ['file' => $path, 'type' => $type];
            }
        }

        if ($request->video_urls) {
            foreach ($request->video_urls as $url) {
                $mediaFiles[] = ['file' => $url, 'type' => 'video'];
            }
        }

        if ($pengumuman->medias) {
            $pengumuman->medias->update(['file' => $mediaFiles]);
        }

        $pengumuman->update([
            'judul'         => $request->judul,
            'deskripsi'     => $request->deskripsi,
            'penyelenggara' => $request->penyelenggara,
            'lokasi'        => $request->lokasi,
            'instansi'      => $request->instansi,
        ]);

        return redirect()->route('pengumuman.index')
            ->with('message', 'Pengumuman berhasil diperbarui');
    }

    public function destroy($id)
    {
        $pengumuman = Pengumuman::with('medias')->findOrFail($id);

        // Hapus cover
        if ($pengumuman->coverImage && Storage::disk('public')->exists($pengumuman->coverImage)) {
            Storage::disk('public')->delete($pengumuman->coverImage);
        }

        // Hapus semua file media
        if ($pengumuman->medias && is_array($pengumuman->medias->file)) {
            foreach ($pengumuman->medias->file as $media) {
                if (isset($media['file']) && !preg_match('/^https?:\/\//', $media['file'])) {
                    if (Storage::disk('public')->exists($media['file'])) {
                        Storage::disk('public')->delete($media['file']);
                    }
                }
            }
            $pengumuman->medias->delete();
        }

        $pengumuman->delete();

        return redirect()->route('pengumuman.index')
            ->with('message', 'Pengumuman berhasil dihapus beserta media terkait');
    }
}
