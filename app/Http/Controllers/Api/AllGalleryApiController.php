<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Agenda;
use App\Models\Berita;
use App\Models\Inovasi;
use App\Models\Pengumuman;

class AllGalleryApiController extends Controller{
    public function index(){
        $berita = Berita::with('medias')->get();
        $inovasi = Inovasi::with('medias')->get();
        $agenda = Agenda::with('medias')->get();
        $pengumuman = Pengumuman::with('medias')->get();


        return response()->json([
            'berita'=> $berita,
            'inovasi' => $inovasi,
            'agenda' => $agenda,
            'pengumuman' => $pengumuman,

        ]);
    }
}