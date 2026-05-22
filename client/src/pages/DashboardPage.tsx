import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { StatusCountCard } from '@/components/dashboard/StatusCountCard';
import { IssueTable } from '@/components/issues/IssueTable';
import { Skeleton } from '@/components/ui/skeleton';
import { issuesApi } from '@/api/issues.api';
import type { Issue, IssueStatus } from '@/types';

const STATUSES: IssueStatus[] = ['open', 'in-progress', 'resolved', 'closed'];

export function DashboardPage() {
  const [counts, setCounts] = useState<Record<IssueStatus, number>>({
    open: 0,
    'in-progress': 0,
    resolved: 0,
    closed: 0,
  });
  const [recentIssues, setRecentIssues] = useState<Issue[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchStats = async () => {
    try {
      const results = await Promise.all(
        STATUSES.map((status) => issuesApi.getIssues({ status, limit: 1, page: 1 }))
      );
      const newCounts = {} as Record<IssueStatus, number>;
      STATUSES.forEach((status, i) => {
        newCounts[status] = results[i].total;
      });
      setCounts(newCounts);

      const recent = await issuesApi.getIssues({ status: 'open', limit: 5, page: 1 });
      setRecentIssues(recent.issues);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void fetchStats();
  }, []);

  return (
    <PageWrapper title="Dashboard">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {STATUSES.map((s) => (
            <Skeleton key={s} className="h-28 rounded-lg" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {STATUSES.map((status) => (
            <StatusCountCard key={status} status={status} count={counts[status]} />
          ))}
        </div>
      )}

      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Recent Open Issues</h2>
        <Button variant="ghost" size="sm" asChild>
          <Link to="/issues" className="flex items-center gap-1">
            View all <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </Button>
      </div>

      {isLoading ? (
        <Skeleton className="h-48 rounded-md" />
      ) : recentIssues.length > 0 ? (
        <IssueTable issues={recentIssues} onDelete={fetchStats} />
      ) : (
        <p className="text-muted-foreground text-sm">No open issues. Great work!</p>
      )}
    </PageWrapper>
  );
}
