/**
 * Locale utility functions for managing locale-based routing across the application
 */

/**
 * Get the current locale prefix based on the current URL path
 * @returns string - The locale prefix ('/ar' or '/en')
 */
export function getLocalePrefix(): string {
    if (typeof window === 'undefined') return '/en'; // SSR fallback
    
    const pathname = window.location.pathname;
    return pathname.includes('/ar') ? '/ar' : '/en';
}

/**
 * Get the current locale code based on the current URL path
 * @returns string - The locale code ('ar' or 'en')
 */
export function getCurrentLocale(): string {
    if (typeof window === 'undefined') return 'en'; // SSR fallback
    
    const pathname = window.location.pathname;
    return pathname.includes('/ar') ? 'ar' : 'en';
}

/**
 * Check if the current locale is Arabic
 * @returns boolean - True if current locale is Arabic
 */
export function isArabic(): boolean {
    return getCurrentLocale() === 'ar';
}

/**
 * Build a localized URL path with the current locale prefix
 * @param path - The path without locale prefix (e.g., 'questions', 'dashboard')
 * @returns string - The full localized path (e.g., '/ar/questions', '/en/dashboard')
 */
export function buildLocalizedPath(path: string): string {
    const localePrefix = getLocalePrefix();
    const cleanPath = path.startsWith('/') ? path.slice(1) : path;
    return `${localePrefix}/${cleanPath}`;
}

/**
 * Build a localized URL path with query parameters
 * @param path - The path without locale prefix
 * @param params - Query parameters object
 * @returns string - The full localized path with query parameters
 */
export function buildLocalizedPathWithParams(path: string, params: Record<string, string>): string {
    const localizedPath = buildLocalizedPath(path);
    const searchParams = new URLSearchParams(params);
    const queryString = searchParams.toString();
    
    return queryString ? `${localizedPath}?${queryString}` : localizedPath;
}

