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
            'email' => 'nullable|string|email|unique:pegawais,email',
            'password' => 'required|string|min:8|confirmed',
            'nip' => 'required|integer|unique:pegawais,nip',
            'nomor' => 'nullable|integer|unique:pegawais,nomor',
            'agama' => 'nullable|in:islam,kristen protestan,katolik,buddha,hindu,konghucu',
            'jenis_kelamin' => 'nullable|in:laki-laki,perempuan',
            'alamat' => 'nullable|string|max:255',
            'tanggal_lahir' => 'nullable|date',
            'tempat_lahir' => 'nullable|string|max:255',
            'unit_kerja' => 'nullable|string|max:255',
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
            'nip' => 'required',
            'password' => 'required',
        ]);

        $pegawai = Pegawai::where('nip', $request->nip)->first();

        if (! $pegawai || ! Hash::check($request->password, $pegawai->password)) {
            return response()->json(['message' => 'NIP atau password salah'], 401);
        }

        $pegawai->tokens()->delete();

        $token = $pegawai->createToken('pegawai_token')->plainTextToken;

        return response()->json([
            'message' => 'Login berhasil',
            // 'pegawai' => $pegawai,
            'token' => $token,
        ]);
    }

    public function getProfile(Request $request)
    {
        $pegawai = $request->user();

        return response()->json([
            'status' => 'success',
            'message' => 'Profil pegawai berhasil diambil.',
            'data' => $pegawai,
        ], 200);
    }

    public function updateProfile(Request $request)
    {
        $pegawai = $request->user();

        $validated = $request->validate([
            'nama' => 'nullable|string|max:255,' . $pegawai->id,
            'email' => 'nullable|email|unique:pegawais,email,' . $pegawai->id,
            'password' => 'nullable|string|min:8|confirmed',
            'nomor' => 'nullable|unique:pegawais,nomor,' . $pegawai->id,
            'agama' => 'nullable|in:islam,kristen protestan,katolik,buddha,hindu,konghucu',
            'jenis_kelamin' => 'nullable|in:laki-laki,perempuan',
            'alamat' => 'nullable|string|max:255',
            'tanggal_lahir' => 'nullable|date',
            'tempat_lahir' => 'nullable|string|max:255',
            'unit_kerja' => 'nullable|string|max:255',
        ]);

        if (!empty($validated['password'])) {
            $validated['password'] = Hash::make($validated['password']);
        } else {
            unset($validated['password']);
        }

        $pegawai->update($validated);

        return response()->json([
            'status' => 'success',
            'message' => 'Profil pegawai berhasil diperbarui.',
            'data' => $pegawai->fresh(),
        ], 200);
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