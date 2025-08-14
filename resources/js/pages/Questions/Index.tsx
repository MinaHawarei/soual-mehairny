import { Link, usePage } from '@inertiajs/react';
import { Search, Filter, BookOpen, Tag } from 'lucide-react';
import PublicLayout from '@/layouts/public-layout';
import { useState, useEffect } from 'react';
import { router } from '@inertiajs/react';
import { getLocalePrefix, isArabic, buildLocalizedPath, buildLocalizedPathWithParams } from '@/lib/locale';
import CopticCrossIcon from '@/components/CopticCrossIcon';

interface Question {
    id: number;
    question_ar: string;
    question_en: string;
    answer_ar: string | null;
    answer_en: string | null;
    youtube_video_id: string | null;
    submitter_name: string | null;
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

    // Use the centralized locale utilities
    const localePrefix = getLocalePrefix();
    const isArabicLocale = isArabic();

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        updateFilters();
    };

    const updateFilters = () => {
        const params: Record<string, string> = {};
        if (searchQuery) params.search = searchQuery;
        if (selectedBibleBook) params.bible_book_id = selectedBibleBook;
        if (selectedTopic) params.topic_id = selectedTopic;

        router.visit(buildLocalizedPathWithParams('questions', params));
    };

    const clearFilters = () => {
        setSearchQuery('');
        setSelectedBibleBook('');
        setSelectedTopic('');
        router.visit(buildLocalizedPath('questions'));
    };

    const getLocalizedName = (item: { name_ar: string; name_en: string }) => {
        return isArabicLocale ? item.name_ar : item.name_en;
    };

    const getLocalizedQuestion = (question: Question) => {
        return isArabicLocale ? question.question_ar : question.question_en;
    };

    const getLocalizedAnswer = (question: Question) => {
        return isArabicLocale ? question.answer_ar : question.answer_en;
    };

    return (
        <PublicLayout>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header with Coptic Cross */}
                <div className="mb-12 text-center">
                    <div className="flex items-center justify-center space-x-4 mb-6">
                        <CopticCrossIcon
                            className="text-amber-600 h-12 w-12 drop-shadow-lg"
                            size={48}
                        />
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-amber-700 via-red-800 to-blue-900 bg-clip-text text-transparent">
                            {isArabicLocale ? 'الأسئلة العقائدية' : 'Doctrinal Questions'}
                        </h1>
                        <CopticCrossIcon
                            className="text-amber-600 h-12 w-12 drop-shadow-lg"
                            size={48}
                        />
                    </div>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                        {isArabicLocale
                            ? 'استكشف مجموعة شاملة من الأسئلة والإجابات العقائدية المستندة إلى الكتاب المقدس'
                            : 'Explore our comprehensive collection of doctrinal questions and answers based on biblical teachings'
                        }
                    </p>
                </div>

                {/* Enhanced Search and Filters */}
                <div className="bg-gradient-to-br from-white to-amber-50/50 rounded-2xl shadow-xl border border-amber-200/50 p-8 mb-12 backdrop-blur-sm">
                    <form onSubmit={handleSearch} className="space-y-6">
                        <div className="flex flex-col md:flex-row gap-6">
                            <div className="flex-1">
                                <div className="relative group">
                                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-amber-500 h-6 w-6 group-focus-within:text-amber-600 transition-colors duration-200" />
                                    <input
                                        type="text"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        placeholder={isArabicLocale ? 'ابحث في الأسئلة والإجابات...' : 'Search questions and answers...'}
                                        className="w-full pl-12 pr-6 py-4 border-2 border-amber-200 rounded-xl focus:ring-4 focus:ring-amber-500/20 focus:border-amber-500 bg-white/80 backdrop-blur-sm transition-all duration-200 text-lg placeholder-gray-400"
                                    />
                                </div>
                            </div>
                            <button
                                type="submit"
                                className="bg-gradient-to-r from-amber-600 to-red-700 text-white px-10 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 hover:from-amber-700 hover:to-red-800"
                            >
                                {isArabicLocale ? 'بحث' : 'Search'}
                            </button>
                        </div>

                        {/* Enhanced Filters Toggle */}
                        <div className="flex items-center justify-between pt-4 border-t border-amber-200/50">
                            <button
                                type="button"
                                onClick={() => setShowFilters(!showFilters)}
                                className="flex items-center space-x-3 text-amber-700 hover:text-amber-800 px-4 py-2 rounded-lg hover:bg-amber-100 transition-all duration-200 group"
                            >
                                <Filter className="h-5 w-5 group-hover:rotate-180 transition-transform duration-300" />
                                <span className="font-medium">{isArabicLocale ? 'فلاتر إضافية' : 'Additional Filters'}</span>
                            </button>

                            {(filters.search || filters.bible_book_id || filters.topic_id) && (
                                <button
                                    type="button"
                                    onClick={clearFilters}
                                    className="text-red-600 hover:text-red-700 text-sm font-medium px-4 py-2 rounded-lg hover:bg-red-50 transition-colors duration-200"
                                >
                                    {isArabicLocale ? 'مسح الفلاتر' : 'Clear Filters'}
                                </button>
                            )}
                        </div>

                        {/* Enhanced Filters */}
                        {showFilters && (
                            <div className="grid md:grid-cols-2 gap-6 pt-6 border-t border-amber-200/50">
                                <div className="space-y-2">
                                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                                        {isArabicLocale ? 'اسفار الكتاب المقدس'  : 'Bible Book'}
                                    </label>
                                    <select
                                        value={selectedBibleBook}
                                        onChange={(e) => setSelectedBibleBook(e.target.value)}
                                        className="w-full border-2 border-amber-200 rounded-xl px-4 py-3 focus:ring-4 focus:ring-amber-500/20 focus:border-amber-500 bg-white/80 backdrop-blur-sm transition-all duration-200"
                                    >
                                        <option value="">{isArabicLocale ? 'جميع الاسفار' : 'All Books'}</option>
                                        {bibleBooks.map((book) => (
                                            <option key={book.id} value={book.id}>
                                                {getLocalizedName(book)}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                                        {isArabicLocale ? 'الموضوع' : 'Topic'}
                                    </label>
                                    <select
                                        value={selectedTopic}
                                        onChange={(e) => setSelectedTopic(e.target.value)}
                                        className="w-full border-2 border-amber-200 rounded-xl px-4 py-3 focus:ring-4 focus:ring-amber-500/20 focus:border-amber-500 bg-white/80 backdrop-blur-sm transition-all duration-200"
                                    >
                                        <option value="">{isArabicLocale ? 'جميع المواضيع' : 'All Topics'}</option>
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

                {/* Enhanced Results Count */}
                <div className="mb-8 text-center">
                    <div className="inline-flex items-center space-x-3 bg-gradient-to-r from-amber-100 to-blue-100 px-6 py-3 rounded-full border border-amber-200/50">
                        <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></div>
                        <p className="text-gray-700 font-medium">
                            {isArabicLocale
                                ? `تم العثور على ${questions.total} سؤال`
                                : `Found ${questions.total} questions`
                            }
                        </p>
                    </div>
                </div>

                {/* Enhanced Questions Grid */}
                <div className="grid gap-8">
                    {questions.data.map((question) => (
                        <div key={question.id} className="group bg-gradient-to-br from-white to-amber-50/30 rounded-2xl shadow-lg border border-amber-200/50 p-8 hover:shadow-2xl hover:shadow-amber-500/10 hover:border-amber-300/50 transition-all duration-300 transform hover:-translate-y-1">
                            <div className="flex items-start justify-between mb-6">
                                <div className="flex-1">
                                    <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-amber-800 transition-colors duration-200">
                                        <Link
                                            href={buildLocalizedPath(`questions/${question.id}`)}
                                            className="hover:text-amber-700 transition-colors duration-200 block"
                                        >
                                            {getLocalizedQuestion(question)}
                                        </Link>
                                    </h3>

                                    {question.answer_ar || question.answer_en ? (
                                        <p className="text-gray-600 mb-6 line-clamp-3 leading-relaxed text-lg">
                                            {getLocalizedAnswer(question)}
                                        </p>
                                    ) : (
                                        <p className="text-amber-600 italic mb-6 text-lg">
                                            {isArabicLocale ? 'لم يتم الرد على هذا السؤال بعد' : 'This question has not been answered yet'}
                                        </p>
                                    )}

                                    {/* Enhanced Meta Information */}
                                    <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500 mb-6">
                                        {question.bible_book && (
                                            <div className="flex items-center space-x-2 bg-amber-100 px-4 py-2 rounded-full border border-amber-200/50">
                                                <BookOpen className="h-4 w-4 text-amber-600" />
                                                <span className="font-medium">{getLocalizedName(question.bible_book)}</span>
                                            </div>
                                        )}

                                        {question.topic && (
                                            <div className="flex items-center space-x-2 bg-blue-100 px-4 py-2 rounded-full border border-blue-200/50">
                                                <Tag className="h-4 w-4 text-blue-600" />
                                                <span className="font-medium">{getLocalizedName(question.topic)}</span>
                                            </div>
                                        )}

                                        <div className="flex items-center space-x-2 bg-gray-100 px-4 py-2 rounded-full border border-gray-200/50">
                                            <span className="text-gray-600">
                                                {isArabicLocale ? 'تم النشر في' : 'Published on'} {new Date(question.created_at).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {question.youtube_video_id && (
                                    <div className="ml-6">
                                        <div className="w-28 h-20 bg-gradient-to-br from-red-100 to-red-200 rounded-xl flex items-center justify-center border border-red-200/50 group-hover:scale-105 transition-transform duration-200">
                                            <span className="text-red-600 text-xs font-medium">
                                                {isArabicLocale ? 'فيديو' : 'Video'}
                                            </span>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="flex justify-between items-center pt-6 border-t border-amber-200/30">
                                <Link
                                    href={buildLocalizedPath(`questions/${question.id}`)}
                                    className="inline-flex items-center space-x-2 text-amber-700 hover:text-amber-800 font-semibold px-6 py-3 rounded-lg hover:bg-amber-100 transition-all duration-200 group"
                                >
                                    <span>{isArabicLocale ? 'اقرأ المزيد' : 'Read More'}</span>
                                    <div className="w-0 group-hover:w-4 h-0.5 bg-amber-600 transition-all duration-300"></div>
                                </Link>

                                {question.submitter_name && (
                                    <span className="text-sm text-gray-500 bg-gray-100 px-4 py-2 rounded-full">
                                        {isArabicLocale ? 'بواسطة' : 'By'} {question.submitter_name}
                                    </span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Enhanced Pagination */}
                {questions.last_page > 1 && (
                    <div className="mt-12 flex justify-center">
                        <nav className="flex space-x-2 bg-white rounded-2xl shadow-lg border border-amber-200/50 p-2">
                            {questions.links.map((link: any, index: number) => (
                                <Link
                                    key={index}
                                    href={link.url || '#'}
                                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                                        link.active
                                            ? 'bg-gradient-to-r from-amber-600 to-red-700 text-white shadow-lg'
                                            : 'text-gray-500 hover:text-amber-700 hover:bg-amber-50'
                                    } ${!link.url ? 'cursor-not-allowed opacity-50' : ''}`}
                                    {...(!link.url && { onClick: (e) => e.preventDefault() })}
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </nav>
                    </div>
                )}

                {/* Enhanced No Results */}
                {questions.data.length === 0 && (
                    <div className="text-center py-16">
                        <div className="text-amber-400 mb-6">
                            <Search className="h-20 w-20 mx-auto drop-shadow-lg" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-4">
                            {isArabicLocale ? 'لا توجد نتائج' : 'No Results Found'}
                        </h3>
                        <p className="text-gray-600 mb-8 text-lg max-w-2xl mx-auto">
                            {isArabicLocale
                                ? 'جرب تعديل معايير البحث أو الفلاتر للحصول على نتائج أفضل'
                                : 'Try adjusting your search criteria or filters to get better results'
                            }
                        </p>
                        <Link
                            href={buildLocalizedPath('questions/create')}
                            className="inline-flex items-center space-x-3 bg-gradient-to-r from-amber-600 to-red-700 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 hover:from-amber-700 hover:to-red-800"
                        >
                            <CopticCrossIcon className="text-white h-6 w-6" size={24} />
                            <span>{isArabicLocale ? 'أرسل سؤالاً جديداً' : 'Submit a New Question'}</span>
                        </Link>
                    </div>
                )}
            </div>
        </PublicLayout>
    );
}
