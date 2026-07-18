import type { Control, FieldPath, UseFormRegister, UseFormSetValue, UseFormWatch } from 'react-hook-form'
import { Controller } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Slider } from '@/components/ui/slider'
import { Textarea } from '@/components/ui/textarea'
import { SUPPORT_OPTIONS, TIME_OF_DAY_OPTIONS, type AssessmentFormValues } from '@/constants/assessmentSchema'
import { cn } from '@/utils/cn'

export interface StepProps {
  register: UseFormRegister<AssessmentFormValues>
  control: Control<AssessmentFormValues>
  watch: UseFormWatch<AssessmentFormValues>
  setValue: UseFormSetValue<AssessmentFormValues>
  habitLabel: string
}

export interface StepDefinition {
  id: string
  title: string
  subtitle?: string
  fields: FieldPath<AssessmentFormValues>[]
  render: (props: StepProps) => React.ReactNode
}

function SliderField({
  control,
  name,
  lowLabel,
  highLabel,
}: {
  control: Control<AssessmentFormValues>
  name: 'stressLevel' | 'sleepQuality' | 'motivationLevel'
  lowLabel: string
  highLabel: string
}) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <div className="space-y-4">
          <div className="text-center text-4xl font-heading font-semibold text-primary" aria-hidden="true">
            {field.value}
          </div>
          <Slider
            min={0}
            max={10}
            step={1}
            value={[field.value]}
            onValueChange={([v]) => field.onChange(v)}
            aria-label={`${name} from 0 to 10`}
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{lowLabel}</span>
            <span>{highLabel}</span>
          </div>
        </div>
      )}
    />
  )
}

/** Multi-select chip group for time-of-day; keyboard accessible checkboxes under the hood. */
function TimeOfDayField({ control }: { control: Control<AssessmentFormValues> }) {
  return (
    <Controller
      control={control}
      name="timeOfDay"
      render={({ field }) => (
        <div className="grid grid-cols-2 gap-2" role="group" aria-label="When does it usually happen?">
          {TIME_OF_DAY_OPTIONS.map((option) => {
            const checked = field.value.includes(option.value)
            return (
              <label
                key={option.value}
                className={cn(
                  'flex cursor-pointer items-center justify-center gap-2 rounded-lg border p-3.5 text-sm font-medium transition-colors',
                  checked
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-border hover:border-primary/50',
                )}
              >
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={checked}
                  onChange={(e) => {
                    field.onChange(
                      e.target.checked
                        ? [...field.value, option.value]
                        : field.value.filter((v) => v !== option.value),
                    )
                  }}
                />
                {option.label}
              </label>
            )
          })}
        </div>
      )}
    />
  )
}

export const ASSESSMENT_STEPS: StepDefinition[] = [
  {
    id: 'frequency',
    title: 'How many times a day does it happen?',
    subtitle: 'A rough estimate is fine — honesty beats precision.',
    fields: ['frequencyPerDay'],
    render: ({ register }) => (
      <div className="space-y-2">
        <Label htmlFor="frequencyPerDay">Times per day</Label>
        <Input
          id="frequencyPerDay"
          type="number"
          inputMode="numeric"
          min={0}
          max={200}
          {...register('frequencyPerDay', { valueAsNumber: true })}
        />
      </div>
    ),
  },
  {
    id: 'timeOfDay',
    title: 'When does it usually happen?',
    subtitle: 'Pick every window that applies — the first one you pick should be the worst.',
    fields: ['timeOfDay'],
    render: ({ control }) => <TimeOfDayField control={control} />,
  },
  {
    id: 'trigger',
    title: "What's your biggest trigger?",
    subtitle: 'The feeling or situation that most often starts the loop.',
    fields: ['primaryTrigger'],
    render: ({ register, habitLabel }) => (
      <div className="space-y-2">
        <Label htmlFor="primaryTrigger">Trigger</Label>
        <Input
          id="primaryTrigger"
          placeholder={`e.g. stress, boredom, seeing others use ${habitLabel.toLowerCase()}`}
          {...register('primaryTrigger')}
        />
      </div>
    ),
  },
  {
    id: 'stress',
    title: 'How stressed are you these days?',
    fields: ['stressLevel'],
    render: ({ control }) => (
      <SliderField control={control} name="stressLevel" lowLabel="Totally calm" highLabel="Maxed out" />
    ),
  },
  {
    id: 'sleep',
    title: 'How well are you sleeping?',
    fields: ['sleepQuality'],
    render: ({ control }) => (
      <SliderField control={control} name="sleepQuality" lowLabel="Terribly" highLabel="Like a rock" />
    ),
  },
  {
    id: 'why',
    title: 'Why do you want to quit?',
    subtitle: 'Your coach will bring this back to you on the hard days.',
    fields: ['motivationReason'],
    render: ({ register }) => (
      <div className="space-y-2">
        <Label htmlFor="motivationReason">Your reason</Label>
        <Textarea
          id="motivationReason"
          rows={3}
          placeholder="e.g. I want my evenings back for my family"
          {...register('motivationReason')}
        />
      </div>
    ),
  },
  {
    id: 'triedBefore',
    title: 'Have you tried to quit before?',
    fields: ['triedBefore', 'whatWorkedBefore'],
    render: ({ control, register, watch }) => (
      <div className="space-y-4">
        <Controller
          control={control}
          name="triedBefore"
          render={({ field }) => (
            <RadioGroup
              value={field.value ? 'yes' : 'no'}
              onValueChange={(v) => field.onChange(v === 'yes')}
              className="grid grid-cols-2 gap-2"
            >
              {(['yes', 'no'] as const).map((option) => (
                <Label
                  key={option}
                  className={cn(
                    'flex cursor-pointer items-center justify-center gap-2 rounded-lg border p-3.5 text-sm font-medium capitalize transition-colors',
                    (field.value ? 'yes' : 'no') === option
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-border hover:border-primary/50',
                  )}
                >
                  <RadioGroupItem value={option} className="sr-only" />
                  {option}
                </Label>
              ))}
            </RadioGroup>
          )}
        />
        {watch('triedBefore') && (
          <div className="space-y-2">
            <Label htmlFor="whatWorkedBefore">What worked, even briefly?</Label>
            <Textarea
              id="whatWorkedBefore"
              rows={2}
              placeholder="e.g. deleting the app, keeping busy in the evenings"
              {...register('whatWorkedBefore')}
            />
          </div>
        )}
      </div>
    ),
  },
  {
    id: 'fear',
    title: "What's your biggest fear about quitting?",
    subtitle: 'Naming it takes away some of its power.',
    fields: ['biggestFear'],
    render: ({ register }) => (
      <div className="space-y-2">
        <Label htmlFor="biggestFear">Biggest fear</Label>
        <Input id="biggestFear" placeholder="e.g. losing touch with friends, failing again" {...register('biggestFear')} />
      </div>
    ),
  },
  {
    id: 'support',
    title: "Who knows you're working on this?",
    fields: ['supportSystem'],
    render: ({ control }) => (
      <Controller
        control={control}
        name="supportSystem"
        render={({ field }) => (
          <RadioGroup value={field.value} onValueChange={field.onChange} className="space-y-2">
            {SUPPORT_OPTIONS.map((option) => (
              <Label
                key={option.value}
                className={cn(
                  'flex cursor-pointer items-center gap-3 rounded-lg border p-3.5 text-sm font-medium transition-colors',
                  field.value === option.value
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-border hover:border-primary/50',
                )}
              >
                <RadioGroupItem value={option.value} />
                {option.label}
              </Label>
            ))}
          </RadioGroup>
        )}
      />
    ),
  },
  {
    id: 'motivation',
    title: 'How motivated are you right now?',
    subtitle: 'Be honest — your plan adjusts to meet you where you are.',
    fields: ['motivationLevel'],
    render: ({ control }) => (
      <SliderField control={control} name="motivationLevel" lowLabel="Barely" highLabel="All in" />
    ),
  },
]
