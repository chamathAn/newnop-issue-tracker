import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { IssueForm } from '@/components/issues/IssueForm';
import { useIssueStore } from '@/stores/issueStore';
import type { IssueFormValues } from '@/schemas/issue.schema';

export function CreateIssuePage() {
  const createIssue = useIssueStore((s) => s.createIssue);
  const navigate = useNavigate();

  const handleSubmit = async (values: IssueFormValues) => {
    try {
      await createIssue({
        title: values.title,
        description: values.description,
        priority: values.priority,
        severity: values.severity,
        assignee: values.assignee || undefined,
      });
      toast.success('Issue created');
      navigate('/issues');
    } catch {
      toast.error('Failed to create issue');
    }
  };

  return (
    <PageWrapper title="New Issue">
      <div className="max-w-2xl">
        <h1 className="text-2xl font-bold mb-6">Create issue</h1>
        <IssueForm onSubmit={handleSubmit} />
      </div>
    </PageWrapper>
  );
}
