import { useEffect } from 'react';

interface PageWrapperProps {
  title: string;
  children: React.ReactNode;
}

export function PageWrapper({ title, children }: PageWrapperProps) {
  useEffect(() => {
    document.title = `${title} — IssueTracker`;
  }, [title]);

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 w-full">
      {children}
    </main>
  );
}
