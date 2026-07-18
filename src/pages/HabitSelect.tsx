import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { HABIT_LIST } from '@/constants/habits'
import { ICONS } from '@/constants/icons'
import type { HabitId } from '@/types'

export default function HabitSelect() {
  const navigate = useNavigate()
  const [customDialogOpen, setCustomDialogOpen] = useState(false)
  const [customLabel, setCustomLabel] = useState('')

  function handleSelect(habitId: HabitId) {
    if (habitId === 'custom') {
      setCustomDialogOpen(true)
      return
    }
    navigate(`/assessment?habit=${habitId}`)
  }

  function handleCustomSubmit() {
    const label = customLabel.trim()
    if (!label) return
    navigate(`/assessment?habit=custom&label=${encodeURIComponent(label)}`)
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-14">
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-heading font-semibold sm:text-4xl">What are you working on?</h1>
        <p className="mt-3 text-muted-foreground">
          Pick the habit you want to change. Your coach will tailor everything around it.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
        {HABIT_LIST.map((habit, index) => {
          const Icon = ICONS[habit.icon]
          return (
            <motion.button
              key={habit.id}
              type="button"
              onClick={() => handleSelect(habit.id)}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.03 }}
              className="group flex flex-col items-center gap-2 rounded-xl border border-border bg-card p-5 text-center transition-colors hover:border-primary hover:bg-accent focus-visible:outline-2 focus-visible:outline-primary"
            >
              <div className="flex size-11 items-center justify-center rounded-full bg-primary/10 text-primary transition-transform group-hover:scale-105">
                <Icon className="size-5" aria-hidden="true" />
              </div>
              <span className="text-sm font-medium">{habit.label}</span>
              <span className="text-xs text-muted-foreground">{habit.tagline}</span>
            </motion.button>
          )
        })}
      </div>

      <Dialog open={customDialogOpen} onOpenChange={setCustomDialogOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Name your habit</DialogTitle>
            <DialogDescription>What's the habit you want to break or change?</DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-2">
            <Label htmlFor="custom-habit">Habit</Label>
            <Input
              id="custom-habit"
              value={customLabel}
              onChange={(e) => setCustomLabel(e.target.value)}
              placeholder="e.g. Late-night snacking"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleCustomSubmit()
              }}
            />
          </div>
          <DialogFooter>
            <Button onClick={handleCustomSubmit} disabled={!customLabel.trim()} className="gap-2">
              Continue
              <ArrowRight className="size-4" aria-hidden="true" />
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
