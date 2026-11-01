<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Mail\SendOtpMail;
use App\Models\Pegawai;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class ForgotPasswordApiController extends Controller
{
    public function sendResetLink(Request $request)
    {
        $request->validate([
            'email' => 'required|email|exists:pegawais,email'
        ]);

        $pegawai = Pegawai::where('email', $request->email)->first();

        $token = Str::random(64);

        DB::table('password_reset_tokens')->updateOrInsert(
            ['email' => $pegawai->email],
            [
                'token' => Hash::make($token),
                'created_at' => now()
            ]
        );

        $frontendUrl = rtrim(config('services.frontend_url'), '/');
        $resetUrl = "{$frontendUrl}/reset-password?token={$token}&email=" . urlencode($pegawai->email);

        try {
            Mail::to($pegawai->email)->send(new SendOtpMail($resetUrl)); 
        } catch (\Exception $e) {
            Log::error('Email gagal dikirim: ' . $e->getMessage());
            return response()->json(['message' => 'Gagal mengirim email.'], 500);
        }

        return response()->json([
            'status' => 'success',
            'message' => 'Link reset password telah dikirim ke email Anda.'
        ]);
    }

    public function resetPassword(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email|exists:pegawais,email',
            'token' => 'required|string',
            'password' => 'required|confirmed|min:8',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $tokenData = DB::table('password_reset_tokens')
            ->where('email', $request->email)
            ->first();

        if (!$tokenData || !Hash::check($request->token, $tokenData->token)) {
            return response()->json(['message' => 'Link reset tidak valid atau sudah kadaluarsa.'], 400);
        }

        if (now()->diffInMinutes($tokenData->created_at) > 60) {
            DB::table('password_reset_tokens')->where('email', $request->email)->delete();
            return response()->json(['message' => 'Link reset sudah kedaluwarsa.'], 400);
        }

        $pegawai = Pegawai::where('email', $request->email)->first();
        $pegawai->password = Hash::make($request->password);
        $pegawai->save();

        DB::table('password_reset_tokens')->where('email', $request->email)->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Password berhasil diubah. Silakan login kembali.'
        ]);
    }

    // --- KONSEP 2: SESUDAH LOGIN (Ubah Password) ---
    // Cukup tambahkan password lama dan password baru dengan konfirmasi
    public function updatePassword(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'password' => 'required|confirmed|min:8', // Hapus 'current_password' dari sini
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // Mendapatkan user yang sedang login
        $user = Auth::user();

        // Pastikan $user adalah instance dari model Pegawai
        if (!$user instanceof Pegawai) {
            return response()->json(['message' => 'Unauthorized or invalid user type.'], 401);
        }

        // 2. HAPUS ATAU KOMENTARI blok pengecekan password lama ini
        // if (!Hash::check($request->current_password, $user->password)) {
        //     return response()->json(['message' => 'Password lama salah.'], 400);
        // }

        // Update Password
        $user->password = Hash::make($request->password);
        $user->save();

        return response()->json([
            'status' => 'success',
            'message' => 'Kata sandi berhasil diperbarui.'
        ]);
    }
}
