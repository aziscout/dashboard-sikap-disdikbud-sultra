<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\LaporanKegiatan;

class LaporanKegiatanApiController extends Controller
{
     public function index(){

        $laporanKegiatan = LaporanKegiatan::with("medias")->get();
        return response()->json($laporanKegiatan);
    }
}
