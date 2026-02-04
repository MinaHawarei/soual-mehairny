import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link } from '@inertiajs/react';
import { ArrowLeft, BookOpen, Tag, Calendar, User, Play, Share2 } from 'lucide-react';
import PublicLayout from '@/layouts/public-layout';
import { isArabic, buildLocalizedPath } from '@/lib/locale';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { OrnamentFrame } from '@/components/ui/ornament-frame';
import { OrnamentDivider } from '@/components/ui/ornament-divider';
import { AuthorityCard } from '@/components/ui/authority-card';

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
    lecturer_name_ar?: string | null;
    lecturer_name_en?: string | null;
    lecturer_role_ar?: string | null;
    lecturer_role_en?: string | null;
    reviewer_name_ar?: string | null;
    reviewer_name_en?: string | null;
    reviewer_role_ar?: string | null;
    reviewer_role_en?: string | null;
}

interface PageProps {
    question: Question;
}

export default function QuestionShow({ question }: PageProps) {
    const isArabicLocale = isArabic();
    const [toastMessage, setToastMessage] = useState<string | null>(null);
    const toastTimeoutRef = useRef<number | null>(null);

    const getLocalizedName = (item: { name_ar: string; name_en: string }) => {
        return isArabicLocale ? item.name_ar : item.name_en;
    };

    const localizedQuestion = useMemo(() => {
        return isArabicLocale ? question.question_ar : question.question_en;
    }, [isArabicLocale, question.question_ar, question.question_en]);

    const localizedAnswer = useMemo(() => {
        return isArabicLocale ? question.answer_ar : question.answer_en;
    }, [isArabicLocale, question.answer_ar, question.answer_en]);

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString(isArabicLocale ? 'ar-EG' : 'en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const lecturer = useMemo(() => {
        const defaultName = isArabicLocale ? question.submitter_name_ar : question.submitter_name_en;
        const defaultRole = '';

        const lecturerName =
            (isArabicLocale ? question.lecturer_name_ar : question.lecturer_name_en) ||
            defaultName ||
            '';

        const getInitials = (name: string): string => {
            if (!name) return '';

            const titles = new Set([
                // Arabic
                'د', 'د.', 'أ', 'أ.', 'أد', 'أ.د', 'أ.د.', 'م', 'م.',
                'دكتور', 'أستاذ', 'الأستاذ', 'الدكتور',
                // English
                'dr', 'dr.', 'prof', 'prof.', 'mr', 'mr.', 'ms', 'ms.', 'mrs', 'mrs.'
            ]);

            const parts = name
                .replace(/[.]/g, '')      // remove dots like "د." / "Dr."
                .trim()
                .split(/\s+/)
                .filter(Boolean)
                .filter(word => {
                    const w = word.toLowerCase();
                    return !titles.has(w) && w.length > 1;
                });

            if (parts.length === 0) return '';
            if (parts.length === 1) return parts[0].charAt(0).toUpperCase();

            return parts
                .slice(0, 2)
                .map(word => word.charAt(0).toUpperCase())
                .join('.');
        };

        const fallbackInitials = getInitials(lecturerName);

        return {
            name: lecturerName,
            role: (isArabicLocale ? question.lecturer_role_ar : question.lecturer_role_en) || defaultRole,
            fallback: fallbackInitials || ' '
        };
    }, [
        isArabicLocale,
        question.lecturer_name_ar,
        question.lecturer_name_en,
        question.lecturer_role_ar,
        question.lecturer_role_en,
        question.submitter_name_ar,
        question.submitter_name_en
    ]);


    const answerText = localizedAnswer || '';
    const answerExcerpt = useMemo(() => {
        if (!answerText) return '';

        const cleaned = answerText.replace(/\s+/g, ' ').trim();
        const maxLength = 140;

        if (cleaned.length <= maxLength) {
            return cleaned;
        }

        return cleaned.slice(0, maxLength).replace(/\s+\S*$/, '') + '…';
    }, [answerText]);


    const showToast = useCallback((message: string) => {
        setToastMessage(message);

        if (toastTimeoutRef.current) {
            window.clearTimeout(toastTimeoutRef.current);
        }

        toastTimeoutRef.current = window.setTimeout(() => {
            setToastMessage(null);
            toastTimeoutRef.current = null;
        }, 2400);
    }, []);

    useEffect(() => {
        return () => {
            if (toastTimeoutRef.current) {
                window.clearTimeout(toastTimeoutRef.current);
            }
        };
    }, []);

    const copyToClipboard = useCallback(async (text: string) => {
        if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
            await navigator.clipboard.writeText(text);
            return;
        }

        if (typeof document !== 'undefined') {
            const textarea = document.createElement('textarea');
            textarea.value = text;
            textarea.setAttribute('readonly', '');
            textarea.style.position = 'absolute';
            textarea.style.left = '-9999px';
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
        }
    }, []);

    const handleShare = useCallback(async () => {
        const title = localizedQuestion?.trim() || (isArabicLocale ? 'سؤال' : 'Question');
        const url = typeof window !== 'undefined' ? window.location.href : '';

        const excerpt =
            (answerExcerpt || '').trim() ||
            (isArabicLocale ? 'إجابة مميزة لسؤالك.' : 'A thoughtful answer to your question.');

        const shareText = isArabicLocale
            ? `${title}\n\n${excerpt}\n\n لمتابعة القراءة: ${url}`
            : `${title}\n\n${excerpt}\n\n Continue reading: ${url}`;


        try {
            // Mobile share sheet (if available)
            if (typeof navigator !== 'undefined' && navigator.share) {
                await navigator.share({
                    title,
                    text: shareText,
                    url
                });
                return;
            }

            // Desktop fallback: copy the full message (not URL only)
            await copyToClipboard(shareText);
            showToast(isArabicLocale ? 'تم نسخ نص المشاركة' : 'Share text copied');
        } catch (error) {
            await copyToClipboard(shareText);
            showToast(isArabicLocale ? 'تم نسخ نص المشاركة' : 'Share text copied');
        }
    }, [answerExcerpt, copyToClipboard, isArabicLocale, localizedQuestion, showToast]);

    const getYoutubeEmbedUrl = useCallback((value: string) => {
        if (!value) {
            return null;
        }

        if (value.includes('youtube.com') || value.includes('youtu.be')) {
            try {
                const url = new URL(value);
                const id = url.searchParams.get('v') || url.pathname.split('/').pop();
                return id ? `https://www.youtube.com/embed/${id}` : null;
            } catch (error) {
                return null;
            }
        }

        return `https://www.youtube.com/embed/${value.split('&')[0]}`;
    }, []);

    const videoUrl = question.youtube_video_id ? getYoutubeEmbedUrl(question.youtube_video_id) : null;

    return (
        <PublicLayout>
            <div className="max-w-5xl mx-auto pb-24">
                <OrnamentFrame className="bg-paper shadow-parchment">
                    <div className="space-y-12 md:space-y-16">
                        {/* Back Navigation */}
                        <div className="flex items-center">
                            <Button variant="ghost" asChild className="pl-0 text-muted-foreground hover:text-primary hover:bg-transparent">
                                <Link href={buildLocalizedPath('questions')} className="flex items-center gap-2">
                                    <ArrowLeft className="h-4 w-4 rtl:rotate-180" />
                                    <span className="font-semibold">{isArabicLocale ? 'العودة إلى الأسئلة' : 'Back to Questions'}</span>
                                </Link>
                            </Button>
                        </div>

                        {/* Question Section */}
                        <div className="space-y-6 text-center">


                            <div className="mx-auto max-w-3xl space-y-4">
                                <h1 className="text-3xl md:text-5xl lg:text-6xl font-heading font-bold text-primary leading-[1.15] tracking-tight drop-shadow-sm">
                                    {localizedQuestion}
                                </h1>

                                <div className="mx-auto h-px w-24 bg-ornament/60" />

                                <div className="flex flex-wrap items-center justify-center gap-3 text-sm text-muted-foreground font-reading">
                                    {question.topic && (
                                        <Badge variant="outline" className="text-muted-foreground border-ornament/50 font-normal py-1 px-3">
                                            <Tag className="h-3 w-3 mr-2 rtl:ml-2 rtl:mr-0" />
                                            {getLocalizedName(question.topic)}
                                        </Badge>
                                    )}
                                    {question.bible_book && (
                                        <Badge variant="outline" className="text-muted-foreground border-ornament/50 font-normal py-1 px-3">
                                            <BookOpen className="h-3 w-3 mr-2 rtl:ml-2 rtl:mr-0" />
                                            {getLocalizedName(question.bible_book)}
                                        </Badge>
                                    )}
                                </div>
                            </div>
                        </div>



                        {/* Answer Section */}
                        <div className="space-y-12">
                            {/* Authority Header */}
                            <div className="flex flex-col gap-6 rounded-xl border border-ornament/20 bg-paper/70 p-2 md:flex-row md:items-center md:justify-between">
                                <div className="space-y-2">

                                    <div className="flex flex-col gap-4 md:flex-row md:items-center">
                                        <AuthorityCard
                                            name={lecturer.name}
                                            role={lecturer.role}
                                            fallbackParams={lecturer.fallback}
                                            date={question.created_at}
                                            isArabicLocale={isArabicLocale}
                                            className="w-full md:w-auto min-w-[260px]"
                                        />

                                    </div>
                                </div>
                                <div className="flex flex-col items-start gap-3 md:items-end">

                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={handleShare}
                                        className="border-seal/40 bg-seal/10 text-seal hover:bg-seal/20"
                                    >
                                        <Share2 className="h-4 w-4" />
                                        {isArabicLocale ? 'مشاركة الإجابة' : 'Share Answer'}
                                    </Button>
                                </div>
                            </div>

                            <OrnamentDivider className="py-1" />

                            {/* Video if exists */}
                            {videoUrl && (
                                <section className="space-y-6">
                                    <div className="flex items-center gap-3 text-ornament">
                                        <Play className="h-5 w-5" />
                                        <h2 className="text-xl font-heading font-bold">
                                            {isArabicLocale ? 'فيديو' : 'Video'}
                                        </h2>
                                    </div>
                                    <div className="rounded-2xl overflow-hidden border border-ornament/30 shadow-parchment bg-black/90">
                                        <div className="aspect-video">
                                            <iframe
                                                width="100%"
                                                height="100%"
                                                src={videoUrl}
                                                title={localizedQuestion}
                                                loading="lazy"
                                                frameBorder="0"
                                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                referrerPolicy="strict-origin-when-cross-origin"
                                                allowFullScreen
                                            ></iframe>
                                        </div>
                                    </div>
                                </section>
                            )}

                            {/* Content */}
                            <article className="prose-reading text-foreground/90 max-w-none rounded-2xl border border-ornament/15 bg-paper/60 px-5 py-8 shadow-[inset_0_1px_0_rgba(255,255,255,0.4)] md:px-8">
                                <div style={{ whiteSpace: 'pre-line' }}>
                                    {answerText}
                                </div>
                            </article>




                        </div>

                    </div>
                </OrnamentFrame>
            </div>

            {toastMessage && (
                <div
                    role="status"
                    aria-live="polite"
                    className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-full border border-ornament/40 bg-paper px-4 py-2 text-sm text-foreground shadow-lg"
                >
                    {toastMessage}
                </div>
            )}
        </PublicLayout>
    );
}
