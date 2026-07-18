import { Badge } from '@/components/ui/badge'
import { cn } from '@/utils/cn'
import type { RiskLevel } from '@/types'

const RISK_STYLE: Record<RiskLevel, { label: string; className: string }> = {
  safe: { label: 'Safe', className: 'bg-success/15 text-success border-success/30' },
  moderate: { label: 'Moderate', className: 'bg-warning/15 text-warning border-warning/30' },
  high: { label: 'High', className: 'bg-danger/15 text-danger border-danger/30' },
  critical: { label: 'Critical', className: 'bg-danger text-destructive-foreground border-danger' },
}

export function RiskBadge({ level, className }: { level: RiskLevel; className?: string }) {
  const style = RISK_STYLE[level]
  return (
    <Badge variant="outline" className={cn(style.className, className)}>
      {style.label} risk
    </Badge>
  )
}
