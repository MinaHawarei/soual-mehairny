import { Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Save } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';

export default function AdminBibleBooksCreate() {
    const { data, setData, post, processing, errors } = useForm({
        name_ar: '',
        name_en: '',
        abbreviation_ar: '',
        abbreviation_en: '',
        order: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('admin.bible-books.store'));
    };

    return (
        <AppLayout>
            <div className="py-6">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-6">
                        <div className="flex items-center space-x-3">
                            <Link
                                href={route('admin.bible-books.index')}
                                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Back to Bible Books
                            </Link>
                            <h1 className="text-2xl font-bold text-gray-900">Add New Bible Book</h1>
                        </div>
                        <p className="mt-2 text-sm text-gray-600">
                            Create a new Bible book category with multilingual support
                        </p>
                    </div>

                    {/* Create Form */}
                    <div className="bg-white shadow rounded-lg">
                        <form onSubmit={handleSubmit} className="p-6 space-y-6">
                            {/* Names Section */}
                            <div>
                                <h3 className="text-lg font-medium text-gray-900 mb-4">Book Names</h3>
                                
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
                                            onChange={(e) => setData('name_ar', e.target.value)}
                                            placeholder="مثال: التكوين"
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
                                            onChange={(e) => setData('name_en', e.target.value)}
                                            placeholder="e.g., Genesis"
                                            required
                                        />
                                        {errors.name_en && (
                                            <p className="mt-1 text-sm text-red-600">{errors.name_en}</p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Abbreviations Section */}
                            <div>
                                <h3 className="text-lg font-medium text-gray-900 mb-4">Abbreviations</h3>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label htmlFor="abbreviation_ar" className="block text-sm font-medium text-gray-700 mb-2">
                                            Abbreviation (Arabic)
                                        </label>
                                        <input
                                            type="text"
                                            id="abbreviation_ar"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                            value={data.abbreviation_ar}
                                            onChange={(e) => setData('abbreviation_ar', e.target.value)}
                                            placeholder="مثال: تك"
                                            maxLength={10}
                                        />
                                        <p className="mt-1 text-sm text-gray-500">
                                            Short form used in references (optional)
                                        </p>
                                        {errors.abbreviation_ar && (
                                            <p className="mt-1 text-sm text-red-600">{errors.abbreviation_ar}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label htmlFor="abbreviation_en" className="block text-sm font-medium text-gray-700 mb-2">
                                            Abbreviation (English)
                                        </label>
                                        <input
                                            type="text"
                                            id="abbreviation_en"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                            value={data.abbreviation_en}
                                            onChange={(e) => setData('abbreviation_en', e.target.value)}
                                            placeholder="e.g., Gen"
                                            maxLength={10}
                                        />
                                        <p className="mt-1 text-sm text-gray-500">
                                            Short form used in references (optional)
                                        </p>
                                        {errors.abbreviation_en && (
                                            <p className="mt-1 text-sm text-red-600">{errors.abbreviation_en}</p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Order Section */}
                            <div>
                                <h3 className="text-lg font-medium text-gray-900 mb-4">Order</h3>
                                
                                <div>
                                    <label htmlFor="order" className="block text-sm font-medium text-gray-700 mb-2">
                                        Biblical Order *
                                    </label>
                                    <input
                                        type="number"
                                        id="order"
                                        min="1"
                                        max="66"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                        value={data.order}
                                        onChange={(e) => setData('order', e.target.value)}
                                        placeholder="e.g., 1 for Genesis, 66 for Revelation"
                                        required
                                    />
                                    <p className="mt-1 text-sm text-gray-500">
                                        The order of this book in the Bible (1-66)
                                    </p>
                                    {errors.order && (
                                        <p className="mt-1 text-sm text-red-600">{errors.order}</p>
                                    )}
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
                                    {processing ? 'Creating...' : 'Create Bible Book'}
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Help Section */}
                    <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <h4 className="text-sm font-medium text-blue-900 mb-2">Tips for creating Bible books:</h4>
                        <ul className="text-sm text-blue-800 space-y-1">
                            <li>• Use the official names as they appear in your Bible translation</li>
                            <li>• Abbreviations should be short and commonly recognized</li>
                            <li>• Order should follow the canonical sequence (1-66)</li>
                            <li>• Both Arabic and English names are required</li>
                            <li>• Abbreviations are optional but recommended for better user experience</li>
                        </ul>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
