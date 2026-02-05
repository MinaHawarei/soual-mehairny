<?php

namespace App\Http\Requests\Api\Native;

use Illuminate\Foundation\Http\FormRequest;

class AskStoreRequest extends FormRequest
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
            'question' => ['required', 'string', 'max:2000'],
            'email' => ['nullable', 'email', 'max:255'],
            'topic_id' => ['nullable', 'exists:topics,id'],
            'locale' => ['nullable', 'in:ar,en'],
        ];
    }
}
