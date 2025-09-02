import { Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Save } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';

interface PageProps {
    user: {
        id: number;
        name: string;
        email: string;
        role: string;
        status: boolean;
    };
}

export default function AdminUsersEdit({ user }: PageProps) {
    const { data, setData, post, processing, errors } = useForm({
        name: user.name,
        email: user.email,
        role: user.role,
        password: '',
        password_confirmation: '',
        status: user.status,
        _method: 'PUT',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('admin.users.update', user.id));
    };

    return (
        <AppLayout>
            <div className="py-6">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-6 flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <Link
                                href={route('admin.users.index')}
                                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                            >
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Back to Users
                            </Link>
                            <h1 className="text-2xl font-bold text-gray-900">Edit User</h1>
                        </div>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="bg-white shadow rounded-lg p-6 space-y-6">
                            {/* Name */}
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                                    Name *
                                </label>
                                <input
                                    id="name"
                                    type="text"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                    required
                                />
                                {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                            </div>

                            {/* Email */}
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                    Email *
                                </label>
                                <input
                                    id="email"
                                    type="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                    required
                                />
                                {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                            </div>

                            {/* Password */}
                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                                    Password (leave blank to keep current)
                                </label>
                                <input
                                    id="password"
                                    type="password"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                />
                                {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
                            </div>

                            {/* Confirm Password */}
                            <div>
                                <label htmlFor="password_confirmation" className="block text-sm font-medium text-gray-700 mb-2">
                                    Confirm Password
                                </label>
                                <input
                                    id="password_confirmation"
                                    type="password"
                                    value={data.password_confirmation}
                                    onChange={(e) => setData('password_confirmation', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                />
                                {errors.password_confirmation && (
                                    <p className="mt-1 text-sm text-red-600">{errors.password_confirmation}</p>
                                )}
                            </div>

                            <div className="mb-4">
  <label className="block text-gray-700">Role</label>
  <select
    name="role"
    value={data.role || 'user'}
    onChange={(e) => setData('role', e.target.value)}
    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
  >
    <option value="user">User</option>
    <option value="admin">Admin</option>
  </select>
  {errors.role && <div className="text-red-500 text-sm">{errors.role}</div>}
</div>

                            {/* Status Toggle */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                                <label className="flex items-center cursor-pointer space-x-3">
                                    <span className="text-sm font-medium text-gray-700">
                                        {data.status ? 'Active' : 'Inactive'}
                                    </span>
                                    <div className="relative">
                                        <input
                                            type="checkbox"
                                            checked={data.status}
                                            onChange={(e) => setData('status', e.target.checked)}
                                            className="sr-only peer"
                                        />
                                        <div className="w-11 h-6 bg-gray-300 rounded-full peer peer-checked:bg-green-600 transition-colors"></div>
                                        <div className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-md transform peer-checked:translate-x-5 transition-transform"></div>
                                    </div>
                                </label>
                            </div>
                        </div>

                        {/* Submit */}
                        <div className="flex justify-end">
                            <button
                                type="submit"
                                disabled={processing}
                                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50"
                            >
                                <Save className="h-4 w-4 mr-2" />
                                {processing ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
