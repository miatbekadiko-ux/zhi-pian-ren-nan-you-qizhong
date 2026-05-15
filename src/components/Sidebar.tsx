'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { T } from '@/lib/tokens';
import { Icon } from './Icon';

const SIDEBAR_KEY = 'zprn_sidebar_collapsed';

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

export function Sidebar({ active, locked = false, onVipClick }: SidebarProps) {
  const router = useRouter();
  const [collapsed, setCollapsed] = React.useState(() => {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem(SIDEBAR_KEY) === 'true';
  });
  const [hovered, setHovered] = React.useState<string | null>(null);
  const [vipHovered, setVipHovered] = React.useState(false);

  React.useEffect(() => {
    const handler = () => {
      setCollapsed(localStorage.getItem(SIDEBAR_KEY) === 'true');
    };
    window.addEventListener('sidebar-toggle', handler);
    return () => window.removeEventListener('sidebar-toggle', handler);
  }, []);

  const handleNav = (key: string) => {
    if (locked) return;
    if (key === 'home') {
      localStorage.setItem(SIDEBAR_KEY, 'false');
      setCollapsed(false);
      window.dispatchEvent(new Event('sidebar-toggle'));
    } else {
      localStorage.setItem(SIDEBAR_KEY, 'true');
      setCollapsed(true);
      window.dispatchEvent(new Event('sidebar-toggle'));
    }
    router.push(NAV_MAP[key]);
  };

  const items = [
    { key: 'home', icon: 'home', label: '首页' },
    { key: 'chat', icon: 'chat', label: '聊天' },
    { key: 'user', icon: 'user', label: '我的' },
    { key: 'gear', icon: 'gear', label: '设置' },
  ];

  return (
    <div style={{
      width: collapsed ? 90 : 220,
      background: '#0d0d0d',
      borderRight: `1px solid ${T.border}`,
      display: 'flex',
      flexDirection: 'column',
      alignItems: collapsed ? 'center' : 'stretch',
      padding: collapsed ? '24px 0' : '24px 18px',
      gap: 16,
      flexShrink: 0,
      overflow: 'visible',
      transition: 'width 0.28s cubic-bezier(0.4,0,0.2,1)',
    }}>
      {items.map(it => {
        const isActive = !locked && it.key === active;
        const isHover = hovered === it.key;
        const overlay = isActive || isHover;

        if (collapsed) {
          return (
            <div key={it.key} style={{ position: 'relative', flexShrink: 0 }}>
              <button
                type="button"
                onClick={() => handleNav(it.key)}
                onMouseEnter={() => setHovered(it.key)}
                onMouseLeave={() => setHovered(null)}
                style={{
                  width: 52, height: 52, borderRadius: 16,
                  background: overlay ? 'rgba(255,255,255,0.18)' : 'rgba(255,255,255,0.05)',
                  border: overlay ? '1px solid rgba(255,255,255,0.25)' : '1px solid rgba(255,255,255,0.06)',
                  color: '#ffffff',
                  cursor: locked ? 'default' : 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'background 0.2s ease, border-color 0.2s ease',
                  boxShadow: overlay ? '0 2px 12px rgba(255,255,255,0.08)' : 'none',
                  flexShrink: 0,
                }}
              >
                <Icon name={it.icon} size={24} />
              </button>
              <span style={{
                position: 'absolute',
                left: 'calc(100% + 8px)', top: '50%', transform: 'translateY(-50%)',
                background: 'rgba(40,40,40,0.95)', color: '#ffffff',
                fontSize: 13, padding: '6px 10px', borderRadius: 6, whiteSpace: 'nowrap',
                opacity: isHover ? 1 : 0, pointerEvents: 'none',
                transition: 'opacity 0.15s ease',
                zIndex: 9999,
              }}>{it.label}</span>
            </div>
          );
        }

        return (
          <button
            type="button"
            key={it.key}
            onClick={() => handleNav(it.key)}
            onMouseEnter={() => setHovered(it.key)}
            onMouseLeave={() => setHovered(null)}
            style={{
              width: '100%', display: 'flex', alignItems: 'center', gap: 14,
              padding: '1px 20px', borderRadius: 14,
              background: overlay ? 'rgba(255,255,255,0.10)' : 'transparent',
              border: overlay ? '1px solid rgba(255,255,255,0.15)' : '1px solid rgba(255,255,255,0.06)',
              cursor: locked ? 'default' : 'pointer',
              textAlign: 'left', fontSize: 16, fontWeight: 500,
              transition: 'background 0.2s ease',
              flexShrink: 0,
            }}
          >
            <div style={{ width: 42, height: 42, borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'transparent', color: locked ? '#3a3437' : overlay ? '#ffffff' : 'rgba(255,255,255,0.75)', transition: 'background 0.2s ease', flexShrink: 0 }}>
              <Icon name={it.icon} size={22} />
            </div>
            <span style={{ color: overlay ? '#ffffff' : 'rgba(255,255,255,0.75)', whiteSpace: 'nowrap' }}>{it.label}</span>
          </button>
        );
      })}

      {/* 会员按钮 */}
      {collapsed ? (
        <div style={{ position: 'relative', flexShrink: 0 }}>
          <button
            type="button"
            onClick={() => onVipClick ? onVipClick() : router.push('/settings')}
            onMouseEnter={() => setVipHovered(true)}
            onMouseLeave={() => setVipHovered(false)}
            style={{
              width: 52, height: 52, borderRadius: 16,
              background: vipHovered
                ? 'linear-gradient(to top, rgba(180,120,30,0.65) 0%, rgba(100,65,10,0.2) 60%, rgba(20,16,8,1) 100%)'
                : 'linear-gradient(to top, rgba(150,100,20,0.5) 0%, rgba(80,50,8,0.15) 60%, rgba(20,16,8,1) 100%)',
              border: '1px solid rgba(201,161,110,0.25)',
              color: '#fff', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'background 0.2s ease',
              boxShadow: vipHovered ? '0 4px 14px rgba(180,130,50,0.3)' : 'none',
              position: 'relative',
              overflow: 'hidden',
              flexShrink: 0,
            }}
          >
            <svg width="8" height="8" viewBox="0 0 14 14" fill="none"
              style={{ position: 'absolute', top: 7, left: 7 }}>
              <line x1="7" y1="0" x2="7" y2="14" stroke="rgba(255,210,100,0.8)" strokeWidth="1.8" strokeLinecap="round"/>
              <line x1="0" y1="7" x2="14" y2="7" stroke="rgba(255,210,100,0.8)" strokeWidth="1.8" strokeLinecap="round"/>
              <line x1="2" y1="2" x2="12" y2="12" stroke="rgba(255,210,100,0.8)" strokeWidth="1.4" strokeLinecap="round"/>
              <line x1="12" y1="2" x2="2" y2="12" stroke="rgba(255,210,100,0.8)" strokeWidth="1.4" strokeLinecap="round"/>
              <circle cx="7" cy="0.5" r="1.5" fill="rgba(255,210,100,0.8)"/>
              <circle cx="7" cy="13.5" r="1.5" fill="rgba(255,210,100,0.8)"/>
              <circle cx="0.5" cy="7" r="1.5" fill="rgba(255,210,100,0.8)"/>
              <circle cx="13.5" cy="7" r="1.5" fill="rgba(255,210,100,0.8)"/>
            </svg>
            <Icon name="gem" size={20} color="#E8C060" />
          </button>
          <span style={{
            position: 'absolute',
            left: 'calc(100% + 8px)', top: '50%', transform: 'translateY(-50%)',
            background: 'rgba(40,40,40,0.95)', color: '#ffffff',
            fontSize: 13, padding: '4px 10px', borderRadius: 6, whiteSpace: 'nowrap',
            opacity: vipHovered ? 1 : 0, pointerEvents: 'none',
            transition: 'opacity 0.15s ease',
            zIndex: 100,
          }}>会员</span>
        </div>
      ) : (
        <div
          style={{ marginTop: 10, padding: '1px 20px', borderRadius: 14, background: vipHovered ? 'rgba(255,255,255,0.10)' : 'transparent', border: `1.5px solid ${vipHovered ? 'rgba(201,161,110,0.7)' : 'rgba(201,161,110,0.35)'}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, cursor: 'pointer', transition: 'background 0.2s ease, border 0.2s ease', flexShrink: 0 }}
          onClick={() => onVipClick ? onVipClick() : router.push('/settings')}
          onMouseEnter={() => setVipHovered(true)}
          onMouseLeave={() => setVipHovered(false)}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 42, height: 42, borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Icon name="gem" size={20} color="#C9A16E" />
            </div>
            <span style={{ fontSize: 14, fontWeight: 700, color: '#C9A16E', whiteSpace: 'nowrap' }}>会员</span>
          </div>
          <span style={{ padding: '3px 7px', borderRadius: 999, background: '#E61B3E', color: '#fff', fontSize: 11, fontWeight: 700, whiteSpace: 'nowrap' }}>-70%</span>
        </div>
      )}
    </div>
  );
}