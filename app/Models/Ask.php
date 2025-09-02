<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Builder;


class Ask extends Model
{
     protected $fillable = [
        'question',
        'email',
        'topic_id',
    ];
    public function topic(): BelongsTo
    {
        return $this->belongsTo(Topic::class);
    }

     public function scopeByTopic(Builder $query, int $topicId): void
    {
        $query->where('topic_id', $topicId);
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

}
