import { type ReactNode, useEffect } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { Globe, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { router } from '@inertiajs/react';
import { getLocalePrefix, getCurrentLocale, buildLocalizedPath } from '@/lib/locale';
import CopticCrossIcon from '@/components/CopticCrossIcon';

interface PublicLayoutProps {
    children: ReactNode;
}

type AppNotice = {
    title: string;
    body?: string;
};

export default function PublicLayout({ children }: PublicLayoutProps) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { url, props } = usePage();
    const currentLocale = getCurrentLocale();
    const [notice, setNotice] = useState<AppNotice | null>(null);

    const nativeError = (props as { nativeError?: string | null }).nativeError ?? null;

    useEffect(() => {
        const handler = (event: Event) => {
            const detail = (event as CustomEvent<AppNotice>).detail;
            if (detail?.title) {
                setNotice(detail);
                window.setTimeout(() => setNotice(null), 2500);
            }
        };

        window.addEventListener('app:notify', handler as EventListener);

        return () => {
            window.removeEventListener('app:notify', handler as EventListener);
        };
    }, []);

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
        <div className="min-h-screen bg-background text-foreground font-sans selection:bg-accent/20">
            {/* Navigation */}
            <nav className="border-b border-ornament/40 bg-background/95 backdrop-blur-md sticky top-0 z-50 shadow-sm">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16 items-center">
                        {/* Logo */}
                        <div className="flex items-center">
                            <Link href={buildLocalizedPath('')} className="flex-shrink-0 group flex items-center gap-3">
                                <CopticCrossIcon
                                    className="text-primary h-8 w-8"
                                    size={32}
                                />
                                <h1 className="text-2xl font-bold font-heading text-primary tracking-tight">
                                    {currentLocale === 'ar' ? 'سؤال محيرني' : 'Soual Mehairny'}
                                </h1>
                            </Link>
                        </div>

                        {/* Desktop Navigation */}
                        <div className="hidden md:flex items-center gap-6">
                            {navigation.map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={`text-sm font-medium transition-colors duration-200
                                        ${url === item.href || url.startsWith(item.href + '/') && item.href !== buildLocalizedPath('')
                                            ? 'text-primary font-semibold'
                                            : 'text-muted-foreground hover:text-primary'
                                        }`}
                                >
                                    {item.name}
                                </Link>
                            ))}

                            <div className="h-4 w-px bg-border mx-2" />

                            {/* Language Toggle */}
                            <button
                                onClick={toggleLanguage}
                                className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
                            >
                                <Globe className="h-4 w-4" />
                                <span>{currentLocale === 'ar' ? 'English' : 'العربية'}</span>
                            </button>
                        </div>

                        {/* Mobile menu button */}
                        <div className="md:hidden flex items-center">
                            <button
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                className="text-foreground p-2 -mr-2"
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
                    <div className="md:hidden border-t border-border bg-background">
                        <div className="px-4 pt-2 pb-4 space-y-1">
                            {navigation.map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className="block px-3 py-3 rounded-md text-base font-medium text-foreground hover:bg-secondary transition-colors"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    {item.name}
                                </Link>
                            ))}
                            <div className="border-t border-border my-2" />
                            <button
                                onClick={toggleLanguage}
                                className="flex items-center gap-2 w-full px-3 py-3 text-base font-medium text-muted-foreground"
                            >
                                <Globe className="h-4 w-4" />
                                <span>{currentLocale === 'ar' ? 'English' : 'العربية'}</span>
                            </button>
                        </div>
                    </div>
                )}
            </nav>

            {/* Main Content */}
            <main className="max-w-5xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                {nativeError && (
                    <div className="mb-6 rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                        {nativeError}
                    </div>
                )}
                {children}
            </main>

            {/* Footer */}
            <footer className="border-t border-border/70 mt-16 bg-secondary/20">
                <div className="max-w-4xl mx-auto px-4 py-6">
                    <div className="flex flex-col items-center gap-2">
                        <CopticCrossIcon
                            className="text-primary/40 h-5 w-5"
                            size={20}
                        />

                        <p className="text-muted-foreground text-xs font-reading opacity-80 text-center">
                            {currentLocale === 'ar'
                                ? `© ${new Date().getFullYear()} سؤال محيرني. جميع الحقوق محفوظة.`
                                : `© ${new Date().getFullYear()} Soual Mehairny. All rights reserved.`}
                        </p>
                    </div>
                </div>
            </footer>

            {notice && (
                <div className="fixed bottom-6 left-1/2 z-50 w-[90%] max-w-sm -translate-x-1/2 rounded-2xl border border-ornament/30 bg-paper px-4 py-3 shadow-xl">
                    <p className="text-sm font-semibold text-foreground">{notice.title}</p>
                    {notice.body && <p className="text-xs text-muted-foreground mt-1">{notice.body}</p>}
                </div>
            )}

        </div>
    );
}
