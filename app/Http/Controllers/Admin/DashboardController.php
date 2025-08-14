<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Question;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(): Response
    {
        $stats = [
            'total_questions' => Question::count(),
            'pending_questions' => Question::where('status', 'pending')->count(),
            'approved_questions' => Question::where('status', 'approved')->count(),
            'rejected_questions' => Question::where('status', 'rejected')->count(),
        ];

        return Inertia::render('Admin/Dashboard', [
            'stats' => $stats,
        ]);
    }
}
