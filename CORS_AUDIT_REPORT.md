# CORS / "Failed to fetch" Full Project Audit Report
**Date:** 2026-02-06  
**Project:** Laravel 12 + React (Inertia) - soual-mehairny  
**Auditor:** Antigravity (Senior Laravel + React Engineer)

---

## Executive Summary

### Root Cause Identified: ✅ **CRITICAL ARCHITECTURE MISMATCH**

**Primary Issue:**  
The frontend is making **cross-origin API calls** from `https://soual-mehairny.test` (web app) to `https://so2al.free.nf` (hosting), violating the same-origin policy. While CORS middleware is correctly configured, **the hosting provider's WAF/Anti-Bot layer (openresty) intercepts XHR/fetch requests** before they reach Laravel, returning HTML challenge pages instead of JSON, and stripping CORS headers.

**Why Navigation Works but Fetch Fails:**
- **Browser navigation (direct URL):** The WAF sees a normal browser request and allows it through → Laravel returns JSON
- **Fetch/XHR:** The WAF detects programmatic access (missing cookies, different fingerprint) → Returns HTML JS challenge → No CORS headers → Frontend fails

### Environment Configuration Issue

Your `.env` contains a dangerous mismatch:

```env
APP_URL=https://so2al.free.nf           # Remote production URL
NATIVE_APP=true                          # LOCAL dev is marked as "native"
REMOTE_APP_URL=https://so2al.free.nf    # Points to remote
NATIVE_APP_ALLOWED_ORIGINS=https://soual-mehairny.test  # Local dev
```

This configuration tells your **local dev environment** to:
1. Treat itself as a "native app" wrapper
2. Make ALL API calls to the remote production server `https://so2al.free.nf`
3. Use cross-origin requests from `https://soual-mehairny.test` → `https://so2al.free.nf`

**This is NOT a standard Laravel+Inertia setup.** You're running a hybrid architecture designed for NativePHP mobile apps, but applying it to local web development.

---

## Section A: Frontend Audit

### A1. All API Call Locations

| File | Line | Call Type | Target URL | Risk Level |
|------|------|-----------|------------|------------|
| `resources/js/lib/api-client.ts` | 110 | `fetch()` | `buildUrl(path)` | 🔴 **CRITICAL** |
| `resources/js/pages/Questions/Index.tsx` | 199 | `apiGet()` | `/api/native/questions?...` | 🔴 **CRITICAL** |
| `resources/js/pages/Questions/Show.tsx` | 270 | `apiGet()` | `/api/native/questions/${id}?...` | 🔴 **CRITICAL** |
| `resources/js/pages/Questions/Create.tsx` | 86, 137 | `apiGet()`, `apiPost()` | `/api/native/ask`, topics | 🔴 **CRITICAL** |
| `resources/js/lib/native-auth.ts` | 16, 28, 35 | `apiPost()`, `apiGet()` | `/api/native/auth/*` | 🔴 **CRITICAL** |

**Total API calls found:** 5 files, ~11 distinct call sites

### A2. URL Rewriting Logic Analysis

**File:** `resources/js/lib/api-client.ts` (Lines 34-46)

```typescript
function buildUrl(path: string): string {
    if (path.startsWith('http://') || path.startsWith('https://')) {
        return path;  // Already absolute, use as-is
    }

    const base = isNativeApp() ? getRemoteAppUrl() : '';
    
    if (!base) {
        return path;  // No base = relative URL (same-origin)
    }

    return `${base.replace(/\/$/, '')}/${path.replace(/^\//, '')}`;
}
```

**How `isNativeApp()` Works:**

```typescript
// resources/js/lib/platform.ts
window.__APP_CONFIG__ = {
    native: (bool) config('app.native_app'),         // .env: NATIVE_APP=true
    remoteAppUrl: (string) config('app.remote_app_url'), // .env: REMOTE_APP_URL=https://so2al.free.nf
    locale: 'en'
};

export function isNativeApp(): boolean {
    return Boolean(getAppConfig().native);  // Returns TRUE in your case
}

export function getRemoteAppUrl(): string | null {
    return getAppConfig().remoteAppUrl ?? null;  // Returns 'https://so2al.free.nf'
}
```

**Execution Flow for Your Environment:**

1. Page loads at `https://soual-mehairny.test/en/questions`
2. `window.__APP_CONFIG__.native = true` (set in `app.blade.php` line 38)
3. `window.__APP_CONFIG__.remoteAppUrl = 'https://so2al.free.nf'` (line 39)
4. Component calls `apiGet('/api/native/questions?...')`
5. `buildUrl()` detects `isNativeApp() === true`
6. Returns: `'https://so2al.free.nf/api/native/questions?...'`
7. `fetch()` makes **cross-origin request** from `.test` → `.nf`
8. **WAF blocks it** → Returns HTML → No CORS headers → Fails

### A3. Headers and Fetch Configuration

**File:** `resources/js/lib/api-client.ts` (Lines 96-118)

```typescript
const headers: Record<string, string> = {
    Accept: 'application/json',  // ✅ Correct
    ...(options.headers ?? {}),
};

// ✅ Correct Content-Type for POST/PUT
if (options.body && method !== 'GET' && method !== 'HEAD') {
    headers['Content-Type'] = headers['Content-Type'] ?? 'application/json';
}

const response = await fetch(url, {
    method,
    headers,
    body: options.body && method !== 'GET' && method !== 'HEAD'
        ? JSON.stringify(options.body)
        : undefined,
    signal,
    credentials: 'omit',  // ⚠️ IMPORTANT: No cookies sent
});
```

**Issue:** `credentials: 'omit'` means:
- No session cookies are sent
- No anti-bot cookies (`__test`) are sent
- WAF sees a "suspicious" request without cookies → Triggers challenge

**Response Parsing:**

```typescript
async function parseResponse(response: Response): Promise<unknown> {
    const contentType = response.headers.get('content-type') ?? '';
    
    if (contentType.includes('application/json')) {
        return response.json();  // ✅ Correct
    }
    
    return response.text();  // ⚠️ Falls back to text (will return HTML challenge)
}
```

**Problem:** When the WAF returns HTML (Content-Type: text/html), the code correctly returns it as text, but the **calling code expects JSON** and will crash when trying to access `.data`.

### A4. Risky Patterns

❌ **No centralized error handling for HTML responses**  
- If WAF returns `<html>...set cookie __test...</html>`, the code parses it as text
- Components try to access `.data` property → Runtime error

❌ **No detection of HTML challenge pages**  
- Should check if response body starts with `<` or `<!DOCTYPE`

❌ **No Content-Type validation before parsing**  
- Should explicitly reject responses with `text/html` content-type for API calls

---

## Section B: Backend Audit

### B1. Laravel 12 Middleware Configuration

**File:** `bootstrap/app.php` (Lines 21-34)

```php
->withMiddleware(function (Middleware $middleware) {
    $middleware->encryptCookies(except: ['appearance', 'sidebar_state']);

    $middleware->web(append: [
        SetLocale::class,
        HandleAppearance::class,
        HandleInertiaRequests::class,
        AddLinkHeadersForPreloadedAssets::class,
    ]);

    $middleware->api(prepend: [
        HandleCors::class,        // ✅ Laravel's built-in CORS
        ForceCorsHeaders::class,  // ✅ Your custom CORS enforcer
    ]);

    $middleware->alias([
        'admin' => AdminMiddleware::class,
    ]);
})
```

✅ **CORRECT:** CORS middleware is registered in the correct order for `/api/*` routes.

### B2. CORS Configuration Analysis

**File:** `config/cors.php` (Lines 3-24)

```php
$nativeOrigins = array_values(array_filter(array_map(
    'trim',
    explode(',', env('NATIVE_APP_ALLOWED_ORIGINS', ''))
)));

return [
    'paths' => ['api/*'],  // ✅ Applies to all /api/* routes

    'allowed_methods' => ['*'],  // ✅ All HTTP methods

    'allowed_origins' => $nativeOrigins,  // ⚠️ ONLY parses .env variable

    'allowed_origins_patterns' => [],  // ❌ Empty

    'allowed_headers' => ['*'],  // ✅ All headers allowed

    'exposed_headers' => [],

    'max_age' => 0,  // ⚠️ No preflight caching (forces OPTIONS on every request)

    'supports_credentials' => false,  // ✅ Correct (matches fetch credentials: 'omit')
];
```

**Parsed Value from `.env`:**
```
NATIVE_APP_ALLOWED_ORIGINS=https://soual-mehairny.test
```
→ `$nativeOrigins = ['https://soual-mehairny.test']`

✅ **CORRECT:** Your local `.test` domain is in the allowed origins list.

### B3. Custom ForceCorsHeaders Middleware

**File:** `app/Http/Middleware/ForceCorsHeaders.php`

```php
public function handle(Request $request, Closure $next)
{
    $origin = $request->headers->get('Origin');  // e.g., 'https://soual-mehairny.test'
    $allowedOrigins = config('cors.allowed_origins', []);  // ['https://soual-mehairny.test']
    
    $isAllowed = $this->isOriginAllowed($origin, $allowedOrigins, $allowedPatterns);
    
    // ✅ Handle preflight OPTIONS early
    if ($request->isMethod('OPTIONS')) {
        $response = response()->noContent();
    } else {
        $response = $next($request);
    }
    
    if (!$origin || !$isAllowed) {
        return $response;  // ⚠️ Early return WITHOUT CORS headers
    }
    
    // Set CORS headers only if origin is allowed
    $response->headers->set('Access-Control-Allow-Origin', $origin);
    $response->headers->set('Vary', 'Origin', false);
    $response->headers->set('Access-Control-Allow-Methods', $this->normalizeMethods($allowedMethods));
    $response->headers->set('Access-Control-Allow-Headers', $this->normalizeHeaders($request, $allowedHeaders));
    
    return $response;
}
```

✅ **CORRECT:** This middleware will add CORS headers when the origin matches.

**Testing Logic:**

```php
private function isOriginAllowed(?string $origin, array $allowedOrigins, array $allowedPatterns): bool
{
    if (!$origin) {
        return false;
    }
    
    if (in_array('*', $allowedOrigins, true)) {  // Not in your config
        return true;
    }
    
    if (in_array($origin, $allowedOrigins, true)) {  // ✅ Strict match
        return true;
    }
    
    foreach ($allowedPatterns as $pattern) {  // Empty in your config
        if (@preg_match($pattern, $origin)) {
            return true;
        }
    }
    
    return false;
}
```

**For your request:**
- `$origin = 'https://soual-mehairny.test'`
- `$allowedOrigins = ['https://soual-mehairny.test']`
- `in_array('https://soual-mehairny.test', ['https://soual-mehairny.test'], true)` → **TRUE** ✅

**Conclusion:** Laravel CORS is configured perfectly. The problem is NOT in Laravel.

### B4. Exception Handling for /api/* Routes

**File:** `bootstrap/app.php` (Lines 41-45)

```php
->withExceptions(function (Exceptions $exceptions) {
    $exceptions->shouldRenderJsonWhen(
        fn ($request) => $request->is('api/*') || $request->expectsJson()
    );
})
```

✅ **CORRECT:** All exceptions on `/api/*` routes will return JSON, not HTML.

### B5. API Route Definitions

**File:** `routes/api.php`

```php
Route::prefix('native')->group(function () {
    Route::post('/auth/login', [AuthController::class, 'login']);
    Route::post('/auth/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');
    Route::get('/auth/me', [AuthController::class, 'me'])->middleware('auth:sanctum');
    
    Route::get('/questions', [QuestionController::class, 'index']);
    Route::get('/questions/filters', [QuestionController::class, 'filters']);
    Route::get('/questions/{question}', [QuestionController::class, 'show']);
    Route::post('/ask', [AskController::class, 'store']);
});
```

✅ All routes under `/api/native/*` will:
1. Be prefixed with `/api` automatically (Laravel 12 convention)
2. Have `HandleCors` + `ForceCorsHeaders` applied via `api` middleware group

### B6. API Controller Analysis

**File:** `app/Http/Controllers/Api/Native/QuestionController.php`

```php
public function index(QuestionIndexRequest $request): JsonResponse
{
    // ... business logic ...
    
    return response()->json([
        'data' => QuestionResource::collection($questions)->resolve(),
        'meta' => [...],
        'filters' => [...],
        'bible_books' => BibleBookResource::collection($bibleBooks)->resolve(),
        'topics' => TopicResource::collection($topics)->resolve(),
    ]);  // ✅ Explicitly returns JSON
}
```

✅ **CORRECT:** All API controllers return `JsonResponse` directly.

---

## Section C: Hosting / WAF / Proxy Layer Evidence

### C1. Observable Symptoms

Based on your description:

1. **Server header:** `openresty`  
   → OpenResty is an nginx-based web server used by free/shared hosting providers
   
2. **Response on fetch:**  
   - Status: `200 OK`  
   - Content-Type: `text/html` (not `application/json`)  
   - Body: HTML page that sets `__test` cookie and redirects  
   - **No `Access-Control-Allow-Origin` header**
   
3. **Direct browser navigation works:**  
   → Browser sends cookies, has full user-agent, passes fingerprinting

### C2. Root Cause: WAF/Anti-Bot Challenge

**What's happening:**

```
┌─────────────────────────────────────────────────────┐
│ Browser at https://soual-mehairny.test             │
│                                                     │
│  fetch('https://so2al.free.nf/api/native/questions')│
│  Headers:                                           │
│    Origin: https://soual-mehairny.test             │
│    Accept: application/json                         │
│    (credentials: 'omit' = NO COOKIES)              │
└──────────────────┬──────────────────────────────────┘
                   │
                   ▼
         ┌─────────────────────┐
         │  DNS Resolution     │
         │  so2al.free.nf      │
         │  → Hosting Provider │
         └─────────┬───────────┘
                   │
                   ▼
    ┌──────────────────────────────────┐
    │ FREE HOSTING WAF (OpenResty)     │
    │                                  │
    │ Checks:                          │
    │  ❌ No cookies (__test missing)  │
    │  ❌ Fetch/XHR user-agent         │
    │  ❌ Cross-origin request         │
    │                                  │
    │ Decision: SUSPICIOUS REQUEST     │
    │                                  │
    │ Action: Return JS Challenge      │
    └──────────┬───────────────────────┘
               │
               ▼
    ┌──────────────────────────────────┐
    │ Response:                        │
    │   HTTP/1.1 200 OK                │
    │   Content-Type: text/html        │
    │   Server: openresty              │
    │                                  │
    │   <html>                         │
    │   <script>                       │
    │     document.cookie = "__test=...";│
    │     window.location.reload();    │
    │   </script>                      │
    │   </html>                        │
    │                                  │
    │ ❌ NO ACAO HEADER                │
    └──────────┬───────────────────────┘
               │
               ▼
     ┌─────────────────────────────┐
     │ Laravel NEVER SEES REQUEST  │
     │                             │
     │ HandleCors middleware       │
     │ is NEVER executed           │
     └─────────────────────────────┘
```

**Why navigation works:**

```
Browser URL bar: https://so2al.free.nf/api/native/questions
→ Full page navigation
→ Sends cookies from previous visits
→ Standard browser User-Agent
→ WAF sees normal user → Allows through
→ Laravel returns JSON
→ Browser shows JSON (not rendered as page)
```

### C3. Hosting Provider: Free Hosting Red Flags

**Domain:** `so2al.free.nf`  
**TLD:** `.nf` (Norfolk Island) often used for free subdomains  
**Evidence:** `openresty` server header

**Common free hosting anti-bot protections:**
- Cloudflare "Checking your browser" page
- Custom JS challenges that set cookies
- Rate limiting on IP addresses
- Blocking requests without `Referer` header
- Blocking requests with `Origin` header (CORS requests)

**Why they do this:**
- Prevent API scraping (you're making API calls from external origin = scraping in their view)
- Prevent resource abuse on free tier
- Force users to upgrade to paid plans

---

## Section D: Root Cause Summary

### D1. Is the Problem in Laravel or Hosting?

**Answer:** ❌ **NOT in Laravel.** ✅ **In Hosting + Architecture.**

**Evidence:**

1. ✅ Laravel CORS configuration is correct
2. ✅ Middleware is correctly registered
3. ✅ API routes return JSON
4. ✅ Exception handling forces JSON for `/api/*`
5. ❌ **Request never reaches Laravel** → WAF intercepts it first

### D2. Why This Architecture Exists (NativePHP)

Your app is designed for **NativePHP** (Electron-style desktop/mobile apps):

```
┌────────────────────────────────┐
│  NativePHP Desktop App         │
│  (Electron/Tauri wrapper)      │
│                                │
│  ┌──────────────────────────┐ │
│  │ Local SQLite DB          │ │  For offline data
│  │ (No remote DB queries)   │ │
│  └──────────────────────────┘ │
│                                │
│  ┌──────────────────────────┐ │
│  │ React Frontend           │ │
│  │ (Same as web version)    │ │
│  └──────────────────────────┘ │
│         │                      │
│         │ API Calls            │
│         ▼                      │
│  [apiClient with REMOTE_APP_URL]│
│         │                      │
└─────────┼──────────────────────┘
          │
          │ HTTPS
          ▼
   ┌─────────────────────┐
   │ Production Laravel  │
   │ https://so2al.free.nf│
   │                     │
   │ MySQL/PostgreSQL    │
   └─────────────────────┘
```

**This works for native apps because:**
- No same-origin policy in Electron/Tauri
- Can set `credentials: 'include'` safely
- Can spoof User-Agent
- Can pre-authenticate and pass cookies

**But fails for web development (`https://soual-mehairny.test`):**
- Same-origin policy enforced
- Cannot send cookies cross-origin with `credentials: 'omit'`
- WAF blocks cross-origin XHR/fetch

---

## Section E: Fix Plan (Prioritized)

### E1. **PREFERRED FIX: Use Same-Origin API Calls (Local Dev)**

**For Local Development:**

Stop treating local dev as a "native app" and run a proper Laravel dev server.

**Changes to `.env.local` (or `.env` for local work):**

```env
APP_ENV=local
APP_URL=https://soual-mehairny.test

# ❌ REMOVE these for local dev:
# NATIVE_APP=true
# REMOTE_APP_URL=https://so2al.free.nf

# ✅ Set to false or comment out:
NATIVE_APP=false
# REMOTE_APP_URL=

# Keep this ONLY for native mobile builds:
# NATIVE_APP_ALLOWED_ORIGINS=capacitor://localhost,tauri://localhost
```

**Result:**
- `window.__APP_CONFIG__.native = false`
- `buildUrl('/api/native/questions')` returns `/api/native/questions` (relative)
- `fetch('/api/native/questions')` = same-origin call to `https://soual-mehairny.test/api/native/questions`
- No CORS needed
- No WAF interference

**Deployment:**

Create separate `.env` files:

```
.env.local          → NATIVE_APP=false, APP_URL=https://soual-mehairny.test
.env.production     → NATIVE_APP=false, APP_URL=https://so2al.free.nf
.env.native         → NATIVE_APP=true, REMOTE_APP_URL=https://so2al.free.nf
```

---

### E2. **FALLBACK FIX: Backend-for-Frontend (BFF) Proxy Route**

If you MUST keep cross-origin for some reason, create a proxy inside Laravel.

**Add to `routes/web.php`:**

```php
Route::get('/bff/api/{path}', function (Request $request, string $path) {
    $remoteUrl = config('app.remote_app_url');
    if (!$remoteUrl) {
        abort(500, 'REMOTE_APP_URL not configured');
    }
    
    $url = rtrim($remoteUrl, '/') . '/api/' . ltrim($path, '/');
    $query = $request->getQueryString();
    if ($query) {
        $url .= '?' . $query;
    }
    
    $response = Http::withHeaders([
        'Accept' => 'application/json',
        'User-Agent' => $request->header('User-Agent'),
    ])->get($url);
    
    return response($response->body(), $response->status())
        ->header('Content-Type', 'application/json');
})->where('path', '.*');
```

**Frontend change:**

```typescript
// resources/js/lib/api-client.ts
function buildUrl(path: string): string {
    if (path.startsWith('http://') || path.startsWith('https://')) {
        return path;
    }

    // If native app, proxy through local BFF instead of direct remote call
    if (isNativeApp() && getRemoteAppUrl()) {
        const apiPath = path.replace(/^\/api\//, '');
        return `/bff/api/${apiPath}`;
    }

    return path;
}
```

**Result:**
- Frontend calls `/bff/api/native/questions` (same-origin)
- Laravel proxies to `https://so2al.free.nf/api/native/questions`
- Laravel has cookies, proper User-Agent → Bypasses WAF
- Returns JSON to frontend

---

### E3. **HARDENING: Detect HTML Responses and Force JSON Validation**

Even with fixes, add defensive checks.

---

## Section F: Code Patches

### F1. Central API Client with HTML Detection

**File:** `resources/js/lib/api-client.ts`

See full patch in next artifact.

### F2. Dev Diagnostics Endpoint

Add to `routes/api.php`:

```php
Route::get('/__diagnostics', function () {
    return response()->json([
        'timestamp' => now()->toIso8601String(),
        'app_url' => config('app.url'),
        'native_app' => config('app.native_app'),
        'remote_app_url' => config('app.remote_app_url'),
        'cors_allowed_origins' => config('cors.allowed_origins'),
        'request_origin' => request()->header('Origin'),
        'request_referer' => request()->header('Referer'),
        'request_user_agent' => request()->header('User-Agent'),
        'cors_will_allow' => in_array(
            request()->header('Origin'),
            config('cors.allowed_origins', []),
            true
        ),
    ]);
})->middleware(['api']);
```

Test in browser console:

```javascript
fetch('https://soual-mehairny.test/api/__diagnostics')
  .then(r => r.json())
  .then(console.log);
```

---

## Conclusion

**The CORS configuration in Laravel is correct.**  
**The root cause is:**

1. **Architecture mismatch:** Local dev is configured as "native app" making cross-origin calls
2. **Hosting WAF:** Free hosting blocks cross-origin XHR/fetch before Laravel sees them

**Fix priority:**

1. ✅ **Use `.env` with `NATIVE_APP=false` for local dev** (5 min fix, zero code changes)
2. ✅ Apply hardening patches to detect HTML responses (10 min)
3. ⚠️ Only use BFF proxy if you have a specific reason to keep cross-origin in dev

**Long-term:**
- Use `.env.local`, `.env.production`, `.env.native` for different build targets
- Deploy native mobile builds with Capacitor/Tauri that have `NATIVE_APP=true`
- Keep web deployments with `NATIVE_APP=false`

---

**End of Report**
