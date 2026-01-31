
import { Link } from '@inertiajs/react';
import { ArrowLeft, BookOpen, Tag, Calendar, User, Play, Share2 } from 'lucide-react';
import PublicLayout from '@/layouts/public-layout';
import { isArabic, buildLocalizedPath } from '@/lib/locale';
import CopticCrossIcon from '@/components/CopticCrossIcon';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { OrthodoxCard } from '@/components/ui/orthodox-card';
import { SealBadge } from '@/components/ui/seal-badge';
import { OrnamentDivider } from '@/components/ui/ornament-divider';

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
            <div className="max-w-4xl mx-auto space-y-8">
                {/* Back Navigation */}
                <Button variant="ghost" asChild className="pl-0 text-muted-foreground hover:text-primary">
                    <Link href={buildLocalizedPath('questions')}>
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        {isArabicLocale ? 'العودة إلى الأسئلة' : 'Back to Questions'}
                    </Link>
                </Button>

                {/* Question Header (The Questioner) */}
                <div className="space-y-6 text-center border-b border-border pb-8">
                    <div className="flex flex-wrap justify-center gap-2">
                        {question.topic && (
                            <Badge variant="outline" className="text-muted-foreground font-normal">
                                <Tag className="h-3 w-3 mr-1" />
                                {getLocalizedName(question.topic)}
                            </Badge>
                        )}
                        {question.bible_book && (
                            <Badge variant="outline" className="text-muted-foreground font-normal">
                                <BookOpen className="h-3 w-3 mr-1" />
                                {getLocalizedName(question.bible_book)}
                            </Badge>
                        )}
                    </div>

                    <h1 className="text-3xl md:text-5xl font-heading font-bold text-primary leading-tight tracking-tight">
                        {getLocalizedQuestion()}
                    </h1>

                    <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
                        {question.submitter_name_ar && (
                            <span className="flex items-center gap-1">
                                <User className="h-4 w-4" />
                                {isArabicLocale ? question.submitter_name_ar : question.submitter_name_en}
                            </span>
                        )}
                        <span>•</span>
                        <span className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {formatDate(question.created_at)}
                        </span>
                    </div>
                </div>


                {/* Answer Section (The Living Manuscript) */}
                {question.answer_ar || question.answer_en ? (
                    <div className="space-y-8">

                        {/* Video if exists */}
                        {question.youtube_video_id && (
                            <Card className="overflow-hidden bg-black/5 border-none">
                                <div className="aspect-video">
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
                            </Card>
                        )}

                        {/* The Text Answer */}
                        <OrthodoxCard variant="ornate" className="relative">
                            <CardContent className="p-8 md:p-12">
                                <div className="flex items-center justify-between mb-8 border-b border-border/50 pb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                            <CopticCrossIcon size={20} />
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-foreground">
                                                {isArabicLocale ? 'الإجابة المعتمدة' : 'Verified Answer'}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                {isArabicLocale ? 'تمت المراجعة بواسطة الآباء' : 'Reviewed by Fathers'}
                                            </p>
                                        </div>
                                    </div>
                                    <SealBadge>
                                        {isArabicLocale ? 'موثوق' : 'Verified'}
                                    </SealBadge>
                                </div>

                                <div className="prose prose-lg dark:prose-invert max-w-none text-foreground font-reading leading-loose">
                                    <div style={{ whiteSpace: 'pre-line' }}>
                                        {getLocalizedAnswer()}
                                    </div>
                                </div>

                                <div className="mt-12 pt-6 border-t border-border/50 flex justify-between items-center text-sm text-muted-foreground">
                                    <div className="flex gap-4">
                                        <button className="flex items-center gap-2 hover:text-primary transition-colors">
                                            <Share2 className="h-4 w-4" />
                                            {isArabicLocale ? 'مشاركة' : 'Share'}
                                        </button>
                                    </div>
                                    <CopticCrossIcon size={16} className="text-ornament" />
                                </div>
                            </CardContent>
                        </OrthodoxCard>
                    </div>
                ) : (
                    <Card className="bg-secondary/20 border-border text-center py-16">
                        <CardContent className="space-y-4">
                            <div className="h-16 w-16 bg-background rounded-full flex items-center justify-center mx-auto border border-border">
                                <BookOpen className="h-8 w-8 text-muted-foreground" />
                            </div>
                            <h3 className="text-xl font-heading font-semibold text-foreground">
                                {isArabicLocale ? 'لم يتم الرد على هذا السؤال بعد' : 'This question has not been answered yet'}
                            </h3>
                            <p className="text-muted-foreground max-w-md mx-auto">
                                {isArabicLocale
                                    ? 'سيتم الرد على هذا السؤال من قبل فريق من الخبراء قريباً. شكراً لصبركم.'
                                    : 'This question will be answered by our team of experts soon. Thank you for your patience.'
                                }
                            </p>
                            <div className="pt-4">
                                <Link href={buildLocalizedPath('questions/create')}>
                                    <Button variant="outline">
                                        {isArabicLocale ? 'أرسل سؤالاً آخر' : 'Submit Another Question'}
                                    </Button>
                                </Link>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Footer Actions */}
                <div className="flex justify-center pt-8">
                    <Link href={buildLocalizedPath('questions')}>
                        <Button variant="link" size="lg" className="text-muted-foreground">
                            {isArabicLocale ? 'استكشف المزيد من الأسئلة' : 'Explore More Questions'}
                        </Button>
                    </Link>
                </div>
            </div>
        </PublicLayout>
    );
}
