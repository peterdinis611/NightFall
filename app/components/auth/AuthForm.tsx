import { useState, useEffect } from "react"
import { useNavigate } from "@tanstack/react-router"
import { useAuthActions } from "@convex-dev/auth/react"
import { useConvexAuth } from "convex/react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "~/lib/utils"
import {
  Mail,
  Lock,
  Github,
  Chrome,
  Ghost,
  AlertCircle,
  Loader2,
  UserPlus,
  LogIn,
} from "lucide-react"

type AuthMode = "signIn" | "signUp"

type AuthFormProps = {
  redirectTo?: string
}

export function AuthForm({ redirectTo = "/" }: AuthFormProps) {
  const navigate = useNavigate()
  const { signIn } = useAuthActions()
  const { isAuthenticated } = useConvexAuth()

  const [mode, setMode] = useState<AuthMode>("signIn")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [loading, setLoading] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (isAuthenticated) {
      navigate({ to: redirectTo as "/" })
    }
  }, [isAuthenticated, navigate, redirectTo])

  async function handlePasswordSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading("password")
    setError(null)

    try {
      const params: Record<string, string> = {
        email,
        password,
        flow: mode === "signUp" ? "signUp" : "signIn",
      }
      if (mode === "signUp" && name.trim()) {
        params.name = name.trim()
      }

      await signIn("password", params)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Authentication failed")
    } finally {
      setLoading(null)
    }
  }

  async function handleOAuth(provider: "github" | "google") {
    setLoading(provider)
    setError(null)
    try {
      await signIn(provider, { redirectTo })
    } catch (err) {
      setError(err instanceof Error ? err.message : "OAuth sign-in failed")
      setLoading(null)
    }
  }

  async function handleAnonymous() {
    setLoading("anonymous")
    setError(null)
    try {
      await signIn("anonymous")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Guest sign-in failed")
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="w-full">
      <div className="auth-tabs">
        {(["signIn", "signUp"] as const).map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => {
              setMode(tab)
              setError(null)
            }}
            className={cn("auth-tab", mode === tab && "auth-tab-active")}
          >
            {tab === "signIn" ? <LogIn className="size-4" /> : <UserPlus className="size-4" />}
            {tab === "signIn" ? "Sign in" : "Register"}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-2 mb-6">
        <OAuthButton
          icon={<Github className="size-4" />}
          label="Continue with GitHub"
          onClick={() => handleOAuth("github")}
          loading={loading === "github"}
          disabled={!!loading}
        />
        <OAuthButton
          icon={<Chrome className="size-4" />}
          label="Continue with Google"
          onClick={() => handleOAuth("google")}
          loading={loading === "google"}
          disabled={!!loading}
        />
      </div>

      <div className="relative mb-6">
        <div className="divider-gradient" />
        <div className="relative flex justify-center -mt-3">
          <span className="auth-divider-label">or with email</span>
        </div>
      </div>

      <form onSubmit={handlePasswordSubmit} className="flex flex-col gap-4">
        <AnimatePresence mode="wait">
          {mode === "signUp" && (
            <motion.div
              key="name"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
            >
              <InputField
                icon={<Ghost className="size-4" />}
                type="text"
                placeholder="Display name (optional)"
                value={name}
                onChange={setName}
                disabled={!!loading}
              />
            </motion.div>
          )}
        </AnimatePresence>

        <InputField
          icon={<Mail className="size-4" />}
          type="email"
          placeholder="Email"
          value={email}
          onChange={setEmail}
          required
          disabled={!!loading}
        />
        <InputField
          icon={<Lock className="size-4" />}
          type="password"
          placeholder="Password (min. 8 characters)"
          value={password}
          onChange={setPassword}
          required
          minLength={8}
          disabled={!!loading}
        />

        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="auth-error"
            >
              <AlertCircle className="size-4 shrink-0" />
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        <button
          type="submit"
          disabled={!!loading || !email || !password}
          className="btn-primary w-full"
        >
          {loading === "password" ? (
            <Loader2 className="size-4 animate-spin" />
          ) : mode === "signIn" ? (
            <LogIn className="size-4" />
          ) : (
            <UserPlus className="size-4" />
          )}
          {mode === "signIn" ? "Sign in" : "Create account"}
        </button>
      </form>

      <div className="mt-6 pt-6 border-t border-[var(--border)]">
        <button
          type="button"
          onClick={handleAnonymous}
          disabled={!!loading}
          className="btn-ghost w-full flex items-center justify-center gap-2 disabled:opacity-40"
        >
          {loading === "anonymous" ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <Ghost className="size-4" />
          )}
          Continue as guest
        </button>
        <p className="auth-guest-note">
          Guest sessions are temporary — sign up to save your stories
        </p>
      </div>
    </div>
  )
}

function OAuthButton({
  icon,
  label,
  onClick,
  loading,
  disabled,
}: {
  icon: React.ReactNode
  label: string
  onClick: () => void
  loading: boolean
  disabled: boolean
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="btn-ghost w-full flex items-center justify-center gap-2.5 disabled:opacity-40"
    >
      {loading ? <Loader2 className="size-4 animate-spin" /> : icon}
      {label}
    </button>
  )
}

function InputField({
  icon,
  type,
  placeholder,
  value,
  onChange,
  required,
  minLength,
  disabled,
}: {
  icon: React.ReactNode
  type: string
  placeholder: string
  value: string
  onChange: (v: string) => void
  required?: boolean
  minLength?: number
  disabled?: boolean
}) {
  return (
    <div className="relative">
      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted">{icon}</span>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        minLength={minLength}
        disabled={disabled}
        className="input-field pl-11 disabled:opacity-50"
      />
    </div>
  )
}
