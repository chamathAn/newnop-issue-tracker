import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useIssueStore } from '@/stores/issueStore';

export function Pagination() {
  const page = useIssueStore((s) => s.page);
  const totalPages = useIssueStore((s) => s.totalPages);
  const setPage = useIssueStore((s) => s.setPage);
  const total = useIssueStore((s) => s.total);

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between mt-4">
      <p className="text-sm text-muted-foreground">
        {total} {total === 1 ? 'issue' : 'issues'} total
      </p>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setPage(page - 1)}
          disabled={page === 1}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <span className="text-sm font-medium px-2">
          Page {page} of {totalPages}
        </span>
        <Button
          variant="outline"
          size="icon"
          onClick={() => setPage(page + 1)}
          disabled={page === totalPages}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
