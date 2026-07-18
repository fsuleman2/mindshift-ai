import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Brain, CheckCircle2, Loader2 } from 'lucide-react'

const ANALYSIS_STEPS = [
  'Reading your responses',
  'Mapping your trigger patterns',
  'Estimating recovery difficulty',
  'Building your personalized blueprint',
]

const STEP_INTERVAL_MS = 700

interface AiAnalysisProps {
  onComplete: () => void
}

/** Transient "AI is analyzing" screen shown between assessment submit and the blueprint. */
export function AiAnalysis({ onComplete }: AiAnalysisProps) {
  const [activeStep, setActiveStep] = useState(0)

  useEffect(() => {
    if (activeStep >= ANALYSIS_STEPS.length) {
      const done = window.setTimeout(onComplete, 500)
      return () => window.clearTimeout(done)
    }
    const timer = window.setTimeout(() => setActiveStep((s) => s + 1), STEP_INTERVAL_MS)
    return () => window.clearTimeout(timer)
  }, [activeStep, onComplete])

  return (
    <div className="mx-auto flex min-h-[70svh] max-w-md flex-col items-center justify-center px-4 text-center">
      <motion.div
        animate={{ scale: [1, 1.08, 1], rotate: [0, 3, -3, 0] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
        className="mb-8 flex size-16 items-center justify-center rounded-2xl bg-primary/10 text-primary"
      >
        <Brain className="size-8" aria-hidden="true" />
      </motion.div>
      <h1 className="text-2xl font-heading font-semibold">Analyzing your profile</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Your coach is building a recovery plan tailored to you.
      </p>

      <ul className="mt-8 w-full space-y-3 text-left" aria-live="polite">
        {ANALYSIS_STEPS.map((step, index) => {
          const isDone = index < activeStep
          const isActive = index === activeStep
          return (
            <motion.li
              key={step}
              initial={{ opacity: 0.4 }}
              animate={{ opacity: isDone || isActive ? 1 : 0.4 }}
              className="flex items-center gap-3 text-sm"
            >
              {isDone ? (
                <CheckCircle2 className="size-5 shrink-0 text-success" aria-hidden="true" />
              ) : isActive ? (
                <Loader2 className="size-5 shrink-0 animate-spin text-primary" aria-hidden="true" />
              ) : (
                <div className="size-5 shrink-0 rounded-full border border-border" aria-hidden="true" />
              )}
              <span className={isDone || isActive ? 'text-foreground' : 'text-muted-foreground'}>{step}</span>
            </motion.li>
          )
        })}
      </ul>
    </div>
  )
}
