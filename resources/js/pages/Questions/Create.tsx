import { Link, useForm, usePage } from '@inertiajs/react';
import { ArrowLeft, Send, HelpCircle } from 'lucide-react';
import PublicLayout from '@/layouts/public-layout';
import { isArabic, buildLocalizedPath } from '@/lib/locale';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { OrnamentFrame } from '@/components/ui/ornament-frame';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

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
            {/* Toast Messages */}
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

            <div className="max-w-2xl mx-auto space-y-8 pb-12">
                {/* Back Navigation */}
                <div className="flex items-center">
                    <Button variant="ghost" asChild className="pl-0 text-muted-foreground hover:text-primary hover:bg-transparent">
                        <Link href={buildLocalizedPath('questions')} className="flex items-center gap-2">
                            <ArrowLeft className="h-4 w-4 rtl:rotate-180" />
                            <span className="font-semibold">{isArabicLocale ? 'العودة إلى الأسئلة' : 'Back to Questions'}</span>
                        </Link>
                    </Button>
                </div>

                {/* Form Card */}
                <div className="relative pt-6">
                    <OrnamentFrame className="shadow-parchment bg-card/80">
                        <div className="text-center pb-8 border-b border-ornament/20 mb-8">
                            <div className="mx-auto w-16 h-16 bg-primary/5 rounded-full flex items-center justify-center mb-6 text-primary border border-ornament/50">
                                <HelpCircle size={32} />
                            </div>
                            <h2 className="text-3xl md:text-4xl font-heading font-bold text-primary mb-3">
                                {isArabicLocale ? 'إرسال سؤال جديد' : 'Submit a New Question'}
                            </h2>
                            <p className="text-lg text-muted-foreground font-reading">
                                {isArabicLocale
                                    ? 'نحن هنا للإجابة على تساؤلاتك العقائدية والروحية.'
                                    : 'We are here to answer your doctrinal and spiritual questions.'
                                }
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-8 px-2 md:px-4">

                            {/* Question Field */}
                            <div className="space-y-3">
                                <Label htmlFor="question" className="text-lg font-bold text-foreground">
                                    {isArabicLocale ? 'سؤالك' : 'Your Question'}
                                </Label>
                                <Textarea
                                    id="question"
                                    value={data.question}
                                    onChange={(e) => setData('question', e.target.value)}
                                    rows={6}
                                    className="resize-none text-lg leading-relaxed bg-background/50 border-ornament/50 focus:border-primary focus:ring-primary/10 transition-all font-reading"
                                    placeholder={isArabicLocale ? 'اكتب سؤالك بوضوح هنا...' : 'Write your question clearly here...'}
                                />
                                {errors.question && (
                                    <p className="text-destructive text-sm font-medium">{errors.question}</p>
                                )}
                            </div>

                            {/* Topic & Email Grid */}
                            <div className="grid md:grid-cols-2 gap-8">
                                <div className="space-y-3">
                                    <Label htmlFor="topic" className="text-base font-semibold">
                                        {isArabicLocale ? 'الموضوع (اختياري)' : 'Topic (Optional)'}
                                    </Label>
                                    <Select
                                        value={data.topic_id}
                                        onValueChange={(value) => setData('topic_id', value)}
                                    >
                                        <SelectTrigger className="w-full h-12 text-base bg-background/50 border-ornament/50 focus:ring-primary/10">
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

                                <div className="space-y-3">
                                    <Label htmlFor="email" className="text-base font-semibold">
                                        {isArabicLocale ? 'البريد الإلكتروني (اختياري)' : 'Email (Optional)'}
                                    </Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        placeholder="user@example.com"
                                        className="h-12 bg-background/50 border-ornament/50 focus:ring-primary/10"
                                    />
                                    {errors.email && (
                                        <p className="text-destructive text-sm font-medium">{errors.email}</p>
                                    )}
                                </div>
                            </div>

                            <div className="pt-8">
                                <Button type="submit" size="lg" className="w-full text-lg h-14 font-bold shadow-md hover:shadow-lg transition-all bg-primary text-primary-foreground hover:bg-primary/90" disabled={processing}>
                                    {processing ? (
                                        <span className="animate-pulse">{isArabicLocale ? 'جاري الإرسال...' : 'Sending...'}</span>
                                    ) : (
                                        <div className="flex items-center gap-3">
                                            <Send size={20} className="rtl:rotate-180" />
                                            <span>{isArabicLocale ? 'إرسال السؤال' : 'Submit Question'}</span>
                                        </div>
                                    )}
                                </Button>
                            </div>

                        </form>
                    </OrnamentFrame>
                </div>
            </div>
        </PublicLayout>
    );
}
