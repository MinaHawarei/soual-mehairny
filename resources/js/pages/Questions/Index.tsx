import { Link, router } from '@inertiajs/react';
import { Search, BookOpen, Tag, X } from 'lucide-react';
import PublicLayout from '@/layouts/public-layout';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { OrthodoxCard } from '@/components/ui/orthodox-card';
import { Badge } from '@/components/ui/badge';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { apiGet } from '@/lib/api-client';
import { getCurrentLocale } from '@/lib/locale';
import { getNativeError, isNativeApp } from '@/lib/platform';
import { notifyLocal } from '@/lib/notifications';

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

interface PaginationMeta {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
}

interface PaginationLink {
    label: string;
    page: number | null;
    active: boolean;
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

type QuestionsApiResponse = {
    data: Question[];
    meta: PaginationMeta;
    filters: Filters;
    bible_books: BibleBook[];
    topics: Topic[];
};

const buildNativeLinks = (meta: PaginationMeta): PaginationLink[] => {
    if (meta.last_page <= 1) {
        return [];
    }

    const links: PaginationLink[] = [];
    const current = meta.current_page;

    links.push({
        label: '&laquo;',
        page: current > 1 ? current - 1 : null,
        active: false,
    });

    for (let page = 1; page <= meta.last_page; page += 1) {
        links.push({
            label: String(page),
            page,
            active: page === current,
        });
    }

    links.push({
        label: '&raquo;',
        page: current < meta.last_page ? current + 1 : null,
        active: false,
    });

    return links;
};

export default function QuestionsIndex({ questions, bibleBooks, topics, filters }: PageProps) {
    const native = isNativeApp();
    const nativeError = getNativeError();
    const [nativeData, setNativeData] = useState({
        questions,
        bibleBooks,
        topics,
        filters,
    });
    const [loading, setLoading] = useState(native && !nativeError);
    const [error, setError] = useState<string | null>(nativeError);

    const [searchQuery, setSearchQuery] = useState(filters.search || '');
    const [selectedBibleBook, setSelectedBibleBook] = useState(filters.bible_book_id || '');
    const [selectedTopic, setSelectedTopic] = useState(filters.topic_id || '');

    const locale = getCurrentLocale();
    const isArabic = locale === 'ar';
    const localePrefix = isArabic ? '/ar' : '/en';

    const activeQuestions = native ? nativeData.questions : questions;
    const activeBibleBooks = native ? nativeData.bibleBooks : bibleBooks;
    const activeTopics = native ? nativeData.topics : topics;

    const lastTotalRef = useRef(activeQuestions.total || 0);
    const requestControllerRef = useRef<AbortController | null>(null);

    const buildParams = useCallback(
        (page: number | undefined, overrides: Partial<Filters> = {}) => {
            const params = new URLSearchParams();
            const search = overrides.search ?? searchQuery;
            const bibleBook = overrides.bible_book_id ?? selectedBibleBook;
            const topic = overrides.topic_id ?? selectedTopic;

            if (search) params.append('search', search);
            if (bibleBook && bibleBook !== 'all') params.append('bible_book_id', bibleBook);
            if (topic && topic !== 'all') params.append('topic_id', topic);
            if (page && page > 1) params.append('page', String(page));

            return params;
        },
        [searchQuery, selectedBibleBook, selectedTopic],
    );

    const updateUrl = useCallback(
        (params: URLSearchParams) => {
            const query = params.toString();
            const target = query ? `${localePrefix}/questions?${query}` : `${localePrefix}/questions`;
            window.history.replaceState({}, '', target);
        },
        [localePrefix],
    );

    const fetchQuestions = useCallback(
        async (params: URLSearchParams) => {
            if (!native || nativeError) {
                return;
            }

            requestControllerRef.current?.abort();
            const controller = new AbortController();
            requestControllerRef.current = controller;

            const apiParams = new URLSearchParams(params);
            apiParams.set('locale', locale);
            apiParams.set('per_page', String(activeQuestions.per_page || 5));

            setLoading(true);
            setError(null);

            try {
                const response = await apiGet<QuestionsApiResponse>(
                    `/api/native/questions?${apiParams.toString()}`,
                    {
                        signal: controller.signal,
                        cacheKey: `questions:${apiParams.toString()}`,
                        cacheTtlMs: 15000,
                        retries: 2,
                    },
                );

                setNativeData({
                    questions: {
                        data: response.data,
                        current_page: response.meta.current_page,
                        last_page: response.meta.last_page,
                        per_page: response.meta.per_page,
                        total: response.meta.total,
                        links: buildNativeLinks(response.meta),
                    },
                    bibleBooks: response.bible_books,
                    topics: response.topics,
                    filters: response.filters,
                });

                if (lastTotalRef.current > 0 && response.meta.total > lastTotalRef.current) {
                    notifyLocal({
                        title: isArabic ? 'تمت إضافة إجابات جديدة' : 'New answers are available',
                        body: isArabic
                            ? 'تم تحديث قاعدة الأسئلة لدينا.'
                            : 'Your questions feed has been updated.',
                    });
                }

                lastTotalRef.current = response.meta.total;
            } catch (err) {
                if (err instanceof DOMException && err.name === 'AbortError') {
                    return;
                }
                const message = err instanceof Error ? err.message : 'Unable to load questions.';
                setError(message);
            } finally {
                setLoading(false);
            }
        },
        [activeQuestions.per_page, isArabic, locale, native, nativeError],
    );

    useEffect(() => {
        return () => {
            requestControllerRef.current?.abort();
        };
    }, []);

    const applyFilters = useCallback(
        (page = 1, overrides: Partial<Filters> = {}) => {
            const params = buildParams(page, overrides);

            if (native) {
                updateUrl(params);
                fetchQuestions(params);
                return;
            }

            router.visit(`${localePrefix}/questions?${params.toString()}`, {
                method: 'get',
                preserveState: true,
                replace: true,
            });
        },
        [buildParams, fetchQuestions, localePrefix, native, updateUrl],
    );

    const clearFilters = () => {
        setSearchQuery('');
        setSelectedBibleBook('');
        setSelectedTopic('');

        if (native) {
            const params = new URLSearchParams();
            updateUrl(params);
            fetchQuestions(params);
            return;
        }

        router.visit(`${localePrefix}/questions`);
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        applyFilters(1);
    };

    const handleBibleBookChange = (value: string) => {
        setSelectedBibleBook(value);
        applyFilters(1, { bible_book_id: value });
    };

    const handleTopicChange = (value: string) => {
        setSelectedTopic(value);
        applyFilters(1, { topic_id: value });
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

    const isFirstRun = useRef(true);

    useEffect(() => {
        if (!native || nativeError) {
            return;
        }

        if (isFirstRun.current) {
            isFirstRun.current = false;
            const pageParam =
                typeof window !== 'undefined'
                    ? Number(new URLSearchParams(window.location.search).get('page') ?? 1)
                    : 1;
            const params = buildParams(pageParam || activeQuestions.current_page || 1);
            fetchQuestions(params);
            return;
        }
    }, [buildParams, fetchQuestions, native, nativeError]);

    const paginationLinks = useMemo(
        () => (native ? (activeQuestions.links as PaginationLink[]) : activeQuestions.links),
        [activeQuestions.links, native],
    );

    const handlePageClick = (page: number | null) => {
        if (!page || page === activeQuestions.current_page) {
            return;
        }

        applyFilters(page);
    };

    return (
        <PublicLayout>
            <div className="space-y-12">
                {/* Header */}
                <div className="text-center space-y-4">
                    <h1 className="text-4xl font-heading font-bold text-primary tracking-tight">
                        {isArabic ? 'الأسئلة العقائدية' : 'Doctrinal Questions'}
                    </h1>
                    <p className="text-muted-foreground max-w-2xl mx-auto text-lg leading-relaxed">
                        {isArabic
                            ? 'استكشف مجموعة شاملة من الأسئلة والإجابات حول الإيمان والعقيدة.'
                            : 'Explore our comprehensive collection of doctrinal questions and answers.'}
                    </p>
                </div>

                {error && (
                    <div className="mx-auto max-w-3xl rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                        {error}
                    </div>
                )}

                {/* Search & Filter Bar */}
                <div className="bg-card border border-border rounded-2xl p-6 md:p-8 space-y-6 max-w-3xl mx-auto">
                    <form onSubmit={handleSearch} className="flex gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-5 w-5" />
                            <Input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder={isArabic ? 'ابحث عن سؤال...' : 'Search for a question...'}
                                className="pl-10 h-12 text-lg bg-background"
                                disabled={native && loading}
                            />
                        </div>
                        <Button type="submit" size="lg" className="h-12 px-8" disabled={native && loading}>
                            {isArabic ? 'بحث' : 'Search'}
                        </Button>
                    </form>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Select value={selectedBibleBook} onValueChange={handleBibleBookChange} disabled={native && loading}>
                            <SelectTrigger className="w-full h-12 bg-background">
                                <SelectValue placeholder={isArabic ? 'كل أسفار الكتاب المقدس' : 'All Bible Books'} />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">
                                    {isArabic ? 'كل أسفار الكتاب المقدس' : 'All Bible Books'}
                                </SelectItem>
                                {activeBibleBooks.map((book) => (
                                    <SelectItem key={book.id} value={String(book.id)}>
                                        {getLocalizedName(book)}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <Select value={selectedTopic} onValueChange={handleTopicChange} disabled={native && loading}>
                            <SelectTrigger className="w-full h-12 bg-background">
                                <SelectValue placeholder={isArabic ? 'جميع المواضيع' : 'All Topics'} />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">{isArabic ? 'جميع المواضيع' : 'All Topics'}</SelectItem>
                                {activeTopics.map((topic) => (
                                    <SelectItem key={topic.id} value={String(topic.id)}>
                                        {getLocalizedName(topic)}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {(searchQuery || selectedBibleBook || selectedTopic) && (
                        <div className="flex justify-end">
                            <Button
                                variant="ghost"
                                onClick={clearFilters}
                                className="text-destructive hover:text-destructive hover:bg-destructive/10"
                            >
                                <X className="h-4 w-4 mr-2" />
                                {isArabic ? 'مسح الفلاتر' : 'Clear Filters'}
                            </Button>
                        </div>
                    )}
                </div>

                {/* Results Count */}
                <div className="text-center">
                    <p className="text-muted-foreground text-lg font-medium">
                        {loading && native
                            ? isArabic
                                ? 'جارٍ تحميل الأسئلة...'
                                : 'Loading questions...'
                            : isArabic
                                ? `تم العثور على ${activeQuestions.total} سؤال`
                                : `${activeQuestions.total} questions found`}
                    </p>
                </div>

                {/* Questions Grid */}
                <div className="grid gap-6 md:grid-cols-1 ">
                    {activeQuestions.data.map((question) => (
                        <OrthodoxCard key={question.id} className="group overflow-hidden">
                            <CardHeader className="space-y-3 p-6">
                                <CardTitle className="text-xl font-heading font-bold text-primary group-hover:text-primary/80 transition-colors">
                                    {getLocalizedQuestion(question)}
                                </CardTitle>
                                <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                                    {question.bible_book && (
                                        <Badge variant="outline" className="border-ornament/50">
                                            <BookOpen className="h-3 w-3 mr-2 rtl:ml-2 rtl:mr-0" />
                                            {getLocalizedName(question.bible_book)}
                                        </Badge>
                                    )}
                                    {question.topic && (
                                        <Badge variant="outline" className="border-ornament/50">
                                            <Tag className="h-3 w-3 mr-2 rtl:ml-2 rtl:mr-0" />
                                            {getLocalizedName(question.topic)}
                                        </Badge>
                                    )}
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4 p-6">
                                <p className="text-muted-foreground font-reading leading-relaxed line-clamp-3">
                                    {question.answer_ar || question.answer_en
                                        ? getLocalizedAnswer(question)
                                        : isArabic
                                            ? 'الإجابة قيد الإعداد.'
                                            : 'Answer is being prepared.'}
                                </p>
                                <Button asChild variant="ghost" className="px-0 text-primary hover:text-primary/80 p-3">
                                    <Link href={`${localePrefix}/questions/${question.id}`}>
                                        {isArabic ? 'اقرأ المزيد' : 'Read More'}
                                    </Link>
                                </Button>
                            </CardContent>
                        </OrthodoxCard>
                    ))}
                </div>

                {/* Pagination */}
                {activeQuestions.last_page > 1 && (
                    <div className="flex justify-center">
                        <div className="flex items-center gap-2">
                            {paginationLinks.map((link: any, index: number) => {
                                const isDisabled = native ? !link.page : !link.url;

                                if (native) {
                                    return (
                                        <button
                                            key={`${link.label}-${index}`}
                                            type="button"
                                            onClick={() => handlePageClick(link.page)}
                                            disabled={isDisabled}
                                            className={`px-3 py-2 text-sm rounded-lg border transition-colors ${link.active
                                                ? 'bg-primary text-primary-foreground border-primary'
                                                : 'bg-background border-border hover:bg-secondary'
                                                } ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                                        >
                                            <span dangerouslySetInnerHTML={{ __html: link.label }} />
                                        </button>
                                    );
                                }

                                return (
                                    <Link
                                        key={index}
                                        href={link.url || '#'}
                                        className={`px-3 py-2 text-sm rounded-lg border transition-colors ${link.active
                                            ? 'bg-primary text-primary-foreground border-primary'
                                            : 'bg-background border-border hover:bg-secondary'
                                            } ${!link.url ? 'pointer-events-none opacity-50' : ''}`}
                                        {...(!link.url && { onClick: (e) => e.preventDefault() })}
                                    >
                                        <span dangerouslySetInnerHTML={{ __html: link.label }} />
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>
        </PublicLayout>
    );
}
