'use client';

import React, { useState } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { TopNav } from '@/components/TopNav';

const PLANS = [
  { id: 0, duration: '12个月', discountBadge: '70% OFF', label: 'BEST VALUE', price: '¥28', original: '¥96', highlight: true },
  { id: 1, duration: '3个月', discountBadge: '35% OFF', label: '', price: '¥62', original: '¥96', highlight: false },
  { id: 2, duration: '1个月', discountBadge: '', label: '', price: '¥96', original: '', highlight: false },
];

const BENEFITS = [
  { emoji: '✨', text: '无限制对话消息' },
  { emoji: '🔥', text: '解锁更多专属角色' },
  { emoji: '🧠', text: 'AI记住更多你们的故事' },
  { emoji: '🪙', text: '每月赠送专属代币/积分' },
  { emoji: '⭐', text: '专属会员标识/称号' },
  { emoji: '🎁', text: '新角色优先体验资格' },
];

interface PremiumModalProps {
  open: boolean;
  onClose: () => void;
}

function PlanCard({ plan }: { plan: typeof PLANS[0] }) {
  const [hovered, setHovered] = useState(false);
  const isHL = plan.highlight;

  const cardBg = isHL
    ? hovered
      ? 'linear-gradient(to top, #c0185a 0%, #7a1040 40%, #2a0a1a 75%, #140810 100%)'
      : 'linear-gradient(to top, #8b1040 0%, #4a0a28 35%, #1a0810 65%, #100608 100%)'
    : hovered
      ? '#1e1e1e'
      : '#141414';

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: cardBg,
        border: 'none',
        boxShadow: isHL
          ? 'inset 1px 1px 0px rgba(255,150,180,0.12)'
          : hovered
            ? 'inset 1px 1px 0px rgba(255,255,255,0.07)'
            : 'inset 1px 1px 0px rgba(255,255,255,0.04)',
        borderRadius: 20,
        padding: '22px 18px 20px',
        cursor: 'pointer',
        transition: 'background 0.35s ease, box-shadow 0.2s ease',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
        <span style={{ fontSize: '0.95rem', fontWeight: 700, color: '#fff' }}>{plan.duration}</span>
        {plan.discountBadge && (
          <span style={{ background: '#f5a623', color: '#000', fontSize: '0.68rem', fontWeight: 800, padding: '3px 9px', borderRadius: 20 }}>
            {plan.discountBadge}
          </span>
        )}
      </div>

      {plan.label
        ? <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#ff5a8a', marginBottom: 14, letterSpacing: '0.04em' }}>{plan.label}</div>
        : <div style={{ marginBottom: 14, height: 16 }} />
      }

      <div style={{ fontSize: '2.2rem', fontWeight: 900, color: '#fff', lineHeight: 1, marginBottom: 4 }}>
        {plan.price}
        <span style={{ fontSize: '0.85rem', fontWeight: 400, color: 'rgba(255,255,255,0.5)' }}>/月</span>
      </div>

      {plan.original
        ? <div style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.28)', textDecoration: 'line-through', marginBottom: 18 }}>{plan.original}/月</div>
        : <div style={{ marginBottom: 18, height: 18 }} />
      }

      {isHL ? (
        <button style={{
          display: 'block', width: '100%', padding: '11px 0',
          borderRadius: 50, border: 'none',
          background: 'linear-gradient(135deg, #ff5a8a, #e0306a)',
          color: '#fff', fontSize: '0.9rem', fontWeight: 700, cursor: 'pointer',
          boxShadow: '0 0 14px rgba(255,90,138,0.3), 0 2px 8px rgba(255,90,138,0.2)',
          pointerEvents: 'none',
        }}>
          立即开始
        </button>
      ) : (
        <button style={{
          display: 'block', width: '100%', padding: '11px 0',
          borderRadius: 50, border: 'none',
          background: hovered ? '#333' : '#1e1e1e',
          color: '#fff', fontSize: '0.9rem', fontWeight: 700, cursor: 'pointer',
          transition: 'background 0.2s',
          pointerEvents: 'none',
        }}>
          立即开始
        </button>
      )}
    </div>
  );
}

export function PremiumModal({ open, onClose }: PremiumModalProps) {
  if (!open) return null;

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 200,
      display: 'flex', flexDirection: 'column',
      background: '#0a0a0a', color: '#fff',
      fontFamily: '"Noto Sans SC", system-ui, sans-serif',
      overflow: 'hidden',
    }}>
      {/* 导航栏，overflow hidden 确保光晕不往上渗 */}
      <div style={{ flexShrink: 0, overflow: 'hidden' }}>
        <TopNav onPremiumClick={() => {}} />
      </div>

      <div style={{ flex: 1, display: 'flex', overflow: 'hidden', minHeight: 0 }}>
        <Sidebar active="" onVipClick={() => {}} />

        <div style={{ flex: 1, overflowY: 'auto' }}>

          {/* 光晕：作为内容区第一个元素，紧贴导航栏下方，绝对不会渗入导航栏 */}
          <div style={{
            height: 0,
            display: 'flex',
            justifyContent: 'center',
            overflow: 'visible',
            pointerEvents: 'none',
          }}>
            <div style={{
              width: '50%',
              height: 10,
              background: 'rgba(255,90,138,1)',
              borderRadius: '50%',
              filter: 'blur(32px)',
              marginTop: 0,
            }} />
          </div>

          <div style={{ padding: '36px 48px 40px' }}>
            <div style={{ maxWidth: 760, margin: '0 auto' }}>

              <h1 style={{ fontSize: '1.9rem', fontWeight: 800, color: '#fff', textAlign: 'center', marginBottom: 6, letterSpacing: '-0.02em' }}>
                选择你的方案
              </h1>
              <p style={{ color: '#666', fontSize: '0.85rem', marginBottom: 28, textAlign: 'center' }}>
                已获全球 5,000 万用户信赖
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 28 }}>
                {PLANS.map((plan) => <PlanCard key={plan.id} plan={plan} />)}
              </div>

              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#444', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12 }}>
                  高级会员权益
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  {BENEFITS.map((b, i) => (
                    <div key={i} style={{
                      background: '#111', border: '1px solid #1a1a1a',
                      borderRadius: 14, padding: '12px 16px',
                      display: 'flex', alignItems: 'center', gap: 12,
                    }}>
                      <span style={{ fontSize: '1.4rem', flexShrink: 0 }}>{b.emoji}</span>
                      <span style={{ fontSize: '0.85rem', color: '#bbb', fontWeight: 500, lineHeight: 1.3 }}>{b.text}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                {[
                  { icon: '🧾', text: '账单显示为「纸片人男友」' },
                  { icon: '🔓', text: '随时可在设置中取消订阅' },
                ].map((item, i) => (
                  <div key={i} style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    padding: '11px 16px', background: '#0d0d0d',
                    border: '1px solid #181818', borderRadius: 12,
                  }}>
                    <span style={{ fontSize: '1.1rem', flexShrink: 0, opacity: 0.5 }}>{item.icon}</span>
                    <span style={{ fontSize: '0.78rem', color: '#555', lineHeight: 1.4 }}>{item.text}</span>
                  </div>
                ))}
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}