import type { RecoveryStyle } from '@/types'

export const STRATEGY_BY_RECOVERY_STYLE: Record<RecoveryStyle, ((habitLabel: string, trigger: string) => string)[]> = {
  structured: [
    (h, t) => `Build a fixed daily structure around the hours when ${t.toLowerCase()} tends to hit — a set routine leaves less room for ${h.toLowerCase()} to fill the gap.`,
  ],
  flexible: [
    (h, t) => `Keep a short list of go-to replacement actions for ${t.toLowerCase()} moments, and let yourself pick whichever fits the moment instead of one rigid rule for ${h.toLowerCase()}.`,
  ],
  social: [
    (h, t) => `Loop in one person who knows what you're working on — a quick check-in message when ${t.toLowerCase()} shows up can interrupt the pull toward ${h.toLowerCase()} before it builds.`,
  ],
  independent: [
    (h, t) => `Track your own patterns closely — journal the moments ${t.toLowerCase()} appears, and use that data to spot your triggers for ${h.toLowerCase()} before they escalate.`,
  ],
}

export const MOTIVATION_TEMPLATES: ((motivationReason: string) => string)[] = [
  (r) => `You started this because ${r.toLowerCase()}. On the hard days, that reason is still true — come back to it.`,
  (r) => `${r.charAt(0).toUpperCase() + r.slice(1)}. That's not a small reason. Let it carry you on the days willpower alone won't.`,
]

export const WEEKLY_GOAL_TEMPLATES: ((habitLabel: string, difficulty: string) => string)[] = [
  (h) => `Log a daily check-in every day this week, even on days you slip with ${h.toLowerCase()} — consistency in tracking matters more than a perfect week.`,
  (h, d) => (d === 'easy' || d === 'moderate'
    ? `Aim for 5 of 7 clean days this week around ${h.toLowerCase()}, and use the emergency toolkit at least once if you feel a strong urge.`
    : `Focus on surviving one trigger moment at a time this week — don't aim for a perfect streak yet, aim for noticing the pattern around ${h.toLowerCase()}.`),
]

export const TIMELINE_BY_DIFFICULTY: Record<string, string> = {
  easy: '2-4 weeks to build a stable new routine',
  moderate: '6-8 weeks to see the habit loop meaningfully weaken',
  hard: '3-4 months of consistent effort before it feels automatic',
  'very-hard': '6+ months, with real progress well before full mastery',
}
