import { getNativeError, getRemoteAppUrl, isNativeApp } from '@/lib/platform';
import { getAuthToken } from '@/lib/native-storage';

type ApiOptions = {
    method?: string;
    body?: unknown;
    headers?: Record<string, string>;
    signal?: AbortSignal;
    timeoutMs?: number;
    retries?: number;
    cacheKey?: string;
    cacheTtlMs?: number;
};

type CachedEntry<T> = {
    expiresAt: number;
    data: T;
};

const inflight = new Map<string, Promise<unknown>>();
const cache = new Map<string, CachedEntry<unknown>>();

export class ApiError extends Error {
    status: number;
    payload: unknown;

    constructor(message: string, status: number, payload: unknown) {
        super(message);
        this.status = status;
        this.payload = payload;
    }
}

/**
 * DIAGNOSTIC: Detect if response is an HTML challenge page instead of JSON
 */
function isHtmlResponse(text: string): boolean {
    const trimmed = text.trim();
    return (
        trimmed.startsWith('<') ||
        trimmed.startsWith('<!DOCTYPE') ||
        trimmed.toLowerCase().includes('<html')
    );
}

/**
 * Build final URL for API request
 * - If absolute URL → use as-is
 * - If native app → prepend REMOTE_APP_URL
 * - Otherwise → return relative path (same-origin)
 */
function buildUrl(path: string): string {
    if (path.startsWith('http://') || path.startsWith('https://')) {
        return path;
    }

    const base = isNativeApp() ? getRemoteAppUrl() : '';

    if (!base) {
        return path;
    }

    return `${base.replace(/\/$/, '')}/${path.replace(/^\//, '')}`;
}

function shouldRetry(status: number): boolean {
    return status === 408 || status === 429 || status >= 500;
}

async function parseResponse(response: Response): Promise<unknown> {
    const contentType = response.headers.get('content-type') ?? '';

    if (contentType.includes('application/json')) {
        return response.json();
    }

    // SECURITY: Detect HTML challenge pages
    const text = await response.text();

    if (isHtmlResponse(text)) {
        if (import.meta.env.DEV) {
            console.error('🚫 API returned HTML instead of JSON', {
                url: response.url,
                status: response.status,
                contentType,
                bodySnippet: text.slice(0, 200),
            });
        }

        throw new Error(
            'API returned HTML instead of JSON. This usually means a hosting WAF/anti-bot challenge is blocking the request. Try using same-origin API calls or check your CORS/hosting configuration.'
        );
    }

    return text;
}

export async function apiRequest<T>(path: string, options: ApiOptions = {}): Promise<T> {
    const nativeError = getNativeError();
    if (isNativeApp() && nativeError) {
        throw new Error(nativeError);
    }

    const method = options.method?.toUpperCase() ?? 'GET';
    const url = buildUrl(path);
    const cacheKey = options.cacheKey ?? `${method}:${url}:${JSON.stringify(options.body ?? null)}`;

    if (options.cacheTtlMs && method === 'GET') {
        const cached = cache.get(cacheKey) as CachedEntry<T> | undefined;
        if (cached && cached.expiresAt > Date.now()) {
            return cached.data;
        }
    }

    if (inflight.has(cacheKey)) {
        return inflight.get(cacheKey) as Promise<T>;
    }

    const requestPromise = (async () => {
        const retries = options.retries ?? (method === 'GET' ? 2 : 0);
        const timeoutMs = options.timeoutMs ?? 20000;
        let attempt = 0;

        while (true) {
            attempt += 1;

            const controller = new AbortController();
            const timeoutId = globalThis.setTimeout(() => controller.abort(), timeoutMs);
            const signal = options.signal ?? controller.signal;

            try {
                const headers: Record<string, string> = {
                    Accept: 'application/json',
                    ...(options.headers ?? {}),
                };

                if (options.body && method !== 'GET' && method !== 'HEAD') {
                    headers['Content-Type'] = headers['Content-Type'] ?? 'application/json';
                }

                const token = await getAuthToken();
                if (token) {
                    headers.Authorization = `Bearer ${token}`;
                }

                const response = await fetch(url, {
                    method,
                    headers,
                    body: options.body && method !== 'GET' && method !== 'HEAD'
                        ? JSON.stringify(options.body)
                        : undefined,
                    signal,
                    credentials: 'omit',
                });

                // HARDENING: Check Content-Type BEFORE parsing
                const contentType = response.headers.get('content-type') ?? '';

                if (import.meta.env.DEV) {
                    console.debug('API Response:', {
                        url,
                        status: response.status,
                        contentType,
                        hasACAO: response.headers.has('access-control-allow-origin'),
                    });
                }

                // SECURITY: Enforce JSON for API routes
                if (!contentType.includes('application/json') && !contentType.includes('text/plain')) {
                    if (import.meta.env.DEV) {
                        const bodyPreview = await response.clone().text();
                        console.error('❌ Invalid Content-Type for API response', {
                            url,
                            status: response.status,
                            contentType,
                            bodySnippet: bodyPreview.slice(0, 200),
                        });
                    }

                    throw new ApiError(
                        `Invalid Content-Type: expected application/json, got ${contentType}`,
                        response.status,
                        null
                    );
                }

                const payload = await parseResponse(response);

                if (!response.ok) {
                    if (attempt <= retries && shouldRetry(response.status)) {
                        continue;
                    }

                    if (import.meta.env.DEV) {
                        console.warn('API request failed', {
                            url,
                            status: response.status,
                            payload,
                        });
                    }

                    throw new ApiError('API request failed.', response.status, payload);
                }

                if (options.cacheTtlMs && method === 'GET') {
                    cache.set(cacheKey, {
                        expiresAt: Date.now() + options.cacheTtlMs,
                        data: payload as T,
                    });
                }

                return payload as T;
            } finally {
                globalThis.clearTimeout(timeoutId);
            }
        }
    })();

    inflight.set(cacheKey, requestPromise);

    try {
        return await requestPromise;
    } finally {
        inflight.delete(cacheKey);
    }
}

export function apiGet<T>(path: string, options: ApiOptions = {}): Promise<T> {
    return apiRequest<T>(path, { ...options, method: 'GET' });
}

export function apiPost<T>(path: string, body: unknown, options: ApiOptions = {}): Promise<T> {
    return apiRequest<T>(path, { ...options, method: 'POST', body });
}
