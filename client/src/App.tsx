import { useEffect } from 'react';
import { Toaster } from '@/components/ui/sonner';
import { AppRouter } from '@/router/AppRouter';
import { useAuthStore } from '@/stores/authStore';
import './index.css';

function App() {
  const initFromStorage = useAuthStore((s) => s.initFromStorage);

  useEffect(() => {
    initFromStorage();
  }, [initFromStorage]);

  return (
    <>
      <AppRouter />
      <Toaster richColors position="top-right" />
    </>
  );
}

export default App;
