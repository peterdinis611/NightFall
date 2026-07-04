import { createCollection } from "@tanstack/react-db"
import { localStorageCollectionOptions } from "@tanstack/react-db"
import type { StorageApi } from "@tanstack/db"
import { z } from "zod"
import { CONVEX_URL } from "~/lib/convex"
import { createMemoryStorage } from "./memoryStorage"

export const AUTH_TOKENS_STORAGE_KEY = "nightfall-auth-tokens"

export const authTokenKeySchema = z.enum(["jwt", "refresh", "oauthVerifier"])
export type AuthTokenKey = z.infer<typeof authTokenKeySchema>

export const authTokenRecordSchema = z.object({
  id: authTokenKeySchema,
  value: z.string(),
})

export type AuthTokenRecord = z.infer<typeof authTokenRecordSchema>

export type AuthTokensCollection = ReturnType<typeof createAuthTokensCollection>

const CONVEX_STORAGE_KEY_MAP: Record<string, AuthTokenKey> = {
  __convexAuthJWT: "jwt",
  __convexAuthRefreshToken: "refresh",
  __convexAuthOAuthVerifier: "oauthVerifier",
}

export function convexStorageKeyToTokenId(key: string): AuthTokenKey | null {
  return CONVEX_STORAGE_KEY_MAP[key] ?? null
}

export function createAuthTokensCollection(storage: StorageApi) {
  return createCollection(
    localStorageCollectionOptions({
      id: "nightfall-auth-tokens",
      storageKey: AUTH_TOKENS_STORAGE_KEY,
      getKey: (item) => item.id,
      schema: authTokenRecordSchema,
      storage,
    }),
  )
}

let authTokensCollection: AuthTokensCollection | null = null

function resolveBrowserStorage(): StorageApi {
  if (typeof window !== "undefined" && window.localStorage) {
    return window.localStorage
  }
  return createMemoryStorage()
}

export function getAuthTokensCollection(): AuthTokensCollection {
  if (!authTokensCollection) {
    authTokensCollection = createAuthTokensCollection(resolveBrowserStorage())
    migrateLegacyConvexAuthKeys(authTokensCollection)
  }
  return authTokensCollection
}

/** Test helper — isolate collection per test file. */
export function resetAuthTokensCollection(storage?: StorageApi) {
  authTokensCollection = createAuthTokensCollection(storage ?? createMemoryStorage())
}

function setTokenValue(collection: AuthTokensCollection, id: AuthTokenKey, value: string) {
  if (collection.has(id)) {
    collection.update(id, (draft) => {
      draft.value = value
    })
  } else {
    collection.insert({ id, value })
  }
}

function deleteTokenValue(collection: AuthTokensCollection, id: AuthTokenKey) {
  if (collection.has(id)) {
    collection.delete(id)
  }
}

export function storeAuthTokens(tokens: { token: string; refreshToken: string }) {
  const collection = getAuthTokensCollection()
  setTokenValue(collection, "jwt", tokens.token)
  setTokenValue(collection, "refresh", tokens.refreshToken)
}

export function hasStoredAuthSession() {
  return getAuthTokensCollection().has("jwt")
}

export function clearStoredAuthSession() {
  const collection = getAuthTokensCollection()
  for (const id of authTokenKeySchema.options) {
    deleteTokenValue(collection, id)
  }
  clearLegacyConvexAuthKeys()
}

export function redirectAfterAuth(path: string) {
  const url = path.startsWith("http")
    ? path
    : `${window.location.origin}${path.startsWith("/") ? path : `/${path}`}`
  window.location.assign(url)
}

function legacyKey(suffix: string) {
  const namespace = CONVEX_URL.replace(/[^a-zA-Z0-9]/g, "")
  return `${suffix}_${namespace}`
}

function clearLegacyConvexAuthKeys() {
  if (typeof window === "undefined") return
  localStorage.removeItem(legacyKey("__convexAuthJWT"))
  localStorage.removeItem(legacyKey("__convexAuthRefreshToken"))
  localStorage.removeItem(legacyKey("__convexAuthOAuthVerifier"))
}

function migrateLegacyConvexAuthKeys(collection: AuthTokensCollection) {
  if (typeof window === "undefined" || collection.has("jwt")) return

  const legacyJwt = localStorage.getItem(legacyKey("__convexAuthJWT"))
  const legacyRefresh = localStorage.getItem(legacyKey("__convexAuthRefreshToken"))
  const legacyVerifier = localStorage.getItem(legacyKey("__convexAuthOAuthVerifier"))

  if (legacyJwt) setTokenValue(collection, "jwt", legacyJwt)
  if (legacyRefresh) setTokenValue(collection, "refresh", legacyRefresh)
  if (legacyVerifier) setTokenValue(collection, "oauthVerifier", legacyVerifier)

  if (legacyJwt || legacyRefresh || legacyVerifier) {
    clearLegacyConvexAuthKeys()
  }
}
