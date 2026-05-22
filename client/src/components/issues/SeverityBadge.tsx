import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { IssueSeverity } from '@/types';

const severityConfig: Record<IssueSeverity, { label: string; className: string }> = {
  minor: { label: 'Minor', className: 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-100' },
  major: { label: 'Major', className: 'bg-orange-100 text-orange-700 border-orange-200 hover:bg-orange-100' },
  critical: { label: 'Critical', className: 'bg-red-100 text-red-700 border-red-200 hover:bg-red-100' },
  blocker: { label: 'Blocker', className: 'bg-purple-100 text-purple-700 border-purple-200 hover:bg-purple-100' },
};

interface SeverityBadgeProps {
  severity?: IssueSeverity;
  className?: string;
}

export function SeverityBadge({ severity, className }: SeverityBadgeProps) {
  if (!severity) return null;
  const config = severityConfig[severity];
  return (
    <Badge variant="outline" className={cn(config.className, className)}>
      {config.label}
    </Badge>
  );
}
