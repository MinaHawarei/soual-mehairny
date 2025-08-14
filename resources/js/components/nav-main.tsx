import { SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { isArabic } from '@/lib/locale';

export function NavMain({ items = [] }: { items: NavItem[] }) {
    const page = usePage();
    const isArabicLocale = isArabic();
    
    return (
        <SidebarGroup className={`px-2 py-0 ${isArabicLocale ? 'rtl' : 'ltr'}`}>
            <SidebarGroupLabel className={isArabicLocale ? 'text-right' : 'text-left'}>
                {isArabicLocale ? 'المنصة' : 'Platform'}
            </SidebarGroupLabel>
            <SidebarMenu>
                {items.map((item) => (
                    <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton 
                            asChild 
                            isActive={page.url.startsWith(item.href)} 
                            tooltip={{ children: item.title }}
                            className={isArabicLocale ? 'rtl' : 'ltr'}
                        >
                            <Link href={item.href} prefetch>
                                {item.icon && <item.icon />}
                                <span className={isArabicLocale ? 'text-right' : 'text-left'}>
                                    {item.title}
                                </span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                ))}
            </SidebarMenu>
        </SidebarGroup>
    );
}
