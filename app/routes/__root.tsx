import { createRootRoute, Outlet, ErrorComponentProps } from "@tanstack/react-router"
import { ContentWarning } from "~/components/shared/ContentWarning"
import { LoadingScreen } from "~/components/shared/LoadingScreen"
import { ErrorScreen } from "~/components/shared/ErrorScreen"
import { NotFoundScreen } from "~/components/shared/NotFoundScreen"
import { ScrollBackdrop } from "~/components/layout/ScrollBackdrop"
import { AppNav } from "~/components/layout/AppNav"
import { AmbientSoundProvider } from "~/lib/ambientSound"

export const Route = createRootRoute({
  component: RootLayout,
  pendingComponent: () => (
    <LoadingScreen message="Summoning the page…" />
  ),
  errorComponent: RootError,
  notFoundComponent: NotFoundScreen,
})

function RootLayout() {
  return (
    <AmbientSoundProvider>
      <ScrollBackdrop />
      <div className="relative z-10 min-h-screen text-fg">
        <AppNav />
        <ContentWarning />
        <Outlet />
      </div>
    </AmbientSoundProvider>
  )
}

function RootError({ error, reset }: ErrorComponentProps) {
  const message =
    error instanceof Error ? error.message : "An unexpected error occurred."

  return (
    <ErrorScreen
      title="The ritual failed"
      message={message}
      onRetry={reset}
    />
  )
}
