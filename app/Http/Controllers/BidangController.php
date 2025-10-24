<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class BidangController extends Controller
{
    public function index() 
    {
        return Inertia::render('bidang/user/index', [
            'bidang' => User::where('role', 'bidang')->get(),
        ]);

    }

    public function create() {
        return Inertia::render("bidang/user/create",[]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:6|confirmed',
        ]);

        User::create([
            'name' => $request->name,
            'email' => $request->email,
            'role' => 'bidang',
            'password' => Hash::make($request->password),
        ]);

        return redirect()->route('user.index')->with('message', 'Bidang berhasil ditambahkan.');
    }

    public function edit($id) 
    {
        $bidang = User::findOrfail($id);
        return Inertia::render("bidang/user/edit", [
            'bidang' => $bidang
        ]);
    }

    public function update(Request $request, $id)
    {
        $bidang = User::findOrFail($id);

        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255|unique:users,email,'.$bidang->id,
            'password' => 'nullable|string|min:6|confirmed',
        ]);

        $data = [
            'name' => $request->name,
            'email' => $request->email,
        ];

        if ($request->filled('password')) {
            $data['password'] = Hash::make($request->password);
        }

        $bidang->update($data);

        return redirect()->route('user.index')->with('message', 'Data bidang berhasil diperbarui.');
    }

    public function destroy(User $user)
    {
        $user->delete();
        return redirect()->route('user.index')->with('message',' Bidang berhasil dihapus.');
    }
}
