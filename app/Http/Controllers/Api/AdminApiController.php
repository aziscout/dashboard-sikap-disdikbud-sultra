<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;

class AdminApiController extends Controller
{
    public function index() {
        $admin = User::where('role','admin')->get();
        return response()->json($admin);
    }
}
