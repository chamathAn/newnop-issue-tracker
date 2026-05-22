import { useEffect } from 'react';
import { useIssueStore } from '@/stores/issueStore';

export function useIssues() {
  const fetchIssues = useIssueStore((s) => s.fetchIssues);
  const filters = useIssueStore((s) => s.filters);
  const page = useIssueStore((s) => s.page);

  useEffect(() => {
    void fetchIssues();
  }, [filters, page, fetchIssues]);
}
