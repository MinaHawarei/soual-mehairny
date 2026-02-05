<?php

namespace App\Http\Requests\Api\Native;

use Illuminate\Foundation\Http\FormRequest;

class QuestionIndexRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'locale' => ['nullable', 'in:ar,en'],
            'search' => ['nullable', 'string', 'max:255'],
            'bible_book_id' => ['nullable', 'integer'],
            'topic_id' => ['nullable', 'integer'],
            'page' => ['nullable', 'integer', 'min:1'],
            'per_page' => ['nullable', 'integer', 'min:1', 'max:50'],
        ];
    }
}
