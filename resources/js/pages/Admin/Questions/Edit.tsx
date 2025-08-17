import { Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Save, Eye } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { useState } from 'react';

interface PageProps {
    question: {
        id: number;
        question_ar: string;
        question_en: string;
        answer_ar: string | null;
        answer_en: string | null;
        youtube_video_id: string | null;
        submitter_name: string | null;
        submitter_email: string | null;
        status: 'pending' | 'approved' | 'rejected';
        bible_book_id: number | null;
        topic_id: number | null;
        chapter_verse: string | null;
        created_at: string;
        updated_at: string;
        bible_book?: {
            id: number;
            name_ar: string;
            name_en: string;
        } | null;
        topic?: {
            id: number;
            name_ar: string;
            name_en: string;
        } | null;
    };
    bibleBooks: Array<{
        id: number;
        name_ar: string;
        name_en: string;
    }>;
    topics: Array<{
        id: number;
        name_ar: string;
        name_en: string;
    }>;
}

export default function AdminQuestionsEdit({ question, bibleBooks, topics }: PageProps) {
    const [showPreview, setShowPreview] = useState(false);

    const { data, setData, post, processing, errors } = useForm({
        question_ar: question.question_ar,
        question_en: question.question_en,
        answer_ar: question.answer_ar || '',
        answer_en: question.answer_en || '',
        youtube_video_id: question.youtube_video_id || '',
        bible_book_id: question.bible_book_id || '',
        topic_id: question.topic_id || '',
        chapter_verse: question.chapter_verse || '',
        status: question.status,
        _method: 'PUT',

    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('admin.questions.update', question.id));
    };

    const getLocalizedName = (item: { name_ar: string; name_en: string }) => {
        return window.location.pathname.includes('/ar') ? item.name_ar : item.name_en;
    };

    const getStatusBadge = (status: string) => {
        const statusClasses = {
            pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
            approved: 'bg-green-100 text-green-800 border-green-200',
            rejected: 'bg-red-100 text-red-800 border-red-200',
        };

        const statusLabels = {
            pending: 'Pending',
            approved: 'Approved',
            rejected: 'Rejected',
        };

        return (
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusClasses[status as keyof typeof statusClasses]}`}>
                {statusLabels[status as keyof typeof statusLabels]}
            </span>
        );
    };

    return (
        <AppLayout>
            <div className="py-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <Link
                                    href={route('admin.questions.index')}
                                    className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                >
                                    <ArrowLeft className="h-4 w-4 mr-2" />
                                    Back to Questions
                                </Link>
                                <h1 className="text-2xl font-bold text-gray-900">Edit Question</h1>
                            </div>
                            <div className="flex items-center space-x-3">
                                <button
                                    type="button"
                                    onClick={() => setShowPreview(!showPreview)}
                                    className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                >
                                    <Eye className="h-4 w-4 mr-2" />
                                    {showPreview ? 'Hide Preview' : 'Show Preview'}
                                </button>
                            </div>
                        </div>
                        <div className="mt-2 flex items-center space-x-4">
                            <span className="text-sm text-gray-500">Status:</span>
                            {getStatusBadge(question.status)}
                            <span className="text-sm text-gray-500">
                                Submitted: {new Date(question.created_at).toLocaleDateString()}
                            </span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Edit Form */}
                        <div className="lg:col-span-2">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Question Section */}
                                <div className="bg-white shadow rounded-lg p-6">
                                    <h3 className="text-lg font-medium text-gray-900 mb-4">Question Details</h3>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label htmlFor="question_ar" className="block text-sm font-medium text-gray-700 mb-2">
                                                Question (Arabic) *
                                            </label>
                                            <textarea
                                                id="question_ar"
                                                rows={4}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                                value={data.question_ar}
                                                onChange={(e) => setData('question_ar', e.target.value)}
                                                required
                                            />
                                            {errors.question_ar && (
                                                <p className="mt-1 text-sm text-red-600">{errors.question_ar}</p>
                                            )}
                                        </div>

                                        <div>
                                            <label htmlFor="question_en" className="block text-sm font-medium text-gray-700 mb-2">
                                                Question (English) *
                                            </label>
                                            <textarea
                                                id="question_en"
                                                rows={4}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                                value={data.question_en}
                                                onChange={(e) => setData('question_en', e.target.value)}
                                                required
                                            />
                                            {errors.question_en && (
                                                <p className="mt-1 text-sm text-red-600">{errors.question_en}</p>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Answer Section */}
                                <div className="bg-white shadow rounded-lg p-6">
                                    <h3 className="text-lg font-medium text-gray-900 mb-4">Answer</h3>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label htmlFor="answer_ar" className="block text-sm font-medium text-gray-700 mb-2">
                                                Answer (Arabic)
                                            </label>
                                            <textarea
                                                id="answer_ar"
                                                rows={6}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                                value={data.answer_ar}
                                                onChange={(e) => setData('answer_ar', e.target.value)}
                                                placeholder="Enter the answer in Arabic..."
                                            />
                                            {errors.answer_ar && (
                                                <p className="mt-1 text-sm text-red-600">{errors.answer_ar}</p>
                                            )}
                                        </div>

                                        <div>
                                            <label htmlFor="answer_en" className="block text-sm font-medium text-gray-700 mb-2">
                                                Answer (English)
                                            </label>
                                            <textarea
                                                id="answer_en"
                                                rows={6}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                                value={data.answer_en}
                                                onChange={(e) => setData('answer_en', e.target.value)}
                                                placeholder="Enter the answer in English..."
                                            />
                                            {errors.answer_en && (
                                                <p className="mt-1 text-sm text-red-600">{errors.answer_en}</p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="mt-4">
                                        <label htmlFor="youtube_video_id" className="block text-sm font-medium text-gray-700 mb-2">
                                            YouTube Video ID
                                        </label>
                                        <input
                                            type="text"
                                            id="youtube_video_id"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                            value={data.youtube_video_id}
                                            onChange={(e) => setData('youtube_video_id', e.target.value)}
                                            placeholder="e.g., dQw4w9WgXcQ"
                                        />
                                        <p className="mt-1 text-sm text-gray-500">
                                            Enter only the video ID from the YouTube URL (e.g., from https://www.youtube.com/watch?v=dQw4w9WgXcQ)
                                        </p>
                                        {errors.youtube_video_id && (
                                            <p className="mt-1 text-sm text-red-600">{errors.youtube_video_id}</p>
                                        )}
                                    </div>
                                </div>

                                {/* Categories Section */}
                                <div className="bg-white shadow rounded-lg p-6">
                                    <h3 className="text-lg font-medium text-gray-900 mb-4">Categories</h3>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label htmlFor="bible_book_id" className="block text-sm font-medium text-gray-700 mb-2">
                                                Bible Book
                                            </label>
                                            <select
                                                id="bible_book_id"
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                                value={data.bible_book_id}
                                                onChange={(e) => setData('bible_book_id', e.target.value ? Number(e.target.value) : '')}
                                            >
                                                <option value="">Select a Bible book</option>
                                                {bibleBooks.map((book) => (
                                                    <option key={book.id} value={book.id}>
                                                        {getLocalizedName(book)}
                                                    </option>
                                                ))}
                                            </select>
                                            {errors.bible_book_id && (
                                                <p className="mt-1 text-sm text-red-600">{errors.bible_book_id}</p>
                                            )}
                                        </div>

                                        <div>
                                            <label htmlFor="topic_id" className="block text-sm font-medium text-gray-700 mb-2">
                                                Topic
                                            </label>
                                            <select
                                                id="topic_id"
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                                value={data.topic_id}
                                                onChange={(e) => setData('topic_id', e.target.value ? Number(e.target.value) : '')}
                                            >
                                                <option value="">Select a topic</option>
                                                {topics.map((topic) => (
                                                    <option key={topic.id} value={topic.id}>
                                                        {getLocalizedName(topic)}
                                                    </option>
                                                ))}
                                            </select>
                                            {errors.topic_id && (
                                                <p className="mt-1 text-sm text-red-600">{errors.topic_id}</p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="mt-4">
                                        <label htmlFor="chapter_verse" className="block text-sm font-medium text-gray-700 mb-2">
                                            Chapter & Verse Reference
                                        </label>
                                        <input
                                            type="text"
                                            id="chapter_verse"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                            value={data.chapter_verse}
                                            onChange={(e) => setData('chapter_verse', e.target.value)}
                                            placeholder="e.g., John 3:16, Genesis 1:1-3"
                                        />
                                        {errors.chapter_verse && (
                                            <p className="mt-1 text-sm text-red-600">{errors.chapter_verse}</p>
                                        )}
                                    </div>
                                </div>

                                {/* Status Section */}
                                <div className="bg-white shadow rounded-lg p-6">
                                    <h3 className="text-lg font-medium text-gray-900 mb-4">Status</h3>

                                    <div className="space-y-3">
                                        <label className="flex items-center">
                                            <input
                                                type="radio"
                                                name="status"
                                                value="pending"
                                                checked={data.status === 'pending'}
                                                onChange={(e) => setData('status', e.target.value as 'pending' | 'approved' | 'rejected')}
                                                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                                            />
                                            <span className="ml-3 text-sm font-medium text-gray-700">Pending Review</span>
                                        </label>
                                        <label className="flex items-center">
                                            <input
                                                type="radio"
                                                name="status"
                                                value="approved"
                                                checked={data.status === 'approved'}
                                                onChange={(e) => setData('status', e.target.value as 'pending' | 'approved' | 'rejected')}
                                                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                                            />
                                            <span className="ml-3 text-sm font-medium text-gray-700">Approved</span>
                                        </label>
                                        <label className="flex items-center">
                                            <input
                                                type="radio"
                                                name="status"
                                                value="rejected"
                                                checked={data.status === 'rejected'}
                                                onChange={(e) => setData('status', e.target.value as 'pending' | 'approved' | 'rejected')}
                                                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                                            />
                                            <span className="ml-3 text-sm font-medium text-gray-700">Rejected</span>
                                        </label>
                                    </div>
                                </div>

                                {/* Submit Button */}
                                <div className="flex justify-end">
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <Save className="h-4 w-4 mr-2" />
                                        {processing ? 'Saving...' : 'Save Changes'}
                                    </button>
                                </div>
                            </form>
                        </div>

                        {/* Preview Sidebar */}
                        {showPreview && (
                            <div className="lg:col-span-1">
                                <div className="bg-white shadow rounded-lg p-6 sticky top-6">
                                    <h3 className="text-lg font-medium text-gray-900 mb-4">Preview</h3>

                                    <div className="space-y-4">
                                        <div>
                                            <h4 className="font-medium text-gray-900 mb-2">Question</h4>
                                            <div className="text-sm text-gray-600">
                                                <div className="mb-2">
                                                    <strong>Arabic:</strong> {data.question_ar || 'No question entered'}
                                                </div>
                                                <div>
                                                    <strong>English:</strong> {data.question_en || 'No question entered'}
                                                </div>
                                            </div>
                                        </div>

                                        {data.answer_ar || data.answer_en ? (
                                            <div>
                                                <h4 className="font-medium text-gray-900 mb-2">Answer</h4>
                                                <div className="text-sm text-gray-600">
                                                    {data.answer_ar && (
                                                        <div className="mb-2">
                                                            <strong>Arabic:</strong> {data.answer_ar}
                                                        </div>
                                                    )}
                                                    {data.answer_en && (
                                                        <div>
                                                            <strong>English:</strong> {data.answer_en}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="text-sm text-gray-500 italic">No answer provided yet</div>
                                        )}

                                        {data.youtube_video_id && (
                                            <div>
                                                <h4 className="font-medium text-gray-900 mb-2">YouTube Video</h4>
                                                <div className="text-sm text-gray-600">
                                                    ID: {data.youtube_video_id}
                                                </div>
                                            </div>
                                        )}

                                        <div>
                                            <h4 className="font-medium text-gray-900 mb-2">Categories</h4>
                                            <div className="text-sm text-gray-600">
                                                {data.bible_book_id ? (
                                                    <div className="mb-1">
                                                        <strong>Bible Book:</strong> {
                                                            bibleBooks.find(b => b.id === data.bible_book_id)?.name_en || 'Unknown'
                                                        }
                                                    </div>
                                                ) : (
                                                    <div className="text-gray-500 italic mb-1">No Bible book selected</div>
                                                )}
                                                {data.topic_id ? (
                                                    <div>
                                                        <strong>Topic:</strong> {
                                                            topics.find(t => t.id === data.topic_id)?.name_en || 'Unknown'
                                                        }
                                                    </div>
                                                ) : (
                                                    <div className="text-gray-500 italic">No topic selected</div>
                                                )}
                                            </div>
                                        </div>

                                        {data.chapter_verse && (
                                            <div>
                                                <h4 className="font-medium text-gray-900 mb-2">Reference</h4>
                                                <div className="text-sm text-gray-600">
                                                    {data.chapter_verse}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
