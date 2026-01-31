import { Link } from '@inertiajs/react';
import { Search, BookOpen, MessageCircle, Play } from 'lucide-react';
import PublicLayout from '@/layouts/public-layout';
import { useState } from 'react';
import { router } from '@inertiajs/react';
import { isArabic, buildLocalizedPath, buildLocalizedPathWithParams } from '@/lib/locale';
import CopticCrossIcon from '@/components/CopticCrossIcon';
import { Button } from '@/components/ui/button';
import { OrthodoxCard } from '@/components/ui/orthodox-card';
import { OrnamentDivider } from '@/components/ui/ornament-divider';

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
            {/* Hero Section */}
            <div className="relative py-24 overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="text-center space-y-8">
                        <div className="flex items-center justify-center gap-6">
                            <CopticCrossIcon
                                className="text-primary h-16 w-16 opacity-80"
                                size={64}
                            />
                            <h1 className="text-5xl md:text-7xl font-heading font-bold text-primary tracking-tight">
                                {isArabicLocale ? 'سؤال محيرني' : 'Soual Mehairny'}
                            </h1>
                            <CopticCrossIcon
                                className="text-primary h-16 w-16 opacity-80"
                                size={64}
                            />
                        </div>

                        <p className="text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed text-muted-foreground font-reading">
                            {isArabicLocale
                                ? 'منصة مسيحية أرثوذكسية تجمع الأسئلة العقائدية وتقدم إجابات شاملة بالنص والفيديو'
                                : 'A Christian Orthodox platform that collects doctrinal questions and provides comprehensive answers in text and video format'
                            }
                        </p>

                        <div className="flex flex-col sm:flex-row gap-6 justify-center pt-8">
                            <Button size="lg" className="h-14 px-8 text-lg font-bold shadow-parchment" asChild>
                                <Link href={buildLocalizedPath('questions')}>
                                    <BookOpen className="h-5 w-5 mr-3 rtl:ml-3 rtl:mr-0" />
                                    <span>{isArabicLocale ? 'استكشف الأسئلة' : 'Explore Questions'}</span>
                                </Link>
                            </Button>
                            <Button size="lg" variant="outline" className="h-14 px-8 text-lg font-bold border-primary/20 text-primary hover:bg-primary/5" asChild>
                                <Link href={buildLocalizedPath('ask/create')}>
                                    <MessageCircle className="h-5 w-5 mr-3 rtl:ml-3 rtl:mr-0" />
                                    <span>{isArabicLocale ? 'أرسل سؤالاً' : 'Submit a Question'}</span>
                                </Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            <OrnamentDivider className="opacity-50" />

            {/* Search Section */}
            <div className="py-16">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
                    <h2 className="text-3xl font-heading font-bold text-foreground">
                        {isArabicLocale ? 'ابحث في الأسئلة' : 'Search Questions'}
                    </h2>

                    <div className="relative max-w-2xl mx-auto">
                        <form onSubmit={handleSearch} className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground h-5 w-5 rtl:right-4 rtl:left-auto" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder={isArabicLocale ? 'ابحث في الأسئلة والإجابات...' : 'Search questions and answers...'}
                                className="w-full h-14 pl-12 pr-4 rtl:pr-12 rtl:pl-4 rounded-xl border-2 border-border bg-card text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary transition-all text-lg shadow-sm"
                            />
                        </form>
                    </div>
                </div>
            </div>

            {/* Features Section */}
            <div className="py-20 bg-secondary/10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-heading font-bold text-foreground mb-4">
                            {isArabicLocale ? 'مميزات المنصة' : 'Platform Features'}
                        </h2>
                        <div className="w-24 h-1 bg-primary/10 mx-auto rounded-full" />
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <OrthodoxCard className="text-center p-8 hover:-translate-y-1 transition-transform duration-300">
                            <div className="w-16 h-16 bg-primary/5 rounded-full flex items-center justify-center mx-auto mb-6 text-primary">
                                <BookOpen className="h-8 w-8" />
                            </div>
                            <h3 className="text-xl font-bold font-heading mb-4 text-foreground">
                                {isArabicLocale ? 'أسئلة عقائدية شاملة' : 'Comprehensive Questions'}
                            </h3>
                            <p className="text-muted-foreground leading-relaxed">
                                {isArabicLocale
                                    ? 'مجموعة واسعة من الأسئلة العقائدية مع إجابات مفصلة ومستندة إلى الكتاب المقدس'
                                    : 'A wide range of doctrinal questions with detailed answers based on biblical teachings'
                                }
                            </p>
                        </OrthodoxCard>

                        <OrthodoxCard className="text-center p-8 hover:-translate-y-1 transition-transform duration-300">
                            <div className="w-16 h-16 bg-primary/5 rounded-full flex items-center justify-center mx-auto mb-6 text-primary">
                                <MessageCircle className="h-8 w-8" />
                            </div>
                            <h3 className="text-xl font-bold font-heading mb-4 text-foreground">
                                {isArabicLocale ? 'إجابات من خبراء' : 'Expert Answers'}
                            </h3>
                            <p className="text-muted-foreground leading-relaxed">
                                {isArabicLocale
                                    ? 'إجابات مكتوبة ومقاطع فيديو من خبراء في اللاهوت والعقيدة المسيحية'
                                    : 'Written answers and video clips from experts in theology and Christian doctrine'
                                }
                            </p>
                        </OrthodoxCard>

                        <OrthodoxCard className="text-center p-8 hover:-translate-y-1 transition-transform duration-300">
                            <div className="w-16 h-16 bg-primary/5 rounded-full flex items-center justify-center mx-auto mb-6 text-primary">
                                <Play className="h-8 w-8" />
                            </div>
                            <h3 className="text-xl font-bold font-heading mb-4 text-foreground">
                                {isArabicLocale ? 'محتوى متعدد الوسائط' : 'Multimedia Content'}
                            </h3>
                            <p className="text-muted-foreground leading-relaxed">
                                {isArabicLocale
                                    ? 'مقاطع فيديو تعليمية ومواد صوتية لتعزيز الفهم والتعلم'
                                    : 'Educational videos and audio materials to enhance understanding and learning'
                                }
                            </p>
                        </OrthodoxCard>
                    </div>
                </div>
            </div>

            {/* CTA Section */}
            <div className="py-24 text-center">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
                    <CopticCrossIcon
                        className="text-primary/20 h-12 w-12 mx-auto"
                        size={48}
                    />
                    <h2 className="text-4xl font-heading font-bold text-foreground">
                        {isArabicLocale ? 'ابدأ رحلتك اليوم' : 'Start Your Journey Today'}
                    </h2>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        {isArabicLocale
                            ? 'انضم إلى مجتمعنا المسيحي واستكشف الإجابات على أسئلتك العقائدية'
                            : 'Join our Christian community and explore answers to your doctrinal questions'
                        }
                    </p>
                    <div className="pt-4">
                        <Button size="lg" className="h-14 px-10 text-lg font-bold shadow-parchment" asChild>
                            <Link href={buildLocalizedPath('questions')}>
                                {isArabicLocale ? 'تصفح الأسئلة' : 'Browse Questions'}
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>
        </PublicLayout>
    );
}
