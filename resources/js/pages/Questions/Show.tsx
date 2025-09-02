import { Link } from '@inertiajs/react';
import { ArrowLeft, BookOpen, Tag, Calendar, User, Play, ExternalLink } from 'lucide-react';
import PublicLayout from '@/layouts/public-layout';
import { isArabic, buildLocalizedPath } from '@/lib/locale';
import CopticCrossIcon from '@/components/CopticCrossIcon';

interface Question {
    id: number;
    question_ar: string;
    question_en: string;
    answer_ar: string | null;
    answer_en: string | null;
    youtube_video_id: string | null;
    submitter_name_ar: string | null;
    submitter_name_en: string | null;
    submitter_email: string | null;
    chapter_verse: string | null;
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

interface PageProps {
    question: Question;
}

export default function QuestionShow({ question }: PageProps) {
    const isArabicLocale = isArabic();

    const getLocalizedName = (item: { name_ar: string; name_en: string }) => {
        return isArabicLocale ? item.name_ar : item.name_en;
    };

    const getLocalizedQuestion = () => {
        return isArabicLocale ? question.question_ar : question.question_en;
    };

    const getLocalizedAnswer = () => {
        return isArabicLocale ? question.answer_ar : question.answer_en;
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString(isArabicLocale ? 'ar-EG' : 'en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <PublicLayout>
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Back Navigation */}
                <div className="mb-8">
                    <Link
                        href={buildLocalizedPath('questions')}
                        className="inline-flex items-center text-amber-700 hover:text-amber-800 px-4 py-2 rounded-lg hover:bg-amber-50 transition-colors duration-200 group"
                    >
                        <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform duration-200" />
                        {isArabicLocale ? 'العودة إلى الأسئلة' : 'Back to Questions'}
                    </Link>
                </div>

                {/* Enhanced Question Header */}
                <div className="bg-gradient-to-br from-white to-amber-50/50 rounded-2xl shadow-xl border border-amber-200/50 p-8 mb-8 backdrop-blur-sm">
                    <div className="flex items-center justify-center space-x-4 mb-6">
                        <CopticCrossIcon
                            className="text-amber-600 h-8 w-8 drop-shadow-lg"
                            size={32}
                        />
                        <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-amber-700 via-red-800 to-blue-900 bg-clip-text text-transparent leading-relaxed text-center">
                            {getLocalizedQuestion()}
                        </h1>
                        <CopticCrossIcon
                            className="text-amber-600 h-8 w-8 drop-shadow-lg"
                            size={32}
                        />
                    </div>

                    {/* Enhanced Meta Information */}
                    <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-gray-500 mb-6">
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

                        {question.chapter_verse && (
                            <div className="flex items-center space-x-2 bg-green-100 px-4 py-2 rounded-full border border-green-200/50">
                                <BookOpen className="h-4 w-4 text-green-600" />
                                <span className="font-medium">{question.chapter_verse}</span>
                            </div>
                        )}

                        <div className="flex items-center space-x-2 bg-gray-100 px-4 py-2 rounded-full border border-gray-200/50">
                            <Calendar className="h-4 w-4 text-gray-600" />
                            <span className="font-medium">
                                {formatDate(question.created_at)}
                            </span>
                        </div>

                    </div>
                      {/* Submitter Information */}
                        {question.submitter_name_ar && (
                            <div className="text-center">
                                <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-amber-100 to-blue-100 px-6 py-3 rounded-full border border-amber-200/50">
                                    <User className="h-4 w-4 text-amber-600" />
                                    <span className="text-gray-700 font-medium">
                                        {isArabicLocale ? `بواسطة ${question.submitter_name_ar}` : `By ${question.submitter_name_en}`}
                                    </span>
                                </div>
                            </div>
                        )}

                </div>

                {/* Enhanced Video Section */}
                {question.youtube_video_id && (
                    <div className="bg-gradient-to-br from-red-50 to-pink-50 rounded-2xl shadow-xl border border-red-200/50 p-8 mb-8 backdrop-blur-sm">
                        <div className="flex items-center justify-center space-x-3 mb-6">
                            <Play className="h-6 w-6 text-red-600" />
                            <h2 className="text-2xl font-bold text-gray-900">
                                {isArabicLocale ? 'فيديو شرح' : 'Explanation Video'}
                            </h2>
                        </div>

                        <div className="aspect-video rounded-xl overflow-hidden border border-red-200/50">
                            <iframe
                                width="100%"
                                height="100%"
                                src={`https://www.youtube.com/embed/${question.youtube_video_id.split('&')[0]}`}
                                title={getLocalizedQuestion()}
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            ></iframe>
                        </div>
                    </div>
                )}

                {/* Enhanced Answer Section */}
                {question.answer_ar || question.answer_en ? (
                    <div className="bg-gradient-to-br from-white to-blue-50/50 rounded-2xl shadow-xl border border-blue-200/50 p-8 mb-8 backdrop-blur-sm">
                        <div className="flex items-center justify-center space-x-3 mb-6">
                            <CopticCrossIcon
                                className="text-blue-600 h-6 w-6"
                                size={24}
                            />
                            <h2 className="text-2xl font-bold text-gray-900">
                                {isArabicLocale ? 'الإجابة' : 'Answer'}
                            </h2>
                            <CopticCrossIcon
                                className="text-blue-600 h-6 w-6"
                                size={24}
                            />
                        </div>

                        <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed" style={{ whiteSpace: 'pre-line' }}>
                            <p className="text-lg leading-relaxed">
                                {getLocalizedAnswer()}
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="bg-gradient-to-br from-amber-50 to-red-50 rounded-2xl shadow-xl border border-amber-200/50 p-8 mb-8 backdrop-blur-sm text-center">
                        <div className="text-amber-500 mb-4">
                            <BookOpen className="h-16 w-16 mx-auto drop-shadow-lg" />
                        </div>
                        <h3 className="text-xl font-semibold text-amber-800 mb-2">
                            {isArabicLocale ? 'لم يتم الرد على هذا السؤال بعد' : 'This question has not been answered yet'}
                        </h3>
                        <p className="text-amber-600 mb-6">
                            {isArabicLocale
                                ? 'سيتم الرد على هذا السؤال من قبل فريق من الخبراء قريباً'
                                : 'This question will be answered by our team of experts soon'
                            }
                        </p>
                        <Link
                            href={buildLocalizedPath('questions/create')}
                            className="inline-flex items-center space-x-3 bg-gradient-to-r from-amber-600 to-red-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 hover:from-amber-700 hover:to-red-800"
                        >
                            <CopticCrossIcon className="text-white h-5 w-5" size={20} />
                            <span>{isArabicLocale ? 'أرسل سؤالاً آخر' : 'Submit Another Question'}</span>
                        </Link>
                    </div>
                )}



                {/* Enhanced Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link
                        href={buildLocalizedPath('questions/create')}
                        className="inline-flex items-center justify-center space-x-3 bg-gradient-to-r from-amber-600 to-red-700 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 hover:from-amber-700 hover:to-red-800"
                    >
                        <CopticCrossIcon className="text-white h-6 w-6" size={24} />
                        <span>{isArabicLocale ? 'أرسل سؤالاً جديداً' : 'Submit a New Question'}</span>
                    </Link>

                    <Link
                        href={buildLocalizedPath('questions')}
                        className="inline-flex items-center justify-center space-x-3 bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 hover:from-blue-700 hover:to-indigo-800"
                    >
                        <BookOpen className="h-6 w-6" />
                        <span>{isArabicLocale ? 'استكشف المزيد من الأسئلة' : 'Explore More Questions'}</span>
                    </Link>
                </div>
            </div>
        </PublicLayout>
    );
}
