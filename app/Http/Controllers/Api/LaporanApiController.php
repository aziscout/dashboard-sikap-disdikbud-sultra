<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\laporan;

class LaporanApiController extends Controller
{
    public function index(){

        $laporan = Laporan::with("medias")->get();
        return response()->json($laporan);
    }
}
