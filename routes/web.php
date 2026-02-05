<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\QuestionController;
use App\Http\Controllers\AskController;
use App\Http\Controllers\Admin\QuestionController as AdminQuestionController;
use App\Http\Controllers\Admin\DashboardController;

// Admin routes (no locale prefix needed) - must come before localized routes
// DB-backed data in NativePHP is fetched via remote JSON APIs.
Route::middleware(['auth', 'verified'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    Route::post('/asks/bulk-delete', [AskController::class, 'bulkDelete'])->name('asks.bulk-delete');

    Route::resource('questions', AdminQuestionController::class);
    Route::resource('ask', AskController::class);
    Route::patch('/questions/{question}/approve', [AdminQuestionController::class, 'approve'])->name('questions.approve');
    Route::patch('/questions/{question}/reject', [AdminQuestionController::class, 'reject'])->name('questions.reject');

    Route::resource('bible-books', \App\Http\Controllers\Admin\BibleBooksController::class);
    Route::resource('topics', \App\Http\Controllers\Admin\TopicsController::class);

    //users
    Route::middleware(['auth', 'admin'])->resource('users', \App\Http\Controllers\UsersController::class);
});

// Localized routes (public routes only)
Route::prefix('{locale}')->where(['locale' => 'ar|en'])->group(function () {
    // Public routes
    Route::get('/', function () {
        return Inertia::render('Home');
    })->name('home');

    Route::get('/questions', [QuestionController::class, 'index'])->name('questions.index');
    Route::post('/questions', [QuestionController::class, 'store'])->name('questions.store');
    Route::get('/questions/{question}', [QuestionController::class, 'show'])->name('questions.show');
    Route::get('/questions/create', [QuestionController::class, 'create'])->name('questions.create');

    Route::get('/ask/create', [AskController::class, 'create'])->name('ask.create');
    Route::post('/ask', [AskController::class, 'store'])->middleware('throttle:1,1')->name('ask.store');
});

// Default locale route (redirects to Arabic)
Route::get('/', function () {
    return redirect('/ar');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
