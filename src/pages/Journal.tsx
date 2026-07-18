import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { BookOpen, Lightbulb, ListChecks, PenLine, Sparkles } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { useLocalStorage } from '@/hooks/useLocalStorage'
import { JournalAnalyzer } from '@/services/journalAnalyzer'
import { StorageService } from '@/services/storageService'
import { MOOD_EMOJI, MOOD_LABEL } from '@/types'
import { formatRelativeDate } from '@/utils/date'
import { generateId } from '@/utils/id'

const MIN_ENTRY_LENGTH = 10

export default function Journal() {
  const entries = useLocalStorage('journal')
  const profile = useLocalStorage('profile')
  const [text, setText] = useState('')
  const [saving, setSaving] = useState(false)

  const canSave = text.trim().length >= MIN_ENTRY_LENGTH

  function handleSave() {
    const trimmed = text.trim()
    if (trimmed.length < MIN_ENTRY_LENGTH) return
    setSaving(true)

    const analysis = JournalAnalyzer.analyze(trimmed, {
      habitId: profile?.habit,
      customHabitLabel: profile?.customHabitLabel,
      primaryTrigger: profile?.primaryTrigger,
    })

    StorageService.addJournalEntry({
      id: generateId(),
      createdAt: new Date().toISOString(),
      text: trimmed,
      analysis,
    })
    setText('')
    setSaving(false)
    toast.success('Entry saved and analyzed.')
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <div className="mb-6">
        <h1 className="text-2xl font-heading font-semibold sm:text-3xl">Journal</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Write freely — your coach reads the patterns, not the prose.
        </p>
      </div>

      <Card>
        <CardContent className="space-y-3 pt-6">
          <Textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={5}
            placeholder="What happened today? What did you feel right before the urge? What helped, even a little?"
            aria-label="Journal entry"
          />
          <div className="flex items-center justify-between">
            <p className="text-xs text-muted-foreground">
              {canSave ? 'Saved entries are analyzed for mood, triggers, and lessons.' : `At least ${MIN_ENTRY_LENGTH} characters to save.`}
            </p>
            <Button onClick={handleSave} disabled={!canSave || saving} className="gap-2">
              <PenLine className="size-4" aria-hidden="true" />
              Save entry
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="mt-8">
        <h2 className="mb-4 flex items-center gap-2 text-lg font-heading font-semibold">
          <BookOpen className="size-4 text-muted-foreground" aria-hidden="true" />
          Past entries
        </h2>

        {entries.length === 0 ? (
          <Card>
            <CardContent className="py-10 text-center text-sm text-muted-foreground">
              Nothing here yet. Your first entry is one honest sentence away.
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            <AnimatePresence initial={false}>
              {entries.map((entry) => (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25 }}
                >
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle className="text-sm font-medium text-muted-foreground">
                        {formatRelativeDate(entry.createdAt.slice(0, 10))}
                      </CardTitle>
                      <Badge variant="secondary" className="gap-1">
                        {MOOD_EMOJI[entry.analysis.mood]} {MOOD_LABEL[entry.analysis.mood]}
                      </Badge>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="whitespace-pre-wrap text-sm leading-relaxed">{entry.text}</p>
                      <div className="space-y-2.5 rounded-lg bg-muted/60 p-3.5 text-sm">
                        <p className="flex items-start gap-2">
                          <Sparkles className="mt-0.5 size-3.5 shrink-0 text-primary" aria-hidden="true" />
                          <span>
                            <span className="font-medium">Trigger:</span>{' '}
                            <span className="capitalize">{entry.analysis.trigger}</span>
                          </span>
                        </p>
                        <p className="flex items-start gap-2">
                          <Lightbulb className="mt-0.5 size-3.5 shrink-0 text-warning" aria-hidden="true" />
                          <span>
                            <span className="font-medium">Lesson:</span> {entry.analysis.lesson}
                          </span>
                        </p>
                        <p className="flex items-start gap-2">
                          <ListChecks className="mt-0.5 size-3.5 shrink-0 text-success" aria-hidden="true" />
                          <span>
                            <span className="font-medium">Action plan:</span> {entry.analysis.actionPlan}
                          </span>
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  )
}
