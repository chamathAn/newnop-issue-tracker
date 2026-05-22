import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { Navbar } from '@/components/layout/Navbar';

export function ProtectedRoute() {
  const user = useAuthStore((s) => s.user);

  if (!user) return <Navigate to="/login" replace />;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <Outlet />
    </div>
  );
}
