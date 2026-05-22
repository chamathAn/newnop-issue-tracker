import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Pencil, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { StatusBadge } from './StatusBadge';
import { PriorityBadge } from './PriorityBadge';
import { SeverityBadge } from './SeverityBadge';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { useIssueStore } from '@/stores/issueStore';
import type { Issue } from '@/types';

interface IssueTableProps {
  issues: Issue[];
}

export function IssueTable({ issues }: IssueTableProps) {
  const deleteIssue = useIssueStore((s) => s.deleteIssue);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteIssue(deleteTarget);
      toast.success('Issue deleted');
    } catch {
      toast.error('Failed to delete issue');
    } finally {
      setDeleteTarget(null);
    }
  };

  return (
    <>
      <div className="rounded-md border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="min-w-[200px]">Title</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Severity</TableHead>
              <TableHead>Assignee</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="w-[80px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {issues.map((issue) => (
              <TableRow key={issue._id}>
                <TableCell className="font-medium">
                  <Link
                    to={`/issues/${issue._id}`}
                    className="hover:text-primary hover:underline underline-offset-4 transition-colors line-clamp-1"
                  >
                    {issue.title}
                  </Link>
                </TableCell>
                <TableCell>
                  <StatusBadge status={issue.status} />
                </TableCell>
                <TableCell>
                  <PriorityBadge priority={issue.priority} />
                </TableCell>
                <TableCell>
                  <SeverityBadge severity={issue.severity} />
                </TableCell>
                <TableCell className="text-muted-foreground text-sm">
                  {issue.assignee?.name ?? '—'}
                </TableCell>
                <TableCell className="text-muted-foreground text-sm whitespace-nowrap">
                  {new Date(issue.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" asChild>
                      <Link to={`/issues/${issue._id}/edit`} title="Edit">
                        <Pencil className="h-3.5 w-3.5" />
                      </Link>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setDeleteTarget(issue._id)}
                      title="Delete"
                      className="hover:text-destructive"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Delete issue"
        description="This action cannot be undone. The issue will be permanently deleted."
        confirmLabel="Delete"
        variant="destructive"
        onConfirm={handleDelete}
      />
    </>
  );
}
