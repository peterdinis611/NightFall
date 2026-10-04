import { CONVEX_URL } from "~/lib/convex"

const JWT_KEY = "__convexAuthJWT"
const REFRESH_KEY = "__convexAuthRefreshToken"
const VERIFIER_KEY = "__convexAuthOAuthVerifier"

/** Same escaping Convex Auth uses for storageNamespace */
export function authStorageNamespace(url: string = CONVEX_URL): string {
  return url.replace(/[^a-zA-Z0-9]/g, "")
}

export function namespacedAuthKey(baseKey: string, url: string = CONVEX_URL): string {
  return `${baseKey}_${authStorageNamespace(url)}`
}

function browserStorage(): Storage | null {
  if (typeof window === "undefined") return null
  try {
    return window.localStorage
  } catch {
    return null
  }
}

export function storeAuthTokens(tokens: { token: string; refreshToken: string }) {
  const storage = browserStorage()
  if (!storage) return
  storage.setItem(namespacedAuthKey(JWT_KEY), tokens.token)
  storage.setItem(namespacedAuthKey(REFRESH_KEY), tokens.refreshToken)
}

export function hasStoredAuthSession(): boolean {
  const storage = browserStorage()
  if (!storage) return false
  return Boolean(storage.getItem(namespacedAuthKey(JWT_KEY)))
}

export function clearStoredAuthSession() {
  const storage = browserStorage()
  if (!storage) return
  storage.removeItem(namespacedAuthKey(JWT_KEY))
  storage.removeItem(namespacedAuthKey(REFRESH_KEY))
  storage.removeItem(namespacedAuthKey(VERIFIER_KEY))
  // Legacy non-namespaced + old TanStack collection dump
  storage.removeItem(JWT_KEY)
  storage.removeItem(REFRESH_KEY)
  storage.removeItem(VERIFIER_KEY)
  storage.removeItem("nightfall-auth-tokens")
}

export function redirectAfterAuth(path: string) {
  const url = path.startsWith("http")
    ? path
    : `${window.location.origin}${path.startsWith("/") ? path : `/${path}`}`
  window.location.assign(url)
}

/** @deprecated kept for tests that import the old helpers */
export const AUTH_TOKENS_STORAGE_KEY = "nightfall-auth-tokens"
