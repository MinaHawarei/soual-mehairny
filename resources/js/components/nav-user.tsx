import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from '@/components/ui/sidebar';
import { UserInfo } from '@/components/user-info';
import { UserMenuContent } from '@/components/user-menu-content';
import { useIsMobile } from '@/hooks/use-mobile';
import { type SharedData } from '@/types';
import { usePage } from '@inertiajs/react';
import { ChevronsUpDown } from 'lucide-react';
import { isArabic } from '@/lib/locale';

export function NavUser() {
    const { auth } = usePage<SharedData>().props;
    const { state } = useSidebar();
    const isMobile = useIsMobile();
    const isArabicLocale = isArabic();

    return (
        <SidebarMenu className={isArabicLocale ? 'rtl' : 'ltr'}>
            <SidebarMenuItem>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <SidebarMenuButton 
                            size="lg" 
                            className={`group text-sidebar-accent-foreground data-[state=open]:bg-sidebar-accent ${isArabicLocale ? 'rtl' : 'ltr'}`}
                        >
                            <UserInfo user={auth.user} />
                            <ChevronsUpDown className={`size-4 ${isArabicLocale ? 'mr-auto' : 'ml-auto'}`} />
                        </SidebarMenuButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
                        align={isArabicLocale ? 'start' : 'end'}
                        side={isMobile ? 'bottom' : state === 'collapsed' ? (isArabicLocale ? 'right' : 'left') : 'bottom'}
                    >
                        <UserMenuContent user={auth.user} />
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarMenuItem>
        </SidebarMenu>
    );
}
