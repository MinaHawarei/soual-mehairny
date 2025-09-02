import { Link, usePage } from '@inertiajs/react';
import { Search, Filter, BookOpen, Tag } from 'lucide-react';
import PublicLayout from '@/layouts/public-layout';
import { useState, useEffect } from 'react';
import { router } from '@inertiajs/react';
import { route } from 'ziggy-js';


interface Question {
    id: number;
    question_ar: string;
    question_en: string;
    answer_ar: string | null;
    answer_en: string | null;
    youtube_video_id: string | null;
    submitter_name_ar: string | null;
    submitter_name_en: string | null;
    created_at: string;
    bible_book?: {
        id: number;
        name_ar: string;
        name_en: string;
    };
    topic?: {
        id: number;
        name_ar: string;
        name_en: string;
    };
}

interface BibleBook {
    id: number;
    name_ar: string;
    name_en: string;
}

interface Topic {
    id: number;
    name_ar: string;
    name_en: string;
}

interface Filters {
    search?: string;
    bible_book_id?: string;
    topic_id?: string;
}

interface PageProps {
    questions: {
        data: Question[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        links: any[];
    };
    bibleBooks: BibleBook[];
    topics: Topic[];
    filters: Filters;
}

export default function QuestionsIndex({ questions, bibleBooks, topics, filters }: PageProps) {
    const [searchQuery, setSearchQuery] = useState(filters.search || '');
    const [selectedBibleBook, setSelectedBibleBook] = useState(filters.bible_book_id || '');
    const [selectedTopic, setSelectedTopic] = useState(filters.topic_id || '');
    const [showFilters, setShowFilters] = useState(false);

    const isArabic = window.location.pathname.includes('/ar');
    const localePrefix = isArabic ? '/ar' : '/en';

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        updateFilters();
    };

    const updateFilters = () => {
        const params = new URLSearchParams();
        if (searchQuery) params.append('search', searchQuery);
        if (selectedBibleBook) params.append('bible_book_id', selectedBibleBook);
        if (selectedTopic) params.append('topic_id', selectedTopic);

        router.visit(`${localePrefix}/questions?${params.toString()}`);
    };

    const clearFilters = () => {
        setSearchQuery('');
        setSelectedBibleBook('');
        setSelectedTopic('');
        router.visit(`${localePrefix}/questions`);
    };

    const getLocalizedName = (item: { name_ar: string; name_en: string }) => {
        return isArabic ? item.name_ar : item.name_en;
    };

    const getLocalizedQuestion = (question: Question) => {
        return isArabic ? question.question_ar : question.question_en;
    };

    const getLocalizedAnswer = (question: Question) => {
        return isArabic ? question.answer_ar : question.answer_en;
    };

    return (
        <PublicLayout>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">
                        {isArabic ? 'الأسئلة العقائدية' : 'Doctrinal Questions'}
                    </h1>
                    <p className="text-gray-600">
                        {isArabic
                            ? 'استكشف مجموعة شاملة من الأسئلة والإجابات العقائدية'
                            : 'Explore our comprehensive collection of doctrinal questions and answers'
                        }
                    </p>
                </div>

                {/* Search and Filters */}
                <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
                    <form onSubmit={handleSearch} className="space-y-4">
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="flex-1">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                                    <input
                                        type="text"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        placeholder={isArabic ? 'ابحث في الأسئلة والإجابات...' : 'Search questions and answers...'}
                                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                            </div>
                            <button
                                type="submit"
                                className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                            >
                                {isArabic ? 'بحث' : 'Search'}
                            </button>
                        </div>

                        {/* Filters Toggle */}
                        <div className="flex items-center justify-between">
                            <button
                                type="button"
                                onClick={() => setShowFilters(!showFilters)}
                                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
                            >
                                <Filter className="h-4 w-4" />
                                <span>{isArabic ? 'فلاتر إضافية' : 'Additional Filters'}</span>
                            </button>

                            {(filters.search || filters.bible_book_id || filters.topic_id) && (
                                <button
                                    type="button"
                                    onClick={clearFilters}
                                    className="text-red-600 hover:text-red-700 text-sm"
                                >
                                    {isArabic ? 'مسح الفلاتر' : 'Clear Filters'}
                                </button>
                            )}
                        </div>

                        {/* Filters */}
                        {showFilters && (
                            <div className="grid md:grid-cols-2 gap-4 pt-4 border-t">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        {isArabic ? 'اسفار الكتاب المقدس' : 'Bible Books'}
                                    </label>
                                    <select
                                        value={selectedBibleBook}
                                        onChange={(e) => setSelectedBibleBook(e.target.value)}
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    >
                                        <option value="">{isArabic ? 'كل أسفار الكتاب المقدس' : 'All Bible Books'}</option>
                                        {bibleBooks.map((book) => (
                                            <option key={book.id} value={book.id}>
                                                {getLocalizedName(book)}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        {isArabic ? 'الموضوع' : 'Topic'}
                                    </label>
                                    <select
                                        value={selectedTopic}
                                        onChange={(e) => setSelectedTopic(e.target.value)}
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    >
                                        <option value="">{isArabic ? 'جميع المواضيع' : 'All Topics'}</option>
                                        {topics.map((topic) => (
                                            <option key={topic.id} value={topic.id}>
                                                {getLocalizedName(topic)}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        )}
                    </form>
                </div>

                {/* Results Count */}
                <div className="mb-6">
                    <p className="text-gray-600">
                        {isArabic
                            ? `تم العثور على ${questions.total} سؤال`
                            : `Found ${questions.total} questions`
                        }
                    </p>
                </div>

                {/* Questions Grid */}
                <div className="grid gap-6">
                    {questions.data.map((question) => (
                        <div key={question.id} className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex-1">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                       <Link
                                            href={route('questions.show', { locale: isArabic ? 'ar' : 'en', question: question.id })}
                                            className="hover:text-blue-600 transition-colors"
                                        >
                                            {getLocalizedQuestion(question)}
                                        </Link>

                                    </h3>

                                    {question.answer_ar || question.answer_en ? (
                                        <p className="text-gray-600 mb-4 line-clamp-3">
                                            {getLocalizedAnswer(question)}
                                        </p>
                                    ) : (
                                        <p className="text-gray-500 italic mb-4">
                                            {isArabic ? 'لم يتم الرد على هذا السؤال بعد' : 'This question has not been answered yet'}
                                        </p>
                                    )}

                                    {/* Meta Information */}
                                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                                        {question.bible_book && (
                                            <div className="flex items-center space-x-1">
                                                <BookOpen className="h-4 w-4" />
                                                <span>{getLocalizedName(question.bible_book)}</span>
                                            </div>
                                        )}

                                        {question.topic && (
                                            <div className="flex items-center space-x-1">
                                                <Tag className="h-4 w-4" />
                                                <span>{getLocalizedName(question.topic)}</span>
                                            </div>
                                        )}

                                        <span>
                                            {isArabic ? 'تم النشر في' : 'Published on'} {new Date(question.created_at).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-between items-center">
                                <Link
                                    href={route('questions.show', [isArabic ? 'ar' : 'en', question.id])}
                                    className="text-blue-600 hover:text-blue-700 font-medium"
                                >
                                    {isArabic ? 'اقرأ المزيد' : 'Read More'}
                                </Link>
                                {question.submitter_name_ar && (
                                    <span className="text-sm text-gray-500 bg-gray-100 px-4 py-2 rounded-full">
                                        {isArabic ? `بواسطة ${question.submitter_name_ar}` : `By ${question.submitter_name_en}`}

                                    </span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Pagination */}
                {questions.last_page > 1 && (
                    <div className="mt-8 flex justify-center">
                        <nav className="flex space-x-2">
                            {questions.links.map((link: any, index: number) => (
                                <Link
                                    key={index}
                                    href={link.url || '#'}
                                    className={`px-3 py-2 rounded-md text-sm font-medium ${
                                        link.active
                                            ? 'bg-blue-600 text-white'
                                            : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                                    } ${!link.url ? 'cursor-not-allowed opacity-50' : ''}`}
                                    {...(!link.url && { onClick: (e) => e.preventDefault() })}
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </nav>
                    </div>
                )}

                {/* No Results */}
                {questions.data.length === 0 && (
                    <div className="text-center py-12">
                        <div className="text-gray-400 mb-4">
                            <Search className="h-16 w-16 mx-auto" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                            {isArabic ? 'لا توجد نتائج' : 'No Results Found'}
                        </h3>
                        <p className="text-gray-600 mb-6">
                            {isArabic
                                ? 'جرب تعديل معايير البحث أو الفلاتر'
                                : 'Try adjusting your search criteria or filters'
                            }
                        </p>
                        <Link
                            href={`${localePrefix}/questions/create`}
                            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                        >
                            {isArabic ? 'أرسل سؤالاً جديداً' : 'Submit a New Question'}
                        </Link>
                    </div>
                )}
            </div>
        </PublicLayout>
    );
}
