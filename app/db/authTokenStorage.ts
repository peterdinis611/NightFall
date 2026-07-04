import type { TokenStorage } from "@convex-dev/auth/react"
import {
  convexStorageKeyToTokenId,
  getAuthTokensCollection,
  type AuthTokensCollection,
} from "./authTokens"

export function createAuthTokenStorage(
  collection: AuthTokensCollection = getAuthTokensCollection(),
): TokenStorage {
  return {
    getItem(key: string) {
      const id = convexStorageKeyToTokenId(key)
      if (!id) return null
      return collection.get(id)?.value ?? null
    },
    setItem(key: string, value: string) {
      const id = convexStorageKeyToTokenId(key)
      if (!id) return
      if (collection.has(id)) {
        collection.update(id, (draft) => {
          draft.value = value
        })
      } else {
        collection.insert({ id, value })
      }
    },
    removeItem(key: string) {
      const id = convexStorageKeyToTokenId(key)
      if (id && collection.has(id)) {
        collection.delete(id)
      }
    },
  }
}
