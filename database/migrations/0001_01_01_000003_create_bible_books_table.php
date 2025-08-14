<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('bible_books', function (Blueprint $table) {
            $table->id();
            $table->string('name_ar'); // Arabic name
            $table->string('name_en'); // English name
            $table->string('abbreviation_ar')->nullable(); // Arabic abbreviation
            $table->string('abbreviation_en')->nullable(); // English abbreviation
            $table->integer('order')->default(0); // Order in Bible
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('bible_books');
    }
};
