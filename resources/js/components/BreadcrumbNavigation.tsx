import { Link } from '@inertiajs/react';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbItem {
    label: string;
    href?: string;
    isCurrent?: boolean;
}

interface BreadcrumbNavigationProps {
    items: BreadcrumbItem[];
    className?: string;
    showHome?: boolean;
}

export default function BreadcrumbNavigation({
    items,
    className = '',
    showHome = true,
}: BreadcrumbNavigationProps) {
    if (items.length === 0) return null;

    return (
        <nav className={`flex items-center space-x-2 text-sm ${className}`} aria-label="Breadcrumb">
            {showHome && (
                <>
                    <Link
                        href="/"
                        className="text-gray-500 hover:text-gray-700 transition-colors"
                    >
                        <Home className="h-4 w-4" />
                    </Link>
                    <ChevronRight className="h-4 w-4 text-gray-400" />
                </>
            )}

            {items.map((item, index) => (
                <div key={index} className="flex items-center">
                    {index > 0 && <ChevronRight className="h-4 w-4 text-gray-400 mx-2" />}
                    
                    {item.isCurrent ? (
                        <span className="text-gray-900 font-medium" aria-current="page">
                            {item.label}
                        </span>
                    ) : item.href ? (
                        <Link
                            href={item.href}
                            className="text-gray-500 hover:text-gray-700 transition-colors"
                        >
                            {item.label}
                        </Link>
                    ) : (
                        <span className="text-gray-500">{item.label}</span>
                    )}
                </div>
            ))}
        </nav>
    );
}

