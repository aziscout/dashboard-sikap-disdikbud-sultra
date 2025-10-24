<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Bidang;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class BidangApiController extends Controller
{
    public function index()
    {
        $bidang = User::where('role','bidang')->get();
        return response()->json($bidang);
    }

    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        $bidang = User::where('email', $request->email)->where('role','bidang')->first();

        if (! $bidang || ! Hash::check($request->password, $bidang->password)) {
            return response()->json(['message' => 'Email atau password salah'], 401);
        }

        $bidang->tokens()->delete();

        $token = $bidang->createToken('bidang_token')->plainTextToken;

        return response()->json([
            'message' => 'Login berhasil',
            'bidang' => $bidang,
            'token' => $token,
        ]);
    }
}
