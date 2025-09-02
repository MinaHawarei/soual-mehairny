import { Link, usePage } from '@inertiajs/react';
import {
    Home,
    MessageSquare,
    BookOpen,
    Tag,
    Users,
    Settings,
    ChevronDown
} from 'lucide-react';
import { useState } from 'react';

interface AdminNavigationProps {
    className?: string;
}

export default function AdminNavigation({ className = '' }: AdminNavigationProps) {
    const [isOpen, setIsOpen] = useState(false);
    const { url } = usePage();

    const navigation = [
        {
            name: 'Dashboard',
            href: route('admin.dashboard'),
            icon: Home,
            current: url === route('admin.dashboard'),
        },
        {
            name: 'Reserved Questions',
            href: route('admin.ask.index'),
            icon: MessageSquare,
            current: url.startsWith('/ask'),
        },
        {
            name: 'Questions',
            href: route('admin.questions.index'),
            icon: MessageSquare,
            current: url.startsWith('/admin/questions'),
        },
        {
            name: 'Bible Books',
            href: route('admin.bible-books.index'),
            icon: BookOpen,
            current: url.startsWith('/admin/bible-books'),
        },
        {
            name: 'Topics',
            href: route('admin.topics.index'),
            icon: Tag,
            current: url.startsWith('/admin/topics'),
        },
        {
            name: 'Users',
            href: route('admin.users.index'),
            icon: Users,
            current: url.startsWith('/admin/users'),
        },
        {
            name: 'Settings',
            href: '#',
            icon: Settings,
            current: false,
            disabled: true,
        },
    ];

    return (
        <nav className={`bg-white shadow-sm border-b ${className}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex">
                        <div className="flex-shrink-0 flex items-center">
                            <span className="text-lg font-semibold text-gray-900">Admin Panel</span>
                        </div>

                        {/* Desktop Navigation */}
                        <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                            {navigation.map((item) => {
                                const Icon = item.icon;
                                return (
                                    <Link
                                        key={item.name}
                                        href={item.disabled ? '#' : item.href}
                                        className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                                            item.current
                                                ? 'border-indigo-500 text-gray-900'
                                                : item.disabled
                                                ? 'border-transparent text-gray-400 cursor-not-allowed'
                                                : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                                        }`}
                                        onClick={item.disabled ? (e) => e.preventDefault() : undefined}
                                    >
                                        <Icon className="h-4 w-4 mr-2" />
                                        {item.name}
                                    </Link>
                                );
                            })}
                        </div>
                    </div>

                    {/* Mobile menu button */}
                    <div className="sm:hidden flex items-center">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
                        >
                            <ChevronDown className={`h-5 w-5 transform ${isOpen ? 'rotate-180' : ''}`} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Navigation */}
            {isOpen && (
                <div className="sm:hidden">
                    <div className="pt-2 pb-3 space-y-1">
                        {navigation.map((item) => {
                            const Icon = item.icon;
                            return (
                                <Link
                                    key={item.name}
                                    href={item.disabled ? '#' : item.href}
                                    className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                                        item.current
                                            ? 'bg-indigo-50 border-indigo-500 text-indigo-700'
                                            : item.disabled
                                            ? 'border-transparent text-gray-400 cursor-not-allowed'
                                            : 'border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800'
                                    }`}
                                    onClick={item.disabled ? (e) => e.preventDefault() : undefined}
                                >
                                    <div className="flex items-center">
                                        <Icon className="h-4 w-4 mr-3" />
                                        {item.name}
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            )}
        </nav>
    );
}
