'use client';

import React, { useState } from 'react';

const PLANS = [
  {
    id: 0,
    duration: '12个月',
    discount: '省70%',
    price: '¥28',
    original: '¥96/月',
    best: true,
  },
  {
    id: 1,
    duration: '3个月',
    discount: '省35%',
    price: '¥62',
    original: '¥96/月',
    best: false,
  },
  {
    id: 2,
    duration: '1个月',
    discount: '',
    price: '¥96',
    original: '',
    best: false,
  },
];

const BENEFITS = [
  '无限制对话消息',
  '解锁更多专属角色',
  '更长的记忆上下文（AI记住更多你们的故事）',
  '每月赠送专属代币/积分',
  '专属会员标识/称号',
  '新角色优先体验资格',
];

interface PremiumModalProps {
  open: boolean;
  onClose: () => void;
}

export function PremiumModal({ open, onClose }: PremiumModalProps) {
  const [activeTab, setActiveTab] = useState(0);
  const [selectedCard, setSelectedCard] = useState(0);

  if (!open) return null;

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div
      onClick={handleOverlayClick}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.75)',
        backdropFilter: 'blur(4px)',
        zIndex: 200,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          background: '#0d0d0d',
          border: '1px solid #2e2e2e',
          borderRadius: 24,
          padding: '50px 40px 40px',
          width: '90%',
          maxWidth: 720,
          maxHeight: '90vh',
          overflowY: 'auto',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: 16,
            right: 20,
            background: 'none',
            border: 'none',
            color: '#aaa',
            fontSize: '1.4rem',
            cursor: 'pointer',
            lineHeight: 1,
          }}
        >
          ✕
        </button>

        <h1 style={{ fontSize: '1.9rem', fontWeight: 800, marginBottom: 8, color: '#fff' }}>
          选择你的方案
        </h1>
        <p style={{ color: '#aaa', fontSize: '0.9rem', marginBottom: 36 }}>
          已获全球 5,000 万用户信赖
        </p>

        {/* Plan Tabs */}
        <div
          style={{
            display: 'flex',
            background: '#1a1a1a',
            borderRadius: 50,
            padding: 5,
            marginBottom: 32,
            gap: 4,
          }}
        >
          {[
            { label: '12个月', badge: '最优惠' },
            { label: '3个月', badge: '' },
            { label: '1个月', badge: '' },
          ].map((tab, i) => (
            <div
              key={i}
              onClick={() => { setActiveTab(i); setSelectedCard(i); }}
              style={{
                position: 'relative',
                padding: '10px 26px',
                borderRadius: 50,
                cursor: 'pointer',
                fontSize: '0.92rem',
                color: activeTab === i ? '#fff' : '#aaa',
                fontWeight: activeTab === i ? 600 : 400,
                background: activeTab === i ? 'linear-gradient(135deg, #d63384, #a020f0)' : 'transparent',
                transition: 'all 0.2s',
                userSelect: 'none',
                whiteSpace: 'nowrap',
              }}
            >
              {tab.label}
              {tab.badge && (
                <span
                  style={{
                    position: 'absolute',
                    top: -10,
                    right: -4,
                    background: '#ff4d4d',
                    color: '#fff',
                    fontSize: '0.62rem',
                    fontWeight: 700,
                    padding: '2px 7px',
                    borderRadius: 20,
                  }}
                >
                  {tab.badge}
                </span>
              )}
            </div>
          ))}
        </div>

        {/* Plan Cards */}
        <div
          style={{
            display: 'flex',
            gap: 16,
            flexWrap: 'wrap',
            justifyContent: 'center',
            marginBottom: 40,
          }}
        >
          {PLANS.map((plan) => (
            <div
              key={plan.id}
              onClick={() => setSelectedCard(plan.id)}
              style={{
                background: '#1a1a1a',
                border: `1.5px solid ${selectedCard === plan.id ? '#d63384' : '#2e2e2e'}`,
                borderRadius: 20,
                padding: '28px 22px',
                width: 190,
                textAlign: 'center',
                position: 'relative',
                cursor: 'pointer',
                transition: 'border-color 0.2s',
              }}
            >
              {plan.best && (
                <div
                  style={{
                    position: 'absolute',
                    top: -12,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    background: 'linear-gradient(135deg, #d63384, #a020f0)',
                    color: '#fff',
                    fontSize: '0.68rem',
                    fontWeight: 700,
                    padding: '3px 12px',
                    borderRadius: 20,
                    whiteSpace: 'nowrap',
                  }}
                >
                  最优选择
                </div>
              )}
              <div style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: 5, color: '#fff' }}>
                {plan.duration}
              </div>
              <div style={{ fontSize: '0.78rem', color: '#d63384', fontWeight: 600, marginBottom: 12, minHeight: 18 }}>
                {plan.discount}
              </div>
              <div style={{ fontSize: '1.9rem', fontWeight: 800, color: '#fff' }}>
                {plan.price}
                <span style={{ fontSize: '0.9rem', fontWeight: 400, color: '#aaa' }}>/月</span>
              </div>
              <div style={{ fontSize: '0.82rem', color: '#666', textDecoration: 'line-through', marginTop: 4, marginBottom: 18, minHeight: 18 }}>
                {plan.original}
              </div>
              <button
                style={{
                  display: 'block',
                  width: '100%',
                  padding: '11px 0',
                  borderRadius: 50,
                  border: 'none',
                  background: 'linear-gradient(135deg, #d63384, #a020f0)',
                  color: '#fff',
                  fontSize: '0.92rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  opacity: 0.9,
                }}
              >
                立即开始
              </button>
            </div>
          ))}
        </div>

        {/* Benefits */}
        <div
          style={{
            background: '#1a1a1a',
            border: '1.5px solid #2e2e2e',
            borderRadius: 20,
            padding: '30px 34px',
            width: '100%',
            marginBottom: 28,
          }}
        >
          <div style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 18, color: '#fff' }}>
            高级会员权益
          </div>
          {BENEFITS.map((b, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                marginBottom: i < BENEFITS.length - 1 ? 14 : 0,
                fontSize: '0.92rem',
                color: '#e0e0e0',
              }}
            >
              <div
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #d63384, #a020f0)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  fontSize: '0.7rem',
                  color: '#fff',
                }}
              >
                ✓
              </div>
              {b}
            </div>
          ))}
        </div>

        {/* Trust */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, width: '100%' }}>
          {['🧾 账单显示为「纸片人男友」', '❌ 随时可在设置中取消订阅'].map((text, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#888', fontSize: '0.85rem' }}>
              {text}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
