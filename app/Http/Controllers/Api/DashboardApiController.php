<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Media;
use Illuminate\Support\Facades\Storage;

class DashboardApiController extends Controller
{
    public function index(){
        $allMedia = Media::all()
            ->flatMap(fn($item) => $item->file)
            ->filter(fn($f) => in_array($f['type'], ['logo', 'hero']))
            ->map(function ($f) {
                $f['url'] = Storage::url($f['file']);
                return $f;
            })
            ->values();

        $logo = $allMedia->firstWhere('type', 'logo');
        $heroes = $allMedia->where('type', 'hero')->values();

        return response()->json([
            'logo' => $logo,
            'heroes' => $heroes
        ]);
    }
}
