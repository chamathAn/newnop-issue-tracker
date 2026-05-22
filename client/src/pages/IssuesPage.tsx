import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { IssueTable } from '@/components/issues/IssueTable';
import { Skeleton } from '@/components/ui/skeleton';
import { useIssueStore } from '@/stores/issueStore';

export function IssuesPage() {
  const { issues, isLoading, fetchIssues } = useIssueStore();

  useEffect(() => {
    void fetchIssues();
  }, [fetchIssues]);

  return (
    <PageWrapper title="Issues">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Issues</h1>
        <Button asChild>
          <Link to="/issues/new">
            <Plus className="h-4 w-4 mr-1" />
            New Issue
          </Link>
        </Button>
      </div>

      {isLoading ? (
        <Skeleton className="h-64 rounded-md" />
      ) : issues.length > 0 ? (
        <IssueTable issues={issues} />
      ) : (
        <div className="text-center py-16">
          <p className="text-muted-foreground mb-4">No issues yet.</p>
          <Button asChild>
            <Link to="/issues/new">Create your first issue</Link>
          </Button>
        </div>
      )}
    </PageWrapper>
  );
}
