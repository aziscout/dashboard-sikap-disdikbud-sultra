<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Agenda;

class AgendaApiController extends Controller
{
    public function index(){
        $agenda = Agenda::with("medias")->get();
        return response()->json($agenda);
    }
    public function show($id)
    {
        $berita = Agenda::with('medias')->find($id);
        if (!$berita) {
            return response()->json(['message' => 'Berita not found'], 404);
        }
        return response()->json($berita);
    }
}
