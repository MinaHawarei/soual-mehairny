import AppLogoIcon from '@/components/app-logo-icon';
import { Link } from '@inertiajs/react';
import { type PropsWithChildren } from 'react';
import { isArabic, buildLocalizedPath } from '@/lib/locale';

interface AuthLayoutProps {
    name?: string;
    title?: string;
    description?: string;
}

export default function AuthSimpleLayout({ children, title, description }: PropsWithChildren<AuthLayoutProps>) {
    const isArabicLocale = isArabic();
    
    return (
        <div className={`flex min-h-svh flex-col items-center justify-center gap-6 bg-background p-6 md:p-10 ${isArabicLocale ? 'rtl' : 'ltr'}`}>
            <div className="w-full max-w-sm">
                <div className="flex flex-col gap-8">
                    <div className="flex flex-col items-center gap-4">
                        <Link href={buildLocalizedPath('')} className="flex flex-col items-center gap-2 font-medium">
                            <div className="mb-1 flex h-9 w-9 items-center justify-center rounded-md">
                                <AppLogoIcon className="size-9 fill-current text-[var(--foreground)] dark:text-white" />
                            </div>
                            <span className="sr-only">
                                {isArabicLocale ? 'سؤال محيرني' : 'Soual Mehairny'}
                            </span>
                        </Link>

                        <div className={`space-y-2 text-center ${isArabicLocale ? 'text-right' : 'text-left'}`}>
                            <h1 className="text-xl font-medium">{title}</h1>
                            <p className={`text-sm text-muted-foreground ${isArabicLocale ? 'text-right' : 'text-center'}`}>
                                {description}
                            </p>
                        </div>
                    </div>
                    {children}
                </div>
            </div>
        </div>
    );
}
