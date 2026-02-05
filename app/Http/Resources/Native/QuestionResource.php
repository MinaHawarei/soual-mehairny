<?php

namespace App\Http\Resources\Native;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class QuestionResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'question_ar' => $this->question_ar,
            'question_en' => $this->question_en,
            'answer_ar' => $this->answer_ar,
            'answer_en' => $this->answer_en,
            'youtube_video_id' => $this->youtube_video_id,
            'submitter_name_ar' => $this->submitter_name_ar,
            'submitter_name_en' => $this->submitter_name_en,
            'submitter_email' => $this->submitter_email,
            'chapter_verse' => $this->chapter_verse,
            'lecturer_name_ar' => $this->lecturer_name_ar ?? null,
            'lecturer_name_en' => $this->lecturer_name_en ?? null,
            'lecturer_role_ar' => $this->lecturer_role_ar ?? null,
            'lecturer_role_en' => $this->lecturer_role_en ?? null,
            'reviewer_name_ar' => $this->reviewer_name_ar ?? null,
            'reviewer_name_en' => $this->reviewer_name_en ?? null,
            'reviewer_role_ar' => $this->reviewer_role_ar ?? null,
            'reviewer_role_en' => $this->reviewer_role_en ?? null,
            'created_at' => optional($this->created_at)->toIso8601String(),
            'bible_book' => $this->whenLoaded('bibleBook', fn () => new BibleBookResource($this->bibleBook)),
            'topic' => $this->whenLoaded('topic', fn () => new TopicResource($this->topic)),
        ];
    }
}
