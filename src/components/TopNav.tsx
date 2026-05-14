'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { T } from '@/lib/tokens';
import { useAuthState } from '@/lib/useAuth';

export function TopNav({ onPremiumClick }: { onPremiumClick?: () => void }) {
  const router = useRouter();
  const { isLoggedIn, email } = useAuthState();
  const [dropOpen, setDropOpen] = React.useState(false);
  const dropRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!dropOpen) return;
    const handler = (e: MouseEvent) => {
      if (dropRef.current && !dropRef.current.contains(e.target as Node)) setDropOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [dropOpen]);

  return (
    <div style={{ flexShrink: 0, height: 68, padding: '0 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#111111', borderBottom: `1px solid ${T.border}`, zIndex: 30 }}>
      <div style={{ fontSize: 24, fontWeight: 700, color: '#fff', lineHeight: 1.05, letterSpacing: -0.5 }}>
        纸片人<span style={{ color: T.pink }}>男友</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 48 }}>
        {isLoggedIn ? (
          <>
            <button
              onClick={onPremiumClick}
              type="button"
              style={{
                height: 40,
                padding: '0 18px',
                borderRadius: 24,
                border: '1.5px solid',
                borderColor: 'rgba(139,92,246,0.8)',
                background: 'linear-gradient(135deg, rgba(45,18,80,0.95) 0%, rgba(25,10,50,0.95) 100%)',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                whiteSpace: 'nowrap',
                boxShadow: '0 0 12px rgba(139,92,246,0.35), inset 0 0 12px rgba(139,92,246,0.08)',
              }}
            >
              <div style={{
                width: 18, height: 18, borderRadius: 4,
                background: 'linear-gradient(135deg, #a78bfa 0%, #7c3aed 50%, #4c1d95 100%)',
                boxShadow: '0 0 8px rgba(167,139,250,0.8)',
                transform: 'rotate(45deg)',
                flexShrink: 0,
              }} />
              <span style={{ color: '#ffffff', fontSize: 13, fontWeight: 700 }}>高级会员</span>
              <span style={{ color: '#ff5555', fontSize: 13, fontWeight: 800 }}>7折优惠</span>
            </button>
            <div ref={dropRef} style={{ position: 'relative' }}>
              <div
                onClick={() => setDropOpen(v => !v)}
                style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}
              >
                <div style={{ width: 40, height: 40, borderRadius: '50%', background: `linear-gradient(140deg, ${T.pinkHi}, ${T.pink})`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: 16 }}>
                  {email ? email[0].toUpperCase() : '我'}
                </div>
                <span style={{ color: 'rgba(255,255,255,0.85)', fontSize: 14, fontWeight: 500 }}>我的</span>
                <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12, transition: 'transform 0.2s', display: 'inline-block', transform: dropOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}>∨</span>
              </div>

              {dropOpen && (
                <div style={{ position: 'absolute', top: 52, right: 0, width: 160, background: '#1a1a1a', border: `1px solid ${T.border}`, borderRadius: 12, overflow: 'hidden', zIndex: 100, boxShadow: '0 12px 36px rgba(0,0,0,0.5)' }}>
                  <div
                    onClick={() => { setDropOpen(false); router.push('/profile'); }}
                    style={{ padding: '13px 18px', fontSize: 14, color: '#ffffff', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10, transition: 'color 0.15s' }}
                    onMouseEnter={e => { e.currentTarget.style.color = T.pink; e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; const svg = e.currentTarget.querySelector('svg'); if (svg) svg.setAttribute('fill', T.pink); }}
                    onMouseLeave={e => { e.currentTarget.style.color = '#ffffff'; e.currentTarget.style.background = 'transparent'; const svg = e.currentTarget.querySelector('svg'); if (svg) svg.setAttribute('fill', 'white'); }}
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="white"><path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/></svg>
                    我的资料
                  </div>
                  <div style={{ height: 1, background: T.border }} />
                  <div
                    onClick={async () => { setDropOpen(false); await fetch('/api/auth/logout', { method: 'POST' }); router.push('/auth'); }}
                    style={{ padding: '13px 18px', fontSize: 14, color: '#ffffff', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10, transition: 'color 0.15s' }}
                    onMouseEnter={e => { e.currentTarget.style.color = T.pink; e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; const svg = e.currentTarget.querySelector('svg'); if (svg) svg.setAttribute('fill', T.pink); }}
                    onMouseLeave={e => { e.currentTarget.style.color = '#ffffff'; e.currentTarget.style.background = 'transparent'; const svg = e.currentTarget.querySelector('svg'); if (svg) svg.setAttribute('fill', 'white'); }}
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="white"><path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5-5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"/></svg>
                    退出登录
                  </div>
                </div>
              )}
            </div>
          </>
        ) : (
          <button
            onClick={() => router.push('/auth')}
            type="button"
            style={{ padding: '12px 24px', borderRadius: 999, border: '2px solid transparent', borderImage: 'linear-gradient(140deg, #FFD700, #FFB347) 1', background: '#111', color: '#FFD700', fontWeight: 700, cursor: 'pointer' }}
          >
            登录 / 注册
          </button>
        )}
      </div>
    </div>
  );
}
