import { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { issueSchema, type IssueFormValues } from '@/schemas/issue.schema';
import { issuesApi } from '@/api/issues.api';
import type { Issue, User } from '@/types';

interface IssueFormProps {
  defaultValues?: Partial<IssueFormValues>;
  issue?: Issue;
  onSubmit: (values: IssueFormValues) => Promise<void>;
  isEdit?: boolean;
}

export function IssueForm({ defaultValues, issue, onSubmit, isEdit = false }: IssueFormProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    issuesApi.getUsers().then(setUsers).catch(() => {});
  }, []);

  const form = useForm<IssueFormValues>({
    resolver: zodResolver(issueSchema),
    defaultValues: {
      title: issue?.title ?? defaultValues?.title ?? '',
      description: issue?.description ?? defaultValues?.description ?? '',
      priority: issue?.priority ?? defaultValues?.priority ?? 'medium',
      severity: issue?.severity ?? defaultValues?.severity,
      status: issue?.status ?? defaultValues?.status,
      assignee: issue?.assignee?._id ?? defaultValues?.assignee ?? '',
    },
  });

  const handleSubmit = async (values: IssueFormValues) => {
    setIsSubmitting(true);
    try {
      await onSubmit(values);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-5">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title <span className="text-destructive">*</span></FormLabel>
              <FormControl>
                <Input placeholder="Brief description of the issue" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description <span className="text-destructive">*</span></FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Detailed explanation, steps to reproduce, expected vs actual behavior..."
                  rows={5}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="priority"
            render={() => (
              <FormItem>
                <FormLabel>Priority <span className="text-destructive">*</span></FormLabel>
                <Controller
                  control={form.control}
                  name="priority"
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="critical">Critical</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="severity"
            render={() => (
              <FormItem>
                <FormLabel>Severity</FormLabel>
                <Controller
                  control={form.control}
                  name="severity"
                  render={({ field }) => (
                    <Select
                      onValueChange={(v) => field.onChange(v === 'none' ? undefined : v)}
                      value={field.value ?? 'none'}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select severity (optional)" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="none">None</SelectItem>
                        <SelectItem value="minor">Minor</SelectItem>
                        <SelectItem value="major">Major</SelectItem>
                        <SelectItem value="critical">Critical</SelectItem>
                        <SelectItem value="blocker">Blocker</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {isEdit && (
            <FormField
              control={form.control}
              name="status"
              render={() => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Controller
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="open">Open</SelectItem>
                          <SelectItem value="in-progress">In Progress</SelectItem>
                          <SelectItem value="resolved">Resolved</SelectItem>
                          <SelectItem value="closed">Closed</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          <FormField
            control={form.control}
            name="assignee"
            render={() => (
              <FormItem>
                <FormLabel>Assignee</FormLabel>
                <Controller
                  control={form.control}
                  name="assignee"
                  render={({ field }) => (
                    <Select
                      onValueChange={(v) => field.onChange(v === 'unassigned' ? '' : v)}
                      value={field.value || 'unassigned'}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Assign to…" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="unassigned">Unassigned</SelectItem>
                        {users.map((user) => (
                          <SelectItem key={user._id} value={user._id}>
                            {user.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex gap-3 pt-2">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving…' : isEdit ? 'Save changes' : 'Create issue'}
          </Button>
          <Button type="button" variant="outline" onClick={() => window.history.back()}>
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  );
}
