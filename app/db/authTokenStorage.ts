import type { TokenStorage } from "@convex-dev/auth/react"

/**
 * Thin localStorage adapter for Convex Auth.
 * Convex Auth already namespaces keys before calling get/set/remove.
 */
export function createAuthTokenStorage(
  storage: Storage = window.localStorage,
): TokenStorage {
  return {
    getItem(key: string) {
      try {
        return storage.getItem(key)
      } catch {
        return null
      }
    },
    setItem(key: string, value: string) {
      try {
        storage.setItem(key, value)
      } catch {
        // Quota / private mode — ignore
      }
    },
    removeItem(key: string) {
      try {
        storage.removeItem(key)
      } catch {
        // ignore
      }
    },
  }
}
