import { Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Send } from 'lucide-react';
import PublicLayout from '@/layouts/public-layout';
import { useState } from 'react';
import { isArabic, buildLocalizedPath } from '@/lib/locale';
import CopticCrossIcon from '@/components/CopticCrossIcon';
import Toast from "@/components/Toast";
import { usePage } from "@inertiajs/react";



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
    const [showEnglish, setShowEnglish] = useState(false);
    const isArabicLocale = isArabic();
    const { flash } = usePage().props as InertiaProps;

    const { data, setData, post, processing, errors } = useForm({
        question: '',
        submitter_name: '',
        submitter_email: '',
        email: '',
        bible_book_id: '',
        topic_id: '',
        chapter_verse: '',
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
                 <div
                    className={`mb-4 p-4 rounded-lg shadow-md transition-all ${
                        flash?.success
                        ? "bg-green-100 text-green-800"
                        : flash?.error
                        ? "bg-red-100 text-red-800"
                        : "hidden"
                    }`}
                    >
                    {flash?.success && <span>{flash.success}</span>}
                    {flash?.error && <span>{flash.error}</span>}
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


                        {/* Question Fields */}
                        <div className="space-y-6">
                            {/* Arabic Question */}
                            <div className={`space-y-4`}>
                                <label className="block text-lg font-semibold text-gray-700">
                                    {isArabicLocale ? 'السؤال' : 'Question'}
                                </label>
                                <textarea
                                    value={data.question}
                                    onChange={(e) => setData('question', e.target.value)}
                                    rows={4}
                                    className="w-full border-2 border-amber-200 rounded-xl px-4 py-3 focus:ring-4 focus:ring-amber-500/20 focus:border-amber-500 bg-white/80 backdrop-blur-sm transition-all duration-200 resize-none"
                                    placeholder={isArabicLocale ? 'اكتب سؤالك هنا...' : 'Write your question here...'}
                                />
                                {errors.question && (
                                    <p className="text-red-600 text-sm">{errors.question}</p>
                                )}
                            </div>
                        </div>



                        <div className="grid md:grid-cols-2 gap-6">


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
                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-gray-700">
                                    {isArabicLocale ? 'البريد الإلكتروني' : 'Email'}
                                </label>
                                <input
                                    type="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    className="w-full border-2 border-amber-200 rounded-xl px-4 py-3 focus:ring-4 focus:ring-amber-500/20 focus:border-amber-500 bg-white/80 backdrop-blur-sm transition-all duration-200"
                                    placeholder={isArabicLocale ? 'بريدك الإلكتروني (اختياري)' : 'Your email address (Optional)'}
                                />
                                {errors.email && (
                                    <p className="text-red-600 text-sm">{errors.email}</p>
                                )}
                            </div>
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
