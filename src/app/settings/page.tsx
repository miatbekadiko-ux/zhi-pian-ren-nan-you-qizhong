'use client';
import { useRequireAuth } from '@/lib/useAuth';
import { PageSettings } from '@/components/pages/Settings';

export default function SettingsPage() {
  const isAuthed = useRequireAuth();
  if (!isAuthed) return null;
  return <div style={{ height: '100vh' }}><PageSettings /></div>;
}
