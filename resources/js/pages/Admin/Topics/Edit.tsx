import { Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Save } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';

interface PageProps {
    topic: {
        id: number;
        name_ar: string;
        name_en: string;
        slug: string;
        description_ar: string | null;
        description_en: string | null;
        created_at: string;
        updated_at: string;
    };
}

export default function AdminTopicsEdit({ topic }: PageProps) {
    const { data, setData, post, processing, errors } = useForm({
        name_ar: topic.name_ar,
        name_en: topic.name_en,
        slug: topic.slug,
        description_ar: topic.description_ar || '',
        description_en: topic.description_en || '',
        _method: 'PUT',

    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('admin.topics.update', topic.id));
    };

    const generateSlug = (name: string) => {
        return name
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .trim();
    };

    const handleNameChange = (field: 'name_ar' | 'name_en', value: string) => {
        setData(field, value);

        // Auto-generate slug from English name if it's empty
        if (field === 'name_en' && !data.slug) {
            const slug = generateSlug(value);
            setData('slug', slug);
        }
    };

    return (
        <AppLayout>
            <div className="py-6">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-6">
                        <div className="flex items-center space-x-3">
                            <Link
                                href={route('admin.topics.index')}
                                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Back to Topics
                            </Link>
                            <h1 className="text-2xl font-bold text-gray-900">Edit Topic</h1>
                        </div>
                        <div className="mt-2 flex items-center space-x-4">
                            <span className="text-sm text-gray-500">
                                Created: {new Date(topic.created_at).toLocaleDateString()}
                            </span>
                            <span className="text-sm text-gray-500">
                                Last updated: {new Date(topic.updated_at).toLocaleDateString()}
                            </span>
                        </div>
                    </div>

                    {/* Edit Form */}
                    <div className="bg-white shadow rounded-lg">
                        <form onSubmit={handleSubmit} className="p-6 space-y-6">
                            {/* Names Section */}
                            <div>
                                <h3 className="text-lg font-medium text-gray-900 mb-4">Topic Names</h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label htmlFor="name_ar" className="block text-sm font-medium text-gray-700 mb-2">
                                            Name (Arabic) *
                                        </label>
                                        <input
                                            type="text"
                                            id="name_ar"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                            value={data.name_ar}
                                            onChange={(e) => handleNameChange('name_ar', e.target.value)}
                                            placeholder="مثال: الثالوث المقدس"
                                            required
                                        />
                                        {errors.name_ar && (
                                            <p className="mt-1 text-sm text-red-600">{errors.name_ar}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label htmlFor="name_en" className="block text-sm font-medium text-gray-700 mb-2">
                                            Name (English) *
                                        </label>
                                        <input
                                            type="text"
                                            id="name_en"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                            value={data.name_en}
                                            onChange={(e) => handleNameChange('name_en', e.target.value)}
                                            placeholder="e.g., Holy Trinity"
                                            required
                                        />
                                        {errors.name_en && (
                                            <p className="mt-1 text-sm text-red-600">{errors.name_en}</p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Slug Section */}
                            <div>
                                <h3 className="text-lg font-medium text-gray-900 mb-4">URL Slug</h3>

                                <div>
                                    <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-2">
                                        URL Slug *
                                    </label>
                                    <input
                                        type="text"
                                        id="slug"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                        value={data.slug}
                                        onChange={(e) => setData('slug', e.target.value)}
                                        placeholder="e.g., holy-trinity"
                                        required
                                    />
                                    <p className="mt-1 text-sm text-gray-500">
                                        URL-friendly identifier. Auto-generated from English name, but can be customized.
                                    </p>
                                    {errors.slug && (
                                        <p className="mt-1 text-sm text-red-600">{errors.slug}</p>
                                    )}
                                </div>
                            </div>

                            {/* Descriptions Section */}
                            <div>
                                <h3 className="text-lg font-medium text-gray-900 mb-4">Descriptions</h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label htmlFor="description_ar" className="block text-sm font-medium text-gray-700 mb-2">
                                            Description (Arabic)
                                        </label>
                                        <textarea
                                            id="description_ar"
                                            rows={4}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                            value={data.description_ar}
                                            onChange={(e) => setData('description_ar', e.target.value)}
                                            placeholder="وصف مختصر للموضوع باللغة العربية..."
                                        />
                                        <p className="mt-1 text-sm text-gray-500">
                                            Brief description of the topic (optional)
                                        </p>
                                        {errors.description_ar && (
                                            <p className="mt-1 text-sm text-red-600">{errors.description_ar}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label htmlFor="description_en" className="block text-sm font-medium text-gray-700 mb-2">
                                            Description (English)
                                        </label>
                                        <textarea
                                            id="description_en"
                                            rows={4}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                            value={data.description_en}
                                            onChange={(e) => setData('description_en', e.target.value)}
                                            placeholder="Brief description of the topic in English..."
                                        />
                                        <p className="mt-1 text-sm text-gray-500">
                                            Brief description of the topic (optional)
                                        </p>
                                        {errors.description_en && (
                                            <p className="mt-1 text-sm text-red-600">{errors.description_en}</p>
                                        )}
                                    </div>
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

                    {/* Current Values Display */}
                    <div className="mt-6 bg-gray-50 border border-gray-200 rounded-lg p-4">
                        <h4 className="text-sm font-medium text-gray-900 mb-3">Current Values:</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div>
                                <span className="font-medium text-gray-700">Arabic Name:</span>
                                <span className="ml-2 text-gray-600">{topic.name_ar}</span>
                            </div>
                            <div>
                                <span className="font-medium text-gray-700">English Name:</span>
                                <span className="ml-2 text-gray-600">{topic.name_en}</span>
                            </div>
                            <div>
                                <span className="font-medium text-gray-700">URL Slug:</span>
                                <span className="ml-2 text-gray-600">{topic.slug}</span>
                            </div>
                            <div>
                                <span className="font-medium text-gray-700">Arabic Description:</span>
                                <span className="ml-2 text-gray-600">{topic.description_ar || 'None'}</span>
                            </div>
                            <div>
                                <span className="font-medium text-gray-700">English Description:</span>
                                <span className="ml-2 text-gray-600">{topic.description_en || 'None'}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
