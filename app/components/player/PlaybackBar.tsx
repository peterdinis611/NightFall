"use client"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "~/lib/utils"
import {
  ChevronLeft, ChevronRight, Play, Pause, Volume2, VolumeX, Share2
} from "lucide-react"

interface Props {
  current:      number
  total:        number
  isRevealing:  boolean
  autoPlay:     boolean
  audioEnabled: boolean
  onPrev:       () => void
  onNext:       () => void
  onToggleAuto: () => void
  onToggleAudio:() => void
  onShare:      () => void
}

export function PlaybackBar({
  current, total, isRevealing, autoPlay, audioEnabled,
  onPrev, onNext, onToggleAuto, onToggleAudio, onShare,
}: Props) {
  const progress = ((current + 1) / total) * 100
  const isLast   = current === total - 1

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 flex flex-col items-center gap-3 pb-8 pt-4 px-4">
      {/* Progress dots */}
      <div className="flex gap-2">
        {Array.from({ length: total }).map((_, i) => (
          <motion.div
            key={i}
            className={cn(
              "rounded-full transition-all duration-300",
              i < current  ? "size-1.5 bg-blood-600/60"   :
              i === current ? "h-1.5 w-4 bg-blood-500"   :
                             "size-1.5 bg-night-700"
            )}
          />
        ))}
      </div>

      {/* Controls row */}
      <div className="flex items-center gap-3">
        {/* Prev */}
        <BarButton onClick={onPrev} disabled={current === 0} title="Previous">
          <ChevronLeft className="size-5" />
        </BarButton>

        {/* Auto-play */}
        <BarButton onClick={onToggleAuto} title={autoPlay ? "Pause auto-play" : "Auto-play"} glow>
          {autoPlay
            ? <Pause  className="size-5 text-blood-400" />
            : <Play   className="size-5" />
          }
        </BarButton>

        {/* Next / Pulse caret when text done */}
        <BarButton
          onClick={onNext}
          disabled={isRevealing}
          title="Next scene"
          glow={!isRevealing && !isLast}
        >
          <AnimatePresence mode="wait">
            {!isRevealing && !isLast ? (
              <motion.span
                key="caret"
                initial={{ opacity: 0, x: -4 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                className="flex items-center text-blood-400"
              >
                <ChevronRight className="size-5" />
              </motion.span>
            ) : (
              <ChevronRight className="size-5 opacity-40" />
            )}
          </AnimatePresence>
        </BarButton>

        <div className="w-px h-5 bg-night-700" />

        {/* Audio */}
        <BarButton onClick={onToggleAudio} title={audioEnabled ? "Mute" : "Unmute"}>
          {audioEnabled
            ? <Volume2 className="size-4 text-night-400" />
            : <VolumeX className="size-4 text-night-600" />
          }
        </BarButton>

        {/* Share */}
        <BarButton onClick={onShare} title="Share story">
          <Share2 className="size-4 text-night-400" />
        </BarButton>
      </div>

      {/* Linear progress bar */}
      <div className="w-full max-w-sm h-px bg-night-800 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-blood-600/50"
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>
    </div>
  )
}

function BarButton({
  onClick, disabled = false, title, glow = false, children,
}: {
  onClick: () => void
  disabled?: boolean
  title: string
  glow?: boolean
  children: React.ReactNode
}) {
  return (
    <motion.button
      title={title}
      onClick={onClick}
      disabled={disabled}
      whileHover={disabled ? {} : { scale: 1.08 }}
      whileTap={disabled ? {} : { scale: 0.92 }}
      className={cn(
        "flex size-10 items-center justify-center rounded-full border transition-all duration-200",
        "bg-night-900/80 backdrop-blur-sm text-night-300",
        glow
          ? "border-blood-700/40 shadow-[0_0_10px_rgba(230,57,70,0.15)]"
          : "border-night-700/60",
        disabled && "opacity-30 pointer-events-none"
      )}
    >
      {children}
    </motion.button>
  )
}
