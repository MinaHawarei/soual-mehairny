<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Question;
use App\Models\Ask;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(): Response
    {
        $stats = [
            'total_questions' => Question::count(),
            'pending_questions' => Ask::count(),
            'approved_questions' => Question::where('status', 'approved')->count(),
            'rejected_questions' => Question::where('status', 'disable')->count(),
        ];

        return Inertia::render('Admin/Dashboard', [
            'stats' => $stats,
        ]);
    }
}
