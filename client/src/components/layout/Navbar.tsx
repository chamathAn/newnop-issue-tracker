import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, ListChecks, LogOut, Bug } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useAuthStore } from '@/stores/authStore';
import { cn } from '@/lib/utils';

const navLinks = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { to: '/issues', label: 'Issues', icon: ListChecks, exact: false },
];

export function Navbar() {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const initials = user?.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <header className="sticky top-0 z-50 bg-background border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center gap-6">
        <div className="flex items-center gap-2 font-semibold text-lg mr-2">
          <Bug className="h-5 w-5 text-primary" />
          <span>IssueTracker</span>
        </div>

        <Separator orientation="vertical" className="h-5" />

        <nav className="flex items-center gap-1">
          {navLinks.map(({ to, label, icon: Icon, exact }) => (
            <NavLink
              key={to}
              to={to}
              end={exact}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                )
              }
            >
              <Icon className="h-4 w-4" />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Avatar className="h-7 w-7">
              <AvatarFallback className="text-xs">{initials}</AvatarFallback>
            </Avatar>
            <span className="text-sm font-medium hidden sm:block">{user?.name}</span>
          </div>
          <Button variant="ghost" size="icon" onClick={handleLogout} title="Sign out">
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  );
}
