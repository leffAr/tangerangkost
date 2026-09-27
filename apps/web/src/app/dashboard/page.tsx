'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';

export default function DashboardRedirect() {
  const router = useRouter();

  useEffect(() => {
    async function checkRole() {
      try {
        const { data } = await api.get('/auth/me');
        if (data.role === 'ADMIN') {
          router.push('/admin');
        } else if (data.role === 'OWNER') {
          router.push('/owner');
        } else {
          router.push('/user');
        }
      } catch (error) {
        router.push('/login');
      }
    }
    checkRole();
  }, [router]);

  return (
    <div className="flex h-screen items-center justify-center">
      <p>Mengalihkan ke dashboard...</p>
    </div>
  );
}
