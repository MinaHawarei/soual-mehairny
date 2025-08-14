import { Link, useForm } from '@inertiajs/react';
import { Search, Filter, Edit, Trash2, CheckCircle, XCircle, Eye, Plus } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { useState } from 'react';

interface Question {
    id: number;
    question_ar: string;
    question_en: string;
    answer_ar: string | null;
    answer_en: string | null;
    youtube_video_id: string | null;
    submitter_name: string | null;
    submitter_email: string | null;
    status: 'pending' | 'approved' | 'rejected';
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
    status?: string;
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

export default function AdminQuestionsIndex({ questions, bibleBooks, topics, filters }: PageProps) {
    const [searchQuery, setSearchQuery] = useState(filters.search || '');
    const [selectedStatus, setSelectedStatus] = useState(filters.status || 'all');
    const [selectedBibleBook, setSelectedBibleBook] = useState(filters.bible_book_id || '');
    const [selectedTopic, setSelectedTopic] = useState(filters.topic_id || '');
    const [showFilters, setShowFilters] = useState(false);

    const { delete: destroy, processing } = useForm();

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        updateFilters();
    };

    const updateFilters = () => {
        const params = new URLSearchParams();
        if (searchQuery) params.append('search', searchQuery);
        if (selectedStatus !== 'all') params.append('status', selectedStatus);
        if (selectedBibleBook) params.append('bible_book_id', selectedBibleBook);
        if (selectedTopic) params.append('topic_id', selectedTopic);
        
        window.location.href = `/admin/questions?${params.toString()}`;
    };

    const clearFilters = () => {
        setSearchQuery('');
        setSelectedStatus('all');
        setSelectedBibleBook('');
        setSelectedTopic('');
        window.location.href = '/admin/questions';
    };

    const handleDelete = (questionId: number) => {
        if (confirm('Are you sure you want to delete this question? This action cannot be undone.')) {
            destroy(`/admin/questions/${questionId}`);
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'approved':
                return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">Approved</span>;
            case 'pending':
                return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">Pending</span>;
            case 'rejected':
                return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">Rejected</span>;
            default:
                return null;
        }
    };

    const getLocalizedName = (item: { name_ar: string; name_en: string }) => {
        // For admin, we'll use English as default
        return item.name_en;
    };

    const getLocalizedQuestion = (question: Question) => {
        // For admin, we'll use English as default
        return question.question_en;
    };

    return (
        <AppLayout>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8 flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Manage Questions</h1>
                        <p className="text-gray-600">Review, approve, and manage submitted questions</p>
                    </div>
                    <Link
                        href="/admin/questions/create"
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                    >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Question
                    </Link>
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
                            
                            {(filters.search || filters.status || filters.bible_book_id || filters.topic_id) && (
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
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                                    <select
                                        value={selectedStatus}
                                        onChange={(e) => setSelectedStatus(e.target.value)}
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    >
                                        <option value="all">All Statuses</option>
                                        <option value="pending">Pending</option>
                                        <option value="approved">Approved</option>
                                        <option value="rejected">Rejected</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Bible Book</label>
                                    <select
                                        value={selectedBibleBook}
                                        onChange={(e) => setSelectedBibleBook(e.target.value)}
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    >
                                        <option value="">All Books</option>
                                        {bibleBooks.map((book) => (
                                            <option key={book.id} value={book.id}>
                                                {getLocalizedName(book)}
                                            </option>
                                        ))}
                                    </select>
                                </div>
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
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Question
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Categories
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Submitter
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
                                        <td className="px-6 py-4">
                                            <div className="max-w-xs">
                                                <p className="text-sm font-medium text-gray-900 truncate">
                                                    {getLocalizedQuestion(question)}
                                                </p>
                                                <p className="text-xs text-gray-500 mt-1">
                                                    {question.question_ar.substring(0, 50)}...
                                                </p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            {getStatusBadge(question.status)}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-gray-900 space-y-1">
                                                {question.bible_book && (
                                                    <div className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                                        {getLocalizedName(question.bible_book)}
                                                    </div>
                                                )}
                                                {question.topic && (
                                                    <div className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                                                        {getLocalizedName(question.topic)}
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-gray-900">
                                                {question.submitter_name || 'Anonymous'}
                                            </div>
                                            {question.submitter_email && (
                                                <div className="text-xs text-gray-500">
                                                    {question.submitter_email}
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-gray-900">
                                                {new Date(question.created_at).toLocaleDateString()}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right text-sm font-medium space-x-2">
                                            <Link
                                                href={`/admin/questions/${question.id}`}
                                                className="text-blue-600 hover:text-blue-900"
                                            >
                                                <Eye className="h-4 w-4" />
                                            </Link>
                                            <Link
                                                href={`/admin/questions/${question.id}/edit`}
                                                className="text-indigo-600 hover:text-indigo-900"
                                            >
                                                <Edit className="h-4 w-4" />
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
                            href="/admin/questions/create"
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
