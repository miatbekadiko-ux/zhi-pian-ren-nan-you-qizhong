'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { T } from '@/lib/tokens';
import { useAuthState } from '@/lib/useAuth';

const SIDEBAR_KEY = 'zprn_sidebar_collapsed';

export function useSidebarCollapsed() {
  const [collapsed, setCollapsed] = React.useState(() => {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem(SIDEBAR_KEY) === 'true';
  });

  const toggle = React.useCallback(() => {
    const current = localStorage.getItem(SIDEBAR_KEY) === 'true';
    const next = !current;
    localStorage.setItem(SIDEBAR_KEY, String(next));
    window.dispatchEvent(new Event('sidebar-toggle'));
    setCollapsed(next);
  }, []);

  React.useEffect(() => {
    const handler = () => {
      setCollapsed(localStorage.getItem(SIDEBAR_KEY) === 'true');
    };
    window.addEventListener('sidebar-toggle', handler);
    return () => window.removeEventListener('sidebar-toggle', handler);
  }, []);

  return { collapsed, toggle };
}

function ChevronDown({ open }: { open: boolean }) {
  return (
    <svg
      width="14"
      height="8"
      viewBox="0 0 14 8"
      fill="none"
      stroke="white"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ display: 'block', transition: 'transform 0.2s', transform: open ? 'rotate(180deg)' : 'rotate(0deg)', flexShrink: 0 }}
    >
      <polyline points="1,1 7,7 13,1" />
    </svg>
  );
}

export function TopNav({ onPremiumClick }: { onPremiumClick?: () => void }) {
  const router = useRouter();
  const { isLoggedIn, isLoading, email } = useAuthState();
  const [dropOpen, setDropOpen] = React.useState(false);
  const [displayChar, setDisplayChar] = React.useState('');
  const dropRef = React.useRef<HTMLDivElement>(null);
  const { toggle } = useSidebarCollapsed();

  React.useEffect(() => {
    if (!isLoggedIn) return;
    const fetchChar = () => {
      fetch('/api/user')
        .then(r => r.ok ? r.json() : Promise.reject())
        .then(data => {
          const n: string = data.nickname || data.email || '';
          setDisplayChar(n ? n[0].toUpperCase() : '我');
        })
        .catch(() => {});
    };
    fetchChar();
    window.addEventListener('user-updated', fetchChar);
    return () => window.removeEventListener('user-updated', fetchChar);
  }, [isLoggedIn, email]);

  React.useEffect(() => {
    if (!dropOpen) return;
    const handler = (e: MouseEvent) => {
      if (dropRef.current && !dropRef.current.contains(e.target as Node)) setDropOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [dropOpen]);

  const handleLogout = async () => {
    setDropOpen(false);
    await signOut({ callbackUrl: '/auth' });
  };

  return (
    <div style={{ flexShrink: 0, height: 64, padding: '0 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#111111', borderBottom: `1px solid ${T.border}`, zIndex: 30 }}>

      {/* 左侧：汉堡 + Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <button
          onClick={toggle}
          type="button"
          style={{ width: 40, height: 40, borderRadius: 10, background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.7)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}
        >
          <svg width="22" height="18" viewBox="0 0 22 18" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
            <line x1="0" y1="2" x2="22" y2="2"/>
            <line x1="0" y1="9" x2="22" y2="9"/>
            <line x1="0" y1="16" x2="22" y2="16"/>
          </svg>
        </button>
        <div style={{ fontSize: 24, fontWeight: 700, color: '#fff', lineHeight: 1.05, letterSpacing: -0.5 }}>
          纸片人<span style={{ color: T.pink }}>男友</span>
        </div>
      </div>

      {/* 右侧 */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        {isLoading ? null : isLoggedIn ? (
          <>
            {/* 已登录：高级会员按钮 */}
            <button
              onClick={onPremiumClick}
              type="button"
              style={{
                height: 36,
                padding: '0 16px',
                borderRadius: 999,
                border: '1.5px solid rgba(139,92,246,0.8)',
                background: 'linear-gradient(135deg, rgba(45,18,80,0.95) 0%, rgba(25,10,50,0.95) 100%)',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 6,
                whiteSpace: 'nowrap',
                boxShadow: '0 0 12px rgba(139,92,246,0.35)',
                lineHeight: 1,
              }}
            >
              <div style={{ width: 14, height: 14, borderRadius: 3, background: 'linear-gradient(135deg, #a78bfa 0%, #7c3aed 50%, #4c1d95 100%)', boxShadow: '0 0 8px rgba(167,139,250,0.8)', transform: 'rotate(45deg)', flexShrink: 0 }} />
              <span style={{ color: '#ffffff', fontSize: 13, fontWeight: 700, lineHeight: 1 }}>高级会员</span>
              <span style={{ color: '#ff5555', fontSize: 13, fontWeight: 800, lineHeight: 1 }}>7折优惠</span>
            </button>

            {/* 已登录：头像 + 我的 + 箭头 */}
            <div ref={dropRef} style={{ position: 'relative' }}>
              <div
                onClick={() => setDropOpen(v => !v)}
                style={{ display: 'flex', alignItems: 'center', gap: 14, cursor: 'pointer', height: 36 }}
              >
                <div style={{ width: 36, height: 36, borderRadius: '50%', background: `linear-gradient(140deg, ${T.pinkHi}, ${T.pink})`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: 15, flexShrink: 0 }}>
                  {displayChar || (email ? email[0].toUpperCase() : '我')}
                </div>
                <span style={{ color: 'rgba(255,255,255,0.85)', fontSize: 14, fontWeight: 500, lineHeight: 1 }}>我的</span>
                <ChevronDown open={dropOpen} />
              </div>

              {/* 下拉菜单 */}
              {dropOpen && (
                <div style={{ position: 'absolute', top: 48, right: 0, width: 160, background: '#1a1a1a', border: `1px solid ${T.border}`, borderRadius: 12, overflow: 'hidden', zIndex: 100, boxShadow: '0 12px 36px rgba(0,0,0,0.5)' }}>
                  <div
                    onClick={() => { setDropOpen(false); router.push('/profile'); }}
                    style={{ padding: '13px 18px', fontSize: 14, color: '#ffffff', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10 }}
                    onMouseEnter={e => { e.currentTarget.style.color = T.pink; e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; }}
                    onMouseLeave={e => { e.currentTarget.style.color = '#ffffff'; e.currentTarget.style.background = 'transparent'; }}
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/></svg>
                    我的资料
                  </div>
                  <div style={{ height: 1, background: T.border }} />
                  <div
                    onClick={handleLogout}
                    style={{ padding: '13px 18px', fontSize: 14, color: '#ffffff', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10 }}
                    onMouseEnter={e => { e.currentTarget.style.color = T.pink; e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; }}
                    onMouseLeave={e => { e.currentTarget.style.color = '#ffffff'; e.currentTarget.style.background = 'transparent'; }}
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5-5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"/></svg>
                    退出登录
                  </div>
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            {/* 未登录：高级会员按钮（同样显示） */}
            <button
              onClick={onPremiumClick}
              type="button"
              style={{
                height: 36,
                padding: '0 16px',
                borderRadius: 999,
                border: '1.5px solid rgba(139,92,246,0.8)',
                background: 'linear-gradient(135deg, rgba(45,18,80,0.95) 0%, rgba(25,10,50,0.95) 100%)',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 6,
                whiteSpace: 'nowrap',
                boxShadow: '0 0 12px rgba(139,92,246,0.35)',
                lineHeight: 1,
              }}
            >
              <div style={{ width: 14, height: 14, borderRadius: 3, background: 'linear-gradient(135deg, #a78bfa 0%, #7c3aed 50%, #4c1d95 100%)', boxShadow: '0 0 8px rgba(167,139,250,0.8)', transform: 'rotate(45deg)', flexShrink: 0 }} />
              <span style={{ color: '#ffffff', fontSize: 13, fontWeight: 700, lineHeight: 1 }}>高级会员</span>
              <span style={{ color: '#ff5555', fontSize: 13, fontWeight: 800, lineHeight: 1 }}>7折优惠</span>
            </button>

            {/* 未登录：粉色胶囊登录按钮 */}
            <button
              onClick={() => router.push('/auth')}
              type="button"
              style={{
                height: 36,
                padding: '0 22px',
                borderRadius: 999,
                border: '1.5px solid #D4537E',
                background: 'transparent',
                color: '#D4537E',
                fontSize: 14,
                fontWeight: 700,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                lineHeight: 1,
              }}
            >
              登录
            </button>
          </>
        )}
      </div>
    </div>
  );
}