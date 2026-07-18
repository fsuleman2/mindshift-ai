import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight, Brain, ShieldAlert, TrendingUp } from 'lucide-react'
import { Button } from '@/components/ui/button'

const FEATURES = [
  {
    icon: Brain,
    title: 'AI coaching that adapts to you',
    description: 'Every response is grounded in your triggers, mood, and history — not generic advice.',
  },
  {
    icon: ShieldAlert,
    title: 'Emergency support, one tap away',
    description: "In a craving? Get an instant, personalized plan to ride it out — day or night.",
  },
  {
    icon: TrendingUp,
    title: 'Real progress, not guesswork',
    description: 'Track your risk, mood, and streaks with a behavior engine that learns your patterns.',
  },
]

export default function Landing() {
  return (
    <div className="relative overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            'radial-gradient(60% 50% at 50% 0%, hsl(var(--primary) / 0.22), transparent), radial-gradient(40% 40% at 85% 20%, hsl(var(--secondary) / 0.18), transparent)',
        }}
      />

      <section className="mx-auto flex max-w-3xl flex-col items-center px-4 pb-20 pt-20 text-center sm:pt-28">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="glass rounded-2xl px-6 py-10 sm:px-12 sm:py-14"
        >
          <p className="text-sm font-medium uppercase tracking-wide text-primary">MindShift AI</p>
          <h1 className="mt-3 text-4xl font-heading font-semibold tracking-tight sm:text-5xl">
            Break the Loop.
            <br />
            Build a Better You.
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-balance text-muted-foreground">
            A personalized AI recovery coach for phone, social media, gaming, smoking, alcohol, and other
            habits you're ready to change — one that actually knows your triggers, not a generic chatbot.
          </p>
          <Button asChild size="lg" className="mt-8 gap-2">
            <Link to="/start">
              Start Recovery
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </Button>
          <p className="mt-4 text-xs text-muted-foreground">
            100% private — everything stays on this device. No account required.
          </p>
        </motion.div>
      </section>

      <section className="mx-auto grid max-w-5xl gap-4 px-4 pb-24 sm:grid-cols-3">
        {FEATURES.map((feature, index) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            className="glass flex flex-col gap-3 rounded-xl p-6 text-left"
          >
            <feature.icon className="size-6 text-primary" aria-hidden="true" />
            <h2 className="text-base font-semibold">{feature.title}</h2>
            <p className="text-sm text-muted-foreground">{feature.description}</p>
          </motion.div>
        ))}
      </section>
    </div>
  )
}
