# CORS Fix - Quick Reference Card

**Print this or keep it open while debugging**

---

## 🎯 The 2-Minute Fix

```bash
# 1. Edit .env
NATIVE_APP=false  # Change from true → false

# 2. Clear cache
php artisan config:clear

# 3. Refresh browser
# Done! ✅
```

---

## 🔍 Diagnostic Commands

### Check Current Configuration

```bash
# View .env setting:
grep NATIVE_APP .env

# Check runtime config:
php artisan config:show app | grep native

# Or in tinker:
php artisan tinker
>>> config('app.native_app')
# Should return: false
```

### Browser Console

```javascript
// Check frontend config:
console.log(window.__APP_CONFIG__);
// Expected: { native: false, remoteAppUrl: null, locale: 'en' }

// Test API call:
fetch('/api/native/questions?locale=en&per_page=1')
  .then(r => r.json())
  .then(console.log)
  .catch(console.error);
```

---

## ✅ Verification Checklist

After applying the fix:

- [ ] `.env`: `NATIVE_APP=false`
- [ ] Ran: `php artisan config:clear`
- [ ] Browser console: `window.__APP_CONFIG__.native === false`
- [ ] DevTools Network: Request URL is `/api/*` (not `https://so2al...`)
- [ ] DevTools Network: Status `200 OK`
- [ ] DevTools Network: Content-Type `application/json`
- [ ] DevTools Console: NO red CORS errors
- [ ] App works: Can open `/en/questions`, see data

---

## 🚨 Common Issues

### Issue: Still getting CORS errors

**Solution:**
```bash
php artisan config:clear
php artisan cache:clear
# Hard refresh: Ctrl+Shift+R (Windows/Linux) or Cmd+Shift+R (Mac)
```

### Issue: "API returned HTML instead of JSON"

**Cause:** Hosting WAF is blocking the request

**Solution:**
- Verify `NATIVE_APP=false` in `.env`
- Apply hardened API client (see CORS_FIX_GUIDE.md)
- If still failing, contact hosting support

### Issue: Console shows `window.__APP_CONFIG__.native === true`

**Cause:** Config is cached

**Solution:**
```bash
php artisan config:clear
# Hard refresh browser
```

### Issue: TypeError: Cannot read property 'data' of undefined

**Cause:** API response is HTML, not JSON

**Solution:**
- Fix root cause (see above)
- Apply hardened API client for better error messages

---

## 📊 Environment Matrix

| Environment | NATIVE_APP | APP_URL | REMOTE_APP_URL |
|-------------|------------|---------|----------------|
| Local Dev   | `false`    | `https://soual-mehairny.test` | (empty) |
| Production  | `false`    | `https://so2al.free.nf` | (empty) |
| Mobile App  | `true`     | `https://so2al.free.nf` | `https://so2al.free.nf` |

---

## 🔧 Quick Patches

### Apply Hardened API Client

```bash
cp .patches/api-client-hardened.ts resources/js/lib/api-client.ts
npm run dev  # Rebuild frontend
```

### Use Environment Templates

```bash
# For local dev:
cp .env.local.example .env

# For production:
cp .env.production.example .env

# For mobile build:
cp .env.native.example .env.native
```

---

## 🌐 Test URLs

### Local Dev

```
Homepage: https://soual-mehairny.test
Questions: https://soual-mehairny.test/en/questions
API Test: https://soual-mehairny.test/api/__diagnostics
```

### Production

```
Homepage: https://so2al.free.nf
Questions: https://so2al.free.nf/en/questions
API Test: https://so2al.free.nf/api/__diagnostics
```

---

## 📞 Documentation Links

- **Quick Summary:** `CORS_SUMMARY.md`
- **Fix Guide:** `CORS_FIX_GUIDE.md`
- **Full Audit:** `CORS_AUDIT_REPORT.md`
- **API Inventory:** `API_CALLS_INVENTORY.md`
- **Master Index:** `CORS_AUDIT_INDEX.md`

---

## 💡 Remember

- ❌ `NATIVE_APP=true` → Cross-origin calls → WAF blocks → CORS error
- ✅ `NATIVE_APP=false` → Same-origin calls → No CORS → Works!

**Rule of thumb:** Use `false` for all web deployments, `true` only for mobile apps.

---

**Questions?** See `CORS_FIX_GUIDE.md` → Troubleshooting section

**Print-friendly:** This card fits on one page at 80% zoom
