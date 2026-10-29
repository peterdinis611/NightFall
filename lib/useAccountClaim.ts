"use client"

import { useCallback } from "react"
import { useMutation, useQuery, useConvexAuth } from "convex/react"
import { api } from "@convex/_generated/api"
import {
  saveAccountClaim,
  readAccountClaim,
  clearAccountClaim,
} from "@/lib/accountClaim"

/** Issue claim while guest; redeem after permanent sign-in. */
export function useAccountClaim() {
  const { isAuthenticated } = useConvexAuth()
  const user = useQuery(api.users.current, isAuthenticated ? {} : "skip")
  const issue = useMutation(api.stories.issueAccountClaim)
  const redeem = useMutation(api.stories.redeemAccountClaim)

  const prepareClaim = useCallback(async () => {
    if (!user?.isAnonymous) return
    try {
      const { token } = await issue({})
      saveAccountClaim(token)
    } catch {
      /* best-effort */
    }
  }, [user?.isAnonymous, issue])

  const redeemIfNeeded = useCallback(async () => {
    const token = readAccountClaim()
    if (!token) return { moved: 0 }
    if (!user || user.isAnonymous) return { moved: 0 }
    try {
      const result = await redeem({ token })
      clearAccountClaim()
      return result
    } catch {
      clearAccountClaim()
      return { moved: 0 }
    }
  }, [user, redeem])

  return { prepareClaim, redeemIfNeeded, isAnonymous: Boolean(user?.isAnonymous) }
}
