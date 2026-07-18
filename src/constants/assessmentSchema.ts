import { z } from 'zod'

export const TIME_OF_DAY_OPTIONS = [
  { value: 'morning', label: 'Morning' },
  { value: 'afternoon', label: 'Afternoon' },
  { value: 'evening', label: 'Evening' },
  { value: 'night', label: 'Late night' },
] as const

export const SUPPORT_OPTIONS = [
  { value: 'strong', label: 'Strong — people I can lean on' },
  { value: 'some', label: 'Some — a person or two' },
  { value: 'none', label: 'None right now' },
] as const

export const assessmentFormSchema = z.object({
  habit: z.string().min(1),
  customHabitLabel: z.string().optional(),
  frequencyPerDay: z
    .number({ message: 'Enter a number' })
    .int('Whole numbers only')
    .min(0, 'Cannot be negative')
    .max(200, 'That seems too high — enter a realistic estimate'),
  timeOfDay: z.array(z.enum(['morning', 'afternoon', 'evening', 'night'])).min(1, 'Pick at least one'),
  primaryTrigger: z.string().min(2, 'Tell us a little more').max(80),
  stressLevel: z.number().min(0).max(10),
  sleepQuality: z.number().min(0).max(10),
  motivationReason: z.string().min(3, 'A sentence or two helps your coach').max(300),
  triedBefore: z.boolean(),
  whatWorkedBefore: z.string().max(300).optional(),
  biggestFear: z.string().min(2, 'Even a few words helps').max(200),
  supportSystem: z.enum(['strong', 'some', 'none']),
  motivationLevel: z.number().min(0).max(10),
})

export type AssessmentFormValues = z.infer<typeof assessmentFormSchema>
