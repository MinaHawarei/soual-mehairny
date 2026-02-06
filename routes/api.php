<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\Native\AuthController;
use App\Http\Controllers\Api\Native\QuestionController;
use App\Http\Controllers\Api\Native\AskController;

Route::prefix('native')->group(function () {
    Route::post('/auth/login', [AuthController::class, 'login']);
    Route::post('/auth/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');
    Route::get('/auth/me', [AuthController::class, 'me'])->middleware('auth:sanctum');

    Route::get('/questions', [QuestionController::class, 'index']);
    Route::get('/questions/filters', [QuestionController::class, 'filters']);
    Route::get('/questions/{question}', [QuestionController::class, 'show']);
    Route::post('/ask', [AskController::class, 'store']);
});

Route::get('/__probe', function () {
    return response()
        ->json(['ok' => true])
        ->header('X-From', 'laravel');
});


Route::get('/__headers', function () {
    return response()->json([
        'seen_origin' => request()->header('origin'),
        'app_url' => config('app.url'),
        'allowed_origins' => config('cors.allowed_origins'),
        'env_native' => env('NATIVE_APP_ALLOWED_ORIGINS'),
    ]);
});
