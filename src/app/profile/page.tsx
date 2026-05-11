'use client';
import { useRequireAuth } from '@/lib/useAuth';
import { PageProfile } from '@/components/pages/Profile';

export default function ProfilePage() {
  const isAuthed = useRequireAuth();
  if (!isAuthed) return null;
  return <div style={{ height: '100vh' }}><PageProfile /></div>;
}
