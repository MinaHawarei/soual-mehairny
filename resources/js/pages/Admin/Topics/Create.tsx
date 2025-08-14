import { Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Save } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';

export default function AdminTopicsCreate() {
    const { data, setData, post, processing, errors } = useForm({
        name_ar: '',
        name_en: '',
        slug: '',
        description_ar: '',
        description_en: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('admin.topics.store'));
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
                            <h1 className="text-2xl font-bold text-gray-900">Add New Topic</h1>
                        </div>
                        <p className="mt-2 text-sm text-gray-600">
                            Create a new theological topic category with multilingual support
                        </p>
                    </div>

                    {/* Create Form */}
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
                                    {processing ? 'Creating...' : 'Create Topic'}
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Help Section */}
                    <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <h4 className="text-sm font-medium text-blue-900 mb-2">Tips for creating topics:</h4>
                        <ul className="text-sm text-blue-800 space-y-1">
                            <li>• Use clear, descriptive names that users will understand</li>
                            <li>• The slug will be auto-generated but can be customized</li>
                            <li>• Descriptions help users understand what the topic covers</li>
                            <li>• Both Arabic and English names are required</li>
                            <li>• Keep names concise but informative</li>
                        </ul>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
