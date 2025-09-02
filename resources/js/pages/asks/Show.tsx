import { Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Edit, Trash2, CheckCircle, XCircle, Play, ExternalLink } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';

interface PageProps {
    question: {
        id: number;
        question: string;
        submitter_email: string | null;
        topic_id: number | null;
        chapter_verse: string | null;
        created_at: string;
        updated_at: string;
        topic?: {
            id: number;
            name_ar: string;
            name_en: string;
        } | null;
    };
}

export default function AdminQuestionsShow({ question }: PageProps) {
    const { post, processing } = useForm({
        _method: 'DELETE',
    });

    const handleDelete = () => {
        if (confirm('Are you sure you want to delete this question? This action cannot be undone.')) {
            post(route('admin.ask.destroy', question.id));
        }
    };

    const getStatusBadge = (status: string) => {
        const statusClasses = {
            approved: 'bg-green-100 text-green-800 border-green-200',
            rejected: 'bg-red-100 text-red-800 border-red-200',
        };

        const statusLabels = {
            approved: 'Enabled',
            rejected: 'Disabled',
        };

        return (
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusClasses[status as keyof typeof statusClasses]}`}>
                {statusLabels[status as keyof typeof statusLabels]}
            </span>
        );
    };

    const getLocalizedName = (item: { name_ar: string; name_en: string }) => {
        return window.location.pathname.includes('/ar') ? item.name_ar : item.name_en;
    };

    return (
        <AppLayout>
            <div className="py-6">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <Link
                                    href={route('admin.ask.index')}
                                    className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                >
                                    <ArrowLeft className="h-4 w-4 mr-2" />
                                    Back to Questions
                                </Link>
                                <h1 className="text-2xl font-bold text-gray-900">Question Details</h1>
                            </div>
                            <div className="flex items-center space-x-3">
                                <Link
                                    href={route('admin.ask.edit', question.id)}
                                    className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                >
                                    <Edit className="h-4 w-4 mr-2" />
                                    Edit
                                </Link>
                                <button
                                    onClick={handleDelete}
                                    disabled={processing}
                                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Delete
                                </button>
                            </div>
                        </div>
                        <div className="mt-2 flex items-center space-x-4">
                            <span className="text-sm text-gray-500">
                                Submitted: {new Date(question.created_at).toLocaleDateString()}
                            </span>
                            <span className="text-sm text-gray-500">
                                Last updated: {new Date(question.updated_at).toLocaleDateString()}
                            </span>
                        </div>
                    </div>

                    <div className="space-y-6">
                        {/* Question Section */}
                        <div className="bg-white shadow rounded-lg p-6">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Question</h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <p className="text-gray-900 leading-relaxed">{question.question}</p>
                                </div>

                            </div>
                        </div>


                        {/* Categories Section */}
                        <div className="bg-white shadow rounded-lg p-6">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Topic</h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                                <div>
                                    {question.topic ? (
                                        <p className="text-gray-900">{getLocalizedName(question.topic)}</p>
                                    ) : (
                                        <p className="text-gray-500 italic">Not specified</p>
                                    )}
                                </div>
                                {question.chapter_verse && (
                                    <div className="md:col-span-2">
                                        <h4 className="text-sm font-medium text-gray-700 mb-2">Chapter & Verse Reference</h4>
                                        <p className="text-gray-900">{question.chapter_verse}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
