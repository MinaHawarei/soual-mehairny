import { DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { UserInfo } from '@/components/user-info';
import { useMobileNavigation } from '@/hooks/use-mobile-navigation';
import { type User } from '@/types';
import { Link, router } from '@inertiajs/react';
import { LogOut, Settings } from 'lucide-react';
import { isArabic } from '@/lib/locale';

interface UserMenuContentProps {
    user: User;
}

export function UserMenuContent({ user }: UserMenuContentProps) {
    const cleanup = useMobileNavigation();
    const isArabicLocale = isArabic();

    const handleLogout = () => {
        cleanup();
        router.flushAll();
    };

    return (
        <>
            <DropdownMenuLabel className={`p-0 font-normal ${isArabicLocale ? 'rtl' : 'ltr'}`}>
                <div className={`flex items-center gap-2 px-1 py-1.5 text-sm ${isArabicLocale ? 'text-right' : 'text-left'}`}>
                    <UserInfo user={user} showEmail={true} />
                </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup className={isArabicLocale ? 'rtl' : 'ltr'}>
                <DropdownMenuItem asChild>
                    <Link 
                        className={`block w-full ${isArabicLocale ? 'text-right' : 'text-left'}`} 
                        href={route('profile.edit')} 
                        as="button" 
                        prefetch 
                        onClick={cleanup}
                    >
                        <Settings className={isArabicLocale ? 'ml-2' : 'mr-2'} />
                        {isArabicLocale ? 'الإعدادات' : 'Settings'}
                    </Link>
                </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
                <Link 
                    className={`block w-full ${isArabicLocale ? 'text-right' : 'text-left'}`} 
                    method="post" 
                    href={route('logout')} 
                    as="button" 
                    onClick={handleLogout}
                >
                    <LogOut className={isArabicLocale ? 'ml-2' : 'mr-2'} />
                    {isArabicLocale ? 'تسجيل الخروج' : 'Log out'}
                </Link>
            </DropdownMenuItem>
        </>
    );
}
