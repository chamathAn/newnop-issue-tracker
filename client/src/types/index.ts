export type IssueStatus = 'open' | 'in-progress' | 'resolved' | 'closed';
export type IssuePriority = 'low' | 'medium' | 'high' | 'critical';
export type IssueSeverity = 'minor' | 'major' | 'critical' | 'blocker';

export interface User {
  _id: string;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export interface Issue {
  _id: string;
  title: string;
  description: string;
  status: IssueStatus;
  priority: IssuePriority;
  severity?: IssueSeverity;
  assignee?: Pick<User, '_id' | 'name' | 'email'>;
  createdBy: Pick<User, '_id' | 'name' | 'email'>;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedIssues {
  issues: Issue[];
  total: number;
  page: number;
  totalPages: number;
}

export interface IssueFilters {
  search: string;
  status: IssueStatus | '';
  priority: IssuePriority | '';
  severity: IssueSeverity | '';
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
}

export interface CreateIssueData {
  title: string;
  description: string;
  priority: IssuePriority;
  severity?: IssueSeverity;
  assignee?: string;
}

export interface UpdateIssueData extends Partial<CreateIssueData> {
  status?: IssueStatus;
}
