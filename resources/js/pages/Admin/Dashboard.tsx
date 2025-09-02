import { Link } from '@inertiajs/react';
import { Users, MessageSquare, CheckCircle, Clock, AlertCircle, Plus } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { isArabic } from '@/lib/locale';

interface DashboardStats {
    total_questions: number;
    pending_questions: number;
    approved_questions: number;
    rejected_questions: number;
}

interface PageProps {
    stats: DashboardStats;
}

export default function AdminDashboard({ stats }: PageProps) {
    const isArabicLocale = isArabic();

    return (
        <AppLayout>
            <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ${isArabicLocale ? 'rtl' : 'ltr'}`}>
                {/* Header */}
                <div className="mb-8">
                    <h1 className={`text-3xl font-bold text-gray-900 ${isArabicLocale ? 'text-right' : 'text-left'}`}>
                        {isArabicLocale ? 'لوحة تحكم المدير' : 'Admin Dashboard'}
                    </h1>
                    <p className={`text-gray-600 ${isArabicLocale ? 'text-right' : 'text-left'}`}>
                        {isArabicLocale
                            ? 'إدارة الأسئلة والمحتوى لمنصة المسيحية الأرثوذكسية'
                            : 'Manage questions and content for the Christian Orthodox platform'
                        }
                    </p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white rounded-lg shadow-sm border p-6">
                        <div className={`flex items-center ${isArabicLocale ? 'flex-row-reverse' : 'flex-row'}`}>
                            <div className="bg-blue-100 p-3 rounded-full">
                                <MessageSquare className="h-6 w-6 text-blue-600" />
                            </div>
                            <div className={isArabicLocale ? 'mr-4' : 'ml-4'}>
                                <p className={`text-sm font-medium text-gray-600 ${isArabicLocale ? 'text-right' : 'text-left'}`}>
                                    {isArabicLocale ? 'إجمالي الأسئلة' : 'Total Questions'}
                                </p>
                                <p className={`text-2xl font-bold text-gray-900 ${isArabicLocale ? 'text-right' : 'text-left'}`}>
                                    {stats.total_questions}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm border p-6">
                        <div className={`flex items-center ${isArabicLocale ? 'flex-row-reverse' : 'flex-row'}`}>
                            <div className="bg-yellow-100 p-3 rounded-full">
                                <Clock className="h-6 w-6 text-yellow-600" />
                            </div>
                            <div className={isArabicLocale ? 'mr-4' : 'ml-4'}>
                                <p className={`text-sm font-medium text-gray-600 ${isArabicLocale ? 'text-right' : 'text-left'}`}>
                                    {isArabicLocale ? 'في انتظار المراجعة' : 'Pending Review'}
                                </p>
                                <p className={`text-2xl font-bold text-gray-900 ${isArabicLocale ? 'text-right' : 'text-left'}`}>
                                    {stats.pending_questions}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm border p-6">
                        <div className={`flex items-center ${isArabicLocale ? 'flex-row-reverse' : 'flex-row'}`}>
                            <div className="bg-green-100 p-3 rounded-full">
                                <CheckCircle className="h-6 w-6 text-green-600" />
                            </div>
                            <div className={isArabicLocale ? 'mr-4' : 'ml-4'}>
                                <p className={`text-sm font-medium text-gray-600 ${isArabicLocale ? 'text-right' : 'text-left'}`}>
                                    {isArabicLocale ? 'معروض' : 'Enabled'}
                                </p>
                                <p className={`text-2xl font-bold text-gray-900 ${isArabicLocale ? 'text-right' : 'text-left'}`}>
                                    {stats.approved_questions}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm border p-6">
                        <div className={`flex items-center ${isArabicLocale ? 'flex-row-reverse' : 'flex-row'}`}>
                            <div className="bg-red-100 p-3 rounded-full">
                                <AlertCircle className="h-6 w-6 text-red-600" />
                            </div>
                            <div className={isArabicLocale ? 'mr-4' : 'ml-4'}>
                                <p className={`text-sm font-medium text-gray-600 ${isArabicLocale ? 'text-right' : 'text-left'}`}>
                                    {isArabicLocale ? 'غير معروض' : 'Disabled'}
                                </p>
                                <p className={`text-2xl font-bold text-gray-900 ${isArabicLocale ? 'text-right' : 'text-left'}`}>
                                    {stats.rejected_questions}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    <Link
                        href={route('admin.questions.index')}
                        className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow"
                    >
                        <div className={`flex items-center mb-4 ${isArabicLocale ? 'flex-row-reverse' : 'flex-row'}`}>
                            <MessageSquare className="h-8 w-8 text-blue-600" />
                            <h3 className={`text-lg font-semibold text-gray-900 ${isArabicLocale ? 'mr-3' : 'ml-3'}`}>
                                {isArabicLocale ? 'إدارة الأسئلة' : 'Manage Questions'}
                            </h3>
                        </div>
                        <p className={`text-gray-600 ${isArabicLocale ? 'text-right' : 'text-left'}`}>
                            {isArabicLocale
                                ? 'مراجعة والموافقة ورفض وتحرير الأسئلة المقدمة'
                                : 'Review, approve, reject, and edit submitted questions'
                            }
                        </p>
                    </Link>

                    <Link
                        href={route('admin.questions.create')}
                        className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow"
                    >
                        <div className={`flex items-center mb-4 ${isArabicLocale ? 'flex-row-reverse' : 'flex-row'}`}>
                            <Plus className="h-8 w-8 text-green-600" />
                            <h3 className={`text-lg font-semibold text-gray-900 ${isArabicLocale ? 'mr-3' : 'ml-3'}`}>
                                {isArabicLocale ? 'إضافة سؤال' : 'Add Question'}
                            </h3>
                        </div>
                        <p className={`text-gray-600 ${isArabicLocale ? 'text-right' : 'text-left'}`}>
                            {isArabicLocale
                                ? 'إنشاء أسئلة جديدة مع إجابات ومحتوى فيديو'
                                : 'Create new questions with answers and video content'
                            }
                        </p>
                    </Link>

                    <Link
                        href={route('admin.bible-books.index')}
                        className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow"
                    >
                        <div className="flex items-center mb-4">
                            <Users className="h-8 w-8 text-purple-600" />
                            <h3 className="text-lg font-semibold text-gray-900 ml-3">Bible Books</h3>
                        </div>
                        <p className="text-gray-600">Manage Bible book categories and references</p>
                    </Link>

                    <Link
                        href={route('admin.topics.index')}
                        className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow"
                    >
                        <div className="flex items-center mb-4">
                            <Users className="h-8 w-8 text-indigo-600" />
                            <h3 className="text-lg font-semibold text-gray-900 ml-3">Topics</h3>
                        </div>
                        <p className="text-gray-600">Manage theological topic categories</p>
                    </Link>
                </div>

                {/* Recent Activity */}
                <div className="bg-white rounded-lg shadow-sm border">
                    <div className="px-6 py-4 border-b">
                        <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
                    </div>
                    <div className="p-6">
                        <div className="text-center text-gray-500 py-8">
                            <MessageSquare className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                            <p>No recent activity to display</p>
                            <p className="text-sm">Activity will appear here as you manage questions</p>
                        </div>
                    </div>
                </div>

                {/* Quick Stats */}
                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white rounded-lg shadow-sm border p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Content Overview</h3>
                        <div className="space-y-3">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Questions with answers</span>
                                <span className="font-medium">{stats.approved_questions}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Questions pending answers</span>
                                <span className="font-medium">{stats.pending_questions}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Total content</span>
                                <span className="font-medium">{stats.total_questions}</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm border p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                        <div className="space-y-3">
                            <Link
                                href={route('admin.questions.index', { status: 'pending' })}
                                className="block w-full text-left px-4 py-2 bg-yellow-50 text-yellow-700 rounded-md hover:bg-yellow-100 transition-colors"
                            >
                                Review pending questions
                            </Link>
                            <Link
                                href={route('admin.questions.create')}
                                className="block w-full text-left px-4 py-2 bg-green-50 text-green-700 rounded-md hover:bg-green-100 transition-colors"
                            >
                                Add new question
                            </Link>
                            <Link
                                href={route('admin.questions.index')}
                                className="block w-full text-left px-4 py-2 bg-blue-50 text-blue-700 rounded-md hover:bg-blue-100 transition-colors"
                            >
                                View all questions
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
