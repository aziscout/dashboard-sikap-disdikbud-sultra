<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Pegawai;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class PegawaiApiController extends Controller
{
    public function register(Request $request)
    {
        $validated = $request->validate([
            'nama' => 'required|string|max:255',
            'email' => 'required|string|email|unique:pegawais,email',
            'password' => 'required|string|min:8|confirmed',
            'nip' => 'required|integer',
            'nomor' => 'required|integer',
            'agama' => 'required|in:islam,kristen protestan, katolik,buddha, hindu, konghucu',
            'jenis_kelamin' => 'required|in:laki-laki,perempuan',
            'alamat' => 'required|string|max:255',
            'tempat_lahir' => 'required|date',
            'notifikasis_id' => 'nullable|integer',
        ]);

        $pegawai = Pegawai::create($validated);

        $token = $pegawai->createToken('pegawai_token')->plainTextToken;

        return response()->json([
            'status' => 'success',
            'message' => 'Registrasi pegawai berhasil!',
            'data' => $pegawai,
            'token' => $token,
        ], 201);
    }

    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        $pegawai = Pegawai::where('email', $request->email)->first();

        if (! $pegawai || ! Hash::check($request->password, $pegawai->password)) {
            return response()->json(['message' => 'Email atau password salah'], 401);
        }

        $pegawai->tokens()->delete();

        $token = $pegawai->createToken('pegawai_token')->plainTextToken;

        return response()->json([
            'message' => 'Login berhasil',
            'pegawai' => $pegawai,
            'token' => $token,
        ]);
    }
}
