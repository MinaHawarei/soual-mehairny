import { Link, useForm } from '@inertiajs/react';
import { Edit, Trash2, Plus, Tag } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';

interface PageProps {
    topics: Array<{
        id: number;
        name_ar: string;
        name_en: string;
        slug: string;
        description_ar: string | null;
        description_en: string | null;
        questions_count: number;
        created_at: string;
        updated_at: string;
    }>;
}

export default function AdminTopicsIndex({ topics }: PageProps) {
    const { delete: post, processing } = useForm({
        _method: 'DELETE',
    });

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this topic? This action cannot be undone.')) {
            post(route('admin.topics.destroy', id));
        }
    };

    const getLocalizedDescription = (topic: { description_ar: string | null; description_en: string | null }) => {
        return window.location.pathname.includes('/ar') ? topic.description_ar : topic.description_en;
    };

    return (
        <AppLayout>
            <div className="py-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">Topics Management</h1>
                                <p className="mt-1 text-sm text-gray-600">
                                    Manage theological topic categories and their descriptions
                                </p>
                            </div>
                            <Link
                                href={route('admin.topics.create')}
                                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                <Plus className="h-4 w-4 mr-2" />
                                Add Topic
                            </Link>
                        </div>
                    </div>

                    {/* Results Count */}
                    <div className="mb-4">
                        <p className="text-sm text-gray-600">
                            Showing {topics.length} topic{topics.length !== 1 ? 's' : ''}
                        </p>
                    </div>

                    {/* Topics Table */}
                    <div className="bg-white shadow rounded-lg overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Name (Arabic)
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Name (English)
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Slug
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Questions
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Last Updated
                                        </th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {(topics || []).map((topic) => (
                                        <tr key={topic.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {topic.name_ar}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {topic.name_en}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                <code className="px-2 py-1 bg-gray-100 rounded text-xs">
                                                    {topic.slug}
                                                </code>
                                            </td>

                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                <div className="flex items-center">
                                                    <Tag className="h-4 w-4 text-gray-400 mr-2" />
                                                    {topic.questions_count}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {new Date(topic.updated_at).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <div className="flex items-center justify-end space-x-2">
                                                    <Link
                                                        href={route('admin.topics.edit', topic.id)}
                                                        className="text-indigo-600 hover:text-indigo-900 p-1 rounded hover:bg-indigo-50"
                                                    >
                                                        <Edit className="h-4 w-4" />
                                                    </Link>
                                                    <button
                                                        onClick={() => handleDelete(topic.id)}
                                                        disabled={processing}
                                                        className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* No Results */}
                    {topics.length === 0 && (
                        <div className="text-center py-12">
                            <Tag className="mx-auto h-12 w-12 text-gray-400" />
                            <h3 className="mt-2 text-sm font-medium text-gray-900">No topics found</h3>
                            <p className="mt-1 text-sm text-gray-500">
                                Get started by creating your first topic category.
                            </p>
                            <div className="mt-6">
                                <Link
                                    href={route('admin.topics.create')}
                                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                >
                                    <Plus className="h-4 w-4 mr-2" />
                                    Add Topic
                                </Link>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
