<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Panduan;
use Illuminate\Http\Request;

class PanduanApiController extends Controller
{
    public function index()
    {
        $panduans = Panduan::all();
        return response()->json([
            'status' => 'success',
            'data' => $panduans,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'video_panduan' => 'required|string',
            'dokumen_panduan' => 'required|string',
        ]);
        
        $panduan = Panduan::create($validated);
        return response()->json([
            'status' => 'success',
            'data' => $panduan,
        ]);
    }
}
