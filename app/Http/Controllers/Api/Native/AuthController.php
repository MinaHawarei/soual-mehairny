<?php

namespace App\Http\Controllers\Api\Native;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\Native\LoginRequest;
use App\Http\Resources\Native\UserResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;

class AuthController extends Controller
{
    public function login(LoginRequest $request): JsonResponse
    {
        $validated = $request->validated();

        $user = \App\Models\User::where('email', $validated['email'])->first();

        if (! $user || ! Hash::check($validated['password'], $user->password)) {
            Log::channel('stack')->warning('Native API login failed', [
                'email' => $validated['email'],
                'ip' => $request->ip(),
            ]);

            return response()->json([
                'message' => 'Invalid credentials.',
            ], 422);
        }

        $deviceName = $validated['device_name']
            ?? $request->userAgent()
            ?? 'native-client';

        $token = $user->createToken($deviceName)->plainTextToken;

        Log::channel('stack')->info('Native API login success', [
            'user_id' => $user->id,
            'ip' => $request->ip(),
        ]);

        return response()->json([
            'token' => $token,
            'user' => new UserResource($user),
        ]);
    }

    public function logout(): \Illuminate\Http\Response
    {
        $user = request()->user();

        if ($user && $user->currentAccessToken()) {
            $user->currentAccessToken()->delete();
        }

        return response()->noContent();
    }

    public function me(): JsonResponse
    {
        return response()->json([
            'user' => new UserResource(request()->user()),
        ]);
    }
}
