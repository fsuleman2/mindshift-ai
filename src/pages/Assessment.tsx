import { useState } from 'react'
import { Navigate, useNavigate, useSearchParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowLeft, ArrowRight, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { ASSESSMENT_STEPS } from '@/components/features/assessment/steps'
import { AiAnalysis } from '@/components/features/AiAnalysis'
import { assessmentFormSchema, type AssessmentFormValues } from '@/constants/assessmentSchema'
import { HABITS } from '@/constants/habits'
import { RecoveryPlanner } from '@/services/recoveryPlanner'
import { StorageService } from '@/services/storageService'
import type { AssessmentAnswers, HabitId } from '@/types'

const VALID_HABIT_IDS = new Set(Object.keys(HABITS))

export default function Assessment() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const habitParam = searchParams.get('habit') ?? ''
  const habitId = VALID_HABIT_IDS.has(habitParam) ? (habitParam as HabitId) : null
  const customHabitLabel = searchParams.get('label')?.trim() || undefined
  const [stepIndex, setStepIndex] = useState(0)
  const [analyzing, setAnalyzing] = useState(false)

  const {
    register,
    control,
    watch,
    setValue,
    trigger,
    getValues,
    formState: { errors },
  } = useForm<AssessmentFormValues>({
    resolver: zodResolver(assessmentFormSchema),
    mode: 'onTouched',
    defaultValues: {
      habit: habitId ?? '',
      customHabitLabel,
      frequencyPerDay: 5,
      timeOfDay: [],
      primaryTrigger: '',
      stressLevel: 5,
      sleepQuality: 5,
      motivationReason: '',
      triedBefore: false,
      whatWorkedBefore: '',
      biggestFear: '',
      supportSystem: 'some',
      motivationLevel: 7,
    },
  })

  // Direct URL access without picking a habit first — send them back.
  if (!habitId) {
    return <Navigate to="/start" replace />
  }

  const habitLabel = habitId === 'custom' && customHabitLabel ? customHabitLabel : HABITS[habitId].label

  const step = ASSESSMENT_STEPS[stepIndex]
  const isLastStep = stepIndex === ASSESSMENT_STEPS.length - 1
  const progressPercent = Math.round((stepIndex / ASSESSMENT_STEPS.length) * 100)

  async function handleNext() {
    const valid = await trigger(step.fields)
    if (!valid) return

    if (!isLastStep) {
      setStepIndex((i) => i + 1)
      return
    }

    // Final step complete: persist answers, run "AI analysis", then show blueprint.
    const values = getValues()
    const answers: AssessmentAnswers = {
      habit: values.habit as HabitId,
      customHabitLabel: values.customHabitLabel || undefined,
      frequencyPerDay: values.frequencyPerDay,
      timeOfDay: values.timeOfDay,
      primaryTrigger: values.primaryTrigger.trim(),
      stressLevel: values.stressLevel,
      sleepQuality: values.sleepQuality,
      motivationReason: values.motivationReason.trim(),
      triedBefore: values.triedBefore,
      whatWorkedBefore: values.whatWorkedBefore?.trim() || undefined,
      biggestFear: values.biggestFear.trim(),
      supportSystem: values.supportSystem,
      motivationLevel: values.motivationLevel,
    }

    StorageService.setAssessment(answers)
    const profile = RecoveryPlanner.buildProfile(answers)
    StorageService.setProfile(profile)
    StorageService.setBlueprint(RecoveryPlanner.buildBlueprint(profile, answers))
    setAnalyzing(true)
  }

  function handleBack() {
    if (stepIndex === 0) {
      navigate('/start')
      return
    }
    setStepIndex((i) => i - 1)
  }

  if (analyzing) {
    return <AiAnalysis onComplete={() => navigate('/blueprint', { replace: true })} />
  }

  const stepErrors = step.fields
    .map((field) => errors[field as keyof typeof errors]?.message)
    .filter((m): m is string => typeof m === 'string')

  return (
    <div className="mx-auto flex min-h-[80svh] max-w-lg flex-col px-4 py-10">
      <div className="mb-8 space-y-3">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <Sparkles className="size-4 text-primary" aria-hidden="true" />
            {habitLabel}
          </span>
          <span>
            {stepIndex + 1} of {ASSESSMENT_STEPS.length}
          </span>
        </div>
        <Progress value={progressPercent} aria-label={`Assessment progress: ${progressPercent}%`} />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={step.id}
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -24 }}
          transition={{ duration: 0.25 }}
          className="flex-1"
        >
          <h1 className="text-2xl font-heading font-semibold">{step.title}</h1>
          {step.subtitle && <p className="mt-2 text-sm text-muted-foreground">{step.subtitle}</p>}
          <div className="mt-8">{step.render({ register, control, watch, setValue, habitLabel })}</div>
          {stepErrors.length > 0 && (
            <div role="alert" className="mt-4 space-y-1 text-sm text-destructive">
              {stepErrors.map((message) => (
                <p key={message}>{message}</p>
              ))}
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      <div className="mt-10 flex items-center justify-between">
        <Button variant="ghost" onClick={handleBack} className="gap-2">
          <ArrowLeft className="size-4" aria-hidden="true" />
          Back
        </Button>
        <Button onClick={handleNext} className="gap-2">
          {isLastStep ? 'Finish' : 'Next'}
          <ArrowRight className="size-4" aria-hidden="true" />
        </Button>
      </div>
    </div>
  )
}
