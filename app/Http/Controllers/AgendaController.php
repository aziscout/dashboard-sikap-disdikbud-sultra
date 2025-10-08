<?php

namespace App\Http\Controllers;

use App\Models\Agenda;
use App\Models\Media;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class AgendaController extends Controller
{
  public function index()
{
    $user = Auth::user();

    if ($user->role === 'admin') {
        // Admin can see all agendas
        $agenda = Agenda::latest()->get();
    } else {
        // Bidang can only see their own agendas
        $agenda = Agenda::where('bidangs_id', $user->id)->latest()->get();
    }

    return Inertia::render("agenda/index", compact("agenda"));
}


    public function create()
    {
        return Inertia::render("agenda/create", []);
    }

    public function store(Request $request)
    {
        $request->validate([
            'judul'        => 'required|string|max:255',
            'penyelenggara'=> 'required|string|max:255',
            'lokasi'       => 'required|string|max:255',
            'instansi'     => 'required|in:umum,sma,smk,slb',
            'deskripsi'    => 'required|string|max:1000',
            'coverImage'  => 'required|image|mimes:jpg,jpeg,png,gif,svg,webp,bmp,tiff|max:20480',
            'files.*'      => 'nullable|mimes:jpg,jpeg,png,mp4,mov,avi|max:50000',
            'video_urls'   => 'nullable|array',
            'video_urls.*' => 'url',
        ]);

        // cover image
        $coverPath = $request->file('coverImage')->store('agenda/cover', 'public');

        // kumpulkan file media
        $mediaFiles = [];

        if ($request->hasFile('files')) {
            foreach ($request->file('files') as $file) {
                $path = $file->store('agenda/file', 'public');
                $type = in_array($file->extension(), ['mp4','mov','avi']) ? 'video' : 'foto';
                $mediaFiles[] = ['file' => $path, 'type' => $type];
            }
        }

        if ($request->video_urls) {
            foreach ($request->video_urls as $url) {
                $mediaFiles[] = ['file' => $url, 'type' => 'video'];
            }
        }
        // simpan media
        $media = Media::create([
            'file' => $mediaFiles
        ]);

        // simpan agenda
        Agenda::create([
            'medias_id'    => $media->id,
            'judul'        => $request->judul,
            'penyelenggara'=> $request->penyelenggara,
            'lokasi'       => $request->lokasi,
            'instansi'     => $request->instansi,
            'deskripsi'    => $request->deskripsi,
            'coverImage'  => $coverPath,
            'tabel'        => 'agenda',
            'bidangs_id'    => Auth::id(),
        ]);

        return redirect()->route('agenda.index')
            ->with('message', 'Agenda berhasil ditambahkan');
    }

    public function edit($id)
    {
        $agenda = Agenda::with('medias')->findOrFail($id);
        return Inertia::render("agenda/edit", compact('agenda'));
    }

    public function update(Request $request, Agenda $agenda)
    {
        $request->validate([
            'judul'        => 'required|string|max:255',
            'penyelenggara'=> 'required|string|max:255',
            'lokasi'       => 'required|string|max:255',
            'instansi'     => 'required|in:umum,sma,smk,slb',
            'deskripsi'    => 'required|string|max:1000',
            'coverImage'  => 'nullable|image|mimes:jpg,jpeg,png|max:20048',
            'files.*'      => 'nullable|mimes:jpg,jpeg,png,mp4,mov,avi|max:50000',
            'video_urls'   => 'nullable|array',
            'video_urls.*' => 'url',
        ]);

        // update cover image
        if ($request->hasFile('coverImage')) {
            if ($agenda->cover_image && Storage::disk('public')->exists($agenda->cover_image)) {
                Storage::disk('public')->delete($agenda->cover_image);
            }
            $coverPath = $request->file('cover_image')->store('agenda/cover', 'public');
            $agenda->cover_image = $coverPath;
        }

        // update media
        $mediaFiles = [];

        if ($request->hasFile('files')) {
            foreach ($request->file('files') as $file) {
                $path = $file->store('agenda/file', 'public');
                $type = in_array($file->extension(), ['mp4','mov','avi']) ? 'video' : 'foto';
                $mediaFiles[] = ['file' => $path, 'type' => $type];
            }
        }

        if ($request->video_urls) {
            foreach ($request->video_urls as $url) {
                $mediaFiles[] = ['file' => $url, 'type' => 'video'];
            }
        }

        if ($agenda->medias) {
            $agenda->medias->update(['file' => $mediaFiles]);
        }

        $agenda->update([
            'judul'        => $request->judul,
            'penyelenggara'=> $request->penyelenggara,
            'lokasi'       => $request->lokasi,
            'instansi'     => $request->instansi,
            'deskripsi'    => $request->deskripsi,
        ]);

        return redirect()->route('agenda.index')
            ->with('message', 'Agenda berhasil diperbarui');
    }

    public function destroy($id)
    {
        $agenda = Agenda::with('medias')->findOrFail($id);

        // hapus cover
        if ($agenda->cover_image && Storage::disk('public')->exists($agenda->cover_image)) {
            Storage::disk('public')->delete($agenda->cover_image);
        }

        // hapus semua file media
        if ($agenda->medias && is_array($agenda->medias->file)) {
            foreach ($agenda->medias->file as $media) {
                if (isset($media['file']) && !preg_match('/^https?:\/\//', $media['file'])) {
                    if (Storage::disk('public')->exists($media['file'])) {
                        Storage::disk('public')->delete($media['file']);
                    }
                }
            }
            $agenda->medias->delete();
        }

        $agenda->delete();

        return redirect()->route('agenda.index')
            ->with('message', 'Agenda berhasil dihapus beserta media terkait');
    }
}
