"use client"

import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import {
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Share2,
  X,
} from "lucide-react"

interface Props {
  current: number
  total: number
  isRevealing: boolean
  autoPlay: boolean
  audioEnabled: boolean
  onPrev: () => void
  onNext: () => void
  onJump?: (index: number) => void
  onToggleAuto: () => void
  onToggleAudio: () => void
  onShare: () => void
  onExit: () => void
}

export function PlaybackBar({
  current,
  total,
  isRevealing,
  autoPlay,
  audioEnabled,
  onPrev,
  onNext,
  onJump,
  onToggleAuto,
  onToggleAudio,
  onShare,
  onExit,
}: Props) {
  const progress = ((current + (isRevealing ? 0.35 : 1)) / total) * 100
  const isLast = current === total - 1

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 px-3 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-6 pointer-events-none">
      <div className="pointer-events-auto mx-auto w-full max-w-lg">
        {/* Folio strip */}
        <div className="mb-3 flex items-center justify-between px-1">
          <p className="font-marginalia text-[10px] tracking-wide text-[var(--verdigris)]/80">
            fol. {String(current + 1).padStart(2, "0")}
          </p>
          <div className="flex items-center gap-1.5">
            {Array.from({ length: total }).map((_, i) => (
              <button
                key={i}
                type="button"
                title={`Scene ${i + 1}`}
                disabled={!onJump}
                onClick={() => onJump?.(i)}
                className={cn(
                  "rounded-full transition-all duration-300",
                  i < current && "size-1.5 bg-[var(--blood)]/45",
                  i === current && "h-1.5 w-5 bg-[var(--blood)]",
                  i > current && "size-1.5 bg-[var(--border)]",
                  onJump && "hover:scale-125 cursor-pointer",
                )}
              />
            ))}
          </div>
          <p className="font-mono text-[10px] tabular-nums text-muted">
            {current + 1}/{total}
          </p>
        </div>

        {/* Dock */}
        <div
          className="relative overflow-hidden rounded-sm border px-3 py-2.5 shadow-[0_-8px_40px_rgba(0,0,0,0.45)]"
          style={{
            borderColor: "color-mix(in srgb, var(--border) 80%, transparent)",
            background: "color-mix(in srgb, var(--card) 82%, transparent)",
            backdropFilter: "blur(14px)",
          }}
        >
          <div
            className="absolute inset-x-0 top-0 h-px"
            style={{
              background:
                "linear-gradient(90deg, transparent, color-mix(in srgb, var(--blood) 45%, transparent), transparent)",
            }}
          />

          <div className="mb-2.5 h-px w-full overflow-hidden rounded-full bg-[var(--border)]/50">
            <motion.div
              className="h-full origin-left bg-[var(--blood)]/55"
              animate={{ width: `${Math.min(100, progress)}%` }}
              transition={{ duration: 0.45, ease: "easeOut" }}
            />
          </div>

          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5">
              <BarButton onClick={onPrev} disabled={current === 0} label="Previous scene">
                <ChevronLeft className="size-5" />
              </BarButton>

              <BarButton
                onClick={onToggleAuto}
                label={autoPlay ? "Stop auto-advance" : "Auto-advance scenes"}
                active={autoPlay}
              >
                {autoPlay ? (
                  <Pause className="size-4 text-[var(--blood)]" />
                ) : (
                  <Play className="size-4" />
                )}
              </BarButton>

              <BarButton
                onClick={onNext}
                label={
                  isRevealing
                    ? "Skip typing"
                    : isLast
                      ? "Finish story"
                      : "Next scene"
                }
                pulse={!isRevealing && !isLast}
                active={isLast && !isRevealing}
              >
                <AnimatePresence mode="wait">
                  <motion.span
                    key={isRevealing ? "skip" : isLast ? "end" : "next"}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center"
                  >
                    {isLast && !isRevealing ? (
                      <X className="size-4 text-[var(--blood)]" />
                    ) : (
                      <ChevronRight
                        className={cn(
                          "size-5",
                          !isRevealing && "text-[var(--blood)]",
                        )}
                      />
                    )}
                  </motion.span>
                </AnimatePresence>
              </BarButton>
            </div>

            <p className="hidden sm:block font-marginalia text-[9px] text-muted/70 tracking-wide">
              {isRevealing ? "tap page to skip" : "space · next"}
            </p>

            <div className="flex items-center gap-1.5">
              <BarButton
                onClick={onToggleAudio}
                label={audioEnabled ? "Mute scene audio" : "Enable scene audio"}
                active={audioEnabled}
              >
                {audioEnabled ? (
                  <Volume2 className="size-4" />
                ) : (
                  <VolumeX className="size-4 opacity-60" />
                )}
              </BarButton>
              <BarButton onClick={onShare} label="Copy story link">
                <Share2 className="size-4" />
              </BarButton>
              <BarButton onClick={onExit} label="Close story">
                <X className="size-4" />
              </BarButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function BarButton({
  onClick,
  disabled = false,
  label,
  active = false,
  pulse = false,
  children,
}: {
  onClick: () => void
  disabled?: boolean
  label: string
  active?: boolean
  pulse?: boolean
  children: React.ReactNode
}) {
  return (
    <motion.button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      disabled={disabled}
      whileHover={disabled ? {} : { scale: 1.06 }}
      whileTap={disabled ? {} : { scale: 0.94 }}
      className={cn(
        "relative flex size-10 items-center justify-center rounded-sm border transition-colors",
        "bg-[var(--surface-bg)] text-[var(--muted)] hover:text-[var(--foreground)]",
        active
          ? "border-[var(--blood)]/45 text-[var(--foreground)]"
          : "border-[var(--border)]",
        pulse && "shadow-[0_0_16px_color-mix(in_srgb,var(--blood)_22%,transparent)]",
        disabled && "opacity-30 pointer-events-none",
      )}
    >
      {children}
      {pulse && (
        <motion.span
          className="absolute inset-0 rounded-sm border border-[var(--blood)]/35"
          animate={{ opacity: [0.2, 0.7, 0.2] }}
          transition={{ duration: 1.6, repeat: Infinity }}
        />
      )}
    </motion.button>
  )
}
