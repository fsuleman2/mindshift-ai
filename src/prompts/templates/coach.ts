import type { TimeOfDay } from '@/utils/date'

export const GREETING_BY_TIME: Record<TimeOfDay, string[]> = {
  morning: ['Good morning.', 'Morning.', 'Hey, good morning.'],
  afternoon: ['Good afternoon.', 'Hey there.', 'Hope your day is going okay.'],
  evening: ['Good evening.', 'Evening.', 'Hey, good evening.'],
  night: ["You're up late.", 'Hey — still awake?', 'Late night check-in.'],
}

export const PEAK_TIME_CALLOUT: ((timeLabel: string) => string)[] = [
  (t) => `${t}s are usually difficult for you.`,
  (t) => `I know ${t.toLowerCase()}s tend to be a harder stretch for you.`,
  (t) => `This is typically your toughest window — ${t.toLowerCase()}s.`,
]

export const STREAK_CALLOUT: ((streak: number) => string)[] = [
  (s) => `You're at ${s} day${s === 1 ? '' : 's'} clean — that's real momentum.`,
  (s) => `${s} day${s === 1 ? '' : 's'} in. Proud of you for staying with this.`,
]

export const OPENING_QUESTION: string[] = [
  'How are you feeling today?',
  "What's on your mind right now?",
  "How's your energy right now?",
  'What would be most helpful to talk through today?',
]

export const REPLY_NEGATIVE: ((habitLabel: string, trigger: string) => string)[] = [
  (h, t) =>
    `That sounds genuinely hard, and it makes sense given what you're carrying. When ${t.toLowerCase()} shows up like this, your urge toward ${h.toLowerCase()} usually follows close behind. Try naming the feeling out loud, then give yourself one small, concrete action — a short walk or a few slow breaths — before deciding anything else. You've gotten through this feeling before.`,
  (h, t) =>
    `Thanks for being honest about that — it takes something to say it. ${t} is a known trigger for you, so this reaction isn't random, it's a pattern we can work with. Right now, try grounding yourself: name 3 things you can see and take 3 slow breaths. Then choose one replacement for ${h.toLowerCase()} in this moment. You're not starting over — you're still in this.`,
]

export const REPLY_POSITIVE: ((streak: number) => string)[] = [
  (s) =>
    `That's genuinely great to hear. ${s > 0 ? `${s} day${s === 1 ? '' : 's'} in and still showing up for yourself — ` : ''}Momentum like this compounds when you notice it, so take a second to actually register what's working right now. What's one thing you did today that helped?`,
  () =>
    `Good — hold onto that feeling for a second, it matters. Recovery isn't just about surviving hard moments, it's also about recognizing the good ones. What made today feel different?`,
]

export const REPLY_TRIGGER_MENTION: ((habitLabel: string, replacement: string) => string)[] = [
  (h, r) =>
    `I hear that ${h.toLowerCase()} is on your mind. That's worth paying attention to, not fighting. Try this right now: ${r.toLowerCase()}. Then check back in with yourself in ten minutes — most urges fade faster than they feel like they will.`,
]

export const REPLY_NEUTRAL: string[] = [
  "Tell me a bit more about that — what's underneath it?",
  "I'm listening. What's the hardest part of today been so far?",
  "That's worth sitting with for a second. What do you think triggered that?",
  "Okay. What would feel like a small win for the rest of today?",
]
