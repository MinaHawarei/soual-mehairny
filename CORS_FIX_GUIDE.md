# CORS Fix Implementation Guide

## 🎯 Quick Fix (5 Minutes)

### For Local Development

**Step 1:** Edit your `.env` file:

```bash
# Change this line:
NATIVE_APP=true

# To this:
NATIVE_APP=false

# And comment out or remove:
# REMOTE_APP_URL=https://so2al.free.nf
```

**Step 2:** Clear config cache:

```bash
php artisan config:clear
```

**Step 3:** Restart your dev server:

```bash
# If using Laravel Herd/Valet:
# Just refresh the page

# If using php artisan serve:
# Stop the server (Ctrl+C) and restart:
php artisan serve
```

**Step 4:** Test in browser console:

```javascript
// Should now return JSON without CORS errors:
fetch('/api/native/questions?locale=en&per_page=5')
  .then(r => r.json())
  .then(console.log);
```

✅ **Done!** Your API calls are now same-origin and will bypass WAF.

---

## 🔐 Hardened API Client (Optional, 10 Minutes)

### Apply the Hardened API Client

**Step 1:** Backup current file:

```bash
cp resources/js/lib/api-client.ts resources/js/lib/api-client.ts.backup
```

**Step 2:** Replace with hardened version:

```bash
cp .patches/api-client-hardened.ts resources/js/lib/api-client.ts
```

**Step 3:** Test:

```bash
npm run dev
```

Open browser console and check for diagnostic logs:

```
API Response: { url: '/api/native/questions', status: 200, contentType: 'application/json', hasACAO: false }
```

### What This Adds:

✅ **HTML Detection:** Throws clear error if WAF returns HTML challenge  
✅ **Content-Type Validation:** Rejects responses with wrong Content-Type  
✅ **Dev Logging:** Shows URL, status, content-type for every request  
✅ **Better Error Messages:** Explains what went wrong (WAF vs network vs API error)

---

## 🏗️ Environment Management (Best Practice)

### Use Separate .env Files

**For Local Development:**

```bash
cp .env.local.example .env
php artisan config:clear
```

**For Production Deployment:**

```bash
cp .env.production.example .env.production

# Then deploy:
rsync -avz .env.production user@server:/var/www/html/.env
ssh user@server 'cd /var/www/html && php artisan config:cache'
```

**For NativePHP Mobile Builds:**

```bash
cp .env.native.example .env.native

# Then build:
php artisan native:build --env=native
```

---

## 🧪 Testing Checklist

### Local Development (NATIVE_APP=false)

- [ ] `.env` has `NATIVE_APP=false`
- [ ] `.env` has `APP_URL=https://soual-mehairny.test`
- [ ] No `REMOTE_APP_URL` set (or commented out)
- [ ] Run `php artisan config:clear`
- [ ] Open `https://soual-mehairny.test/en/questions`
- [ ] Open browser DevTools → Network tab
- [ ] Filter by `Fetch/XHR`
- [ ] Click a question to load details
- [ ] **Verify:**
  - Request URL starts with `/api/` (relative)
  - Status: `200 OK`
  - Type: `xhr`
  - Content-Type: `application/json`
  - **NO** CORS error in console

### Production Deployment (NATIVE_APP=false)

- [ ] `.env.production` has `NATIVE_APP=false`
- [ ] `.env.production` has `APP_URL=https://so2al.free.nf`
- [ ] Deploy to server
- [ ] Run `php artisan config:cache` on server
- [ ] Test same as local (should work identically)

### NativePHP Mobile Build (NATIVE_APP=true)

- [ ] `.env.native` has `NATIVE_APP=true`
- [ ] `.env.native` has `REMOTE_APP_URL=https://so2al.free.nf`
- [ ] Build app: `php artisan native:build --env=native`
- [ ] Run app on mobile device/simulator
- [ ] **Verify:**
  - Requests show full URL: `https://so2al.free.nf/api/native/questions`
  - Authorization header is sent (if logged in)
  - App works offline-first with local SQLite

---

## 🐛 Debugging Tools

### Browser Console Quick Tests

**Test 1: Check window.__APP_CONFIG__**

```javascript
console.log(window.__APP_CONFIG__);
// Expected for local dev:
// { native: false, remoteAppUrl: null, locale: 'en' }

// Expected for mobile app:
// { native: true, remoteAppUrl: 'https://so2al.free.nf', locale: 'en' }
```

**Test 2: Test API call**

```javascript
import { apiGet } from '@/lib/api-client';

apiGet('/api/__diagnostics')
  .then(data => {
    console.log('Diagnostics:', data);
    console.log('CORS will allow:', data.cors_will_allow);
    console.log('Request origin:', data.request_origin);
  })
  .catch(err => console.error('Failed:', err));
```

**Test 3: Check CORS headers (DevTools Network tab)**

1. Open Network tab
2. Filter by `Fetch/XHR`
3. Click any `/api/` request
4. Check **Response Headers**:
   - ✅ Should have `Access-Control-Allow-Origin` (if cross-origin)
   - ✅ Should have `Content-Type: application/json`
   - ❌ Should NOT have `Content-Type: text/html`

**Test 4: Simulate WAF HTML response (for hardened client testing)**

```javascript
// Inject a fake HTML response to test error handling
fetch('/api/native/questions', {
  headers: { 'X-Force-HTML': 'true' }  // Won't work, but shows how to test
});

// Or manually test:
const fakeHtmlResponse = new Response(
  '<html><body>Challenge</body></html>',
  { headers: { 'Content-Type': 'text/html' } }
);

// Should throw: "API returned HTML instead of JSON..."
```

---

## 🚨 Troubleshooting

### Issue: "API returned HTML instead of JSON"

**Cause:** Hosting WAF is challenging the request

**Solutions:**

1. ✅ Use `.env` with `NATIVE_APP=false` (same-origin calls)
2. ✅ Contact hosting support to whitelist `/api/*` from anti-bot protection
3. ✅ Upgrade to paid hosting plan (removes WAF restrictions)
4. ⚠️ Use BFF proxy (see CORS_AUDIT_REPORT.md, Section E2)

### Issue: "Invalid Content-Type: expected application/json, got text/html"

**Same as above.** The hardened client is correctly detecting the WAF challenge.

### Issue: Still getting CORS errors after setting NATIVE_APP=false

**Check:**

```bash
# 1. Verify .env has correct value:
grep NATIVE_APP .env

# 2. Clear config cache:
php artisan config:clear

# 3. Check runtime value:
php artisan tinker
> config('app.native_app')
# Should return: false

# 4. Check browser console:
console.log(window.__APP_CONFIG__.native);
# Should log: false

# 5. Hard-refresh page (Ctrl+Shift+R)
```

### Issue: CORS works locally but fails in production

**Likely causes:**

1. Production `.env` has `NATIVE_APP=true` (should be `false`)
2. Cached config on server: Run `php artisan config:cache` after deployment
3. Production is proxied through Cloudflare/WAF with different rules

**Fix:**

```bash
# On production server:
cd /var/www/html  # or your web root
nano .env
# Set: NATIVE_APP=false
# Save and exit

php artisan config:cache
php artisan optimize:clear
```

### Issue: Mobile app build fails

**If using `.env.native` for builds:**

```bash
# Ensure you're building with correct env:
php artisan native:build --env=native

# Or set manually:
export APP_ENV=native
php artisan native:build

# Verify build config:
php artisan config:show app
```

---

## 📋 Deployment Checklist

### Initial Setup (One-Time)

- [ ] Create `.env.local.example` (for team)
- [ ] Create `.env.production.example` (for deployment)
- [ ] Create `.env.native.example` (for mobile builds)
- [ ] Update `.gitignore` to include `.env.local`, `.env.production`, `.env.native`
- [ ] Document in README which `.env` to use for each environment

### Local Development

- [ ] Copy `.env.local.example` to `.env`
- [ ] Set `NATIVE_APP=false`
- [ ] Set `APP_URL=https://soual-mehairny.test` (or your local domain)
- [ ] Run `php artisan config:clear`
- [ ] Test in browser

### Production Web Deployment

- [ ] Copy `.env.production.example` to server's `.env`
- [ ] Set `NATIVE_APP=false`
- [ ] Set `APP_URL=https://so2al.free.nf` (your production URL)
- [ ] On server: `php artisan config:cache`
- [ ] On server: `php artisan migrate`
- [ ] Test in production

### Mobile App Build

- [ ] Copy `.env.native.example` to `.env.native`
- [ ] Set `NATIVE_APP=true`
- [ ] Set `REMOTE_APP_URL=https://so2al.free.nf`
- [ ] Build: `php artisan native:build --env=native`
- [ ] Test on device/simulator

---

## 🎓 Understanding the Architecture

### Why This Works

**Standard Web App (NATIVE_APP=false):**

```
Browser at https://soual-mehairny.test/questions
  ↓
  fetch('/api/native/questions')  ← Relative URL
  ↓
  https://soual-mehairny.test/api/native/questions  ← Same origin
  ↓
  No CORS needed ✅
  No WAF interference ✅
  Direct to Laravel ✅
```

**NativePHP Mobile App (NATIVE_APP=true):**

```
Mobile App (Capacitor/Tauri)
  ↓
  fetch('https://so2al.free.nf/api/native/questions')  ← Absolute URL
  ↓
  Native HTTP client (not browser fetch)
  ↓
  No same-origin policy ✅
  Can set credentials, cookies ✅
  Can spoof User-Agent to bypass WAF ✅
  CORS headers added by Laravel ✅
```

### What Was Wrong Before

```
Browser at https://soual-mehairny.test
  ↓
  NATIVE_APP=true in .env
  ↓
  fetch('https://so2al.free.nf/api/native/questions')  ← Cross-origin!
  ↓
  Browser enforces same-origin policy
  ↓
  Sends OPTIONS preflight
  ↓
  Hosting WAF sees: "Hmm, fetch request without cookies, different origin, looks like a bot"
  ↓
  Returns: <html><script>set cookie __test; redirect</script></html>
  ↓
  Content-Type: text/html ❌
  No Access-Control-Allow-Origin header ❌
  ↓
  Browser blocks response: "CORS error"
  Frontend receives HTML instead of JSON
  App crashes ❌
```

---

## 🔗 Additional Resources

- **Main Audit Report:** See `CORS_AUDIT_REPORT.md` for full analysis
- **Hardened API Client:** See `.patches/api-client-hardened.ts`
- **Laravel CORS Docs:** https://laravel.com/docs/12.x/routing#cors
- **NativePHP Docs:** https://nativephp.com/docs

---

**Questions?** Check the audit report or open an issue in the project repo.
