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
}
