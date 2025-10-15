<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Berita;

class BeritaApiController extends Controller
{
    public function index(){

        $berita = Berita::with("medias")->get();
        return response()->json($berita);
    }
     public function show($id)
    {
        $berita = Berita::with('medias')->find($id);
        if (!$berita) {
            return response()->json(['message' => 'Berita not found'], 404);
        }
        return response()->json($berita);
    }
}
