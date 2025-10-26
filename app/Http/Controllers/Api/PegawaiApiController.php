<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Pegawai;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class PegawaiApiController extends Controller
{
    public function index()
    {
        $pegawaiAuth = auth('pegawai')->user() ?? auth('api')->user();

        if (!$pegawaiAuth) {
            return response()->json([
                'status' => 'error',
                'message' => 'Token tidak valid atau belum login.',
            ], 401);
        }

        if (isset($pegawaiAuth->role) && $pegawaiAuth->role === 'admin') {
            $pegawais = Pegawai::all();

            return response()->json([
                'status' => 'success',
                'message' => 'Data seluruh pegawai berhasil diambil (oleh admin).',
                'data' => $pegawais,
            ], 200);
        }

        if ($pegawaiAuth instanceof Pegawai) {
            return response()->json([
                'status' => 'success',
                'message' => 'Data pegawai berhasil diambil.',
                'data' => $pegawaiAuth,
            ], 200);
        }

        return response()->json([
            'status' => 'error',
            'message' => 'Akses ditolak.',
        ], 403);
    }


    public function register(Request $request)
    {
        $validated = $request->validate([
            'nama' => 'required|string|max:255',
            'email' => 'required|string|email|unique:pegawais,email',
            'password' => 'required|string|min:8|confirmed',
            'nip' => 'required|integer|unique:pegawais',
            'nomor' => 'required|integer|unique:pegawais',
            'agama' => 'required|in:islam,kristen protestan,katolik,buddha,hindu,konghucu',
            'jenis_kelamin' => 'required|in:laki-laki,perempuan',
            'alamat' => 'required|string|max:255',
            'tanggal_lahir' => 'required|date',
            'tempat_lahir' => 'required|string|max:255',
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

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Logout berhasil!.',
        ]);
    }


}
