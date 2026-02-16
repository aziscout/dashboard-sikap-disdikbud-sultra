<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class PensiunController extends Controller
{
    public function index()
    {
        return Inertia::render('pangkat/pensiun/index',[]);
    }
}
