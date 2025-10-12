<?php

namespace App\Http\Controllers;

use App\Models\LaporanKegiatan;
use App\Models\Media;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class LaporanKegiatanController extends Controller
{
    public function index()
    {
        $user = Auth::user();

        if ($user->role === 'admin') {
            $laporan_kegiatan = LaporanKegiatan::latest()->get();
        } else {
            $laporan_kegiatan = LaporanKegiatan::where('bidangs_id', $user->id)->latest()->get();
        }

        return Inertia::render("laporan-kegiatan/index", compact("laporan_kegiatan"));
    }

    public function create()
    {
        return Inertia::render("laporan-kegiatan/create", []);
    }

    public function store(Request $request)
    {
        $request->validate([
            'judul'         => 'required|string|max:255',
            'penyelenggara' => 'required|string|max:255',
            'lokasi'        => 'required|string|max:255',
            'instansi'      => 'required|in:umum,sma,smk,slb',
            'deskripsi'     => 'required|string|max:1000',
            'coverImage'    => 'required|image|mimes:jpg,jpeg,png,gif,svg,webp,bmp,tiff|max:20480',
            'files.*'       => 'nullable|mimes:jpg,jpeg,png,mp4,mov,avi|max:50000',
            'video_urls'    => 'nullable|array',
            'video_urls.*'  => 'url',
        ]);

        // Upload cover image
        $coverPath = $request->file('coverImage')->store('laporan-kegiatan/cover', 'public');

        // Collect media files
        $mediaFiles = [];

        if ($request->hasFile('files')) {
            foreach ($request->file('files') as $file) {
                $path = $file->store('laporan-kegiatan/file', 'public');
                $type = in_array($file->extension(), ['mp4','mov','avi']) ? 'video' : 'foto';
                $mediaFiles[] = ['file' => $path, 'type' => $type];
            }
        }

        if ($request->video_urls) {
            foreach ($request->video_urls as $url) {
                $mediaFiles[] = ['file' => $url, 'type' => 'video'];
            }
        }

        // Save media
        $media = Media::create([
            'file' => $mediaFiles
        ]);

        // Save laporan kegiatan
        LaporanKegiatan::create([
            'medias_id'     => $media->id,
            'judul'         => $request->judul,
            'penyelenggara' => $request->penyelenggara,
            'lokasi'        => $request->lokasi,
            'instansi'      => $request->instansi,
            'deskripsi'     => $request->deskripsi,
            'coverImage'    => $coverPath,
            'tabel'         => 'laporan_kegiatan',
            'bidangs_id'    => Auth::id(),
        ]);

        return redirect()->route('laporan-kegiatan.index')
            ->with('message', 'Laporan kegiatan berhasil ditambahkan');
    }

    public function edit($id)
    {
        $user = Auth::user();
        $laporan_kegiatan = LaporanKegiatan::with('medias')->findOrFail($id);

        if ($user->role !== 'admin' && $laporan_kegiatan->bidangs_id !== $user->id) {
            abort(403, 'Unauthorized to edit this laporan kegiatan.');
        }

        return Inertia::render("laporan-kegiatan/edit", ['laporanKegiatan' => $laporan_kegiatan]);
    }

    public function update(Request $request, LaporanKegiatan $laporan_kegiatan)
    {
        $user = Auth::user();

        if ($user->role !== 'admin' && $laporan_kegiatan->bidangs_id !== $user->id) {
            abort(403, 'Unauthorized to update this laporan kegiatan.');
        }

        $request->validate([
            'judul'         => 'required|string|max:255',
            'penyelenggara' => 'required|string|max:255',
            'lokasi'        => 'required|string|max:255',
            'instansi'      => 'required|in:umum,sma,smk,slb',
            'deskripsi'     => 'required|string|max:1000',
            'coverImage'    => 'nullable|image|mimes:jpg,jpeg,png|max:20048',
            'files.*'       => 'nullable|mimes:jpg,jpeg,png,mp4,mov,avi|max:50000',
            'video_urls'    => 'nullable|array',
            'video_urls.*'  => 'url',
        ]);

        // Update cover image
        if ($request->hasFile('coverImage')) {
            if ($laporan_kegiatan->coverImage && Storage::disk('public')->exists($laporan_kegiatan->coverImage)) {
                Storage::disk('public')->delete($laporan_kegiatan->coverImage);
            }
            $coverPath = $request->file('coverImage')->store('laporan-kegiatan/cover', 'public');
            $laporan_kegiatan->coverImage = $coverPath;
        }

        // Update media
        $mediaFiles = [];

        if ($request->hasFile('files')) {
            foreach ($request->file('files') as $file) {
                $path = $file->store('laporan-kegiatan/file', 'public');
                $type = in_array($file->extension(), ['mp4','mov','avi']) ? 'video' : 'foto';
                $mediaFiles[] = ['file' => $path, 'type' => $type];
            }
        }

        if ($request->video_urls) {
            foreach ($request->video_urls as $url) {
                $mediaFiles[] = ['file' => $url, 'type' => 'video'];
            }
        }

        if ($laporan_kegiatan->medias) {
            $laporan_kegiatan->medias->update(['file' => $mediaFiles]);
        }

        $laporan_kegiatan->update([
            'judul'         => $request->judul,
            'penyelenggara' => $request->penyelenggara,
            'lokasi'        => $request->lokasi,
            'instansi'      => $request->instansi,
            'deskripsi'     => $request->deskripsi,
        ]);

        return redirect()->route('laporan-kegiatan.index')
            ->with('message', 'Laporan kegiatan berhasil diperbarui');
    }

    public function destroy($id)
    {
        $laporan_kegiatan = LaporanKegiatan::with('medias')->findOrFail($id);

        // Delete cover image
        if ($laporan_kegiatan->coverImage && Storage::disk('public')->exists($laporan_kegiatan->coverImage)) {
            Storage::disk('public')->delete($laporan_kegiatan->coverImage);
        }

        // Delete all media files
        if ($laporan_kegiatan->medias && is_array($laporan_kegiatan->medias->file)) {
            foreach ($laporan_kegiatan->medias->file as $media) {
                if (isset($media['file']) && !preg_match('/^https?:\/\//', $media['file'])) {
                    if (Storage::disk('public')->exists($media['file'])) {
                        Storage::disk('public')->delete($media['file']);
                    }
                }
            }
            $laporan_kegiatan->medias->delete();
        }

        $laporan_kegiatan->delete();

        return redirect()->route('laporan-kegiatan.index')
            ->with('message', 'Laporan kegiatan berhasil dihapus beserta media terkait');
    }
}
