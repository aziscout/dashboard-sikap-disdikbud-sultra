<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ProdukHukum;

class ProdukHukumApiController extends Controller
{
    public function index()
    {
        $produk_hukum = ProdukHukum::with('dokumens')->get();
        return response()->json($produk_hukum);
    }
}
