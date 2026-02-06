<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class ForceCorsHeaders
{
    public function handle(Request $request, Closure $next)
    {
        $origin = $request->headers->get('Origin');
        $allowedOrigins = config('cors.allowed_origins', []);
        $allowedPatterns = config('cors.allowed_origins_patterns', []);
        $allowedMethods = config('cors.allowed_methods', []);
        $allowedHeaders = config('cors.allowed_headers', []);
        $exposedHeaders = config('cors.exposed_headers', []);
        $maxAge = (int) config('cors.max_age', 0);
        $supportsCredentials = (bool) config('cors.supports_credentials', false);

        $isAllowed = $this->isOriginAllowed($origin, $allowedOrigins, $allowedPatterns);

        // Handle preflight early to avoid hitting app logic
        if ($request->isMethod('OPTIONS')) {
            $response = response()->noContent();
        } else {
            $response = $next($request);
        }

        if (!$origin || !$isAllowed) {
            return $response;
        }

        $response->headers->set('Access-Control-Allow-Origin', $origin);
        $response->headers->set('Vary', 'Origin', false);
        $response->headers->set(
            'Access-Control-Allow-Methods',
            $this->normalizeMethods($allowedMethods)
        );
        $response->headers->set(
            'Access-Control-Allow-Headers',
            $this->normalizeHeaders($request, $allowedHeaders)
        );

        if (!empty($exposedHeaders)) {
            $response->headers->set('Access-Control-Expose-Headers', implode(', ', $exposedHeaders));
        }

        if ($maxAge > 0) {
            $response->headers->set('Access-Control-Max-Age', (string) $maxAge);
        }

        if ($supportsCredentials) {
            $response->headers->set('Access-Control-Allow-Credentials', 'true');
        }

        return $response;
    }

    private function isOriginAllowed(?string $origin, array $allowedOrigins, array $allowedPatterns): bool
    {
        if (!$origin) {
            return false;
        }

        if (in_array('*', $allowedOrigins, true)) {
            return true;
        }

        if (in_array($origin, $allowedOrigins, true)) {
            return true;
        }

        foreach ($allowedPatterns as $pattern) {
            if (@preg_match($pattern, $origin)) {
                return true;
            }
        }

        return false;
    }

    private function normalizeMethods(array $allowedMethods): string
    {
        if (in_array('*', $allowedMethods, true) || empty($allowedMethods)) {
            return 'GET, POST, PUT, PATCH, DELETE, OPTIONS';
        }

        $upper = array_map(static fn (string $method) => strtoupper($method), $allowedMethods);

        return implode(', ', $upper);
    }

    private function normalizeHeaders(Request $request, array $allowedHeaders): string
    {
        if (in_array('*', $allowedHeaders, true)) {
            return $request->headers->get(
                'Access-Control-Request-Headers',
                'Content-Type, Authorization, X-Requested-With, Accept, Origin'
            );
        }

        if (empty($allowedHeaders)) {
            return 'Content-Type, Authorization, X-Requested-With, Accept, Origin';
        }

        return implode(', ', $allowedHeaders);
    }
}
