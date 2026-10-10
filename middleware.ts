import {
  convexAuthNextjsMiddleware,
  createRouteMatcher,
  nextjsMiddlewareRedirect,
} from "@convex-dev/auth/nextjs/server"

const isAuthPage = createRouteMatcher(["/auth"])
const isProtectedRoute = createRouteMatcher(["/library"])

export default convexAuthNextjsMiddleware(async (request, { convexAuth }) => {
  // Prefer cookie token — avoids auth:isAuthenticated query which may be missing
  // until Convex fully syncs the convex-auth 0.0.76+ export.
  const token = await convexAuth.getToken()
  const authed = Boolean(token)

  if (isAuthPage(request) && authed) {
    return nextjsMiddlewareRedirect(request, "/")
  }

  if (isProtectedRoute(request) && !authed) {
    return nextjsMiddlewareRedirect(request, "/auth?redirect=/library")
  }
})

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
}
