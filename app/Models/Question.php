<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Builder;

class Question extends Model
{
    use HasFactory;

    protected $fillable = [
        'question_ar',
        'question_en',
        'answer_ar',
        'answer_en',
        'youtube_video_id',
        'submitter_name_ar',
        'submitter_name_en',
        'submitter_email',
        'status',
        'bible_book_id',
        'topic_id',
        'chapter_verse',
    ];

    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    public function bibleBook(): BelongsTo
    {
        return $this->belongsTo(BibleBook::class);
    }

    public function topic(): BelongsTo
    {
        return $this->belongsTo(Topic::class);
    }

    public function getQuestionAttribute(): string
    {
        return app()->getLocale() === 'ar' ? $this->question_ar : $this->question_en;
    }

    public function getAnswerAttribute(): ?string
    {
        return app()->getLocale() === 'ar' ? $this->answer_ar : $this->answer_en;
    }

    public function scopeApproved(Builder $query): void
    {
        $query->where('status', 'approved');
    }

    public function scopePending(Builder $query): void
    {
        $query->where('status', 'pending');
    }

    public function scopeSearch(Builder $query, string $search): void
    {
        $locale = app()->getLocale();
        $questionField = $locale === 'ar' ? 'question_ar' : 'question_en';
        $answerField = $locale === 'ar' ? 'answer_ar' : 'answer_en';

        $query->where(function ($q) use ($search, $questionField, $answerField) {
            $q->where($questionField, 'like', "%{$search}%")
              ->orWhere($answerField, 'like', "%{$search}%");
        });
    }

    public function scopeByBibleBook(Builder $query, int $bibleBookId): void
    {
        $query->where('bible_book_id', $bibleBookId);
    }

    public function scopeByTopic(Builder $query, int $topicId): void
    {
        $query->where('topic_id', $topicId);
    }

    public function getYouTubeEmbedUrlAttribute(): ?string
    {
        if (!$this->youtube_video_id) {
            return null;
        }
        return "https://www.youtube.com/embed/{$this->youtube_video_id}";
    }

    public function getYouTubeWatchUrlAttribute(): ?string
    {
        if (!$this->youtube_video_id) {
            return null;
        }
        return "https://www.youtube.com/watch?v={$this->youtube_video_id}";
    }
}
