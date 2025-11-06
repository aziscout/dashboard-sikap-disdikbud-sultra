<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Ppid;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Exception;

class PpidApiController extends Controller
{
    public function index(Request $request)
    {
        try {
            // Ambil semua PPID dengan relasi dokumens
            $ppid_data = Ppid::with('dokumens')->latest()->get();

            // Format data agar dokumen bisa diakses dari frontend
            $ppid_data->transform(function ($item) {
                $item->dokumen_path = $item->dokumens->dokumen ?? null;
                $item->dokumen_url = $item->dokumens && $item->dokumens->dokumen
                    ? asset('storage/' . $item->dokumens->dokumen)
                    : null;
                unset($item->dokumens); // optional: supaya JSON lebih rapi
                return $item;
            });

            return response()->json([
                'status' => 'success',
                'total_data' => $ppid_data->count(),
                'data' => $ppid_data,
            ], 200);
        } catch (Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Gagal mengambil data PPID: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function show($id)
    {
        try {
            $ppid = Ppid::with('dokumens')->findOrFail($id);

            $ppid->dokumen_path = $ppid->dokumens->dokumen ?? null;
            $ppid->dokumen_url = $ppid->dokumens && $ppid->dokumens->dokumen
                ? asset('storage/' . $ppid->dokumens->dokumen)
                : null;

            unset($ppid->dokumens);

            return response()->json([
                'status' => 'success',
                'data' => $ppid,
            ], 200);
        } catch (Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Data PPID tidak ditemukan: ' . $e->getMessage(),
            ], 404);
        }
    }
}
