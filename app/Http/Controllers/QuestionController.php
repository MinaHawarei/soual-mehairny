<?php

namespace App\Http\Controllers;

use App\Models\Question;
use App\Models\BibleBook;
use App\Models\Topic;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class QuestionController extends Controller
{
    public function index(Request $request): Response
    {
        $search = $request->get('search');
        $bibleBookId = $request->get('bible_book_id');
        $topicId = $request->get('topic_id');

        $questions = Question::query()
            ->approved()
            ->with(['bibleBook', 'topic'])
            ->when($search, fn($query) => $query->search($search))
            ->when($bibleBookId, fn($query) => $query->byBibleBook($bibleBookId))
            ->when($topicId, fn($query) => $query->byTopic($topicId))
            ->latest()
            ->paginate(12)
            ->withQueryString();

        $bibleBooks = BibleBook::orderBy('order')->get();
        $topics = Topic::orderBy('name_' . app()->getLocale())->get();

        return Inertia::render('Questions/Index', [
            'questions' => $questions,
            'bibleBooks' => $bibleBooks,
            'topics' => $topics,
            'filters' => [
                'search' => $search,
                'bible_book_id' => $bibleBookId,
                'topic_id' => $topicId,
            ],
        ]);
    }

    public function show(Question $question): Response
    {
        if ($question->status !== 'approved') {
            abort(404);
        }

        $question->load(['bibleBook', 'topic']);

        return Inertia::render('Questions/Show', [
            'question' => $question,
        ]);
    }

    public function create(): Response
    {
        $bibleBooks = BibleBook::orderBy('order')->get();
        $topics = Topic::orderBy('name_' . app()->getLocale())->get();

        return Inertia::render('Questions/Create', [
            'bibleBooks' => $bibleBooks,
            'topics' => $topics,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'question_ar' => 'required|string|max:2000',
            'question_en' => 'required|string|max:2000',
            'submitter_name' => 'nullable|string|max:255',
            'submitter_email' => 'nullable|email|max:255',
            'bible_book_id' => 'nullable|exists:bible_books,id',
            'topic_id' => 'nullable|exists:topics,id',
            'chapter_verse' => 'nullable|string|max:100',
        ]);

        Question::create($validated);

        return redirect()->route('questions.index')
            ->with('success', app()->getLocale() === 'ar' 
                ? 'تم إرسال سؤالك بنجاح. سنقوم بمراجعته والرد عليه قريباً.' 
                : 'Your question has been submitted successfully. We will review and answer it soon.');
    }
}
