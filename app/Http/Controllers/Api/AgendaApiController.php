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
        $agenda = Agenda::with('medias')->find($id);
        if (!$agenda) {
            return response()->json(['message' => 'Agenda not found'], 404);
        }
        return response()->json($agenda);
    }
}
