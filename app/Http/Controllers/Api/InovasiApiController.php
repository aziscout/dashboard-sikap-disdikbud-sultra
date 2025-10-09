<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Inovasi;

class InovasiApiController extends Controller
{
    public function index(){

        $inovasi = Inovasi::with("medias")->get();
        return response()->json($inovasi);
    }

}
