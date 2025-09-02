<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;


class UsersController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->get('search');

        $users = User::query()
            ->when($search, fn($query) =>
                $query->where('name', 'like', "%{$search}%")
            )
            ->paginate();

        return Inertia::render('Users/Index', [
            'users' => $users,
            'filters' => $request->only('search'),
        ]);
    }

    public function create()
    {
        return Inertia::render('Users/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
        ]);

        User::create($validated);

        return redirect()->route('admin.users.index');
    }

    public function edit(User $user)
    {
        return Inertia::render('Users/Edit', [
            'user' => $user,
        ]);
    }


    public function update(Request $request, User $user)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,' . $user->id,
            'password' => 'nullable|string|min:8|confirmed',
            'status' => 'required|boolean',
            'role' => 'required|string|in:admin,user',
        ]);

        if (!empty($validated['password'])) {
            $validated['password'] = bcrypt($validated['password']);
        } else {
            unset($validated['password']);
        }

        $validated['status'] = $request->boolean('status');

        $user->update($validated);
        // مسح كل الجلسات الخاصة بالمستخدم
        DB::table('sessions')->where('user_id', $user->id)->delete();
        if (auth()->id() === $user->id) {
            Auth::logout();
            session()->invalidate();
            session()->regenerateToken();
        }

        return redirect()->route('admin.users.index')
            ->with('success', 'User updated and sessions invalidated.');
    }



    public function destroy(User $user)
    {
        $user->delete();

        return redirect()->route('admin.users.index');
    }
}
