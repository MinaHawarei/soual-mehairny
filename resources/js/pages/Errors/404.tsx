import { Link } from '@inertiajs/react';
import { Home, ArrowLeft, Search, MessageCircle } from 'lucide-react';
import PublicLayout from '@/layouts/public-layout';

export default function NotFound() {
    const isArabic = window.location.pathname.includes('/ar');
    
    return (
        <PublicLayout>
            <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
                <div className="max-w-md w-full text-center">
                    {/* 404 Icon */}
                    <div className="mb-8">
                        <div className="mx-auto h-24 w-24 bg-gray-100 rounded-full flex items-center justify-center">
                            <span className="text-4xl font-bold text-gray-600">404</span>
                        </div>
                    </div>

                    {/* Error Message */}
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">
                        {isArabic ? 'الصفحة غير موجودة' : 'Page Not Found'}
                    </h1>
                    
                    <p className="text-lg text-gray-600 mb-8">
                        {isArabic 
                            ? 'عذراً، الصفحة التي تبحث عنها غير موجودة أو تم نقلها.'
                            : 'Sorry, the page you are looking for could not be found or has been moved.'
                        }
                    </p>

                    {/* Action Buttons */}
                    <div className="space-y-4">
                        <Link
                            href={isArabic ? '/ar' : '/en'}
                            className="inline-flex items-center justify-center w-full px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                        >
                            <Home className="h-5 w-5 mr-2" />
                            {isArabic ? 'العودة للرئيسية' : 'Go to Home'}
                        </Link>

                        <Link
                            href={isArabic ? '/ar/questions' : '/en/questions'}
                            className="inline-flex items-center justify-center w-full px-6 py-3 border border-gray-300 text-base font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                        >
                            <Search className="h-5 w-5 mr-2" />
                            {isArabic ? 'تصفح الأسئلة' : 'Browse Questions'}
                        </Link>

                        <Link
                            href={isArabic ? '/ar/questions/create' : '/en/questions/create'}
                            className="inline-flex items-center justify-center w-full px-6 py-3 border border-gray-300 text-base font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                        >
                            <MessageCircle className="h-5 w-5 mr-2" />
                            {isArabic ? 'إرسال سؤال' : 'Submit a Question'}
                        </Link>
                    </div>

                    {/* Help Text */}
                    <p className="mt-8 text-sm text-gray-500">
                        {isArabic 
                            ? 'إذا كنت تعتقد أن هذا خطأ، يرجى الاتصال بنا.'
                            : 'If you believe this is an error, please contact us.'
                        }
                    </p>
                </div>
            </div>
        </PublicLayout>
    );
}
