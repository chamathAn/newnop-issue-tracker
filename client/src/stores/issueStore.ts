import { create } from 'zustand';
import { issuesApi } from '@/api/issues.api';
import type { Issue, IssueFilters, CreateIssueData, UpdateIssueData } from '@/types';

interface IssueState {
  issues: Issue[];
  total: number;
  page: number;
  totalPages: number;
  isLoading: boolean;
  error: string | null;
  filters: IssueFilters;
  fetchIssues: () => Promise<void>;
  setFilter: (key: keyof IssueFilters, value: string) => void;
  setPage: (page: number) => void;
  createIssue: (data: CreateIssueData) => Promise<void>;
  updateIssue: (id: string, data: UpdateIssueData) => Promise<void>;
  deleteIssue: (id: string) => Promise<void>;
}

export const useIssueStore = create<IssueState>((set, get) => ({
  issues: [],
  total: 0,
  page: 1,
  totalPages: 1,
  isLoading: false,
  error: null,
  filters: { search: '', status: '', priority: '', severity: '' },

  fetchIssues: async () => {
    set({ isLoading: true, error: null });
    try {
      const { filters, page } = get();
      const params = {
        page,
        limit: 20,
        ...(filters.search && { search: filters.search }),
        ...(filters.status && { status: filters.status }),
        ...(filters.priority && { priority: filters.priority }),
        ...(filters.severity && { severity: filters.severity }),
      };
      const data = await issuesApi.getIssues(params);
      set({ issues: data.issues, total: data.total, totalPages: data.totalPages, isLoading: false });
    } catch {
      set({ isLoading: false, error: 'Failed to fetch issues' });
    }
  },

  setFilter: (key, value) => {
    set((state) => ({ filters: { ...state.filters, [key]: value }, page: 1 }));
    get().fetchIssues();
  },

  setPage: (page) => {
    set({ page });
    get().fetchIssues();
  },

  createIssue: async (data) => {
    await issuesApi.createIssue(data);
    await get().fetchIssues();
  },

  updateIssue: async (id, data) => {
    await issuesApi.updateIssue(id, data);
    await get().fetchIssues();
  },

  deleteIssue: async (id) => {
    await issuesApi.deleteIssue(id);
    await get().fetchIssues();
  },
}));
