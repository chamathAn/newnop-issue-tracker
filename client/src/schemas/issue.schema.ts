import { z } from 'zod';

export const issueSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title cannot exceed 200 characters'),
  description: z.string().min(1, 'Description is required'),
  priority: z.enum(['low', 'medium', 'high', 'critical'], { message: 'Select a priority' }),
  severity: z.enum(['minor', 'major', 'critical', 'blocker']).optional(),
  status: z.enum(['open', 'in-progress', 'resolved', 'closed']).optional(),
  assignee: z.string().optional(),
});

export type IssueFormValues = z.infer<typeof issueSchema>;
