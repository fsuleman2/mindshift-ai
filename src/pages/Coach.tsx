import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { RotateCcw, Send, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { useAI } from '@/hooks/useAI'
import { useLocalStorage } from '@/hooks/useLocalStorage'
import { useTypingEffect } from '@/hooks/useTypingEffect'
import { StorageService } from '@/services/storageService'
import { generateId } from '@/utils/id'
import { renderMarkdown } from '@/utils/markdown'
import { cn } from '@/utils/cn'
import type { CoachMessage } from '@/types'

const COACH_REPLY_DELAY_MS = 700

function CoachBubble({ message, animate }: { message: CoachMessage; animate: boolean }) {
  const { visible } = useTypingEffect(message.content, animate)
  return (
    <div className="flex items-start gap-2.5">
      <div className="mt-1 flex size-7 shrink-0 items-center justify-center rounded-full bg-primary/15">
        <Sparkles className="size-3.5 text-primary" aria-hidden="true" />
      </div>
      <div className="max-w-[85%] rounded-2xl rounded-tl-sm bg-muted px-4 py-2.5 text-sm leading-relaxed">
        {renderMarkdown(visible)}
      </div>
    </div>
  )
}

function UserBubble({ message }: { message: CoachMessage }) {
  return (
    <div className="flex justify-end">
      <div className="max-w-[85%] rounded-2xl rounded-tr-sm bg-primary px-4 py-2.5 text-sm leading-relaxed text-primary-foreground">
        {message.content}
      </div>
    </div>
  )
}

export default function Coach() {
  const history = useLocalStorage('coachHistory')
  const { getCoachOpening, getCoachReply } = useAI()
  const [input, setInput] = useState('')
  const [thinking, setThinking] = useState(false)
  // Only the message created in this session animates; history renders instantly.
  const [animatedId, setAnimatedId] = useState<string | null>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const openingRequested = useRef(false)

  // Personalized opening whenever the conversation is empty.
  useEffect(() => {
    if (history.length > 0 || openingRequested.current) return
    openingRequested.current = true
    const opening = getCoachOpening()
    const message: CoachMessage = {
      id: generateId(),
      role: 'coach',
      content: opening.text,
      createdAt: new Date().toISOString(),
    }
    StorageService.appendCoachMessage(message)
    setAnimatedId(message.id)
  }, [history.length, getCoachOpening])

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [history, thinking])

  function handleSend() {
    const text = input.trim()
    if (!text || thinking) return

    StorageService.appendCoachMessage({
      id: generateId(),
      role: 'user',
      content: text,
      createdAt: new Date().toISOString(),
    })
    setInput('')
    setThinking(true)

    window.setTimeout(() => {
      const reply = getCoachReply(text)
      const message: CoachMessage = {
        id: generateId(),
        role: 'coach',
        content: reply.text,
        createdAt: new Date().toISOString(),
      }
      StorageService.appendCoachMessage(message)
      setAnimatedId(message.id)
      setThinking(false)
    }, COACH_REPLY_DELAY_MS)
  }

  function handleNewConversation() {
    StorageService.clearCoachHistory()
    openingRequested.current = false
    setAnimatedId(null)
  }

  return (
    <div className="mx-auto flex h-[calc(100svh-3.5rem)] max-w-2xl flex-col px-4">
      <div className="flex items-center justify-between py-4">
        <div>
          <h1 className="text-lg font-heading font-semibold">Your Coach</h1>
          <p className="text-xs text-muted-foreground">Private, on-device, always here</p>
        </div>
        <Button variant="ghost" size="sm" onClick={handleNewConversation} className="gap-1.5">
          <RotateCcw className="size-3.5" aria-hidden="true" />
          New chat
        </Button>
      </div>

      <div
        ref={scrollRef}
        className="flex-1 space-y-4 overflow-y-auto pb-4"
        role="log"
        aria-label="Conversation with your coach"
        aria-live="polite"
      >
        {history.map((message) =>
          message.role === 'coach' ? (
            <CoachBubble key={message.id} message={message} animate={message.id === animatedId} />
          ) : (
            <UserBubble key={message.id} message={message} />
          ),
        )}
        {thinking && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-2.5"
            aria-label="Coach is typing"
          >
            <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary/15">
              <Sparkles className="size-3.5 text-primary" aria-hidden="true" />
            </div>
            <div className="flex gap-1 rounded-2xl bg-muted px-4 py-3">
              {[0, 1, 2].map((i) => (
                <motion.span
                  key={i}
                  className="size-1.5 rounded-full bg-muted-foreground"
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                />
              ))}
            </div>
          </motion.div>
        )}
      </div>

      {/* Bottom margin keeps the composer clear of the floating Emergency button until the viewport is wide enough that they can't overlap. */}
      <div className="border-t border-border py-3 mb-20 xl:mb-0">
        <div className="flex items-end gap-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                handleSend()
              }
            }}
            placeholder="Tell your coach what's going on..."
            aria-label="Message your coach"
            rows={1}
            className={cn('min-h-10 flex-1 resize-none')}
          />
          <Button
            onClick={handleSend}
            disabled={!input.trim() || thinking}
            size="icon"
            aria-label="Send message"
          >
            <Send className="size-4" aria-hidden="true" />
          </Button>
        </div>
      </div>
    </div>
  )
}
