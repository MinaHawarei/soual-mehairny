# All API Call Locations - Risk Assessment

**Generated:** 2026-02-06  
**Purpose:** Comprehensive list of all frontend API calls for security and architecture review

---

## Summary Statistics

- **Total Files with API Calls:** 5
- **Total API Call Sites:** ~11
- **Risk Level Distribution:**
  - 🔴 Critical: 11 (all cross-origin when NATIVE_APP=true)
  - 🟡 Medium: 0
  - 🟢 Low: 0

---

## Pattern 1: Central API Client (✅ GOOD)

All API calls funnel through a single centralized client in `resources/js/lib/api-client.ts`.

**Functions:**
- `apiRequest<T>(path, options)` - Core request handler
- `apiGet<T>(path, options)` - GET wrapper
- `apiPost<T>(path, body, options)` - POST wrapper

**Key Features:**
- ✅ Retry logic with exponential backoff
- ✅ Request deduplication (inflight map)
- ✅ Response caching with TTL
- ✅ Timeout handling (20s default)
- ✅ AbortController for cancellation
- ⚠️ Credentials: 'omit' (no cookies sent)

**Issue:**
- When `NATIVE_APP=true`, all paths are converted to absolute URLs pointing to REMOTE_APP_URL
- This triggers CORS and WAF challenges

---

## Detailed Call Sites

### File 1: `resources/js/pages/Questions/Index.tsx`

**Purpose:** Browse questions with filters and pagination

**API Calls:**

| Line | Function | Endpoint | Method | Parameters | Risk |
|------|----------|----------|--------|------------|------|
| 199 | `apiGet()` | `/api/native/questions` | GET | `locale`, `per_page`, `search`, `bible_book_id`, `topic_id`, `page` | 🔴 |

**Call Context:**

```typescript
const response = await apiGet<QuestionsApiResponse>(
    `/api/native/questions?${apiParams.toString()}`,
    {
        signal: controller.signal,
        cacheKey: `questions:${apiParams.toString()}`,
        cacheTtlMs: 15000,  // 15 second cache
        retries: 2,
    },
);
```

**Expected Response:**

```typescript
{
  data: Question[],
  meta: {
    current_page: number,
    last_page: number,
    per_page: number,
    total: number
  },
  filters: { search?, bible_book_id?, topic_id? },
  bible_books: BibleBook[],
  topics: Topic[]
}
```

**Error Handling:**
- ✅ AbortError detection
- ✅ Sets loading/error states
- ✅ User-friendly error messages (AR/EN)

**Risk Assessment:**
- 🔴 **CRITICAL** when `NATIVE_APP=true` (cross-origin)
- 🟢 **LOW** when `NATIVE_APP=false` (same-origin)

---

### File 2: `resources/js/pages/Questions/Show.tsx`

**Purpose:** Display single question with full answer

**API Calls:**

| Line | Function | Endpoint | Method | Parameters | Risk |
|------|----------|----------|--------|------------|------|
| 270 | `apiGet()` | `/api/native/questions/{id}` | GET | `locale` | 🔴 |

**Call Context:**

```typescript
const response = await apiGet<{ data: Question }>(
    `/api/native/questions/${resolvedId}?locale=${locale}`,
    { signal: controller.signal, retries: 2 },
);
```

**Expected Response:**

```typescript
{
  data: {
    id: number,
    question_ar: string,
    question_en: string,
    answer_ar: string | null,
    answer_en: string | null,
    youtube_video_id: string | null,
    bible_book?: { id, name_ar, name_en },
    topic?: { id, name_ar, name_en },
    lecturer_name_ar?: string,
    lecturer_role_ar?: string,
    // ... etc
  }
}
```

**Error Handling:**
- ✅ AbortError detection
- ✅ Cancellation on unmount
- ✅ Fallback UI for loading/error states

**Risk Assessment:**
- 🔴 **CRITICAL** when `NATIVE_APP=true` (cross-origin)
- 🟢 **LOW** when `NATIVE_APP=false` (same-origin)

---

### File 3: `resources/js/pages/Questions/Create.tsx`

**Purpose:** Submit new question (Ask a question form)

**API Calls:**

| Line | Function | Endpoint | Method | Parameters | Risk |
|------|----------|----------|--------|------------|------|
| 86 | `apiGet()` | `/api/native/questions/filters` | GET | None | 🔴 |
| 137 | `apiPost()` | `/api/native/ask` | POST | Question form data | 🔴 |

**Call 1: Load Filters (Topics)**

```typescript
const response = await apiGet<{ topics: Topic[] }>(
    '/api/native/questions/filters',
    { retries: 2 }
);
```

**Call 2: Submit Question**

```typescript
const response = await apiPost<{ message: string }>('/api/native/ask', {
    question_ar: values.question_ar,
    question_en: values.question_en,
    topic_id: values.topic_id,
    submitter_name_ar: values.submitter_name_ar,
    submitter_name_en: values.submitter_name_en,
    submitter_email: values.submitter_email,
});
```

**Error Handling:**
- ✅ ApiError type checking
- ✅ Form validation errors displayed
- ✅ Success notification

**Risk Assessment:**
- 🔴 **CRITICAL** when `NATIVE_APP=true` (cross-origin)
- 🟢 **LOW** when `NATIVE_APP=false` (same-origin)

---

### File 4: `resources/js/lib/native-auth.ts`

**Purpose:** Authentication for native mobile apps (Sanctum token-based)

**API Calls:**

| Line | Function | Endpoint | Method | Parameters | Risk |
|------|----------|----------|--------|------------|------|
| 16 | `apiPost()` | `/api/native/auth/login` | POST | `email`, `password`, `device_name` | 🔴 |
| 28 | `apiPost()` | `/api/native/auth/logout` | POST | None (requires auth) | 🔴 |
| 35 | `apiGet()` | `/api/native/auth/me` | GET | None (requires auth) | 🔴 |

**Call 1: Login**

```typescript
const response = await apiPost<LoginResponse>('/api/native/auth/login', {
    email,
    password,
    device_name: 'browser',
});

// Response: { token: string, user: User }
```

**Call 2: Logout**

```typescript
await apiPost('/api/native/auth/logout', {});
```

**Call 3: Get Current User**

```typescript
const response = await apiGet<{ user: LoginResponse['user'] }>(
    '/api/native/auth/me'
);
```

**Security Notes:**
- ✅ Uses Sanctum bearer token (stored in localStorage encrypted)
- ✅ Token included in Authorization header via `getAuthToken()`
- ⚠️ Credentials: 'omit' means cookies NOT sent (intentional for token auth)

**Risk Assessment:**
- 🔴 **CRITICAL** when `NATIVE_APP=true` (cross-origin)
- 🟢 **LOW** when `NATIVE_APP=false` (same-origin)
- 🟡 **MEDIUM** security risk if token storage is compromised

---

### File 5: `resources/js/lib/api-client.ts` (Core Implementation)

**Purpose:** Central API request handler

**Key Functions:**

#### `buildUrl(path: string): string`

**Logic:**

```typescript
function buildUrl(path: string): string {
    // 1. If already absolute URL → return as-is
    if (path.startsWith('http://') || path.startsWith('https://')) {
        return path;
    }

    // 2. Check if native app mode
    const base = isNativeApp() ? getRemoteAppUrl() : '';
    
    // 3. If no base URL → return relative path
    if (!base) {
        return path;
    }

    // 4. Combine base + path
    return `${base.replace(/\/$/, '')}/${path.replace(/^\//, '')}`;
}
```

**Examples:**

| NATIVE_APP | REMOTE_APP_URL | Input | Output |
|------------|----------------|-------|--------|
| `false` | (empty) | `/api/native/questions` | `/api/native/questions` |
| `true` | `https://so2al.free.nf` | `/api/native/questions` | `https://so2al.free.nf/api/native/questions` |
| `true` | `https://so2al.free.nf` | `https://example.com/api` | `https://example.com/api` |

**Risk:**
- 🔴 When `NATIVE_APP=true`, ALL relative paths become cross-origin
- 🟢 When `NATIVE_APP=false`, all paths stay relative (same-origin)

#### `parseResponse(response: Response): Promise<unknown>`

**Logic:**

```typescript
async function parseResponse(response: Response): Promise<unknown> {
    const contentType = response.headers.get('content-type') ?? '';

    if (contentType.includes('application/json')) {
        return response.json();  // ✅ Parse JSON
    }

    return response.text();  // ⚠️ Returns raw text (could be HTML)
}
```

**Issue:**
- ⚠️ Does NOT validate if text response is HTML challenge page
- ⚠️ Calling code expects JSON structure, will crash if HTML returned

**Fixed in Hardened Version:**
- ✅ Detects HTML responses: `isHtmlResponse(text)`
- ✅ Throws clear error before returning to caller

#### `apiRequest<T>(path, options): Promise<T>`

**Configuration:**

```typescript
const response = await fetch(url, {
    method,
    headers: {
        Accept: 'application/json',  // ✅ Tells server we want JSON
        'Content-Type': 'application/json',  // ✅ For POST/PUT
        Authorization: `Bearer ${token}`,  // ✅ If authenticated
    },
    body: JSON.stringify(options.body),
    signal: controller.signal,  // ✅ For cancellation
    credentials: 'omit',  // ⚠️ NO cookies sent
});
```

**Retry Logic:**

```typescript
const retries = options.retries ?? (method === 'GET' ? 2 : 0);

// Retries on:
// - 408 Request Timeout
// - 429 Too Many Requests
// - 500+ Server Errors

// Does NOT retry on:
// - 400-407, 410-428, 430-499 (client errors)
// - 200-299 (success)
```

**Request Deduplication:**

```typescript
const cacheKey = `${method}:${url}:${JSON.stringify(body)}`;

if (inflight.has(cacheKey)) {
    return inflight.get(cacheKey);  // Return existing promise
}

// Otherwise create new request
```

**Prevents:**
- Multiple identical requests firing simultaneously
- Race conditions
- Server overload

**Caching:**

```typescript
if (options.cacheTtlMs && method === 'GET') {
    cache.set(cacheKey, {
        expiresAt: Date.now() + options.cacheTtlMs,
        data: payload,
    });
}
```

**Used in:**
- Questions Index: 15s cache (`cacheTtlMs: 15000`)
- Reduces API calls on rapid filter changes

---

## Inertia.js Router Calls (NOT API Calls)

These are **server-side rendered** page navigations, NOT API calls. They do NOT have CORS issues.

**Pattern:**

```typescript
import { router } from '@inertiajs/react';

router.visit('/en/questions', { method: 'get' });
router.post(route('login'), { email, password });
```

**Count:** 50+ instances across pages

**Risk:** 🟢 **NONE** - Server-side routing, no CORS

---

## Recommendations

### ✅ KEEP (Good Patterns)

1. **Centralized API client** - All calls go through `api-client.ts`
2. **Retry logic** - Handles transient failures
3. **Request deduplication** - Prevents duplicate requests
4. **AbortController** - Proper cancellation on unmount
5. **TypeScript generics** - Type-safe responses

### 🔧 FIX (Critical Issues)

1. **NATIVE_APP flag** - Set to `false` for web development
2. **HTML detection** - Apply hardened API client patch
3. **Content-Type validation** - Reject non-JSON responses
4. **Credentials policy** - Consider `credentials: 'include'` for session-based auth (alternative to Sanctum)

### 🟡 CONSIDER (Improvements)

1. **Error boundaries** - Catch API errors at component level
2. **Loading states** - Unified loading component
3. **Offline detection** - Show offline message when network is down
4. **Rate limiting** - Client-side rate limiting to prevent abuse
5. **Response validation** - Use Zod or similar to validate API response shapes

---

## Testing Matrix

| Scenario | NATIVE_APP | REMOTE_APP_URL | Expected Behavior | Test Status |
|----------|------------|----------------|-------------------|-------------|
| Local dev (web) | `false` | (empty) | Same-origin calls to `.test` | ✅ PASS (after fix) |
| Production (web) | `false` | (empty) | Same-origin calls to `.nf` | 🟡 TBD |
| Native mobile | `true` | `https://so2al.free.nf` | Cross-origin calls with auth token | 🟡 TBD |
| Offline (native) | `true` | (empty) | Error message shown | ✅ PASS |

---

## Related Files

**Configuration:**
- `.env` - Environment variables
- `config/cors.php` - Laravel CORS settings
- `bootstrap/app.php` - Middleware registration

**Frontend:**
- `resources/js/lib/api-client.ts` - API client implementation
- `resources/js/lib/platform.ts` - Environment detection
- `resources/js/lib/native-auth.ts` - Authentication helpers
- `resources/js/lib/native-storage.ts` - Token storage

**Backend:**
- `routes/api.php` - API route definitions
- `app/Http/Middleware/ForceCorsHeaders.php` - Custom CORS middleware
- `app/Http/Controllers/Api/Native/*` - API controllers

---

## Glossary

- **Same-Origin:** Request from `https://soual-mehairny.test` to `https://soual-mehairny.test/api/*`
- **Cross-Origin:** Request from `https://soual-mehairny.test` to `https://so2al.free.nf/api/*`
- **CORS:** Cross-Origin Resource Sharing (browser security policy)
- **WAF:** Web Application Firewall (hosting anti-bot protection)
- **Sanctum:** Laravel's token-based API authentication
- **Inertia:** Server-side routing for React/Vue SPAs

---

**End of Report**
