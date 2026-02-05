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
