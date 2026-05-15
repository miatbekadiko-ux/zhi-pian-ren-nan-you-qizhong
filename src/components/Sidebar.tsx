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
  collapsed?: boolean;
  onVipClick?: () => void;
}

export function Sidebar({ active, locked = false, collapsed = false, onVipClick }: SidebarProps) {
  const router = useRouter();
  const [hovered, setHovered] = React.useState<string | null>(null);
  const [vipHovered, setVipHovered] = React.useState(false);
  const items = [
    { key: 'home', icon: 'home', label: '首页' },
    { key: 'chat', icon: 'chat', label: '聊天' },
    { key: 'user', icon: 'user', label: '我的' },
    { key: 'gear', icon: 'gear', label: '设置' },
  ];

  if (collapsed) {
    return (
      <div style={{ width: 60, background: '#0d0d0d', borderRight: `1px solid ${T.border}`, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px 0', gap: 8, flexShrink: 0 }}>
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
              title={it.label}
              style={{
                width: 44, height: 44, borderRadius: 14,
                background: overlay ? 'rgba(212,83,126,0.18)' : 'transparent',
                border: `1px solid ${overlay ? T.pink : 'transparent'}`,
                color: overlay ? T.pink : 'rgba(255,255,255,0.75)',
                cursor: locked ? 'default' : 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'background 0.2s ease, color 0.2s ease',
              }}
            >
              <Icon name={it.icon} size={20} />
            </button>
          );
        })}
        <div style={{ flex: 1 }} />
        <button
          type="button"
          title="会员"
          onClick={() => onVipClick ? onVipClick() : router.push('/settings')}
          onMouseEnter={() => setVipHovered(true)}
          onMouseLeave={() => setVipHovered(false)}
          style={{ width: 44, height: 44, borderRadius: 14, background: vipHovered ? 'rgba(201,161,110,0.15)' : 'transparent', border: `1px solid ${vipHovered ? 'rgba(201,161,110,0.7)' : 'rgba(201,161,110,0.3)'}`, color: '#C9A16E', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.2s ease, border 0.2s ease' }}
        >
          <Icon name="gem" size={20} color="#C9A16E" />
        </button>
      </div>
    );
  }

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
              width: '100%', display: 'flex', alignItems: 'center', gap: 14, padding: '18px 20px', borderRadius: 20,
              background: overlay ? 'rgba(255,255,255,0.10)' : 'transparent',
              border: overlay ? '1px solid rgba(255,255,255,0.15)' : '1px solid rgba(255,255,255,0.06)',
              cursor: locked ? 'default' : 'pointer',
              textAlign: 'left', fontSize: 16, fontWeight: 500,
              transition: 'background 0.2s ease',
            }}
          >
            <div style={{ width: 42, height: 42, borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', background: overlay ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.06)', color: locked ? '#3a3437' : overlay ? '#ffffff' : 'rgba(255,255,255,0.75)', transition: 'background 0.2s ease' }}>
              <Icon name={it.icon} size={22} />
            </div>
            <span style={{ color: overlay ? '#ffffff' : 'rgba(255,255,255,0.75)' }}>{it.label}</span>
          </button>
        );
      })}
      <div style={{ marginTop: 10, padding: '20px 18px', borderRadius: 20, background: vipHovered ? 'rgba(255,255,255,0.10)' : 'transparent', border: `1.5px solid ${vipHovered ? 'rgba(201,161,110,0.7)' : 'rgba(201,161,110,0.35)'}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, cursor: 'pointer', transition: 'background 0.2s ease, border 0.2s ease' }} onClick={() => onVipClick ? onVipClick() : router.push('/settings')} onMouseEnter={() => setVipHovered(true)} onMouseLeave={() => setVipHovered(false)}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Icon name="gem" size={20} color="#C9A16E" />
          <span style={{ fontSize: 14, fontWeight: 700, color: '#C9A16E' }}>会员</span>
        </div>
        <span style={{ padding: '6px 12px', borderRadius: 999, background: '#E61B3E', color: '#fff', fontSize: 13, fontWeight: 700 }}>-70%</span>
      </div>
    </div>
  );
}
