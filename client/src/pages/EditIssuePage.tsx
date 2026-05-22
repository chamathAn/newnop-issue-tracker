import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { IssueForm } from '@/components/issues/IssueForm';
import { Skeleton } from '@/components/ui/skeleton';
import { issuesApi } from '@/api/issues.api';
import { useIssueStore } from '@/stores/issueStore';
import type { Issue } from '@/types';
import type { IssueFormValues } from '@/schemas/issue.schema';

export function EditIssuePage() {
  const { id } = useParams<{ id: string }>();
  const [issue, setIssue] = useState<Issue | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const updateIssue = useIssueStore((s) => s.updateIssue);
  const navigate = useNavigate();

  useEffect(() => {
    if (!id) return;
    issuesApi
      .getIssue(id)
      .then(setIssue)
      .catch(() => toast.error('Issue not found'))
      .finally(() => setIsLoading(false));
  }, [id]);

  const handleSubmit = async (values: IssueFormValues) => {
    if (!id) return;
    try {
      await updateIssue(id, {
        title: values.title,
        description: values.description,
        priority: values.priority,
        severity: values.severity,
        status: values.status,
        assignee: values.assignee || undefined,
      });
      toast.success('Issue updated');
      navigate(`/issues/${id}`);
    } catch {
      toast.error('Failed to update issue');
    }
  };

  return (
    <PageWrapper title="Edit Issue">
      <div className="max-w-2xl">
        <h1 className="text-2xl font-bold mb-6">Edit issue</h1>
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-10 w-48" />
          </div>
        ) : issue ? (
          <IssueForm issue={issue} onSubmit={handleSubmit} isEdit />
        ) : (
          <p className="text-muted-foreground">Issue not found.</p>
        )}
      </div>
    </PageWrapper>
  );
}
