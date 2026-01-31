import { Link, useForm, usePage } from '@inertiajs/react';
import { ArrowLeft, Send, HelpCircle } from 'lucide-react';
import PublicLayout from '@/layouts/public-layout';
import { isArabic, buildLocalizedPath } from '@/lib/locale';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { OrthodoxCard } from '@/components/ui/orthodox-card';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Label } from '@/components/ui/label';

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

type InertiaProps = {
    flash?: {
        success?: string;
        error?: string;
    };
};

export default function QuestionCreate({ bibleBooks, topics }: PageProps) {
    const isArabicLocale = isArabic();
    const { flash } = usePage().props as InertiaProps;

    const { data, setData, post, processing, errors } = useForm({
        question: '',
        topic_id: '',
        email: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(buildLocalizedPath('ask'));
    };

    const getLocalizedName = (item: { name_ar: string; name_en: string }) => {
        return isArabicLocale ? item.name_ar : item.name_en;
    };

    return (
        <PublicLayout>
            {/* Toast Messages - Keeping existing logic but can be upgraded to Toaster later */}
            <div
                className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-md transition-all ${flash?.success
                    ? "bg-green-100 text-green-800 border-l-4 border-green-500"
                    : flash?.error
                        ? "bg-red-100 text-red-800 border-l-4 border-red-500"
                        : "hidden"
                    }`}
            >
                {flash?.success && <span>{flash.success}</span>}
                {flash?.error && <span>{flash.error}</span>}
            </div>

            <div className="max-w-2xl mx-auto space-y-8">
                {/* Back Navigation */}
                <Button variant="ghost" asChild className="pl-0 text-muted-foreground hover:text-primary">
                    <Link href={buildLocalizedPath('questions')}>
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        {isArabicLocale ? 'العودة إلى الأسئلة' : 'Back to Questions'}
                    </Link>
                </Button>

                {/* Form Card */}
                <OrthodoxCard>
                    <CardHeader className="text-center pb-8 border-b border-border/50">
                        <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4 text-primary">
                            <HelpCircle size={24} />
                        </div>
                        <CardTitle className="text-3xl font-heading font-bold text-primary">
                            {isArabicLocale ? 'إرسال سؤال جديد' : 'Submit a New Question'}
                        </CardTitle>
                        <CardDescription className="text-lg mt-2">
                            {isArabicLocale
                                ? 'نحن هنا للإجابة على تساؤلاتك العقائدية والروحية.'
                                : 'We are here to answer your doctrinal and spiritual questions.'
                            }
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="pt-8">
                        <form onSubmit={handleSubmit} className="space-y-6">

                            {/* Question Field */}
                            <div className="space-y-2">
                                <Label htmlFor="question" className="text-base">
                                    {isArabicLocale ? 'سؤالك' : 'Your Question'}
                                </Label>
                                <Textarea
                                    id="question"
                                    value={data.question}
                                    onChange={(e) => setData('question', e.target.value)}
                                    rows={5}
                                    className="resize-none text-base leading-relaxed"
                                    placeholder={isArabicLocale ? 'اكتب سؤالك بوضوح هنا...' : 'Write your question clearly here...'}
                                />
                                {errors.question && (
                                    <p className="text-destructive text-sm">{errors.question}</p>
                                )}
                            </div>

                            {/* Topic & Email Grid */}
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="topic">
                                        {isArabicLocale ? 'الموضوع (اختياري)' : 'Topic (Optional)'}
                                    </Label>
                                    <Select
                                        value={data.topic_id}
                                        onValueChange={(value) => setData('topic_id', value)}
                                    >
                                        <SelectTrigger className="w-full h-10 text-base md:text-sm">
                                            <SelectValue placeholder={isArabicLocale ? 'اختر الموضوع' : 'Select Topic'} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {topics.map((topic) => (
                                                <SelectItem key={topic.id} value={String(topic.id)}>
                                                    {getLocalizedName(topic)}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="email">
                                        {isArabicLocale ? 'البريد الإلكتروني (اختياري)' : 'Email (Optional)'}
                                    </Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        placeholder="user@example.com"
                                        className="h-10"
                                    />
                                    {errors.email && (
                                        <p className="text-destructive text-sm">{errors.email}</p>
                                    )}
                                </div>
                            </div>

                            <div className="pt-4">
                                <Button type="submit" size="lg" className="w-full text-base h-12" disabled={processing}>
                                    {processing ? (
                                        <span className="animate-pulse">{isArabicLocale ? 'جاري الإرسال...' : 'Sending...'}</span>
                                    ) : (
                                        <div className="flex items-center gap-2">
                                            <Send size={18} />
                                            <span>{isArabicLocale ? 'إرسال السؤال' : 'Submit Question'}</span>
                                        </div>
                                    )}
                                </Button>
                            </div>

                        </form>
                    </CardContent>
                </OrthodoxCard>
            </div>
        </PublicLayout>
    );
}
