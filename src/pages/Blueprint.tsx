import { Link, Navigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, CalendarDays, Clock, Compass, Flame, Heart, Target } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useLocalStorage } from '@/hooks/useLocalStorage'
import { HABITS } from '@/constants/habits'

const DIFFICULTY_LABEL: Record<string, string> = {
  easy: 'Gentle climb',
  moderate: 'Steady effort',
  hard: 'Serious challenge',
  'very-hard': 'Hardest — but doable',
}

const sectionMotion = (index: number) => ({
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.35, delay: index * 0.08 },
})

export default function Blueprint() {
  const blueprint = useLocalStorage('recoveryBlueprint')
  const profile = useLocalStorage('profile')

  if (!blueprint || !profile) {
    return <Navigate to="/start" replace />
  }

  const habitLabel =
    profile.habit === 'custom' && profile.customHabitLabel
      ? profile.customHabitLabel
      : HABITS[profile.habit].label

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <motion.div {...sectionMotion(0)} className="mb-8 text-center">
        <Badge variant="secondary" className="mb-3">
          {habitLabel} · {DIFFICULTY_LABEL[profile.estimatedDifficulty]}
        </Badge>
        <h1 className="text-3xl font-heading font-semibold sm:text-4xl">Your Recovery Blueprint</h1>
        <p className="mt-3 text-muted-foreground">
          Built from your answers — this is your personal starting map, not a rulebook.
        </p>
      </motion.div>

      <div className="space-y-4">
        <motion.div {...sectionMotion(1)}>
          <Card>
            <CardHeader className="flex flex-row items-center gap-3">
              <Flame className="size-5 text-danger" aria-hidden="true" />
              <CardTitle>Biggest Trigger</CardTitle>
            </CardHeader>
            <CardContent className="capitalize">{blueprint.biggestTrigger}</CardContent>
          </Card>
        </motion.div>

        <motion.div {...sectionMotion(2)}>
          <Card>
            <CardHeader className="flex flex-row items-center gap-3">
              <Compass className="size-5 text-primary" aria-hidden="true" />
              <CardTitle>Best Recovery Strategy</CardTitle>
            </CardHeader>
            <CardContent>{blueprint.bestStrategy}</CardContent>
          </Card>
        </motion.div>

        <motion.div {...sectionMotion(3)}>
          <Card>
            <CardHeader className="flex flex-row items-center gap-3">
              <CalendarDays className="size-5 text-secondary" aria-hidden="true" />
              <CardTitle>Daily Routine</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2.5">
                {blueprint.dailyRoutine.map((item) => (
                  <li key={item} className="flex gap-2.5 text-sm">
                    <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary" aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div {...sectionMotion(4)}>
          <Card>
            <CardHeader className="flex flex-row items-center gap-3">
              <Target className="size-5 text-success" aria-hidden="true" />
              <CardTitle>This Week's Goal</CardTitle>
            </CardHeader>
            <CardContent>{blueprint.weeklyGoal}</CardContent>
          </Card>
        </motion.div>

        <motion.div {...sectionMotion(5)}>
          <Card>
            <CardHeader className="flex flex-row items-center gap-3">
              <Clock className="size-5 text-warning" aria-hidden="true" />
              <CardTitle>Estimated Timeline</CardTitle>
            </CardHeader>
            <CardContent>{blueprint.estimatedTimeline}</CardContent>
          </Card>
        </motion.div>

        <motion.div {...sectionMotion(6)}>
          <Card className="border-primary/40 bg-primary/5">
            <CardHeader className="flex flex-row items-center gap-3">
              <Heart className="size-5 text-primary" aria-hidden="true" />
              <CardTitle>Your Why</CardTitle>
            </CardHeader>
            <CardContent className="italic">{blueprint.personalMotivation}</CardContent>
          </Card>
        </motion.div>
      </div>

      <motion.div {...sectionMotion(7)} className="mt-10 text-center">
        <Button asChild size="lg" className="gap-2">
          <Link to="/dashboard">
            Go to my Dashboard
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </Button>
      </motion.div>
    </div>
  )
}
