import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Pencil, Trash2, CheckCircle, XCircle, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { StatusBadge } from '@/components/issues/StatusBadge';
import { PriorityBadge } from '@/components/issues/PriorityBadge';
import { SeverityBadge } from '@/components/issues/SeverityBadge';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { issuesApi } from '@/api/issues.api';
import { useIssueStore } from '@/stores/issueStore';
import type { Issue } from '@/types';

type DialogAction = 'delete' | 'resolve' | 'close' | null;

export function IssueDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [issue, setIssue] = useState<Issue | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [dialogAction, setDialogAction] = useState<DialogAction>(null);
  const deleteIssue = useIssueStore((s) => s.deleteIssue);
  const navigate = useNavigate();

  const fetchIssue = async () => {
    if (!id) return;
    try {
      const data = await issuesApi.getIssue(id);
      setIssue(data);
    } catch {
      toast.error('Issue not found');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void fetchIssue();
  }, [id]);

  const handleDelete = async () => {
    if (!id) return;
    try {
      await deleteIssue(id);
      toast.success('Issue deleted');
      navigate('/issues');
    } catch {
      toast.error('Failed to delete issue');
    }
  };

  const handleStatusChange = async (status: 'resolved' | 'closed') => {
    if (!id) return;
    try {
      await issuesApi.updateIssue(id, { status });
      toast.success(`Issue marked as ${status}`);
      await fetchIssue();
    } catch {
      toast.error('Failed to update status');
    }
  };

  const dialogConfig = {
    delete: {
      title: 'Delete issue',
      description: 'This action cannot be undone. The issue will be permanently deleted.',
      confirmLabel: 'Delete',
      variant: 'destructive' as const,
      onConfirm: handleDelete,
    },
    resolve: {
      title: 'Mark as Resolved',
      description: 'This issue will be marked as resolved. You can reopen it later by editing.',
      confirmLabel: 'Mark Resolved',
      variant: 'default' as const,
      onConfirm: () => handleStatusChange('resolved'),
    },
    close: {
      title: 'Close issue',
      description: 'This issue will be closed. You can reopen it later by editing.',
      confirmLabel: 'Close Issue',
      variant: 'default' as const,
      onConfirm: () => handleStatusChange('closed'),
    },
  };

  return (
    <PageWrapper title={issue?.title ?? 'Issue Detail'}>
      <div className="max-w-3xl">
        <div className="flex items-center gap-2 mb-6">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/issues">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Issues
            </Link>
          </Button>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-32 w-full" />
          </div>
        ) : issue ? (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold mb-3">{issue.title}</h1>
              <div className="flex flex-wrap gap-2">
                <StatusBadge status={issue.status} />
                <PriorityBadge priority={issue.priority} />
                <SeverityBadge severity={issue.severity} />
              </div>
            </div>

            <Separator />

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground font-medium mb-1">Assignee</p>
                {issue.assignee ? (
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarFallback className="text-xs">
                        {issue.assignee.name.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span>{issue.assignee.name}</span>
                  </div>
                ) : (
                  <span className="text-muted-foreground">Unassigned</span>
                )}
              </div>
              <div>
                <p className="text-muted-foreground font-medium mb-1">Reporter</p>
                <span>{issue.createdBy?.name}</span>
              </div>
              <div>
                <p className="text-muted-foreground font-medium mb-1">Created</p>
                <span>{new Date(issue.createdAt).toLocaleDateString()}</span>
              </div>
              <div>
                <p className="text-muted-foreground font-medium mb-1">Updated</p>
                <span>{new Date(issue.updatedAt).toLocaleDateString()}</span>
              </div>
              <div>
                <p className="text-muted-foreground font-medium mb-1">ID</p>
                <Badge variant="outline" className="font-mono text-xs">{issue._id.slice(-8)}</Badge>
              </div>
            </div>

            <Separator />

            <div>
              <h2 className="font-semibold mb-2">Description</h2>
              <p className="text-sm leading-relaxed whitespace-pre-wrap">{issue.description}</p>
            </div>

            <Separator />

            <div className="flex flex-wrap gap-2">
              <Button asChild>
                <Link to={`/issues/${issue._id}/edit`}>
                  <Pencil className="h-4 w-4 mr-1" />
                  Edit
                </Link>
              </Button>

              {issue.status !== 'resolved' && issue.status !== 'closed' && (
                <Button variant="outline" onClick={() => setDialogAction('resolve')}>
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Mark Resolved
                </Button>
              )}

              {issue.status !== 'closed' && (
                <Button variant="outline" onClick={() => setDialogAction('close')}>
                  <XCircle className="h-4 w-4 mr-1" />
                  Close Issue
                </Button>
              )}

              <Button
                variant="outline"
                className="text-destructive hover:text-destructive border-destructive/30"
                onClick={() => setDialogAction('delete')}
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Delete
              </Button>
            </div>
          </div>
        ) : (
          <p className="text-muted-foreground">Issue not found.</p>
        )}
      </div>

      {dialogAction && (
        <ConfirmDialog
          open={true}
          onOpenChange={(open) => !open && setDialogAction(null)}
          {...dialogConfig[dialogAction]}
        />
      )}
    </PageWrapper>
  );
}
