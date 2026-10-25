'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/store/useAppStore';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';

function useAuthCheck(): boolean {
  const router = useRouter();
  const [isReady, setIsReady] = useState<boolean>(false);
  const isAuthenticated = useAppStore((s) => s.isAuthenticated);
  const token = useAppStore((s) => s.token);

  useEffect(() => {
    const storedToken = typeof window !== 'undefined' ? (localStorage.getItem('token') || token) : null;
    if (isAuthenticated || storedToken) {
      setIsReady(true);
    } else {
      router.push('/');
      setIsReady(false);
    }
  }, [isAuthenticated, token, router]);

  return isReady;
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
