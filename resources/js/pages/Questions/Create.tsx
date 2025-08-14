import { Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Send } from 'lucide-react';
import PublicLayout from '@/layouts/public-layout';
import { useState } from 'react';
import { isArabic, buildLocalizedPath } from '@/lib/locale';
import CopticCrossIcon from '@/components/CopticCrossIcon';

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

interface PageProps {
    bibleBooks: BibleBook[];
    topics: Topic[];
}

export default function QuestionCreate({ bibleBooks, topics }: PageProps) {
    const [showEnglish, setShowEnglish] = useState(false);
    const isArabicLocale = isArabic();

    const { data, setData, post, processing, errors } = useForm({
        question_ar: '',
        question_en: '',
        submitter_name: '',
        submitter_email: '',
        bible_book_id: '',
        topic_id: '',
        chapter_verse: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(buildLocalizedPath('questions'));
    };

    const getLocalizedName = (item: { name_ar: string; name_en: string }) => {
        return isArabicLocale ? item.name_ar : item.name_en;
    };

    return (
        <PublicLayout>
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header with Coptic Cross */}
                <div className="mb-12 text-center">
                    <div className="flex items-center justify-center space-x-4 mb-6">
                        <CopticCrossIcon
                            className="text-amber-600 h-10 w-10 drop-shadow-lg"
                            size={40}
                        />
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-amber-700 via-red-800 to-blue-900 bg-clip-text text-transparent">
                            {isArabicLocale ? 'إرسال سؤال جديد' : 'Submit a New Question'}
                        </h1>
                        <CopticCrossIcon
                            className="text-amber-600 h-10 w-10 drop-shadow-lg"
                            size={40}
                        />
                    </div>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                        {isArabicLocale
                            ? 'ساعدنا في بناء قاعدة معرفية شاملة للمجتمع المسيحي. يمكنك إرسال سؤالك باللغتين العربية والإنجليزية.'
                            : 'Help us build a comprehensive knowledge base for the Christian community. You can submit your question in both Arabic and English.'
                        }
                    </p>
                </div>

                {/* Back Navigation */}
                <div className="mb-8">
                    <Link
                        href={buildLocalizedPath('questions')}
                        className="inline-flex items-center text-amber-700 hover:text-amber-800 mb-4 px-4 py-2 rounded-lg hover:bg-amber-50 transition-colors duration-200 group"
                    >
                        <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform duration-200" />
                        {isArabicLocale ? 'العودة إلى الأسئلة' : 'Back to Questions'}
                    </Link>
                </div>

                {/* Enhanced Form */}
                <div className="bg-gradient-to-br from-white to-amber-50/50 rounded-2xl shadow-xl border border-amber-200/50 p-8 backdrop-blur-sm">
                    <form onSubmit={handleSubmit} className="space-y-8">
                        {/* Enhanced Language Toggle */}
                        <div className="flex items-center justify-between p-6 bg-gradient-to-r from-amber-100/50 to-blue-100/50 rounded-xl border border-amber-200/50">
                            <span className="text-lg font-semibold text-gray-700">
                                {isArabicLocale ? 'اللغة' : 'Language'}
                            </span>
                            <div className="flex items-center space-x-3">
                                <button
                                    type="button"
                                    onClick={() => setShowEnglish(false)}
                                    className={`px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                                        !showEnglish
                                            ? 'bg-gradient-to-r from-amber-600 to-red-700 text-white shadow-lg'
                                            : 'text-gray-600 hover:text-amber-700 hover:bg-amber-50'
                                    }`}
                                >
                                    العربية
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowEnglish(true)}
                                    className={`px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                                        showEnglish
                                            ? 'bg-gradient-to-r from-amber-600 to-red-700 text-white shadow-lg'
                                            : 'text-gray-600 hover:text-amber-700 hover:bg-amber-50'
                                    }`}
                                >
                                    English
                                </button>
                            </div>
                        </div>

                        {/* Question Fields */}
                        <div className="space-y-6">
                            {/* Arabic Question */}
                            <div className={`space-y-4 ${showEnglish ? 'opacity-50' : ''}`}>
                                <label className="block text-lg font-semibold text-gray-700">
                                    {isArabicLocale ? 'السؤال بالعربية' : 'Question in Arabic'}
                                </label>
                                <textarea
                                    value={data.question_ar}
                                    onChange={(e) => setData('question_ar', e.target.value)}
                                    rows={4}
                                    className="w-full border-2 border-amber-200 rounded-xl px-4 py-3 focus:ring-4 focus:ring-amber-500/20 focus:border-amber-500 bg-white/80 backdrop-blur-sm transition-all duration-200 resize-none"
                                    placeholder={isArabicLocale ? 'اكتب سؤالك هنا...' : 'Write your question here...'}
                                />
                                {errors.question_ar && (
                                    <p className="text-red-600 text-sm">{errors.question_ar}</p>
                                )}
                            </div>

                            {/* English Question */}
                            <div className={`space-y-4 ${!showEnglish ? 'opacity-50' : ''}`}>
                                <label className="block text-lg font-semibold text-gray-700">
                                    {isArabicLocale ? 'السؤال بالإنجليزية' : 'Question in English'}
                                </label>
                                <textarea
                                    value={data.question_en}
                                    onChange={(e) => setData('question_en', e.target.value)}
                                    rows={4}
                                    className="w-full border-2 border-amber-200 rounded-xl px-4 py-3 focus:ring-4 focus:ring-amber-500/20 focus:border-amber-500 bg-white/80 backdrop-blur-sm transition-all duration-200 resize-none"
                                    placeholder="Write your question here..."
                                />
                                {errors.question_en && (
                                    <p className="text-red-600 text-sm">{errors.question_en}</p>
                                )}
                            </div>
                        </div>

                        {/* Additional Fields */}
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-gray-700">
                                    {isArabicLocale ? 'اسم المرسل' : 'Submitter Name'}
                                </label>
                                <input
                                    type="text"
                                    value={data.submitter_name}
                                    onChange={(e) => setData('submitter_name', e.target.value)}
                                    className="w-full border-2 border-amber-200 rounded-xl px-4 py-3 focus:ring-4 focus:ring-amber-500/20 focus:border-amber-500 bg-white/80 backdrop-blur-sm transition-all duration-200"
                                    placeholder={isArabicLocale ? 'اسمك الكامل' : 'Your full name'}
                                />
                                {errors.submitter_name && (
                                    <p className="text-red-600 text-sm">{errors.submitter_name}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-gray-700">
                                    {isArabicLocale ? 'البريد الإلكتروني' : 'Email'}
                                </label>
                                <input
                                    type="email"
                                    value={data.submitter_email}
                                    onChange={(e) => setData('submitter_email', e.target.value)}
                                    className="w-full border-2 border-amber-200 rounded-xl px-4 py-3 focus:ring-4 focus:ring-amber-500/20 focus:border-amber-500 bg-white/80 backdrop-blur-sm transition-all duration-200"
                                    placeholder={isArabicLocale ? 'بريدك الإلكتروني' : 'Your email address'}
                                />
                                {errors.submitter_email && (
                                    <p className="text-red-600 text-sm">{errors.submitter_email}</p>
                                )}
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-gray-700">
                                    {isArabicLocale ? 'اسفار الكتاب المقدس' : 'Bible Book'}
                                </label>
                                <select
                                    value={data.bible_book_id}
                                    onChange={(e) => setData('bible_book_id', e.target.value)}
                                    className="w-full border-2 border-amber-200 rounded-xl px-4 py-3 focus:ring-4 focus:ring-amber-500/20 focus:border-amber-500 bg-white/80 backdrop-blur-sm transition-all duration-200"
                                >
                                    <option value="">{isArabicLocale ? 'اخترالسفر' : 'Select Bible Book'}</option>
                                    {bibleBooks.map((book) => (
                                        <option key={book.id} value={book.id}>
                                            {getLocalizedName(book)}
                                        </option>
                                    ))}
                                </select>
                                {errors.bible_book_id && (
                                    <p className="text-red-600 text-sm">{errors.bible_book_id}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-gray-700">
                                    {isArabicLocale ? 'الموضوع' : 'Topic'}
                                </label>
                                <select
                                    value={data.topic_id}
                                    onChange={(e) => setData('topic_id', e.target.value)}
                                    className="w-full border-2 border-amber-200 rounded-xl px-4 py-3 focus:ring-4 focus:ring-amber-500/20 focus:border-amber-500 bg-white/80 backdrop-blur-sm transition-all duration-200"
                                >
                                    <option value="">{isArabicLocale ? 'اختر الموضوع' : 'Select Topic'}</option>
                                    {topics.map((topic) => (
                                        <option key={topic.id} value={topic.id}>
                                            {getLocalizedName(topic)}
                                        </option>
                                    ))}
                                </select>
                                {errors.topic_id && (
                                    <p className="text-red-600 text-sm">{errors.topic_id}</p>
                                )}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="block text-sm font-semibold text-gray-700">
                                {isArabicLocale ? 'الفصل والآية (اختياري)' : 'Chapter & Verse (Optional)'}
                            </label>
                            <input
                                type="text"
                                value={data.chapter_verse}
                                onChange={(e) => setData('chapter_verse', e.target.value)}
                                className="w-full border-2 border-amber-200 rounded-xl px-4 py-3 focus:ring-4 focus:ring-amber-500/20 focus:border-amber-500 bg-white/80 backdrop-blur-sm transition-all duration-200"
                                placeholder={isArabicLocale ? 'مثال: يوحنا 3:16' : 'Example: John 3:16'}
                            />
                            {errors.chapter_verse && (
                                <p className="text-red-600 text-sm">{errors.chapter_verse}</p>
                            )}
                        </div>

                        {/* Submit Button */}
                        <div className="pt-6 border-t border-amber-200/50">
                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full bg-gradient-to-r from-amber-600 to-red-700 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 hover:from-amber-700 hover:to-red-800 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-3"
                            >
                                <CopticCrossIcon className="text-white h-6 w-6" size={24} />
                                <Send className="h-6 w-6" />
                                <span>
                                    {processing
                                        ? (isArabicLocale ? 'جاري الإرسال...' : 'Submitting...')
                                        : (isArabicLocale ? 'إرسال السؤال' : 'Submit Question')
                                    }
                                </span>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </PublicLayout>
    );
}
