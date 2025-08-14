import { Search, Filter, X } from 'lucide-react';
import { useState } from 'react';
import { isArabic } from '@/lib/locale';

interface SearchFilter {
    id: string;
    label: string;
    value: string;
    options: { value: string; label: string }[];
}

interface EnhancedSearchProps {
    searchQuery: string;
    onSearchChange: (query: string) => void;
    onSearch: (query: string, filters: Record<string, string>) => void;
    filters?: SearchFilter[];
    placeholder?: string;
    className?: string;
    showFilters?: boolean;
    onToggleFilters?: () => void;
}

export default function EnhancedSearch({
    searchQuery,
    onSearchChange,
    onSearch,
    filters = [],
    placeholder = 'Search...',
    className = '',
    showFilters = false,
    onToggleFilters,
}: EnhancedSearchProps) {
    const [activeFilters, setActiveFilters] = useState<Record<string, string>>({});
    const isArabicLocale = isArabic();

    const handleFilterChange = (filterId: string, value: string) => {
        const newFilters = { ...activeFilters };
        if (value) {
            newFilters[filterId] = value;
        } else {
            delete newFilters[filterId];
        }
        setActiveFilters(newFilters);
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        onSearch(searchQuery, activeFilters);
    };

    const clearAllFilters = () => {
        setActiveFilters({});
        onSearch(searchQuery, {});
    };

    const hasActiveFilters = Object.keys(activeFilters).length > 0;

    return (
        <div className={`space-y-4 ${className} ${isArabicLocale ? 'rtl' : 'ltr'}`}>
            {/* Search Bar */}
            <form onSubmit={handleSearch} className="flex gap-3">
                <div className="flex-1 relative">
                    <Search className={`absolute top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 ${
                        isArabicLocale ? 'right-3' : 'left-3'
                    }`} />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => onSearchChange(e.target.value)}
                        placeholder={isArabicLocale ? 'ابحث...' : placeholder}
                        className={`w-full py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black ${
                            isArabicLocale ? 'pr-10 pl-4' : 'pl-10 pr-4'
                        }`}
                    />
                </div>
                
                <button
                    type="submit"
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                    {isArabicLocale ? 'بحث' : 'Search'}
                </button>

                {filters.length > 0 && (
                    <button
                        type="button"
                        onClick={onToggleFilters}
                        className={`px-4 py-3 border rounded-lg font-medium transition-colors ${
                            showFilters
                                ? 'border-blue-500 text-blue-600 bg-blue-50'
                                : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                        }`}
                    >
                        <Filter className="h-5 w-5" />
                    </button>
                )}
            </form>

            {/* Active Filters Display */}
            {hasActiveFilters && (
                <div className={`flex items-center gap-2 flex-wrap ${isArabicLocale ? 'justify-end' : 'justify-start'}`}>
                    <span className="text-sm text-gray-600">
                        {isArabicLocale ? 'الفلاتر النشطة:' : 'Active filters:'}
                    </span>
                    {Object.entries(activeFilters).map(([filterId, value]) => {
                        const filter = filters.find(f => f.id === filterId);
                        const option = filter?.options.find(o => o.value === value);
                        return (
                            <span
                                key={filterId}
                                className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                            >
                                {filter?.label}: {option?.label || value}
                                <button
                                    onClick={() => handleFilterChange(filterId, '')}
                                    className="text-blue-600 hover:text-blue-800"
                                >
                                    <X className="h-3 w-3" />
                                </button>
                            </span>
                        );
                    })}
                    <button
                        onClick={clearAllFilters}
                        className="text-sm text-gray-500 hover:text-gray-700 underline"
                    >
                        {isArabicLocale ? 'مسح الكل' : 'Clear all'}
                    </button>
                </div>
            )}

            {/* Filters Panel */}
            {showFilters && filters.length > 0 && (
                <div className="bg-gray-50 rounded-lg p-4 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filters.map((filter) => (
                            <div key={filter.id} className={isArabicLocale ? 'text-right' : 'text-left'}>
                                <label className={`block text-sm font-medium text-gray-700 mb-2 ${
                                    isArabicLocale ? 'text-right' : 'text-left'
                                }`}>
                                    {filter.label}
                                </label>
                                <select
                                    value={activeFilters[filter.id] || ''}
                                    onChange={(e) => handleFilterChange(filter.id, e.target.value)}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                                >
                                    <option value="">
                                        {isArabicLocale ? `جميع ${filter.label}` : `All ${filter.label}`}
                                    </option>
                                    {filter.options.map((option) => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        ))}
                    </div>
                    
                    <div className={`flex gap-3 ${isArabicLocale ? 'justify-start' : 'justify-end'}`}>
                        <button
                            onClick={clearAllFilters}
                            className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                        >
                            {isArabicLocale ? 'مسح الكل' : 'Clear All'}
                        </button>
                        <button
                            onClick={() => onSearch(searchQuery, activeFilters)}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            {isArabicLocale ? 'تطبيق الفلاتر' : 'Apply Filters'}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

