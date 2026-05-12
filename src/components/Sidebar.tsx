'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { T } from '@/lib/tokens';
import { Icon } from './Icon';

const NAV_MAP: Record<string, string> = {
  home: '/',
  chat: '/chat',
  user: '/profile',
  gear: '/settings',
};

interface SidebarProps {
  active: string;
  locked?: boolean;
}

export function Sidebar({ active, locked = false }: SidebarProps) {
  const router = useRouter();
  const [hovered, setHovered] = React.useState<string | null>(null);
  const items = [
    { key: 'home', icon: 'home' },
    { key: 'chat', icon: 'chat' },
    { key: 'user', icon: 'user' },
    { key: 'gear', icon: 'gear' },
  ];
  return (
    <div style={{ width: 220, background: '#0d0d0d', borderRight: `1px solid ${T.border}`, display: 'flex', flexDirection: 'column', alignItems: 'stretch', padding: '24px 18px 24px', gap: 16, flexShrink: 0 }}>
      {items.map(it => {
        const isActive = !locked && it.key === active;
        const isHover = hovered === it.key;
        const overlay = isActive || isHover;
        return (
          <button
            type="button"
            key={it.key}
            onClick={() => !locked && router.push(NAV_MAP[it.key])}
            onMouseEnter={() => setHovered(it.key)}
            onMouseLeave={() => setHovered(null)}
            style={{
              width: '100%', display: 'flex', alignItems: 'center', gap: 14, padding: '16px 18px', borderRadius: 20,
              background: overlay ? 'rgba(255,255,255,0.08)' : 'transparent',
              color: T.text,
              border: `1px solid ${T.border}`,
              cursor: locked ? 'default' : 'pointer',
              textAlign: 'left',
              fontSize: 15,
              fontWeight: 500,
              transition: 'background 0.2s ease',
            }}
          >
            <div style={{ width: 38, height: 38, borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', background: overlay ? 'rgba(255,255,255,0.08)' : T.panel2, color: locked ? '#3a3437' : T.textMute, transition: 'background 0.2s ease' }}>
              <Icon name={it.icon} size={20} />
            </div>
            <span>{it.key === 'home' ? '首页' : it.key === 'chat' ? '聊天' : it.key === 'user' ? '我的' : '设置'}</span>
          </button>
        );
      })}
      <div style={{ marginTop: 10, padding: '18px 18px', borderRadius: 24, background: 'transparent', border: '4px solid rgba(255,255,255,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, cursor: 'pointer' }} onClick={() => router.push('/settings')}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Icon name="gem" size={20} color="#C9A16E" />
          <span style={{ fontSize: 14, fontWeight: 700, color: '#C9A16E' }}>会员</span>
        </div>
        <span style={{ padding: '6px 12px', borderRadius: 999, background: '#E61B3E', color: '#fff', fontSize: 13, fontWeight: 700 }}>-70%</span>
      </div>
    </div>
  );
}
