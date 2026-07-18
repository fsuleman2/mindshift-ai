export const LESSON_TEMPLATES: ((trigger: string, habitLabel: string) => string)[] = [
  (t) => `${t.charAt(0).toUpperCase() + t.slice(1)} keeps showing up as a pattern — recognizing it while it's happening is the first real lever you have.`,
  (t, h) => `This entry points back to ${t.toLowerCase()} as the root, not ${h.toLowerCase()} itself. The habit is downstream of the real trigger.`,
  () => `Writing this down already shows more self-awareness than acting on autopilot would have. That awareness is the skill that compounds.`,
]

export const ACTION_PLAN_TEMPLATES: ((trigger: string, replacement: string) => string)[] = [
  (t, r) => `Next time ${t.toLowerCase()} shows up, try ${r.toLowerCase()} before deciding anything else.`,
  (t, r) => `Set a plan now, while you're calm: when ${t.toLowerCase()} hits, the first move is ${r.toLowerCase()}.`,
  (_t, r) => `Make the replacement automatic — ${r.toLowerCase()} — so you don't have to decide in the moment.`,
]
