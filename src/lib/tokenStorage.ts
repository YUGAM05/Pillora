/**
 * Cross-platform token storage utility.
 * 
 * Solves the iOS Safari Private/Incognito mode issue where localStorage
 * and sessionStorage throw QuotaExceededError or are entirely unavailable.
 * 
 * Storage priority:
 *   1. Cookies (primary — works reliably on iOS Safari incognito)
 *   2. localStorage (fallback — works on most browsers in normal mode)
 *   3. In-memory Map (last resort — survives within the tab session only)
 */

// ---------------------------------------------------------------------------
// In-memory fallback store
// ---------------------------------------------------------------------------
const memoryStore = new Map<string, string>();

// ---------------------------------------------------------------------------
// Feature detection helpers
// ---------------------------------------------------------------------------
function isLocalStorageAvailable(): boolean {
    if (typeof window === 'undefined') return false;
    try {
        const testKey = '__pillora_storage_test__';
        window.localStorage.setItem(testKey, '1');
        window.localStorage.removeItem(testKey);
        return true;
    } catch {
        return false;
    }
}

function areCookiesAvailable(): boolean {
    if (typeof document === 'undefined') return false;
    try {
        document.cookie = '__pillora_cookie_test__=1; path=/; SameSite=Lax';
        const works = document.cookie.includes('__pillora_cookie_test__=1');
        // Clean up the test cookie
        document.cookie = '__pillora_cookie_test__=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
        return works;
    } catch {
        return false;
    }
}

// Cache the detection results so we don't re-probe on every call
let _cookiesAvailable: boolean | null = null;
let _localStorageAvailable: boolean | null = null;

function cookiesOk(): boolean {
    if (_cookiesAvailable === null) _cookiesAvailable = areCookiesAvailable();
    return _cookiesAvailable;
}

function localStorageOk(): boolean {
    if (_localStorageAvailable === null) _localStorageAvailable = isLocalStorageAvailable();
    return _localStorageAvailable;
}

// ---------------------------------------------------------------------------
// Cookie helpers
// ---------------------------------------------------------------------------
function setCookie(name: string, value: string, days: number = 7): void {
    const maxAge = days * 24 * 60 * 60; // seconds
    // Encode the value so special characters (JSON) are safe
    const encoded = encodeURIComponent(value);
    document.cookie = `${name}=${encoded}; path=/; max-age=${maxAge}; SameSite=Lax`;
}

function getCookie(name: string): string | null {
    if (typeof document === 'undefined') return null;
    const cookies = document.cookie.split('; ');
    for (const cookie of cookies) {
        const [key, ...rest] = cookie.split('=');
        if (key === name) {
            return decodeURIComponent(rest.join('='));
        }
    }
    return null;
}

function removeCookie(name: string): void {
    document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
}

// ---------------------------------------------------------------------------
// Public API — drop-in replacement for localStorage.getItem / setItem / removeItem
// ---------------------------------------------------------------------------

/**
 * Store a value using the best available mechanism.
 */
export function storageSet(key: string, value: string): void {
    if (typeof window === 'undefined') return;

    // 1. Cookie (primary)
    if (cookiesOk()) {
        setCookie(key, value);
    }

    // 2. localStorage (secondary — write in parallel for faster reads)
    if (localStorageOk()) {
        try {
            window.localStorage.setItem(key, value);
        } catch {
            // Silently ignore quota errors
        }
    }

    // 3. In-memory (always keep a copy as last resort)
    memoryStore.set(key, value);
}

/**
 * Retrieve a value, checking all layers in priority order.
 */
export function storageGet(key: string): string | null {
    if (typeof window === 'undefined') return null;

    // 1. Cookie first
    if (cookiesOk()) {
        const cookieVal = getCookie(key);
        if (cookieVal !== null) return cookieVal;
    }

    // 2. localStorage
    if (localStorageOk()) {
        try {
            const lsVal = window.localStorage.getItem(key);
            if (lsVal !== null) return lsVal;
        } catch {
            // ignore
        }
    }

    // 3. In-memory
    const val = memoryStore.get(key) || null;

    // 4. Return null if not found or is a literal "null"/"undefined" string
    if (!val || val === 'null' || val === 'undefined') {
        return null;
    }

    return val;
}


/**
 * Remove a value from every layer.
 */
export function storageRemove(key: string): void {
    if (typeof window === 'undefined') return;

    if (cookiesOk()) removeCookie(key);

    if (localStorageOk()) {
        try {
            window.localStorage.removeItem(key);
        } catch {
            // ignore
        }
    }

    memoryStore.delete(key);
}

// ---------------------------------------------------------------------------
// Convenience helpers for auth-specific usage
// ---------------------------------------------------------------------------
export function getToken(): string | null {
    return storageGet('token');
}

export function getUser(): any | null {
    const user = storageGet('user');
    if (!user) return null;
    try {
        return JSON.parse(user);
    } catch {
        return user; // Return raw string if not JSON (fallback)
    }
}

export function setToken(token: string): void {
    storageSet('token', token);
}

export function setUser(user: any): void {
    const value = typeof user === 'string' ? user : JSON.stringify(user);
    storageSet('user', value);
}

export function clearAuth(): void {
    storageRemove('token');
    storageRemove('user');
}
