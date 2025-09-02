<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Topic;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class TopicsController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): Response
    {
        $query = Topic::query()
            ->withCount('questions')
            ->orderBy('name_en');


        // Search functionality
        if ($request->filled('search')) {
            $search = $request->get('search');
            $query->where(function ($q) use ($search) {
                $q->where('name_ar', 'like', "%{$search}%")
                  ->orWhere('name_en', 'like', "%{$search}%")
                  ->orWhere('slug', 'like', "%{$search}%")
                  ->orWhere('description_ar', 'like', "%{$search}%")
                  ->orWhere('description_en', 'like', "%{$search}%");
            });
        }

        // Sort functionality
        if ($request->filled('sort')) {
            $sort = $request->get('sort');
            switch ($sort) {
                case 'created':
                    $query->orderBy('created_at', 'desc');
                    break;
                case 'updated':
                    $query->orderBy('updated_at', 'desc');
                    break;
                case 'questions':
                    $query->orderBy('questions_count', 'desc');
                    break;
                default:
                    $query->orderBy('name_en');
                    break;
            }
        }

        $topics = $query->get();
        return Inertia::render('Admin/Topics/Index', [
            'topics' => $topics,
            'filters' => $request->only(['search', 'sort']),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response
    {
        return Inertia::render('Admin/Topics/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name_ar' => 'required|string|max:255',
            'name_en' => 'required|string|max:255',
            'slug' => 'required|string|max:255|unique:topics,slug',
            'description_ar' => 'nullable|string',
            'description_en' => 'nullable|string',
        ]);

        // Generate slug if not provided
        if (empty($validated['slug'])) {
            $validated['slug'] = Str::slug($validated['name_en']);
        }

        Topic::create($validated);

        return redirect()->route('admin.topics.index')
            ->with('success', 'Topic created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Topic $topic): Response
    {
        $topic->load(['questions' => function ($query) {
            $query->latest()->limit(10);
        }]);

        return Inertia::render('Admin/Topics/Show', [
            'topic' => $topic,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Topic $topic): Response
    {
        return Inertia::render('Admin/Topics/Edit', [
            'topic' => $topic,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Topic $topic)
    {
        $validated = $request->validate([
            'name_ar' => 'required|string|max:255',
            'name_en' => 'required|string|max:255',
            'slug' => 'required|string|max:255|unique:topics,slug,' . $topic->id,
            'description_ar' => 'nullable|string',
            'description_en' => 'nullable|string',
        ]);

        // Generate slug if not provided
        if (empty($validated['slug'])) {
            $validated['slug'] = Str::slug($validated['name_en']);
        }

        $topic->update($validated);

        return redirect()->route('admin.topics.index')
            ->with('success', 'Topic updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Topic $topic)
    {
        // Check if there are questions associated with this topic
        if ($topic->questions()->exists()) {
            return back()->with('error', 'Cannot delete topic that has associated questions.');
        }

        $topic->delete();

        return redirect()->route('admin.topics.index')
            ->with('success', 'Topic deleted successfully.');
    }
}
