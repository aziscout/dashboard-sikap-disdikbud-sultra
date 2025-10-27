<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class RiwayatController extends Controller
{
    public function index()
    {
        return Inertia::render('pangkat/riwayat/index',[]);
    }
}
