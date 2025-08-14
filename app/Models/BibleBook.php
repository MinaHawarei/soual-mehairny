<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class BibleBook extends Model
{
    use HasFactory;

    protected $fillable = [
        'name_ar',
        'name_en',
        'abbreviation_ar',
        'abbreviation_en',
        'order',
    ];

    public function questions(): HasMany
    {
        return $this->hasMany(Question::class);
    }

    public function getNameAttribute(): string
    {
        return app()->getLocale() === 'ar' ? $this->name_ar : $this->name_en;
    }

    public function getAbbreviationAttribute(): ?string
    {
        return app()->getLocale() === 'ar' ? $this->abbreviation_ar : $this->abbreviation_en;
    }
}
