export const DAILY_TIPS: ((habitLabel: string, streak: number) => string)[] = [
  (h) => `Urges to ${h.toLowerCase()} usually peak within 10-15 minutes, then fade on their own if you don't act on them. Ride the wave — don't fight it.`,
  () => `Willpower is a limited resource each day. Protect it by removing friction: keep your environment set up for the choice you want to make later.`,
  (h) => `Notice the moment right before ${h.toLowerCase()} — that's your real decision point, not the craving itself. Get curious about what happens right before.`,
  (_h, streak) => (streak > 0 ? `You've proven ${streak} time${streak === 1 ? '' : 's'} already that today counts as a day — that's evidence, not luck.` : `Every recovery has a first real day. Today can be that day, and that's enough for now.`),
  () => `Progress in recovery isn't a straight line. A hard day doesn't erase the pattern you're building — it's one data point, not the whole story.`,
  () => `Name the feeling before you act on the urge. "I'm anxious" or "I'm bored" takes some of its power away almost immediately.`,
  (h) => `Instead of asking "will I ${h.toLowerCase()} today," ask "what do I need right now instead?" Same trigger, better question.`,
  () => `Sleep, food, and connection are the three biggest levers for craving intensity. If today's hard, check those three first.`,
]
