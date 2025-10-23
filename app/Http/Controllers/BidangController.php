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
        $bidangs = User::where('role', 'bidang')->get();
        return Inertia::render('bidang/user/index', [
            'bidangs' => $bidangs
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

        return redirect()->route('user.index')->with('success', 'Bidang berhasil ditambahkan.');
    }
}
