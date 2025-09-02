import { Link, useForm, router } from '@inertiajs/react';
import { Search, Filter, Edit, Trash2, Plus, CheckCircle, XCircle } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { useState } from 'react';

interface User {
    id: number;
    name: string;
    email: string;
    role: string;
    status: boolean;
    created_at: string;
}

interface Filters {
    search?: string;
}

interface PageProps {
    users: {
        data: User[];
        current_page: number;
        last_page: number;
        total: number;
        links: any[];
    };
    filters: Filters;
}

export default function AdminUsersIndex({ users, filters }: PageProps) {
    const [searchQuery, setSearchQuery] = useState(filters.search || '');
    const { delete: destroy, processing } = useForm();

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        const params = new URLSearchParams();
        if (searchQuery) params.append('search', searchQuery);
        window.location.href = `/users?${params.toString()}`;
    };

    const clearFilters = () => {
        setSearchQuery('');
        window.location.href = '/users';
    };

    const handleDelete = (userId: number) => {
        if (confirm('Are you sure you want to delete this user?')) {
            destroy(route('admin.users.destroy', userId));
        }
    };

    const getStatusBadge = (status: boolean) => {
        return status ? (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                <CheckCircle className="h-3 w-3 mr-1" /> Active
            </span>
        ) : (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                <XCircle className="h-3 w-3 mr-1" /> Inactive
            </span>
        );
    };

    return (
        <AppLayout>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8 flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Manage Users</h1>
                        <p className="text-gray-600">View, edit and manage system users</p>
                    </div>

                </div>



                {/* Results Count */}
                <div className="mb-6">
                    <p className="text-gray-600">{users.total} users</p>
                </div>

                {/* Users Table */}
                <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {users.data.map((user) => (
                                    <tr key={user.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4">{user.name}</td>
                                        <td className="px-6 py-4">{user.email}</td>
                                        <td className="px-6 py-4 capitalize">{user.role}</td>
                                        <td className="px-6 py-4">{getStatusBadge(user.status)}</td>
                                        <td className="px-6 py-4 text-right space-x-2">
                                            <Link
                                                href={`/admin/users/${user.id}/edit`}
                                                className="text-indigo-600 hover:text-indigo-900"
                                            >
                                                <Edit className="h-4 w-4" />
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(user.id)}
                                                disabled={processing}
                                                className="text-red-600 hover:text-red-900 disabled:opacity-50"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Pagination */}
                {users.last_page > 1 && (
                    <div className="mt-8 flex justify-center">
                        <nav className="flex space-x-2">
                            {users.links.map((link: any, index: number) => (
                                <Link
                                    key={index}
                                    href={link.url || '#'}
                                    className={`px-3 py-2 rounded-md text-sm font-medium ${
                                        link.active
                                            ? 'bg-blue-600 text-white'
                                            : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                                    } ${!link.url ? 'cursor-not-allowed opacity-50' : ''}`}
                                    {...(!link.url && { onClick: (e) => e.preventDefault() })}
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </nav>
                    </div>
                )}

                {/* No Results */}
                {users.data.length === 0 && (
                    <div className="text-center py-12">
                        <div className="text-gray-400 mb-4">
                            <Search className="h-16 w-16 mx-auto" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No Users Found</h3>
                        <p className="text-gray-600 mb-6">Try adjusting your search</p>
                        <Link
                            href="/users/create"
                            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                        >
                            Add First User
                        </Link>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
