import { router  , Link, useForm } from '@inertiajs/react';
import { Search, Filter, Edit, Trash2, CheckCircle, XCircle, Eye, Plus } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { useState } from 'react';

interface Question {
    id: number;
    question: string;
    youtube_video_id: string | null;
    email: string | null;
    status: 'Enabled' | 'Disabled';
    created_at: string;

    topic?: {
        id: number;
        name_ar: string;
        name_en: string;
    };
}

interface Topic {
    id: number;
    name_ar: string;
    name_en: string;
}

interface Filters {
    search?: string;
    status?: string;
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
    topics: Topic[];
    filters: Filters;
}

export default function AdminAskIndex({ questions, topics, filters }: PageProps) {
    const [searchQuery, setSearchQuery] = useState(filters.search || '');
    const [selectedStatus, setSelectedStatus] = useState(filters.status || 'all');
    const [selectedTopic, setSelectedTopic] = useState(filters.topic_id || '');
    const [showFilters, setShowFilters] = useState(false);
    // حالة جديدة لتخزين معرفات الأسئلة المحددة
    const [selectedQuestions, setSelectedQuestions] = useState<number[]>([]);

    const { delete: destroy, processing } = useForm();

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        updateFilters();
    };

    const updateFilters = () => {
        const params = new URLSearchParams();
        if (searchQuery) params.append('search', searchQuery);
        if (selectedStatus !== 'all') params.append('status', selectedStatus);
        if (selectedTopic) params.append('topic_id', selectedTopic);

        window.location.href = `/admin/ask?${params.toString()}`;
    };

    const clearFilters = () => {
        setSearchQuery('');
        setSelectedStatus('all');
        setSelectedTopic('');
        window.location.href = '/admin/ask';
    };

    const handleDelete = (questionId: number) => {
        if (confirm('Are you sure you want to delete this question? This action cannot be undone.')) {
            destroy(`/admin/ask/${questionId}`);
        }
    };

    // دالة للتعامل مع تحديد/إلغاء تحديد كل الأسئلة
    const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            const allIds = questions.data.map(q => q.id);
            setSelectedQuestions(allIds);
        } else {
            setSelectedQuestions([]);
        }
    };

    // دالة للتعامل مع تحديد/إلغاء تحديد سؤال فردي
    const handleSelectQuestion = (questionId: number) => {
        setSelectedQuestions(prevSelected =>
            prevSelected.includes(questionId)
                ? prevSelected.filter(id => id !== questionId)
                : [...prevSelected, questionId]
        );
    };
    const { post } = useForm();

    // دالة جديدة لحذف الأسئلة المحددة
    const handleBulkDelete = () => {
        if (selectedQuestions.length === 0) {
            return;
        }

        if (confirm(`Are you sure you want to delete ${selectedQuestions.length} questions? This action cannot be undone.`)) {
            // استخدام مسار جديد لحذف المجموعات (يجب إعداده في مسارات Laravel)
            router.post(route('admin.asks.bulk-delete'), {
                ids: selectedQuestions,
            });


        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'approved':
                return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">Enabled</span>;
            case 'disable':
                return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">Disabled</span>;
            default:
                return null;
        }
    };

    const getLocalizedName = (item: { name_ar: string; name_en: string }) => {
        return item.name_en;
    };

    const getLocalizedQuestion = (question: Question) => {
        return question.question;
    };

    return (
        <AppLayout>
            <div className="max-w-7xl px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8 flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Manage Questions</h1>
                        <p className="text-gray-600">Review, approve, and manage submitted questions</p>
                    </div>
                    <div className="flex space-x-4">
                        {/* زر الحذف المتعدد، يظهر فقط عند وجود عناصر محددة */}
                        {selectedQuestions.length > 0 && (
                            <button
                                onClick={handleBulkDelete}
                                disabled={processing}
                                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center disabled:opacity-50"
                            >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete Selected ({selectedQuestions.length})
                            </button>
                        )}
                        <Link
                            href="/admin/ask/create"
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                        >
                            <Plus className="h-4 w-4 mr-2" />
                            Add Question
                        </Link>
                    </div>
                </div>

                {/* Search and Filters */}
                <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
                    <form onSubmit={handleSearch} className="space-y-4">
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="flex-1">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                                    <input
                                        type="text"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        placeholder="Search questions and answers..."
                                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                            </div>
                            <button
                                type="submit"
                                className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                            >
                                Search
                            </button>
                        </div>

                        {/* Filters Toggle */}
                        <div className="flex items-center justify-between">
                            <button
                                type="button"
                                onClick={() => setShowFilters(!showFilters)}
                                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
                            >
                                <Filter className="h-4 w-4" />
                                <span>Additional Filters</span>
                            </button>

                            {(filters.search || filters.status || filters.topic_id) && (
                                <button
                                    type="button"
                                    onClick={clearFilters}
                                    className="text-red-600 hover:text-red-700 text-sm"
                                >
                                    Clear Filters
                                </button>
                            )}
                        </div>

                        {/* Filters */}
                        {showFilters && (
                            <div className="grid md:grid-cols-3 gap-4 pt-4 border-t">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Topic</label>
                                    <select
                                        value={selectedTopic}
                                        onChange={(e) => setSelectedTopic(e.target.value)}
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    >
                                        <option value="">All Topics</option>
                                        {topics.map((topic) => (
                                            <option key={topic.id} value={topic.id}>
                                                {getLocalizedName(topic)}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        )}
                    </form>
                </div>

                {/* Results Count */}
                <div className="mb-6">
                    <p className="text-gray-600">
                        Found {questions.total} questions
                    </p>
                </div>

                {/* Questions Table */}
                <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    {/* خلية جديدة لخانة الاختيار الرئيسية */}
                                    <th className="px-6 py-3 text-left">
                                        <input
                                            type="checkbox"
                                            onChange={handleSelectAll}
                                            checked={selectedQuestions.length === questions.data.length && questions.data.length > 0}
                                            className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                                        />
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-full">
                                        Question
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Categories
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Date
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {questions.data.map((question) => (
                                    <tr key={question.id} className="hover:bg-gray-50">
                                        {/* خلية جديدة لكل خانة اختيار فردية */}
                                        <td className="px-6 py-4">
                                            <input
                                                type="checkbox"
                                                checked={selectedQuestions.includes(question.id)}
                                                onChange={() => handleSelectQuestion(question.id)}
                                                className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                                            />
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="w-full max-w-lg">
                                                <p
                                                    className="text-sm font-medium text-gray-900 truncate"
                                                    title={getLocalizedQuestion(question)}
                                                >
                                                    {getLocalizedQuestion(question)}
                                                </p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-gray-900 space-y-1">
                                                {question.topic && (
                                                    <div className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                                                        {getLocalizedName(question.topic)}
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-gray-900">
                                                {new Date(question.created_at).toLocaleDateString()}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right text-sm font-medium space-x-2">
                                            <Link
                                                href={`/admin/ask/${question.id}`}
                                                className="text-blue-600 hover:text-blue-900"
                                            >
                                                <Eye className="h-4 w-4" />
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(question.id)}
                                                disabled={processing}
                                                className="text-red-600 hover:text-red-900 disabled:opacity-50"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Pagination */}
                {questions.last_page > 1 && (
                    <div className="mt-8 flex justify-center">
                        <nav className="flex space-x-2">
                            {questions.links.map((link: any, index: number) => (
                                <Link
                                    key={index}
                                    href={link.url || '#'}
                                    className={`px-3 py-2 rounded-md text-sm font-medium ${
                                        link.active
                                            ? 'bg-blue-600 text-white'
                                            : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                                    } ${!link.url ? 'cursor-not-allowed opacity-50' : ''}`}
                                    {...(!link.url && { onClick: (e) => e.preventDefault() })}
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </nav>
                    </div>
                )}

                {/* No Results */}
                {questions.data.length === 0 && (
                    <div className="text-center py-12">
                        <div className="text-gray-400 mb-4">
                            <Search className="h-16 w-16 mx-auto" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No Questions Found</h3>
                        <p className="text-gray-600 mb-6">
                            Try adjusting your search criteria or filters
                        </p>
                        <Link
                            href="/admin/ask/create"
                            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                        >
                            Add First Question
                        </Link>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
