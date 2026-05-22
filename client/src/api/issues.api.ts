import api from './axios';
import type { Issue, PaginatedIssues, CreateIssueData, UpdateIssueData, IssueFilters, User } from '@/types';

interface GetIssuesParams extends Partial<IssueFilters> {
  page?: number;
  limit?: number;
  sort?: string;
}

export const issuesApi = {
  getIssues: (params: GetIssuesParams = {}) =>
    api.get<PaginatedIssues>('/issues', { params }).then((r) => r.data),

  exportIssues: (params: Partial<IssueFilters> & { format: 'csv' | 'json' }) =>
    api.get('/issues/export', { params, responseType: 'blob' }).then((r) => r.data),

  getIssue: (id: string) => api.get<Issue>(`/issues/${id}`).then((r) => r.data),

  createIssue: (data: CreateIssueData) =>
    api.post<Issue>('/issues', data).then((r) => r.data),

  updateIssue: (id: string, data: UpdateIssueData) =>
    api.patch<Issue>(`/issues/${id}`, data).then((r) => r.data),

  deleteIssue: (id: string) =>
    api.delete<{ message: string }>(`/issues/${id}`).then((r) => r.data),

  getUsers: () => api.get<User[]>('/users').then((r) => r.data),
};
