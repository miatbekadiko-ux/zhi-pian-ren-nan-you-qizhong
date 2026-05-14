'use client';

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export function useRequireAuth() {
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace('/auth');
    }
  }, [status, router]);

  return status === 'authenticated';
}

export function useAuthState() {
  const { data: session, status } = useSession();
  return {
    isLoggedIn: status === 'authenticated',
    isLoading: status === 'loading',
    email: session?.user?.email ?? '',
    userId: session?.user?.id ?? null,
    name: session?.user?.name ?? '',
  };
}
