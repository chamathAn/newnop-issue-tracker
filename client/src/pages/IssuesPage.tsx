import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { IssueTable } from '@/components/issues/IssueTable';
import { IssueFilters } from '@/components/issues/IssueFilters';
import { Skeleton } from '@/components/ui/skeleton';
import { Pagination } from '@/components/common/Pagination';
import { ExportButton } from '@/components/common/ExportButton';
import { useIssueStore } from '@/stores/issueStore';
import { useIssues } from '@/hooks/useIssues';

export function IssuesPage() {
  useIssues();
  const { issues, isLoading, filters } = useIssueStore();

  const hasActiveFilters =
    filters.search || filters.status || filters.priority || filters.severity;

  return (
    <PageWrapper title="Issues">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Issues</h1>
        <Button asChild>
          <Link to="/issues/new">
            <Plus className="h-4 w-4 mr-1" />
            New Issue
          </Link>
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 mb-4">
        <div className="flex-1 w-full">
          <IssueFilters />
        </div>
        <ExportButton />
      </div>

      {isLoading ? (
        <Skeleton className="h-64 rounded-md" />
      ) : issues.length > 0 ? (
        <>
          <IssueTable issues={issues} />
          <Pagination />
        </>
      ) : (
        <div className="text-center py-16">
          <p className="text-muted-foreground mb-4">
            {hasActiveFilters
              ? 'No issues match your filters.'
              : 'No issues yet.'}
          </p>
          {!hasActiveFilters && (
            <Button asChild>
              <Link to="/issues/new">Create your first issue</Link>
            </Button>
          )}
        </div>
      )}
    </PageWrapper>
  );
}
