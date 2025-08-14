<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class SetLocale
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Skip locale processing for admin routes
        if ($request->is('admin*')) {
            // For admin routes, we still need to set a locale for the application
            // but we don't process the URL segments
            app()->setLocale('ar'); // Default to Arabic for admin panel
            return $next($request);
        }

        // Check if locale is set in URL segment for public routes
        $locale = $request->segment(1);

        // Valid locales
        $validLocales = ['ar', 'en'];

        if (in_array($locale, $validLocales)) {
            app()->setLocale($locale);
        } else {
            // Default to Arabic if no valid locale in URL
            app()->setLocale('ar');
        }
        
        return $next($request);
    }
}
