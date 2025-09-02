import { type ReactNode } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { Globe, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { router } from '@inertiajs/react';
import { getLocalePrefix, getCurrentLocale, buildLocalizedPath } from '@/lib/locale';
import CopticCrossIcon from '@/components/CopticCrossIcon';

interface PublicLayoutProps {
    children: ReactNode;
}

export default function PublicLayout({ children }: PublicLayoutProps) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { url } = usePage();
    const currentLocale = getCurrentLocale();
    const localePrefix = getLocalePrefix();

    const toggleLanguage = () => {
        const newLocale = currentLocale === 'ar' ? 'en' : 'ar';
        const newUrl = url.replace(`/${currentLocale}`, `/${newLocale}`);
        router.visit(newUrl);
    };

    const navigation = [
        { name: currentLocale === 'ar' ? 'الرئيسية' : 'Home', href: buildLocalizedPath('') },
        { name: currentLocale === 'ar' ? 'الأسئلة' : 'Questions', href: buildLocalizedPath('questions') },
        { name: currentLocale === 'ar' ? 'إرسال سؤال' : 'Submit Question', href: buildLocalizedPath('ask/create') },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-blue-50">
            {/* Navigation */}
            <nav className="bg-white/95 backdrop-blur-sm shadow-lg border-b border-amber-200/50 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center">
                            <Link href={buildLocalizedPath('')} className="flex-shrink-0 group">
                                <div className="flex items-center space-x-3 group-hover:scale-105 transition-transform duration-200">
                                    <div className="relative">
                                        <CopticCrossIcon
                                            className="text-amber-600 h-8 w-8 drop-shadow-sm"
                                            size={32}
                                        />
                                        <div className="absolute inset-0 bg-amber-400/20 rounded-full blur-sm group-hover:bg-amber-400/30 transition-colors duration-200"></div>
                                    </div>
                                    <h1 className="text-2xl font-bold bg-gradient-to-r from-amber-700 via-red-800 to-blue-900 bg-clip-text text-transparent">
                                        {currentLocale === 'ar' ? 'سؤال محيرني' : 'Soual Mehairny'}
                                    </h1>
                                </div>
                            </Link>
                        </div>

                        {/* Desktop Navigation */}
                        <div className="hidden md:flex items-center space-x-8">
                            {navigation.map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className="text-gray-700 hover:text-amber-700 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-amber-50 hover:shadow-md relative group"
                                >
                                    {item.name}
                                    <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-amber-500 to-red-600 group-hover:w-full transition-all duration-300"></div>
                                </Link>
                            ))}

                            {/* Language Toggle */}
                            <button
                                onClick={toggleLanguage}
                                className="flex items-center space-x-2 text-gray-700 hover:text-amber-700 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-amber-50 hover:shadow-md"
                            >
                                <Globe className="h-4 w-4" />
                                <span>{currentLocale === 'ar' ? 'English' : 'العربية'}</span>
                            </button>
                        </div>

                        {/* Mobile menu button */}
                        <div className="md:hidden flex items-center">
                            <button
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                className="text-gray-700 hover:text-amber-700 p-2 rounded-lg hover:bg-amber-50 transition-colors duration-200"
                            >
                                {isMenuOpen ? (
                                    <X className="h-6 w-6" />
                                ) : (
                                    <Menu className="h-6 w-6" />
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Navigation */}
                {isMenuOpen && (
                    <div className="md:hidden">
                        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white/95 backdrop-blur-sm border-t border-amber-200/50">
                            {navigation.map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className="text-gray-700 hover:text-amber-700 block px-3 py-2 rounded-lg text-base font-medium transition-colors duration-200 hover:bg-amber-50"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    {item.name}
                                </Link>
                            ))}

                            <button
                                onClick={toggleLanguage}
                                className="flex items-center space-x-2 text-gray-700 hover:text-amber-700 block w-full text-left px-3 py-2 rounded-lg text-base font-medium transition-colors duration-200 hover:bg-amber-50"
                            >
                                <Globe className="h-4 w-4" />
                                <span>{currentLocale === 'ar' ? 'English' : 'العربية'}</span>
                            </button>
                        </div>
                    </div>
                )}
            </nav>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto py-8 sm:px-6 lg:px-8">
                {children}
            </main>

            {/* Footer */}
            <footer className="bg-gradient-to-r from-amber-50 to-blue-50 border-t border-amber-200/50 mt-auto">
                <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <div className="flex items-center justify-center space-x-2 mb-4">
                            <CopticCrossIcon className="text-amber-600 h-6 w-6" size={24} />
                            <span className="text-amber-700 font-medium">
                                {currentLocale === 'ar' ? 'سؤال محيرني' : 'Soual Mehairny'}
                            </span>
                        </div>
                        <p className="text-gray-600 text-sm">
                            {currentLocale === 'ar'
                                ? '© 2025جميع الحقوق محفوظة.'
                                : '© 2025 All rights reserved.'}
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
