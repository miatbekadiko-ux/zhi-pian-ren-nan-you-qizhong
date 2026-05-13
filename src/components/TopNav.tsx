'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { T } from '@/lib/tokens';
import { Icon } from './Icon';
import { useAuthState } from '@/lib/useAuth';

export function TopNav({ onPremiumClick }: { onPremiumClick?: () => void }) {
  const router = useRouter();
  const { isLoggedIn, email } = useAuthState();

  return (
    <div style={{ flexShrink: 0, height: 68, padding: '0 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#111111', borderBottom: `1px solid ${T.border}`, zIndex: 30 }}>
      <div style={{ fontSize: 24, fontWeight: 700, color: '#fff', lineHeight: 1.05, letterSpacing: -0.5 }}>
        纸片人<span style={{ color: T.pink }}>男友</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 28 }}>
        {isLoggedIn ? (
          <>
            <button
              onClick={onPremiumClick}
              type="button"
              style={{ height: 40, padding: '0 24px', borderRadius: 24, border: 'none', background: 'linear-gradient(140deg, #FF4B8B 0%, #8B00FF 100%)', fontWeight: 700, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 10, whiteSpace: 'nowrap', boxShadow: '0 0 0 4px rgba(255,75,139,0.3)' }}
            >
              <Icon name="diamond" size={16} color="#8B5CF6" />
              <span style={{ color: '#fff' }}>高级会员</span>
              <span style={{ color: '#FF9CD6' }}>7折优惠</span>
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, color: '#fff', fontSize: 13, lineHeight: 1.2, minWidth: 140, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              <div style={{ width: 40, height: 40, borderRadius: '50%', background: `linear-gradient(140deg, ${T.pinkHi}, ${T.pink})`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: 16 }}>
                {email ? email[0].toUpperCase() : '我'}
              </div>
              <span>{email || '我的账户'}</span>
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
