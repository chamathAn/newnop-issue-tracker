import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { IssueStatus } from '@/types';

const statusConfig: Record<IssueStatus, { label: string; className: string }> = {
  open: { label: 'Open', className: 'bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-100' },
  'in-progress': { label: 'In Progress', className: 'bg-amber-100 text-amber-700 border-amber-200 hover:bg-amber-100' },
  resolved: { label: 'Resolved', className: 'bg-green-100 text-green-700 border-green-200 hover:bg-green-100' },
  closed: { label: 'Closed', className: 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-100' },
};

interface StatusBadgeProps {
  status: IssueStatus;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status];
  return (
    <Badge variant="outline" className={cn(config.className, className)}>
      {config.label}
    </Badge>
  );
}
