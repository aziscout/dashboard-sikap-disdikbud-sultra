<?php
namespace App\Http\Middleware;

use Closure;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class CheckPermission
{
    public function handle($request, Closure $next, $feature)
    {
        $user = Auth::user();


        // dump($user);
        
        $hasPermission = DB::table('permissions')
            ->where('role', $user->role)
            ->where('feature', $feature)
            ->exists();

        if (!$hasPermission) {
            abort(403, 'Unauthorized.');
        }

        return $next($request);
    }
}
