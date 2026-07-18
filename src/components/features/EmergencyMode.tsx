import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { AlertTriangle, MessageCircle, Wind } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { EMERGENCY_RESPONSE_DELAY_MS, EMERGENCY_TRIGGERS } from '@/constants/emergency'
import { ICONS } from '@/constants/icons'
import { useAI } from '@/hooks/useAI'
import { StorageService } from '@/services/storageService'
import { generateId } from '@/utils/id'
import { cn } from '@/utils/cn'
import type { EmergencyTrigger } from '@/types'

type Step = 'select' | 'generating' | 'response'

export function EmergencyMode() {
  const [open, setOpen] = useState(false)
  const [step, setStep] = useState<Step>('select')
  const [trigger, setTrigger] = useState<EmergencyTrigger | null>(null)
  const [note, setNote] = useState('')
  const [response, setResponse] = useState('')
  const { getEmergencyResponse } = useAI()
  const navigate = useNavigate()

  function reset() {
    setStep('select')
    setTrigger(null)
    setNote('')
    setResponse('')
  }

  function handleOpenChange(next: boolean) {
    setOpen(next)
    if (!next) reset()
  }

  function handleSelectTrigger(id: EmergencyTrigger) {
    setTrigger(id)
    setStep('generating')

    window.setTimeout(() => {
      const result = getEmergencyResponse(id, note.trim() || undefined)
      setResponse(result.text)
      setStep('response')
      StorageService.addEmergencyEvent({
        id: generateId(),
        createdAt: new Date().toISOString(),
        trigger: id,
        note: note.trim() || undefined,
        resolved: true,
      })
    }, EMERGENCY_RESPONSE_DELAY_MS)
  }

  function handleTalkToCoach() {
    handleOpenChange(false)
    navigate('/coach')
  }

  return (
    <>
      <motion.button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="I'm about to relapse — open emergency support"
        className="fixed bottom-6 right-4 z-40 flex items-center gap-2 rounded-full bg-destructive px-4 py-3.5 text-destructive-foreground shadow-lg sm:right-6"
        animate={{ scale: [1, 1.04, 1] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
        whileTap={{ scale: 0.96 }}
      >
        <AlertTriangle className="size-5 shrink-0" aria-hidden="true" />
        <span className="hidden text-sm font-semibold sm:inline">I'm About To Relapse</span>
      </motion.button>

      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="sm:max-w-md">
          {step === 'select' && (
            <>
              <DialogHeader>
                <DialogTitle>What's going on right now?</DialogTitle>
                <DialogDescription>
                  Pick what's closest to how you're feeling — this helps tailor what comes next.
                </DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-3 gap-2" role="group" aria-label="Select what's triggering you">
                {EMERGENCY_TRIGGERS.map((option) => {
                  const Icon = ICONS[option.icon]
                  return (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => handleSelectTrigger(option.id)}
                      className={cn(
                        'flex flex-col items-center gap-1.5 rounded-lg border border-border p-3 text-sm transition-colors',
                        'hover:border-primary hover:bg-accent focus-visible:outline-2 focus-visible:outline-primary',
                      )}
                    >
                      <Icon className="size-5 text-primary" aria-hidden="true" />
                      {option.label}
                    </button>
                  )
                })}
              </div>
              <Textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Anything else you want to note? (optional)"
                aria-label="Optional additional context"
                rows={2}
              />
            </>
          )}

          <AnimatePresence mode="wait">
            {step === 'generating' && (
              <motion.div
                key="generating"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center gap-3 py-8 text-center"
              >
                <motion.div
                  animate={{ scale: [1, 1.15, 1] }}
                  transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <Wind className="size-8 text-primary" aria-hidden="true" />
                </motion.div>
                <p className="text-sm text-muted-foreground">Getting something for you...</p>
              </motion.div>
            )}

            {step === 'response' && (
              <motion.div
                key="response"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col gap-4"
              >
                <DialogHeader>
                  <DialogTitle>You've got this</DialogTitle>
                  {trigger && (
                    <DialogDescription>
                      For: {EMERGENCY_TRIGGERS.find((t) => t.id === trigger)?.label}
                    </DialogDescription>
                  )}
                </DialogHeader>
                <p className="text-sm leading-relaxed">{response}</p>
                <div className="flex flex-col gap-2 sm:flex-row">
                  <Button className="flex-1" onClick={() => handleOpenChange(false)}>
                    I'm okay now
                  </Button>
                  <Button variant="outline" className="flex-1 gap-2" onClick={handleTalkToCoach}>
                    <MessageCircle className="size-4" aria-hidden="true" />
                    Talk to my coach
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </DialogContent>
      </Dialog>
    </>
  )
}
