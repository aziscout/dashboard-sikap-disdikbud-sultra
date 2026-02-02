<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Berkas;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class BerkasApiController extends Controller
{
    public function index()
    {
        $pegawai = auth('pegawai')->user();
        $admin   = auth('sanctum')->user();

        if ($pegawai) {
            $berkas = Berkas::where('pegawais_id', $pegawai->id)->with('pegawai')->get();

            return response()->json([
                'status' => 'success',
                'message' => 'Data berkas pegawai',
                'data' => $berkas,
            ]);
        }

        if ($admin && $admin->role === 'admin_sikap') {
            return response()->json([
                'status' => 'success',
                'data' => Berkas::with('pegawai')->latest()->get(),
            ]);
        }

        return response()->json(['message' => 'Unauthorized'], 403);
    }

    public function store(Request $request)
    {
        $request->validate([
            'sk_cpns' => 'nullable|file|mimes:pdf,doc,docx|max:5120',
            'sk_pns' => 'nullable|file|mimes:pdf,doc,docx|max:5120',
            'sk_pangkat_terakhir' => 'nullable|file|mimes:pdf,doc,docx|max:5120',
            'sk_gaji_berkala' => 'nullable|file|mimes:pdf,doc,docx|max:5120',
            'sk_jabatan' => 'nullable|file|mimes:pdf,doc,docx|max:5120',
        ]);

        $pegawai = auth('pegawai')->user();
        $admin = User::where('role', 'admin_sikap')->first();

        $berkas = Berkas::create([
            'sk_cpns' => $request->hasFile('sk_cpns')
                ? $request->file('sk_cpns')->store('berkas', 'public')
                : null,

            'sk_pns' => $request->hasFile('sk_pns')
                ? $request->file('sk_pns')->store('berkas', 'public')
                : null,

            'sk_pangkat_terakhir' => $request->hasFile('sk_pangkat_terakhir')
                ? [$request->file('sk_pangkat_terakhir')->store('berkas', 'public')]
                : [],

            'sk_gaji_berkala' => $request->hasFile('sk_gaji_berkala')
                ? [$request->file('sk_gaji_berkala')->store('berkas', 'public')]
                : [],

            'sk_jabatan' => $request->hasFile('sk_jabatan')
                ? [$request->file('sk_jabatan')->store('berkas', 'public')]
                : [],

            'status' => false,
            'users_id' => $admin?->id,
            'pegawais_id' => $pegawai->id,
        ]);

        return response()->json([
            'status' => 'success',
            'data' => $berkas,
        ], 201);
    }



    public function update(Request $request, $id)
    {
        $berkas = Berkas::findOrFail($id);
        $pegawai = auth('pegawai')->user();
        $admin = auth('sanctum')->user();

        // =====================
        // AKSES
        // =====================
        if ($pegawai && $berkas->pegawais_id !== $pegawai->id) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        if (!$pegawai && (!$admin || $admin->role !== 'admin_sikap')) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        if ($pegawai) {

            foreach (['sk_cpns', 'sk_pns'] as $field) {
                if ($request->hasFile($field)) {

                    if ($berkas->$field) {
                        Storage::disk('public')->delete($berkas->$field);
                    }

                    $berkas->$field = $request->file($field)
                        ->store('berkas', 'public');
                }
            }

            foreach (['sk_pangkat_terakhir', 'sk_gaji_berkala', 'sk_jabatan'] as $field) {
                if ($request->hasFile($field)) {
                    $files = $berkas->$field ?? [];
                    $files[] = $request->file($field)->store('berkas', 'public');
                    $berkas->$field = $files;
                }
            }
        }

        if ($admin && $admin->role === 'admin_sikap') {

            if ($request->hasFile('file_sk')) {
                $files = $berkas->file_sk ?? [];
                $files[] = $request->file('file_sk')->store('berkas', 'public');
                $berkas->file_sk = $files;
            }

            if ($request->filled('status')) {
                $request->validate([
                    'status' => 'required|boolean',
                ]);

                // Prevent changing status from true to false
                if ($berkas->status === true && $request->status === false) {
                    return response()->json(['message' => 'Status tidak dapat diubah dari true ke false'], 422);
                }

                $berkas->status = $request->status;
            }
        }

        $berkas->save();

        return response()->json([
            'status' => 'success',
            'data' => $berkas->fresh(),
        ]);
    }


    public function destroy($id)
    {
        $berkas = Berkas::findOrFail($id);
        $pegawai = auth('pegawai')->user();
        $admin = auth('sanctum')->user();

        if ($pegawai && $berkas->pegawais_id !== $pegawai->id) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        // string
        foreach (['sk_cpns','sk_pns'] as $field) {
            if ($berkas->$field) {
                Storage::disk('public')->delete($berkas->$field);
            }
        }

        // json
        foreach (['sk_pangkat_terakhir','sk_gaji_berkala','sk_jabatan','file_sk'] as $field) {
            foreach ($berkas->$field ?? [] as $file) {
                Storage::disk('public')->delete($file);
            }
        }

        $berkas->delete();

        return response()->json(['status' => 'success']);
    }


    public function show($id)
    {
        $berkas = Berkas::with('pegawai')->findOrFail($id);
        $pegawai = auth('pegawai')->user();
        $admin = auth('sanctum')->user();

        if ($pegawai && $berkas->pegawais_id !== $pegawai->id) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        if (!$pegawai && (!$admin || $admin->role !== 'admin_sikap')) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $files = [];
        foreach (['sk_cpns','sk_pns','sk_pangkat_terakhir','sk_gaji_berkala','sk_jabatan','file_sk'] as $field) {
            $files[$field] = collect($berkas->$field ?? [])
                ->map(fn ($f) => asset('storage/' . $f));
        }

        return response()->json([
            'status' => 'success',
            'data' => [
                'pegawai' => $berkas->pegawai?->nama,
                'status' => $berkas->status,
                'files' => $files,
            ],
        ]);
    }
}
