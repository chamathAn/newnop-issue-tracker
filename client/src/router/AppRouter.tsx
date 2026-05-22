import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';
import { LoginPage } from '@/pages/LoginPage';
import { RegisterPage } from '@/pages/RegisterPage';
import { DashboardPage } from '@/pages/DashboardPage';
import { IssuesPage } from '@/pages/IssuesPage';
import { IssueDetailPage } from '@/pages/IssueDetailPage';
import { CreateIssuePage } from '@/pages/CreateIssuePage';
import { EditIssuePage } from '@/pages/EditIssuePage';

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/issues" element={<IssuesPage />} />
          <Route path="/issues/new" element={<CreateIssuePage />} />
          <Route path="/issues/:id" element={<IssueDetailPage />} />
          <Route path="/issues/:id/edit" element={<EditIssuePage />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
