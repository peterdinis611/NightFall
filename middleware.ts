import {
  convexAuthNextjsMiddleware,
  createRouteMatcher,
  nextjsMiddlewareRedirect,
} from "@convex-dev/auth/nextjs/server"

const isAuthPage = createRouteMatcher(["/auth"])
const isProtectedRoute = createRouteMatcher(["/library"])

export default convexAuthNextjsMiddleware(async (request, { convexAuth }) => {
  const authed = await convexAuth.isAuthenticated()

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
