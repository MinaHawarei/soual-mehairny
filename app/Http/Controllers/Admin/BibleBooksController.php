<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\BibleBook;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class BibleBooksController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): Response
    {
        $query = BibleBook::query()
            ->withCount('questions')
            ->orderBy('order');

        // Search functionality
        if ($request->filled('search')) {
            $search = $request->get('search');
            $query->where(function ($q) use ($search) {
                $q->where('name_ar', 'like', "%{$search}%")
                  ->orWhere('name_en', 'like', "%{$search}%")
                  ->orWhere('abbreviation_ar', 'like', "%{$search}%")
                  ->orWhere('abbreviation_en', 'like', "%{$search}%");
            });
        }

        // Order functionality
        if ($request->filled('order')) {
            $order = $request->get('order');
            switch ($order) {
                case 'desc':
                    $query->orderBy('order', 'desc');
                    break;
                case 'name':
                    $query->orderBy('name_en');
                    break;
                default:
                    $query->orderBy('order');
                    break;
            }
        }

        $bibleBooks = $query->get();

        return Inertia::render('Admin/BibleBooks/Index', [
            'bibleBooks' => $bibleBooks,
            'filters' => $request->only(['search', 'order']),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response
    {
        return Inertia::render('Admin/BibleBooks/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name_ar' => 'required|string|max:255',
            'name_en' => 'required|string|max:255',
            'abbreviation_ar' => 'nullable|string|max:10',
            'abbreviation_en' => 'nullable|string|max:10',
            'order' => 'required|integer|min:1|max:66|unique:bible_books,order',
        ]);

        BibleBook::create($validated);

        return redirect()->route('admin.bible-books.index')
            ->with('success', 'Bible book created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(BibleBook $bibleBook): Response
    {
        $bibleBook->load(['questions' => function ($query) {
            $query->latest()->limit(10);
        }]);

        return Inertia::render('Admin/BibleBooks/Show', [
            'bibleBook' => $bibleBook,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(BibleBook $bibleBook): Response
    {
        return Inertia::render('Admin/BibleBooks/Edit', [
            'bibleBook' => $bibleBook,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, BibleBook $bibleBook)
    {
        $validated = $request->validate([
            'name_ar' => 'required|string|max:255',
            'name_en' => 'required|string|max:255',
            'abbreviation_ar' => 'nullable|string|max:10',
            'abbreviation_en' => 'nullable|string|max:10',
            'order' => 'required|integer|min:1|max:66|unique:bible_books,order,' . $bibleBook->id,
        ]);

        $bibleBook->update($validated);

        return redirect()->route('admin.bible-books.index')
            ->with('success', 'Bible book updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(BibleBook $bibleBook)
    {
        // Check if there are questions associated with this Bible book
        if ($bibleBook->questions()->exists()) {
            return back()->with('error', 'Cannot delete Bible book that has associated questions.');
        }

        $bibleBook->delete();

        return redirect()->route('admin.bible-books.index')
            ->with('success', 'Bible book deleted successfully.');
    }
}
