<?php

namespace App\Http\Controllers;

use App\Models\LaporanKegiatan;
use App\Models\Media;
use App\Models\Dokumen;
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
            // Admin can see all reports
            $laporan_kegiatan = LaporanKegiatan::latest()->get();
        } else {
            // Bidang only sees their own uploads
            $laporan_kegiatan = LaporanKegiatan::where('bidangs_id', $user->id)->latest()->get();
        }

        return Inertia::render('laporan-kegiatan/index', compact('laporan_kegiatan'));
    }

    public function create()
    {
        return Inertia::render("laporan-kegiatan/create", []);
    }

    public function store(Request $request)
    {
        $request->validate([
            'judul' => 'required|string|max:255',
            'penyelenggara' => 'required|string|max:255',
            'lokasi' => 'required|string|max:255',
            'deskripsi' => 'required|string|max:255',

            // support both image and document uploads
            'file' => 'nullable|mimes:jpg,jpeg,png,gif,svg,webp,bmp,tiff,pdf,doc,docx,xls,xlsx,ppt,pptx|max:30000',
        ]);

        $mediaId = null;
        $dokumenId = null;
        $path = null;

        if ($request->hasFile('file')) {
            $file = $request->file('file');
            $extension = strtolower($file->getClientOriginalExtension());

            // store file
            $path = $file->store('laporan-kegiatan', 'public');

            // if it's an image → store in media
            if (in_array($extension, ['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp', 'bmp', 'tiff'])) {
                $media = Media::create(['file' => $path]);
                $mediaId = $media->id;
            } 
            // if it's a document → store in dokumen
            else {
                $dokumen = Dokumen::create(['dokumen' => $path]);
                $dokumenId = $dokumen->id;
            }
        }

        // create laporan kegiatan record
        LaporanKegiatan::create([
            'judul' => $request->judul,
            'deskripsi' => $request->deskripsi,
            'penyelenggara' => $request->penyelenggara,
            'lokasi' => $request->lokasi,
            'file' => $path,
            'bidangs_id'  => Auth::id(),
            'medias_id'   => $mediaId,
            'dokumens_id' => $dokumenId,
        ]);

        return redirect()->route('laporan-kegiatan.index')->with('message', 'Laporan kegiatan berhasil ditambahkan');
    }

    public function edit(LaporanKegiatan $laporanKegiatan)
    {
        return Inertia::render("laporan-kegiatan/edit", compact('laporanKegiatan'));
    }

    public function update(Request $request, LaporanKegiatan $laporanKegiatan)
    {
        $request->validate([
            'judul' => 'sometimes|required|string|max:255',
            'penyelenggara' => 'sometimes|required|string|max:255',
            'lokasi' => 'sometimes|required|string|max:255',
            'deskripsi' => 'sometimes|required|string|max:255',
            'file' => 'nullable|mimes:jpg,jpeg,png,gif,svg,webp,bmp,tiff,pdf,doc,docx,xls,xlsx,ppt,pptx|max:30000',
        ]);

        $updateData = [
            'judul' => $request->input('judul', $laporanKegiatan->judul),
            'penyelenggara' => $request->input('penyelenggara', $laporanKegiatan->penyelenggara),
            'lokasi' => $request->input('lokasi', $laporanKegiatan->lokasi),
            'deskripsi' => $request->input('deskripsi', $laporanKegiatan->deskripsi),
        ];

        if ($request->hasFile('file')) {
            // delete old file
            if ($laporanKegiatan->file && Storage::disk('public')->exists($laporanKegiatan->file)) {
                Storage::disk('public')->delete($laporanKegiatan->file);
            }

            $file = $request->file('file');
            $extension = strtolower($file->getClientOriginalExtension());
            $path = $file->store('laporan-kegiatan', 'public');
            $updateData['file'] = $path;

            // update media or dokumen based on file type
            if (in_array($extension, ['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp', 'bmp', 'tiff'])) {
                if ($laporanKegiatan->medias_id) {
                    $laporanKegiatan->media->update(['file' => $path]);
                } else {
                    $media = Media::create(['file' => $path]);
                    $updateData['medias_id'] = $media->id;
                }
            } else {
                if ($laporanKegiatan->dokumens_id) {
                    $laporanKegiatan->dokumen->update(['dokumen' => $path]);
                } else {
                    $dokumen = Dokumen::create(['dokumen' => $path]);
                    $updateData['dokumens_id'] = $dokumen->id;
                }
            }
        }

        $laporanKegiatan->update($updateData);

        return redirect()->route('laporan-kegiatan.index')->with('message', 'Laporan kegiatan berhasil diperbarui');
    }

    public function destroy(LaporanKegiatan $laporanKegiatan)
    {
        // delete file from storage
        if ($laporanKegiatan->file && Storage::disk('public')->exists($laporanKegiatan->file)) {
            Storage::disk('public')->delete($laporanKegiatan->file);
        }

        $laporanKegiatan->delete();
        return redirect()->route('laporan-kegiatan.index')->with('message', 'Laporan kegiatan berhasil dihapus');
    }
}
