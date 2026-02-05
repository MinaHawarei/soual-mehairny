import { isNativeApp } from '@/lib/platform';

const TOKEN_KEY = 'native_auth_token';

let memoryToken: string | null = null;
let secureStoragePromise: Promise<any | null> | null = null;

/**
 * Runtime-only NativePHP import
 * Prevents Vite from resolving "#nativephp" at build time.
 */
async function importNativePhp(): Promise<any | null> {
  if (!isNativeApp()) {
    return null;
  }

  try {
    // eslint-disable-next-line no-new-func
    const importer = new Function('return import("#nativephp")');
    return await importer();
  } catch {
    return null;
  }
}

async function loadSecureStorage() {
  if (!isNativeApp()) {
    return null;
  }

  if (!secureStoragePromise) {
    secureStoragePromise = (async () => {
      const module = await importNativePhp();
      return module?.secureStorage ?? null;
    })();
  }

  return secureStoragePromise;
}

export async function getAuthToken(): Promise<string | null> {
  if (memoryToken) {
    return memoryToken;
  }

  const secureStorage = await loadSecureStorage();

  if (secureStorage?.get) {
    const result = await secureStorage.get(TOKEN_KEY);

    const value =
      typeof result === 'object' && result !== null && 'value' in result
        ? (result as { value?: string | null }).value
        : result;

    memoryToken = value ?? null;
    return memoryToken;
  }

  if (typeof window !== 'undefined' && window.localStorage) {
    memoryToken = window.localStorage.getItem(TOKEN_KEY);
    return memoryToken;
  }

  return null;
}

export async function setAuthToken(token: string): Promise<void> {
  memoryToken = token;

  const secureStorage = await loadSecureStorage();

  if (secureStorage?.set) {
    await secureStorage.set(TOKEN_KEY, token);
    return;
  }

  if (typeof window !== 'undefined' && window.localStorage) {
    window.localStorage.setItem(TOKEN_KEY, token);
  }
}

export async function clearAuthToken(): Promise<void> {
  memoryToken = null;

  const secureStorage = await loadSecureStorage();

  if (secureStorage?.delete) {
    await secureStorage.delete(TOKEN_KEY);
    return;
  }

  if (typeof window !== 'undefined' && window.localStorage) {
    window.localStorage.removeItem(TOKEN_KEY);
  }
}
