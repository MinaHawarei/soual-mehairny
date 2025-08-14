import { Link } from '@inertiajs/react';
import { Home, AlertTriangle, RefreshCw } from 'lucide-react';
import PublicLayout from '@/layouts/public-layout';

interface ErrorProps {
    status?: number;
    title?: string;
    message?: string;
}

export default function Error({ status = 500, title, message }: ErrorProps) {
    const isArabic = window.location.pathname.includes('/ar');
    
    // Default error messages based on status
    const getDefaultTitle = () => {
        if (title) return title;
        
        switch (status) {
            case 403:
                return isArabic ? 'غير مصرح' : 'Forbidden';
            case 404:
                return isArabic ? 'غير موجود' : 'Not Found';
            case 419:
                return isArabic ? 'انتهت صلاحية الصفحة' : 'Page Expired';
            case 429:
                return isArabic ? 'كثير من الطلبات' : 'Too Many Requests';
            case 500:
                return isArabic ? 'خطأ في الخادم' : 'Server Error';
            case 503:
                return isArabic ? 'الخدمة غير متاحة' : 'Service Unavailable';
            default:
                return isArabic ? 'خطأ' : 'Error';
        }
    };

    const getDefaultMessage = () => {
        if (message) return message;
        
        switch (status) {
            case 403:
                return isArabic 
                    ? 'عذراً، ليس لديك صلاحية للوصول إلى هذه الصفحة.'
                    : 'Sorry, you are not authorized to access this page.';
            case 404:
                return isArabic 
                    ? 'عذراً، الصفحة التي تبحث عنها غير موجودة.'
                    : 'Sorry, the page you are looking for could not be found.';
            case 419:
                return isArabic 
                    ? 'عذراً، انتهت صلاحية الصفحة. يرجى تحديث الصفحة والمحاولة مرة أخرى.'
                    : 'Sorry, your session has expired. Please refresh and try again.';
            case 429:
                return isArabic 
                    ? 'عذراً، لقد قمت بطلبات كثيرة جداً. يرجى المحاولة مرة أخرى لاحقاً.'
                    : 'Sorry, you are making too many requests. Please try again later.';
            case 500:
                return isArabic 
                    ? 'عذراً، حدث خطأ في الخادم. يرجى المحاولة مرة أخرى لاحقاً.'
                    : 'Sorry, something went wrong on our servers. Please try again later.';
            case 503:
                return isArabic 
                    ? 'عذراً، الخدمة غير متاحة حالياً. يرجى المحاولة مرة أخرى لاحقاً.'
                    : 'Sorry, we are doing maintenance. Please try again later.';
            default:
                return isArabic 
                    ? 'عذراً، حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.'
                    : 'Sorry, an unexpected error occurred. Please try again.';
        }
    };

    return (
        <PublicLayout>
            <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
                <div className="max-w-md w-full text-center">
                    {/* Error Icon */}
                    <div className="mb-8">
                        <div className="mx-auto h-24 w-24 bg-red-100 rounded-full flex items-center justify-center">
                            <AlertTriangle className="h-12 w-12 text-red-600" />
                        </div>
                    </div>

                    {/* Status Code */}
                    {status && (
                        <div className="mb-4">
                            <span className="text-6xl font-bold text-gray-300">{status}</span>
                        </div>
                    )}

                    {/* Error Title */}
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">
                        {getDefaultTitle()}
                    </h1>
                    
                    {/* Error Message */}
                    <p className="text-lg text-gray-600 mb-8">
                        {getDefaultMessage()}
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

                        <button
                            onClick={() => window.location.reload()}
                            className="inline-flex items-center justify-center w-full px-6 py-3 border border-gray-300 text-base font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                        >
                            <RefreshCw className="h-5 w-5 mr-2" />
                            {isArabic ? 'إعادة المحاولة' : 'Try Again'}
                        </button>
                    </div>

                    {/* Help Text */}
                    <p className="mt-8 text-sm text-gray-500">
                        {isArabic 
                            ? 'إذا استمرت المشكلة، يرجى الاتصال بنا للحصول على المساعدة.'
                            : 'If the problem persists, please contact us for assistance.'
                        }
                    </p>
                </div>
            </div>
        </PublicLayout>
    );
}
