import { Link } from '@inertiajs/react';
import { Search, BookOpen, MessageCircle, Play } from 'lucide-react';
import PublicLayout from '@/layouts/public-layout';
import { useState } from 'react';
import { router } from '@inertiajs/react';
import { isArabic, buildLocalizedPath, buildLocalizedPathWithParams } from '@/lib/locale';
import CopticCrossIcon from '@/components/CopticCrossIcon';

export default function Home() {
    const [searchQuery, setSearchQuery] = useState('');
    const [bibleBookId, setBibleBookId] = useState('');
    const [topicId, setTopicId] = useState('');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        const params: Record<string, string> = {};
        if (searchQuery) params.search = searchQuery;
        if (bibleBookId) params.bible_book_id = bibleBookId;
        if (topicId) params.topic_id = topicId;

        router.visit(buildLocalizedPathWithParams('questions', params));
    };

    const isArabicLocale = isArabic();

    return (
        <PublicLayout>
            {/* Enhanced Hero Section */}
            <div className="bg-gradient-to-br from-amber-600 via-red-700 to-blue-800 text-white relative overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute inset-0" style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                    }}></div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 relative z-10">
                    <div className="text-center">
                        <div className="flex items-center justify-center space-x-4 mb-8">
                            <CopticCrossIcon
                                className="text-amber-300 h-16 w-16 drop-shadow-2xl"
                                size={64}
                            />
                            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-amber-200 via-white to-blue-200 bg-clip-text text-transparent">
                                {isArabicLocale ? 'سؤال محيرني' : 'Soual Mehairny'}
                            </h1>
                            <CopticCrossIcon
                                className="text-amber-300 h-16 w-16 drop-shadow-2xl"
                                size={64}
                            />
                        </div>
                        <p className="text-xl md:text-2xl mb-12 max-w-4xl mx-auto leading-relaxed opacity-95">
                            {isArabicLocale
                                ? 'منصة مسيحية أرثوذكسية تجمع الأسئلة العقائدية وتقدم إجابات شاملة بالنص والفيديو'
                                : 'A Christian Orthodox platform that collects doctrinal questions and provides comprehensive answers in text and video format'
                            }
                        </p>
                        <div className="flex flex-col sm:flex-row gap-6 justify-center">
                            <Link
                                href={buildLocalizedPath('questions')}
                                className="group bg-white text-amber-700 px-10 py-4 rounded-2xl font-bold text-lg shadow-2xl hover:shadow-amber-500/25 transform hover:-translate-y-1 transition-all duration-300 hover:bg-amber-50"
                            >
                                <span className="flex items-center justify-center space-x-3">
                                    <BookOpen className="h-6 w-6 group-hover:scale-110 transition-transform duration-200" />
                                    <span>{isArabicLocale ? 'استكشف الأسئلة' : 'Explore Questions'}</span>
                                </span>
                            </Link>
                            <Link
                                href={buildLocalizedPath('questions/create')}
                                className="group border-2 border-white text-white px-10 py-4 rounded-2xl font-bold text-lg hover:bg-white hover:text-amber-700 transform hover:-translate-y-1 transition-all duration-300 shadow-lg hover:shadow-2xl"
                            >
                                <span className="flex items-center justify-center space-x-3">
                                    <MessageCircle className="h-6 w-6 group-hover:scale-110 transition-transform duration-200" />
                                    <span>{isArabicLocale ? 'أرسل سؤالاً' : 'Submit a Question'}</span>
                                </span>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Enhanced Search Section */}
            <div className="bg-gradient-to-br from-amber-50 to-blue-50 py-16">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <div className="flex items-center justify-center space-x-3 mb-6">
                            <CopticCrossIcon
                                className="text-amber-600 h-8 w-8"
                                size={32}
                            />
                            <h2 className="text-4xl font-bold bg-gradient-to-r from-amber-700 via-red-800 to-blue-900 bg-clip-text text-transparent">
                                {isArabicLocale ? 'ابحث في الأسئلة' : 'Search Questions'}
                            </h2>
                            <CopticCrossIcon
                                className="text-amber-600 h-8 w-8"
                                size={32}
                            />
                        </div>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            {isArabicLocale
                                ? 'ابحث في قاعدة البيانات الشاملة للأسئلة والإجابات العقائدية'
                                : 'Search our comprehensive database of doctrinal questions and answers'
                            }
                        </p>
                    </div>

                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-amber-200/50 p-8">
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
                        </form>
                    </div>
                </div>
            </div>

            {/* Enhanced Features Section */}
            <div className="bg-gradient-to-br from-white to-amber-50/30 py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <div className="flex items-center justify-center space-x-3 mb-6">
                            <CopticCrossIcon
                                className="text-amber-600 h-8 w-8"
                                size={32}
                            />
                            <h2 className="text-4xl font-bold bg-gradient-to-r from-amber-700 via-red-800 to-blue-900 bg-clip-text text-transparent">
                                {isArabicLocale ? 'مميزات المنصة' : 'Platform Features'}
                            </h2>
                            <CopticCrossIcon
                                className="text-amber-600 h-8 w-8"
                                size={32}
                            />
                        </div>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            {isArabicLocale
                                ? 'اكتشف ما يجعل منصة سؤال محيرني فريدة من نوعها'
                                : 'Discover what makes Soual Mehairny platform unique'
                            }
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {/* Feature 1 */}
                        <div className="group bg-gradient-to-br from-white to-amber-50/50 rounded-2xl shadow-lg border border-amber-200/50 p-8 text-center hover:shadow-2xl hover:shadow-amber-500/10 hover:border-amber-300/50 transition-all duration-300 transform hover:-translate-y-2">
                            <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-red-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                                <BookOpen className="h-8 w-8 text-white" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-4">
                                {isArabicLocale ? 'أسئلة عقائدية شاملة' : 'Comprehensive Doctrinal Questions'}
                            </h3>
                            <p className="text-gray-600 leading-relaxed">
                                {isArabicLocale
                                    ? 'مجموعة واسعة من الأسئلة العقائدية مع إجابات مفصلة ومستندة إلى الكتاب المقدس'
                                    : 'A wide range of doctrinal questions with detailed answers based on biblical teachings'
                                }
                            </p>
                        </div>

                        {/* Feature 2 */}
                        <div className="group bg-gradient-to-br from-white to-blue-50/50 rounded-2xl shadow-lg border border-blue-200/50 p-8 text-center hover:shadow-2xl hover:shadow-blue-500/10 hover:border-blue-300/50 transition-all duration-300 transform hover:-translate-y-2">
                            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                                <MessageCircle className="h-8 w-8 text-white" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-4">
                                {isArabicLocale ? 'إجابات من خبراء' : 'Expert Answers'}
                            </h3>
                            <p className="text-gray-600 leading-relaxed">
                                {isArabicLocale
                                    ? 'إجابات مكتوبة ومقاطع فيديو من خبراء في اللاهوت والعقيدة المسيحية'
                                    : 'Written answers and video clips from experts in theology and Christian doctrine'
                                }
                            </p>
                        </div>

                        {/* Feature 3 */}
                        <div className="group bg-gradient-to-br from-white to-red-50/50 rounded-2xl shadow-lg border border-red-200/50 p-8 text-center hover:shadow-2xl hover:shadow-red-500/10 hover:border-red-300/50 transition-all duration-300 transform hover:-translate-y-2">
                            <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                                <Play className="h-8 w-8 text-white" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-4">
                                {isArabicLocale ? 'محتوى متعدد الوسائط' : 'Multimedia Content'}
                            </h3>
                            <p className="text-gray-600 leading-relaxed">
                                {isArabicLocale
                                    ? 'مقاطع فيديو تعليمية ومواد صوتية لتعزيز الفهم والتعلم'
                                    : 'Educational videos and audio materials to enhance understanding and learning'
                                }
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Enhanced CTA Section */}
            <div className="bg-gradient-to-br from-amber-600 via-red-700 to-blue-800 py-20">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="flex items-center justify-center space-x-4 mb-8">
                        <CopticCrossIcon
                            className="text-amber-200 h-12 w-12 drop-shadow-lg"
                            size={48}
                        />
                        <h2 className="text-4xl font-bold text-white">
                            {isArabicLocale ? 'ابدأ رحلتك اليوم' : 'Start Your Journey Today'}
                        </h2>
                        <CopticCrossIcon
                            className="text-amber-200 h-12 w-12 drop-shadow-lg"
                            size={48}
                        />
                    </div>
                    <p className="text-xl text-amber-100 mb-10 max-w-2xl mx-auto leading-relaxed">
                        {isArabicLocale
                            ? 'انضم إلى مجتمعنا المسيحي واستكشف الإجابات على أسئلتك العقائدية'
                            : 'Join our Christian community and explore answers to your doctrinal questions'
                        }
                    </p>
                    <div className="flex flex-col sm:flex-row gap-6 justify-center">
                        <Link
                            href={buildLocalizedPath('questions')}
                            className="group bg-white text-amber-700 px-10 py-4 rounded-2xl font-bold text-lg shadow-2xl hover:shadow-amber-500/25 transform hover:-translate-y-1 transition-all duration-300 hover:bg-amber-50"
                        >
                            <span className="flex items-center justify-center space-x-3">
                                <BookOpen className="h-6 w-6 group-hover:scale-110 transition-transform duration-200" />
                                <span>{isArabicLocale ? 'استكشف الأسئلة' : 'Explore Questions'}</span>
                            </span>
                        </Link>
                        <Link
                            href={buildLocalizedPath('questions/create')}
                            className="group border-2 border-white text-white px-10 py-4 rounded-2xl font-bold text-lg hover:bg-white hover:text-amber-700 transform hover:-translate-y-1 transition-all duration-300 shadow-lg hover:shadow-2xl"
                        >
                            <span className="flex items-center justify-center space-x-3">
                                <MessageCircle className="h-6 w-6 group-hover:scale-110 transition-transform duration-200" />
                                <span>{isArabicLocale ? 'أرسل سؤالاً' : 'Submit a Question'}</span>
                            </span>
                        </Link>
                    </div>
                </div>
            </div>
        </PublicLayout>
    );
}
