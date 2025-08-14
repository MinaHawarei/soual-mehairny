<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('questions', function (Blueprint $table) {
            $table->id();
            $table->text('question_ar'); // Question in Arabic
            $table->text('question_en'); // Question in English
            $table->text('answer_ar')->nullable(); // Answer in Arabic
            $table->text('answer_en')->nullable(); // Answer in English
            $table->string('youtube_video_id')->nullable(); // YouTube video ID
            $table->string('submitter_name')->nullable(); // Name of person who submitted
            $table->string('submitter_email')->nullable(); // Email of person who submitted
            $table->enum('status', ['pending', 'approved', 'rejected'])->default('pending');
            $table->foreignId('bible_book_id')->nullable()->constrained()->onDelete('set null');
            $table->foreignId('topic_id')->nullable()->constrained()->onDelete('set null');
            $table->string('chapter_verse')->nullable(); // Specific Bible reference
            $table->timestamps();
            
            // Indexes for better performance
            $table->index(['status', 'created_at']);
            $table->index(['bible_book_id']);
            $table->index(['topic_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('questions');
    }
};
