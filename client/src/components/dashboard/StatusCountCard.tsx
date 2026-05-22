import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { IssueStatus } from '@/types';

const statusConfig: Record<IssueStatus, { label: string; className: string; dotClass: string }> = {
  open: {
    label: 'Open',
    className: 'border-blue-200 bg-blue-50',
    dotClass: 'bg-blue-500',
  },
  'in-progress': {
    label: 'In Progress',
    className: 'border-amber-200 bg-amber-50',
    dotClass: 'bg-amber-500',
  },
  resolved: {
    label: 'Resolved',
    className: 'border-green-200 bg-green-50',
    dotClass: 'bg-green-500',
  },
  closed: {
    label: 'Closed',
    className: 'border-slate-200 bg-slate-50',
    dotClass: 'bg-slate-400',
  },
};

interface StatusCountCardProps {
  status: IssueStatus;
  count: number;
}

export function StatusCountCard({ status, count }: StatusCountCardProps) {
  const config = statusConfig[status];
  return (
    <Card className={cn('border', config.className)}>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
          <span className={cn('h-2.5 w-2.5 rounded-full', config.dotClass)} />
          {config.label}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-3xl font-bold">{count}</p>
        <p className="text-xs text-muted-foreground mt-1">
          {count === 1 ? 'issue' : 'issues'}
        </p>
      </CardContent>
    </Card>
  );
}
