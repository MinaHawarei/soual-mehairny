<?php

namespace App\Http\Controllers\Api\Native;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\Native\QuestionIndexRequest;
use App\Http\Resources\Native\BibleBookResource;
use App\Http\Resources\Native\QuestionResource;
use App\Http\Resources\Native\TopicResource;
use App\Models\BibleBook;
use App\Models\Question;
use App\Models\Topic;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class QuestionController extends Controller
{
    public function index(QuestionIndexRequest $request): JsonResponse
    {
        $locale = $this->resolveLocale($request);
        app()->setLocale($locale);

        $search = $request->get('search');
        $bibleBookId = $request->get('bible_book_id');
        $topicId = $request->get('topic_id');
        $perPage = (int) $request->get('per_page', 5);

        $questions = Question::query()
            ->approved()
            ->with(['bibleBook', 'topic'])
            ->when($search, fn ($query) => $query->search($search))
            ->when($bibleBookId, fn ($query) => $query->byBibleBook((int) $bibleBookId))
            ->when($topicId, fn ($query) => $query->byTopic((int) $topicId))
            ->latest()
            ->paginate($perPage);

        $bibleBooks = BibleBook::orderBy('order')->get();
        $topics = Topic::orderBy('name_' . $locale)->get();

        Log::channel('stack')->info('Native API questions index', [
            'locale' => $locale,
            'page' => $questions->currentPage(),
            'total' => $questions->total(),
        ]);

        return response()->json([
            'data' => QuestionResource::collection($questions)->resolve(),
            'meta' => [
                'current_page' => $questions->currentPage(),
                'last_page' => $questions->lastPage(),
                'per_page' => $questions->perPage(),
                'total' => $questions->total(),
            ],
            'filters' => [
                'search' => $search,
                'bible_book_id' => $bibleBookId,
                'topic_id' => $topicId,
            ],
            'bible_books' => BibleBookResource::collection($bibleBooks)->resolve(),
            'topics' => TopicResource::collection($topics)->resolve(),
        ]);
    }

    public function show(Request $request, Question $question): JsonResponse
    {
        $locale = $this->resolveLocale($request);
        app()->setLocale($locale);

        if ($question->status !== 'approved') {
            abort(404);
        }

        $question->load(['bibleBook', 'topic']);

        Log::channel('stack')->info('Native API question show', [
            'locale' => $locale,
            'question_id' => $question->id,
        ]);

        return response()->json([
            'data' => (new QuestionResource($question))->resolve(),
        ]);
    }

    public function filters(Request $request): JsonResponse
    {
        $locale = $this->resolveLocale($request);
        app()->setLocale($locale);

        $bibleBooks = BibleBook::orderBy('order')->get();
        $topics = Topic::orderBy('name_' . $locale)->get();

        return response()->json([
            'bible_books' => BibleBookResource::collection($bibleBooks)->resolve(),
            'topics' => TopicResource::collection($topics)->resolve(),
        ]);
    }

    private function resolveLocale(Request $request): string
    {
        $locale = $request->get('locale', config('app.locale'));

        return in_array($locale, ['ar', 'en'], true) ? $locale : config('app.locale');
    }
}
