'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export function useRequireAuth() {
  const router = useRouter();
  const [isAuthed, setIsAuthed] = useState(false);

  useEffect(() => {
    if (localStorage.getItem('isLoggedIn') === 'true') {
      setIsAuthed(true);
    } else {
      router.replace('/auth');
    }
  }, [router]);

  return isAuthed;
}

export function useAuthState() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState('');

  useEffect(() => {
    setIsLoggedIn(localStorage.getItem('isLoggedIn') === 'true');
    setEmail(localStorage.getItem('userEmail') ?? '');
  }, []);

  return { isLoggedIn, email };
}
