import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { CheckCircle2 } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { Textarea } from '@/components/ui/textarea'
import { useLocalStorage } from '@/hooks/useLocalStorage'
import { StorageService } from '@/services/storageService'
import { MOOD_EMOJI, MOOD_LABEL, type Mood } from '@/types'
import { generateId } from '@/utils/id'
import { todayISO } from '@/utils/date'
import { cn } from '@/utils/cn'

const MOODS = Object.keys(MOOD_EMOJI) as Mood[]

export default function CheckIn() {
  const navigate = useNavigate()
  const checkIns = useLocalStorage('dailyCheckins')
  const alreadyCheckedIn = checkIns.some((c) => c.date === todayISO())

  const [mood, setMood] = useState<Mood | null>(null)
  const [feeling, setFeeling] = useState('')
  const [challenge, setChallenge] = useState('')
  const [sleepQuality, setSleepQuality] = useState(5)
  const [stayedClean, setStayedClean] = useState<boolean | null>(null)

  const canSubmit = mood !== null && stayedClean !== null

  function handleSubmit() {
    if (mood === null || stayedClean === null) return

    StorageService.addCheckIn({
      id: generateId(),
      date: todayISO(),
      mood,
      feeling: feeling.trim(),
      biggestChallenge: challenge.trim(),
      sleepQuality,
      stayedClean,
      createdAt: new Date().toISOString(),
    })
    toast.success('Check-in saved. See you tomorrow.')
    navigate('/dashboard')
  }

  if (alreadyCheckedIn) {
    return (
      <div className="mx-auto flex min-h-[60svh] max-w-md flex-col items-center justify-center gap-4 px-4 text-center">
        <CheckCircle2 className="size-10 text-success" aria-hidden="true" />
        <h1 className="text-2xl font-heading font-semibold">You already checked in today</h1>
        <p className="text-sm text-muted-foreground">
          One check-in per day keeps the signal clean. Come back tomorrow — or talk to your coach if
          something's on your mind.
        </p>
        <div className="flex gap-3">
          <Button onClick={() => navigate('/dashboard')}>Back to dashboard</Button>
          <Button variant="outline" onClick={() => navigate('/coach')}>
            Talk to coach
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-10">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        <h1 className="text-2xl font-heading font-semibold sm:text-3xl">Daily Check-in</h1>
        <p className="mt-2 text-sm text-muted-foreground">Under a minute — it keeps your coach accurate.</p>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-base">How are you feeling today?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between" role="radiogroup" aria-label="Select your mood">
              {MOODS.map((m) => (
                <button
                  key={m}
                  type="button"
                  role="radio"
                  aria-checked={mood === m}
                  aria-label={MOOD_LABEL[m]}
                  onClick={() => setMood(m)}
                  className={cn(
                    'flex flex-col items-center gap-1.5 rounded-lg px-3 py-2 transition-all',
                    mood === m ? 'scale-110 bg-primary/10 ring-2 ring-primary' : 'hover:bg-accent',
                  )}
                >
                  <span className="text-2xl" aria-hidden="true">
                    {MOOD_EMOJI[m]}
                  </span>
                  <span className="text-xs text-muted-foreground">{MOOD_LABEL[m]}</span>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="mt-4">
          <CardHeader>
            <CardTitle className="text-base">Did you stay clean today?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-2" role="radiogroup" aria-label="Did you stay clean today?">
              {([
                { value: true, label: 'Yes, stayed clean' },
                { value: false, label: 'I slipped today' },
              ] as const).map((option) => (
                <button
                  key={String(option.value)}
                  type="button"
                  role="radio"
                  aria-checked={stayedClean === option.value}
                  onClick={() => setStayedClean(option.value)}
                  className={cn(
                    'rounded-lg border p-3.5 text-sm font-medium transition-colors',
                    stayedClean === option.value
                      ? option.value
                        ? 'border-success bg-success/10 text-success'
                        : 'border-warning bg-warning/10 text-warning'
                      : 'border-border hover:border-primary/50',
                  )}
                >
                  {option.label}
                </button>
              ))}
            </div>
            {stayedClean === false && (
              <p className="mt-3 text-xs text-muted-foreground">
                A slip is a data point, not a verdict. Logging it honestly is what makes recovery real.
              </p>
            )}
          </CardContent>
        </Card>

        <Card className="mt-4">
          <CardHeader>
            <CardTitle className="text-base">How did you sleep last night?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="text-center text-2xl font-heading font-semibold text-primary" aria-hidden="true">
              {sleepQuality}
            </div>
            <Slider
              min={0}
              max={10}
              step={1}
              value={[sleepQuality]}
              onValueChange={([v]) => setSleepQuality(v)}
              aria-label="Sleep quality from 0 to 10"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Terribly</span>
              <span>Like a rock</span>
            </div>
          </CardContent>
        </Card>

        <Card className="mt-4">
          <CardContent className="space-y-4 pt-6">
            <div className="space-y-2">
              <Label htmlFor="feeling">Anything you want to say about today? (optional)</Label>
              <Textarea
                id="feeling"
                rows={2}
                value={feeling}
                onChange={(e) => setFeeling(e.target.value)}
                placeholder="A sentence or two is plenty"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="challenge">Biggest challenge today? (optional)</Label>
              <Textarea
                id="challenge"
                rows={2}
                value={challenge}
                onChange={(e) => setChallenge(e.target.value)}
                placeholder="e.g. boredom after dinner, a stressful call"
              />
            </div>
          </CardContent>
        </Card>

        <Button onClick={handleSubmit} disabled={!canSubmit} size="lg" className="mt-6 w-full">
          Save check-in
        </Button>
        {!canSubmit && (
          <p className="mt-2 text-center text-xs text-muted-foreground">
            Pick a mood and answer "did you stay clean" to save.
          </p>
        )}
      </motion.div>
    </div>
  )
}
