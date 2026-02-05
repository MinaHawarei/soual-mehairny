<?php

namespace App\Http\Controllers\Api\Native;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\Native\AskStoreRequest;
use App\Models\Ask;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;

class AskController extends Controller
{
    public function store(AskStoreRequest $request): JsonResponse
    {
        $validated = $request->validated();

        $question = Ask::create([
            'question' => $validated['question'],
            'email' => $validated['email'] ?? null,
            'topic_id' => $validated['topic_id'] ?? null,
        ]);

        Log::channel('stack')->info('Native API ask created', [
            'id' => $question->id,
        ]);

        return response()->json([
            'message' => 'Question submitted successfully.',
        ], 201);
    }
}
