
import { Link, usePage } from '@inertiajs/react';
import { Search, BookOpen, Tag, X } from 'lucide-react';
import PublicLayout from '@/layouts/public-layout';
import { useState, useEffect, useRef } from 'react';
import { router } from '@inertiajs/react';
import { route } from 'ziggy-js';
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
} from "@/components/ui/select"

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

    const isArabic = window.location.pathname.includes('/ar');
    const localePrefix = isArabic ? '/ar' : '/en';

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        updateFilters();
    };

    const updateFilters = () => {
        const params = new URLSearchParams();
        if (searchQuery) params.append('search', searchQuery);
        if (selectedBibleBook && selectedBibleBook !== 'all') params.append('bible_book_id', selectedBibleBook);
        if (selectedTopic && selectedTopic !== 'all') params.append('topic_id', selectedTopic);

        router.visit(`${localePrefix}/questions?${params.toString()}`, {
            method: 'get',
            preserveState: true,
            replace: true,
        });
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

    const isFirstRun = useRef(true);

    useEffect(() => {
        if (isFirstRun.current) {
            isFirstRun.current = false;
            return;
        }
        updateFilters();
    }, [selectedBibleBook, selectedTopic]);

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
                            : 'Explore our comprehensive collection of doctrinal questions and answers.'
                        }
                    </p>
                </div>

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
                            />
                        </div>
                        <Button type="submit" size="lg" className="h-12 px-8">
                            {isArabic ? 'بحث' : 'Search'}
                        </Button>
                    </form>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Select
                            value={selectedBibleBook}
                            onValueChange={setSelectedBibleBook}
                        >
                            <SelectTrigger className="w-full h-12 bg-background">
                                <SelectValue placeholder={isArabic ? 'كل أسفار الكتاب المقدس' : 'All Bible Books'} />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">
                                    {isArabic ? 'كل أسفار الكتاب المقدس' : 'All Bible Books'}
                                </SelectItem>
                                {bibleBooks.map((book) => (
                                    <SelectItem key={book.id} value={String(book.id)}>
                                        {getLocalizedName(book)}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <Select
                            value={selectedTopic}
                            onValueChange={setSelectedTopic}
                        >
                            <SelectTrigger className="w-full h-12 bg-background">
                                <SelectValue placeholder={isArabic ? 'جميع المواضيع' : 'All Topics'} />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">
                                    {isArabic ? 'جميع المواضيع' : 'All Topics'}
                                </SelectItem>
                                {topics.map((topic) => (
                                    <SelectItem key={topic.id} value={String(topic.id)}>
                                        {getLocalizedName(topic)}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {(filters.search || filters.bible_book_id || filters.topic_id) && (
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
                    <span className="text-sm text-muted-foreground bg-secondary/50 px-3 py-1 rounded-full">
                        {isArabic
                            ? `تم العثور على ${questions.total} سؤال`
                            : `Found ${questions.total} questions`
                        }
                    </span>
                </div>

                {/* Questions Grid */}
                <div className="space-y-6">
                    {questions.data.map((question) => (
                        <OrthodoxCard key={question.id} className="hover:border-gold transition-all duration-300 group">
                            <CardContent className="p-6 md:p-8">
                                <div className="flex flex-col gap-4">
                                    <div className="space-y-3">
                                        <div className="flex flex-wrap gap-2">
                                            {question.topic && (
                                                <Badge variant="outline" className="font-normal text-muted-foreground group-hover:text-primary group-hover:border-primary/30 transition-colors">
                                                    <Tag className="h-3 w-3 mr-1" />
                                                    {getLocalizedName(question.topic)}
                                                </Badge>
                                            )}
                                            {question.bible_book && (
                                                <Badge variant="outline" className="font-normal text-muted-foreground group-hover:text-primary group-hover:border-primary/30 transition-colors">
                                                    <BookOpen className="h-3 w-3 mr-1" />
                                                    {getLocalizedName(question.bible_book)}
                                                </Badge>
                                            )}
                                        </div>

                                        <Link
                                            href={route('questions.show', { locale: isArabic ? 'ar' : 'en', question: question.id })}
                                            className="block"
                                        >
                                            <h3 className="text-2xl font-heading font-bold text-foreground group-hover:text-primary transition-colors leading-relaxed">
                                                {getLocalizedQuestion(question)}
                                            </h3>
                                        </Link>

                                        <p className="text-muted-foreground line-clamp-3 leading-loose">
                                            {question.answer_ar || question.answer_en
                                                ? getLocalizedAnswer(question)
                                                : (isArabic ? 'قريبًا...' : 'Coming soon...')
                                            }
                                        </p>
                                    </div>

                                    <div className="flex items-center justify-between pt-4 border-t border-border/50">
                                        <div className="text-sm text-muted-foreground">
                                            {new Date(question.created_at).toLocaleDateString(isArabic ? 'ar-EG' : 'en-US', { day: 'numeric', month: 'long', year: 'numeric' })}
                                        </div>

                                        <Button variant="link" className="p-0 h-auto text-primary font-bold" asChild>
                                            <Link href={route('questions.show', [isArabic ? 'ar' : 'en', question.id])}>
                                                {isArabic ? 'اقرأ الإجابة الكاملة' : 'Read Full Answer'} &rarr;
                                            </Link>
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </OrthodoxCard>
                    ))}
                </div>

                {/* Pagination */}
                {questions.last_page > 1 && (
                    <div className="flex justify-center pt-8">
                        <nav className="flex flex-wrap gap-2 justify-center">
                            {questions.links.map((link: any, index: number) => (
                                <Link
                                    key={index}
                                    href={link.url || '#'}
                                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${link.active
                                        ? 'bg-primary text-primary-foreground'
                                        : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                                        } ${!link.url ? 'pointer-events-none opacity-50' : ''}`}
                                    {...(!link.url && { onClick: (e) => e.preventDefault() })}
                                >
                                    <span dangerouslySetInnerHTML={{ __html: link.label }} />
                                </Link>
                            ))}
                        </nav>
                    </div>
                )}

                {/* Empty State */}
                {questions.data.length === 0 && (
                    <div className="text-center py-20 bg-secondary/20 rounded-2xl border border-dashed border-border">
                        <div className="bg-background w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm border border-border">
                            <Search className="h-8 w-8 text-muted-foreground" />
                        </div>
                        <h3 className="text-xl font-heading font-semibold text-foreground mb-2">
                            {isArabic ? 'لم يتم العثور على أسئلة' : 'No Questions Found'}
                        </h3>
                        <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                            {isArabic
                                ? 'لم نجد أي أسئلة تطابق بحثك. هل تود طرح سؤال جديد؟'
                                : 'We couldn\'t find any questions matching your search. Would you like to ask a new one?'
                            }
                        </p>
                        <Button asChild size="lg">
                            <Link href={`${localePrefix}/questions/create`}>
                                {isArabic ? 'أرسل سؤالاً جديداً' : 'Submit a New Question'}
                            </Link>
                        </Button>
                    </div>
                )}
            </div>
        </PublicLayout>
    );
}
