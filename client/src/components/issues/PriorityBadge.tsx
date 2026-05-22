import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { IssuePriority } from '@/types';

const priorityConfig: Record<IssuePriority, { label: string; className: string }> = {
  low: { label: 'Low', className: 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-100' },
  medium: { label: 'Medium', className: 'bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-100' },
  high: { label: 'High', className: 'bg-orange-100 text-orange-700 border-orange-200 hover:bg-orange-100' },
  critical: { label: 'Critical', className: 'bg-red-100 text-red-700 border-red-200 hover:bg-red-100' },
};

interface PriorityBadgeProps {
  priority: IssuePriority;
  className?: string;
}

export function PriorityBadge({ priority, className }: PriorityBadgeProps) {
  const config = priorityConfig[priority];
  return (
    <Badge variant="outline" className={cn(config.className, className)}>
      {config.label}
    </Badge>
  );
}
