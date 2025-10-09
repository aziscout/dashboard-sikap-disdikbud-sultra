<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Pengumuman;

class PengumumanApiController extends Controller
{
    public function index(){

        $pengumuman = Pengumuman::with("medias")->get();
        return response()->json($pengumuman);
    }
}
