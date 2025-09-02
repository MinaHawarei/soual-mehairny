<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
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
        $status = $request->get('status', 'all');
        $bibleBookId = $request->get('bible_book_id');
        $topicId = $request->get('topic_id');

        $questions = Question::query()
            ->with(['bibleBook', 'topic'])
            ->when($search, fn($query) => $query->search($search))
            ->when($status !== 'all', fn($query) => $query->where('status', $status))
            ->when($bibleBookId, fn($query) => $query->byBibleBook($bibleBookId))
            ->when($topicId, fn($query) => $query->byTopic($topicId))
            ->latest()
            ->paginate(20)
            ->withQueryString();

        $bibleBooks = BibleBook::orderBy('order')->get();
        $topics = Topic::orderBy('name_' . app()->getLocale())->get();

        return Inertia::render('Admin/Questions/Index', [
            'questions' => $questions,
            'bibleBooks' => $bibleBooks,
            'topics' => $topics,
            'filters' => [
                'search' => $search,
                'status' => $status,
                'bible_book_id' => $bibleBookId,
                'topic_id' => $topicId,
            ],
        ]);
    }

    public function show(Question $question): Response
    {
        $question->load(['bibleBook', 'topic']);
        $bibleBooks = BibleBook::orderBy('order')->get();
        $topics = Topic::orderBy('name_' . app()->getLocale())->get();

        return Inertia::render('Admin/Questions/Show', [
            'question' => $question,
            'bibleBooks' => $bibleBooks,
            'topics' => $topics,
        ]);
    }

     public function create(): Response
    {
        $bibleBooks = BibleBook::orderBy('order')->get();
        $topics = Topic::orderBy('name_' . app()->getLocale())->get();

        return Inertia::render('Admin/Questions/Create', [
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

        return redirect()->route('questions.index');
    }


    public function edit(Question $question): Response
    {
        $question->load(['bibleBook', 'topic']);
        $bibleBooks = BibleBook::orderBy('order')->get();
        $topics = Topic::orderBy('name_' . app()->getLocale())->get();

        return Inertia::render('Admin/Questions/Edit', [
            'question' => $question,
            'bibleBooks' => $bibleBooks,
            'topics' => $topics,
        ]);
    }

    public function update(Request $request, Question $question)
    {
        $validated = $request->validate([
            'question_ar' => 'required|string',
            'question_en' => 'required|string',
            'answer_ar' => 'nullable|string',
            'answer_en' => 'nullable|string',
            'youtube_video_id' => 'nullable|string',
            'status' => 'required|in:approved,disable',
            'bible_book_id' => 'nullable|exists:bible_books,id',
            'topic_id' => 'nullable|exists:topics,id',
            'chapter_verse' => 'nullable|string',
        ]);

        $question->update($validated);

        return redirect()->route('admin.questions.index')
            ->with('success', app()->getLocale() === 'ar'
                ? 'تم تحديث السؤال بنجاح'
                : 'Question updated successfully');
    }

    public function destroy(Question $question)
    {
        $question->delete();

        return redirect()->route('admin.questions.index')
            ->with('success', app()->getLocale() === 'ar'
                ? 'تم حذف السؤال بنجاح'
                : 'Question deleted successfully');
    }

    public function approve(Question $question)
    {
        $question->update(['status' => 'approved']);

        return redirect()->route('admin.questions.index')
            ->with('success', app()->getLocale() === 'ar'
                ? 'تم الموافقة على السؤال'
                : 'Question approved successfully');
    }

    public function reject(Question $question)
    {
        $question->update(['status' => 'rejected']);

        return redirect()->route('admin.questions.index')
            ->with('success', app()->getLocale() === 'ar'
                ? 'تم رفض السؤال'
                : 'Question rejected successfully');
    }
}
