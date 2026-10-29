const KEY = "nightfall-account-claim"

export function saveAccountClaim(token: string) {
  if (typeof window === "undefined") return
  localStorage.setItem(KEY, token)
}

export function readAccountClaim(): string | null {
  if (typeof window === "undefined") return null
  return localStorage.getItem(KEY)
}

export function clearAccountClaim() {
  if (typeof window === "undefined") return
  localStorage.removeItem(KEY)
}
