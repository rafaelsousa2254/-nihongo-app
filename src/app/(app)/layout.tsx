'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/store/useAppStore';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';

function useAuthCheck() {
  const router = useRouter();
  const [isReady, setIsReady] = useState<boolean>(false);
  const isAuthenticated = useAppStore((s) => s.isAuthenticated);

  useEffect(() => {
    if (isAuthenticated) {
      setIsReady(true);
    } else {
      const storedToken = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      if (!storedToken) {
        router.push('/');
        setIsReady(false);
      } else {
        setIsReady(true);
      }
    }
  }, [isAuthenticated, router]);

  return { isReady };
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const isReady = useAuthCheck();
  const { logout } = useAppStore();

  const handleLogout = () => {
    logout();
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
    window.location.href = '/';
  };

  if (!isReady) return null;

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
