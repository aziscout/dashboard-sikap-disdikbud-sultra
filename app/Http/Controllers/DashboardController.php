<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use App\Models\Media;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $media = Media::latest()->first(); // ambil record terakhir
        $files = $media ? $media->file : [];

        // pisahkan logo & hero
        $logo = collect($files)->firstWhere('type', 'logo');
        $heroes = collect($files)->where('type', 'hero')->values();

        return Inertia::render('dashboard/index', [
            'logo' => $logo,
            'heroes' => $heroes,
        ]);
    }


    public function create()
    {
        return Inertia::render("dashboard/create");
    }

    public function store(Request $request)
    {
        $request->validate([
            'logo' => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
            'hero.*' => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
        ]);

        $files = [];

        if ($request->hasFile('logo')) {
            $logoPath = $request->file('logo')->store('dashboard/logo', 'public');
            $files[] = [
                'file' => $logoPath, 
                'type' => 'logo'
            ];
        }

        if ($request->hasFile('hero')) {
            foreach ($request->file('hero') as $index => $file) {
                if ($index >= 3) break;
                $heroPath = $file->store('dashboard/hero', 'public');
                $files[] = [
                    'file' => $heroPath,
                    'type' => 'hero'
                ];
            }
        }

        Media::create([
            'file' => $files
        ]);

        return redirect()
            ->route('dashboard.index')
            ->with('success', 'Logo & Hero berhasil disimpan!');
    }

    public function edit()
    {
        $media = Media::latest()->first();
        $files = $media ? $media->file : [];

        $logo = collect($files)->firstWhere('type', 'logo');
        $heroes = collect($files)->where('type', 'hero')->values();

        return Inertia::render('dashboard/edit', [
            'logo' => $logo,
            'heroes' => $heroes,
        ]);
    }

    public function update(Request $request)
    {
        $request->validate([
            'logo' => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
            'hero' => 'nullable|array|max:3',
            'hero.*' => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
            '_existing_logo' => 'nullable|string',
            '_existing_heroes' => 'nullable|array',
        ]);

        $media = Media::latest()->first();
        if (!$media) {
            return redirect()->route('dashboard.index')->with('error', 'Tidak ada data media untuk diperbarui.');
        }

        $existingFiles = $media->file ?? [];
        $oldLogo = collect($existingFiles)->firstWhere('type', 'logo');
        $oldHeroes = collect($existingFiles)->where('type', 'hero')->values()->all();

        $newFiles = [];

        // ===== LOGO =====
        if ($request->hasFile('logo')) {
            if ($oldLogo && Storage::disk('public')->exists($oldLogo['file'])) {
                Storage::disk('public')->delete($oldLogo['file']);
            }
            $logoPath = $request->file('logo')->store('dashboard/logo', 'public');
            $newFiles[] = ['file' => $logoPath, 'type' => 'logo'];
        } elseif ($request->filled('_existing_logo')) {
            $newFiles[] = ['file' => $request->_existing_logo, 'type' => 'logo'];
        } elseif ($oldLogo) {
            $newFiles[] = ['file' => $oldLogo['file'], 'type' => 'logo'];
        }

        // ===== HERO =====
        if ($request->hasFile('hero')) {
            foreach ($oldHeroes as $hero) {
                if (isset($hero['file']) && Storage::disk('public')->exists($hero['file'])) {
                    Storage::disk('public')->delete($hero['file']);
                }
            }
            foreach ($request->file('hero') as $index => $file) {
                if ($index >= 3) break;
                $heroPath = $file->store('dashboard/hero', 'public');
                $newFiles[] = ['file' => $heroPath, 'type' => 'hero'];
            }
        } elseif ($request->filled('_existing_heroes')) {
            foreach ($request->_existing_heroes as $path) {
                $newFiles[] = ['file' => $path, 'type' => 'hero'];
            }
        } else {
            foreach ($oldHeroes as $hero) {
                $newFiles[] = ['file' => $hero['file'], 'type' => 'hero'];
            }
        }

        $media->update(['file' => $newFiles]);

        return redirect()->route('dashboard.index')->with('success', 'Logo & Hero berhasil diperbarui! 🚀');
    }
    
}
