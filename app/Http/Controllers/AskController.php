<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Ask;
use App\Models\BibleBook;
use App\Models\Topic;
use Inertia\Inertia;
use Inertia\Response;


class AskController extends Controller
{
    public function index(Request $request): Response
    {
        $search = $request->get('search');
        $topicId = $request->get('topic_id');

        if (isNativeApp()) {
            return Inertia::render('asks/Index', [
                'questions' => $this->emptyPagination(),
                'bibleBooks' => [],
                'topics' => [],
                'filters' => [
                    'search' => $search,
                    'topic_id' => $topicId,
                ],
            ]);
        }

        $questions = Ask::query()
            ->with(['topic'])
            ->when($search, fn($query) => $query->search($search))
            ->when($topicId, fn($query) => $query->byTopic($topicId))
            ->latest()
            ->paginate(12)
            ->withQueryString();

        $bibleBooks = BibleBook::orderBy('order')->get();
        $topics = Topic::orderBy('name_' . app()->getLocale())->get();

        return Inertia::render('asks/Index', [
            'questions' => $questions,
            'bibleBooks' => $bibleBooks,
            'topics' => $topics,
            'filters' => [
                'search' => $search,
                'topic_id' => $topicId,
            ],
        ]);

    }

     public function show($questionId): Response
    {
        if (isNativeApp()) {
            return Inertia::render('asks/Show', [
                'question' => null,
                'questionId' => (int) $questionId,
            ]);
        }

        $question = Ask::with(['topic'])->findOrFail($questionId);

        return Inertia::render('asks/Show', [
            'question' => $question,
        ]);
    }

      public function create(): Response
    {
        if (isNativeApp()) {
            return Inertia::render('Questions/Create', [
                'topics' => [],
            ]);
        }

        $topics = Topic::orderBy('name_' . app()->getLocale())->get();

        return Inertia::render('Questions/Create', [
            'topics' => $topics,
        ]);
    }
    public function store(Request $request)
    {
        if (isNativeApp()) {
            abort(409, 'Use the Native API endpoint to submit questions.');
        }

        $validated = $request->validate([
            'question' => 'required|string|max:2000',
            'email' => 'nullable|email|max:255',
            'topic_id' => 'nullable|exists:topics,id',
        ]);

        Ask::create($validated);

        return redirect()->back()
            ->with('success', app()->getLocale() === 'ar'
                ? 'تم إرسال سؤالك بنجاح. سنقوم بمراجعته والرد عليه قريباً.'
                : 'Your question has been submitted successfully. We will review and answer it soon.');
    }
    public function destroy(Ask $ask)
    {
        if (isNativeApp()) {
            abort(409, 'Native mode does not support local mutations.');
        }

        $ask->delete();

        return redirect()->route('admin.ask.index')
            ->with('success', 'Question deleted successfully');
    }
    public function bulkDelete(Request $request)
    {
        if (isNativeApp()) {
            abort(409, 'Native mode does not support local mutations.');
        }

        // Validate the request to ensure 'ids' is an array of valid question IDs
        $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'exists:asks,id', // Make sure this table name is correct, it might be 'questions'
        ]);

        // Delete all questions with the provided IDs
        Ask::whereIn('id', $request->ids)->delete();

        // Redirect back to the index page with a success message
        return redirect()->route('admin.ask.index')
            ->with('success', 'Selected questions have been deleted successfully.');
    }

    private function emptyPagination(): array
    {
        return [
            'data' => [],
            'current_page' => 1,
            'last_page' => 1,
            'per_page' => 12,
            'total' => 0,
            'links' => [],
        ];
    }

}
