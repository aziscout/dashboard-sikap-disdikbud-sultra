<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Media;
use App\Models\Inovasi;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class InovasiController extends Controller
{
    public function index()
    {
        $inovasi = Inovasi::with('medias')->latest()->get();
        return Inertia::render('inovasi/index', compact('inovasi'));
    }

    public function create()
    {
        return Inertia::render('inovasi/create', []);
    }

    public function store(Request $request)
    {
        $request->validate([
            'judul'        => 'required|string|max:255',
            'deskripsi'    => 'required|string',
            'cover_image'  => 'required|image|mimes:jpg,jpeg,png|max:20048',
            'files.*'      => 'nullable|mimes:jpg,jpeg,png,mp4,mov,avi|max:50000',
            'category'     => 'nullable|in:foto,video',
            'instansi'     => 'required|in:umum,sma,smk,slb',
            'lokasi'       => 'required|string|max:200',
            'video_urls'   => 'nullable|array',
            'video_urls.*' => 'url',
        ]);

        // Simpan cover image
        $coverPath = $request->file('cover_image')->store('inovasi/cover', 'public');

        $mediaFiles = [];

        // Upload file lokal (foto/video)
        if ($request->hasFile('files')) {
            foreach ($request->file('files') as $file) {
                $path = $file->store('inovasi/file', 'public');
                $type = in_array($file->extension(), ['mp4', 'mov', 'avi']) ? 'video' : 'foto';
                $mediaFiles[] = [
                    'file' => $path,
                    'type' => $type
                ];
            }
        }

        // Tambahkan video link dari URL
        if ($request->video_urls) {
            foreach ($request->video_urls as $url) {
                $mediaFiles[] = [
                    'file' => $url,
                    'type' => 'video'
                ];
            }
        }

        // Buat media record
        $media = Media::create([
            'file' => $mediaFiles
        ]);

        // Buat inovasi baru
        Inovasi::create([
            'medias_id'   => $media->id,
            'judul'       => $request->judul,
            'deskripsi'   => $request->deskripsi,
            'cover_image' => $coverPath,
            'category'    => $request->category,
            'instansi'    => $request->instansi,
            'lokasi'      => $request->lokasi,
            'tabel'       => 'inovasi',
        ]);

        return redirect()->route('inovasi.index')->with('message', 'Inovasi berhasil ditambahkan');
    }

    public function edit($id)
    {
        $inovasi = Inovasi::with('medias')->findOrFail($id);
        return Inertia::render('inovasi/edit', compact('inovasi'));
    }

    public function update(Request $request, Inovasi $inovasi)
    {
        $request->validate([
            'judul'         => 'required|string|max:255',
            'deskripsi'     => 'required|string',
            'cover_image'   => 'nullable|image|mimes:jpg,jpeg,png|max:20048',
            'files.*'       => 'nullable|mimes:jpg,jpeg,png,mp4,mov,avi|max:50000',
            'category'      => 'nullable|in:foto,video',
            'instansi'      => 'required|in:umum,sma,smk,slb',
            'lokasi'        => 'required|string|max:200',
            'video_urls'    => 'nullable|array',
            'video_urls.*'  => 'url',
            'deleted_files' => 'nullable|array',
        ]);

        // Update cover image jika ada
        if ($request->hasFile('cover_image')) {
            $coverPath = $request->file('cover_image')->store('inovasi/cover', 'public');
            $inovasi->cover_image = $coverPath;
        }

        // Ambil media lama
        $oldMedia = $inovasi->medias ? $inovasi->medias->file : [];
        $mediaFiles = $oldMedia ?? [];

        // Hapus media tertentu jika user minta
        if ($request->deleted_files) {
            foreach ($request->deleted_files as $delFile) {
                if (!preg_match('/^https?:\/\//', $delFile) && Storage::disk('public')->exists($delFile)) {
                    Storage::disk('public')->delete($delFile);
                }

                $mediaFiles = array_filter($mediaFiles, function ($m) use ($delFile) {
                    return $m['file'] !== $delFile;
                });
            }

            // Reset array index
            $mediaFiles = array_values($mediaFiles);
        }

        // Tambah file baru
        if ($request->hasFile('files')) {
            foreach ($request->file('files') as $file) {
                $path = $file->store('inovasi/file', 'public');
                $type = in_array($file->extension(), ['mp4', 'mov', 'avi']) ? 'video' : 'foto';
                $mediaFiles[] = [
                    'file' => $path,
                    'type' => $type
                ];
            }
        }

        // Hapus video link lama untuk diganti dengan yang baru
        $mediaFiles = array_filter($mediaFiles, function ($m) {
            return $m['type'] !== 'video' || !preg_match('/^https?:\/\//', $m['file']);
        });

        // Tambahkan video link baru (jika ada)
        if ($request->video_urls) {
            foreach ($request->video_urls as $url) {
                $mediaFiles[] = [
                    'file' => $url,
                    'type' => 'video'
                ];
            }
        }

        // Simpan media ke database
        if ($inovasi->medias) {
            $inovasi->medias->update(['file' => array_values($mediaFiles)]);
        } else {
            $inovasi->medias()->create(['file' => array_values($mediaFiles)]);
        }

        // Update data utama inovasi
        $inovasi->update([
            'judul'     => $request->judul,
            'deskripsi' => $request->deskripsi,
            'category'  => $request->category,
            'instansi'  => $request->instansi,
            'lokasi'    => $request->lokasi,
        ]);

        return redirect()->route('inovasi.index')->with('message', 'Inovasi berhasil diperbarui');
    }

    public function destroy($id)
    {
        $inovasi = Inovasi::with('medias')->findOrFail($id);

        // Hapus cover image
        if ($inovasi->cover_image && Storage::disk('public')->exists($inovasi->cover_image)) {
            Storage::disk('public')->delete($inovasi->cover_image);
        }

        // Hapus semua media (file lokal)
        if ($inovasi->medias && is_array($inovasi->medias->file)) {
            foreach ($inovasi->medias->file as $media) {
                if (isset($media['file']) && !preg_match('/^https?:\/\//', $media['file'])) {
                    if (Storage::disk('public')->exists($media['file'])) {
                        Storage::disk('public')->delete($media['file']);
                    }
                }
            }

            // Hapus record media
            $inovasi->medias->delete();
        }

        // Hapus record utama inovasi
        $inovasi->delete();

        return redirect()->route('inovasi.index')->with('message', 'Inovasi berhasil dihapus beserta media terkait');
    }
}