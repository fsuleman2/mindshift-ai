import type { EmergencyTrigger } from '@/types'

export const VALIDATION_BY_TRIGGER: Record<EmergencyTrigger, ((habitLabel: string) => string)[]> = {
  stress: [
    (h) => `Stress is a real, physical signal — it makes sense that ${h.toLowerCase()} feels like relief right now.`,
    (h) => `Your body is asking for a release valve, and ${h.toLowerCase()} has been the fastest one you know. That's understandable.`,
  ],
  bored: [
    () => `Boredom is one of the hardest cravings to sit with — your brain is just looking for stimulation.`,
    (h) => `That restless, empty feeling is exactly when ${h.toLowerCase()} usually creeps in. You noticed it — that's the hard part done.`,
  ],
  lonely: [
    () => `Loneliness is a heavy feeling to carry, and reaching for something familiar makes total sense right now.`,
    (h) => `Wanting connection is human. ${h} just happens to be the closest substitute in reach — but it isn't the only option.`,
  ],
  habit: [
    (h) => `This might just be the routine talking — your brain running a script it's rehearsed a thousand times with ${h.toLowerCase()}.`,
    () => `Autopilot urges are often the strongest and the shortest-lived. You catching it mid-loop is genuinely a win.`,
  ],
  anxiety: [
    () => `Anxiety spikes are uncomfortable enough that almost any relief looks appealing right now. That reaction is normal.`,
    (h) => `Your nervous system is on high alert, and ${h.toLowerCase()} has felt like the off-switch before. Let's find another one.`,
  ],
  other: [
    (h) => `Whatever's pulling you toward ${h.toLowerCase()} right now, the urge is real and it will pass — most cravings peak within minutes.`,
    () => `You don't need a perfect reason for this urge to be valid. Naming it and pausing is already progress.`,
  ],
}

export const BREATHING_EXERCISES: string[] = [
  'Try box breathing: inhale for 4 seconds, hold for 4, exhale for 4, hold for 4. Repeat it 4 times.',
  'Do 4-7-8 breathing: inhale through your nose for 4 seconds, hold for 7, exhale slowly for 8. Three rounds usually shifts the urge.',
  'Take 5 slow breaths, making each exhale longer than the inhale — that alone tells your nervous system it\'s safe to calm down.',
  'Place a hand on your chest and breathe in for 4 counts, out for 6, for one full minute.',
]

export const REPLACEMENT_TEMPLATES: ((activity: string) => string)[] = [
  (a) => `Right now, try this instead: ${a.toLowerCase()}.`,
  (a) => `Redirect that energy for the next few minutes — ${a.toLowerCase()}.`,
  (a) => `Give yourself a small, real alternative: ${a.toLowerCase()}.`,
]

export const GOAL_REMINDER_TEMPLATES: ((streak: number, motivationReason: string) => string)[] = [
  (streak, reason) =>
    streak > 0
      ? `You've held a ${streak}-day streak for a reason — ${reason.toLowerCase()}.`
      : `Remember why you started this: ${reason.toLowerCase()}.`,
  (streak, reason) =>
    streak > 0
      ? `${streak} day${streak === 1 ? '' : 's'} of proof that you can do hard things — this moment doesn't erase that.`
      : `This moment doesn't define you — ${reason.toLowerCase()} still matters just as much right now.`,
]

export const ENCOURAGEMENT_CLOSE: string[] = [
  'This urge is temporary. You are not.',
  "You've already done the hardest part — you paused. Keep going.",
  'One craving survived is one more piece of proof you can trust yourself.',
  "You're stronger than this moment, even if it doesn't feel that way yet.",
]
