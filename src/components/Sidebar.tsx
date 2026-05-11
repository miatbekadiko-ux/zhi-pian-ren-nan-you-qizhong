'use client';

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
  const items = [
    { key: 'home', icon: 'home' },
    { key: 'chat', icon: 'chat' },
    { key: 'user', icon: 'user' },
    { key: 'gear', icon: 'gear' },
  ];
  return (
    <div style={{ width: 64, background: T.panel, borderRight: `1px solid ${T.border}`, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '16px 0 18px', gap: 6, flexShrink: 0 }}>
      <div style={{ width: 36, height: 36, borderRadius: '50%', background: `linear-gradient(140deg, ${T.pinkHi}, ${T.pink})`, color: 'white', fontFamily: '"Noto Serif SC", serif', fontWeight: 700, fontSize: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 14px rgba(212,83,126,0.35)', marginBottom: 12 }}>纸</div>
      {items.map(it => {
        const isActive = !locked && it.key === active;
        return (
          <div
            key={it.key}
            onClick={() => !locked && router.push(NAV_MAP[it.key])}
            style={{
              width: 40, height: 40, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: isActive ? T.pinkSoft : 'transparent',
              color: isActive ? T.pink : (locked ? '#3a3437' : T.textMute),
              cursor: locked ? 'default' : 'pointer',
            }}
          >
            <Icon name={it.icon} size={19} />
          </div>
        );
      })}
      <div style={{ flex: 1 }} />
      <div style={{ position: 'relative', width: 40, height: 40 }}>
        <div style={{ position: 'absolute', inset: -6, borderRadius: 14, background: 'radial-gradient(circle, rgba(212,83,126,0.55) 0%, rgba(139,0,255,0.35) 50%, transparent 75%)', filter: 'blur(6px)', pointerEvents: 'none' }} />
        <div title="升级 Premium" style={{
          position: 'relative', width: 40, height: 40, borderRadius: 11,
          background: 'linear-gradient(140deg, #FFB347 0%, #D4537E 45%, #8B00FF 100%)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#FFF6CC',
          boxShadow: active === 'vip'
            ? '0 6px 22px rgba(212,83,126,0.7), inset 0 1px 0 rgba(255,255,255,0.5), 0 0 0 2px rgba(255,255,255,0.25)'
            : '0 4px 16px rgba(212,83,126,0.5), inset 0 1px 0 rgba(255,255,255,0.4)',
          cursor: 'pointer',
          transform: active === 'vip' ? 'scale(1.05)' : 'none',
          transition: 'all 0.2s',
        }}>
          <Icon name="gem" size={18} color="#FFF6CC" />
          <div style={{ position: 'absolute', top: -3, right: -3, minWidth: 14, height: 14, padding: '0 4px', borderRadius: 7, background: '#FFD23F', color: '#3a1a04', fontSize: 9, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1.5px solid ' + T.panel, letterSpacing: 0.3 }}>VIP</div>
        </div>
      </div>
    </div>
  );
}
