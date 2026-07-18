import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ArrowRight,
  BookOpen,
  CalendarCheck,
  Flame,
  Lightbulb,
  Route,
  ShieldCheck,
  Target,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { RiskBadge } from '@/components/features/RiskBadge'
import { useAI } from '@/hooks/useAI'
import { useBehaviorState } from '@/hooks/useBehaviorState'
import { useLocalStorage } from '@/hooks/useLocalStorage'
import { useRecoveryScore } from '@/hooks/useRecoveryScore'
import { useRiskScore } from '@/hooks/useRiskScore'
import { HABITS } from '@/constants/habits'
import { MOOD_EMOJI, MOOD_LABEL } from '@/types'
import { daysAgoISO, formatRelativeDate, todayISO } from '@/utils/date'

const cardMotion = (index: number) => ({
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.3, delay: index * 0.05 },
})

/** Last 7 days, oldest first, with check-in status for the weekly progress strip. */
function useWeeklyProgress() {
  const checkIns = useLocalStorage('dailyCheckins')
  const byDate = new Map(checkIns.map((c) => [c.date, c]))

  return Array.from({ length: 7 }, (_, i) => {
    const date = daysAgoISO(6 - i)
    const checkIn = byDate.get(date)
    return {
      date,
      dayLabel: new Date(date).toLocaleDateString(undefined, { weekday: 'narrow' }),
      status: checkIn ? (checkIn.stayedClean ? 'clean' : 'slipped') : 'missed',
    } as const
  })
}

export default function Dashboard() {
  const profile = useLocalStorage('profile')
  const blueprint = useLocalStorage('recoveryBlueprint')
  const journal = useLocalStorage('journal')
  const checkIns = useLocalStorage('dailyCheckins')
  const behavior = useBehaviorState()
  const risk = useRiskScore()
  const recoveryScore = useRecoveryScore()
  const { getDailyTip } = useAI()
  const week = useWeeklyProgress()

  const habitLabel =
    profile && (profile.habit === 'custom' && profile.customHabitLabel
      ? profile.customHabitLabel
      : HABITS[profile.habit].label)

  const todayCheckIn = checkIns.find((c) => c.date === todayISO()) ?? null
  const latestJournal = journal[0] ?? null
  const dailyTip = getDailyTip().text

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm text-muted-foreground">Working on: {habitLabel}</p>
          <h1 className="text-2xl font-heading font-semibold sm:text-3xl">Your Dashboard</h1>
        </div>
        {!todayCheckIn && (
          <Button asChild className="gap-2">
            <Link to="/check-in">
              <CalendarCheck className="size-4" aria-hidden="true" />
              Daily check-in
            </Link>
          </Button>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <motion.div {...cardMotion(0)}>
          <Card className="h-full">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Recovery Score</CardTitle>
              <ShieldCheck className="size-4 text-primary" aria-hidden="true" />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-heading font-semibold">{recoveryScore}</p>
              <Progress value={recoveryScore} className="mt-3" aria-label={`Recovery score ${recoveryScore} out of 100`} />
            </CardContent>
          </Card>
        </motion.div>

        <motion.div {...cardMotion(1)}>
          <Card className="h-full">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Current Streak</CardTitle>
              <Flame className="size-4 text-warning" aria-hidden="true" />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-heading font-semibold">
                {behavior.streak}
                <span className="ml-1 text-base font-normal text-muted-foreground">
                  day{behavior.streak === 1 ? '' : 's'}
                </span>
              </p>
              <p className="mt-2 text-xs text-muted-foreground">
                Longest: {behavior.longestStreak} day{behavior.longestStreak === 1 ? '' : 's'}
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div {...cardMotion(2)}>
          <Card className="h-full">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Today's Mood</CardTitle>
            </CardHeader>
            <CardContent>
              {todayCheckIn ? (
                <p className="text-3xl" aria-label={`Mood: ${MOOD_LABEL[todayCheckIn.mood]}`}>
                  {MOOD_EMOJI[todayCheckIn.mood]}
                  <span className="ml-2 text-base font-medium">{MOOD_LABEL[todayCheckIn.mood]}</span>
                </p>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Not logged yet —{' '}
                  <Link to="/check-in" className="font-medium text-primary underline-offset-2 hover:underline">
                    check in now
                  </Link>
                </p>
              )}
            </CardContent>
          </Card>
        </motion.div>

        <motion.div {...cardMotion(3)}>
          <Card className="h-full">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Risk Right Now</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-heading font-semibold">{risk.score}</p>
              <RiskBadge level={risk.level} className="mt-2" />
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <motion.div {...cardMotion(4)} className="lg:col-span-2">
          <Card className="h-full border-primary/30 bg-primary/5">
            <CardHeader className="flex flex-row items-center gap-2 pb-2">
              <Lightbulb className="size-4 text-primary" aria-hidden="true" />
              <CardTitle className="text-sm font-medium">Today's AI Tip</CardTitle>
            </CardHeader>
            <CardContent className="text-sm leading-relaxed">{dailyTip}</CardContent>
          </Card>
        </motion.div>

        <motion.div {...cardMotion(5)}>
          <Card className="h-full">
            <CardHeader className="flex flex-row items-center gap-2 pb-2">
              <Target className="size-4 text-success" aria-hidden="true" />
              <CardTitle className="text-sm font-medium">Today's Goal</CardTitle>
            </CardHeader>
            <CardContent className="text-sm leading-relaxed">
              {blueprint?.weeklyGoal ?? 'Complete your assessment to get a personal goal.'}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <motion.div {...cardMotion(6)}>
          <Card className="h-full">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">This Week</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between" role="img" aria-label="Check-in history for the last 7 days">
                {week.map((day) => (
                  <div key={day.date} className="flex flex-col items-center gap-1.5">
                    <span
                      className={
                        day.status === 'clean'
                          ? 'size-6 rounded-full bg-success'
                          : day.status === 'slipped'
                            ? 'size-6 rounded-full bg-danger/70'
                            : 'size-6 rounded-full border-2 border-dashed border-border'
                      }
                      title={`${day.date}: ${day.status}`}
                    />
                    <span className="text-xs text-muted-foreground">{day.dayLabel}</span>
                  </div>
                ))}
              </div>
              <p className="mt-3 text-xs text-muted-foreground">
                {week.filter((d) => d.status === 'clean').length} clean day
                {week.filter((d) => d.status === 'clean').length === 1 ? '' : 's'} this week
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div {...cardMotion(7)}>
          <Card className="h-full">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="text-sm font-medium">Recent Journal</CardTitle>
              <BookOpen className="size-4 text-muted-foreground" aria-hidden="true" />
            </CardHeader>
            <CardContent>
              {latestJournal ? (
                <div className="space-y-2">
                  <p className="line-clamp-3 text-sm text-muted-foreground">{latestJournal.text}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatRelativeDate(latestJournal.createdAt.slice(0, 10))} · mood{' '}
                    {MOOD_EMOJI[latestJournal.analysis.mood]}
                  </p>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  No entries yet —{' '}
                  <Link to="/journal" className="font-medium text-primary underline-offset-2 hover:underline">
                    write your first one
                  </Link>
                </p>
              )}
            </CardContent>
          </Card>
        </motion.div>

        <motion.div {...cardMotion(8)}>
          <Card className="h-full">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="text-sm font-medium">Recovery Timeline</CardTitle>
              <Route className="size-4 text-muted-foreground" aria-hidden="true" />
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p>
                <span className="text-muted-foreground">Started:</span>{' '}
                {profile ? formatRelativeDate(profile.createdAt.slice(0, 10)) : '—'}
              </p>
              <p>
                <span className="text-muted-foreground">Estimate:</span>{' '}
                {blueprint?.estimatedTimeline ?? '—'}
              </p>
              <Button asChild variant="ghost" size="sm" className="mt-1 -ml-2 gap-1.5 text-primary">
                <Link to="/progress">
                  View full progress
                  <ArrowRight className="size-3.5" aria-hidden="true" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
