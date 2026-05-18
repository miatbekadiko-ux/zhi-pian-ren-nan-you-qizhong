'use client';

import React from 'react';

interface ContactModalProps {
  open: boolean;
  onClose: () => void;
}

export function ContactModal({ open, onClose }: ContactModalProps) {
  const [message, setMessage] = React.useState('');
  const [sending, setSending] = React.useState(false);
  const [sent, setSent] = React.useState(false);
  const [error, setError] = React.useState('');

  if (!open) return null;

  const handleClose = () => {
    onClose();
    setTimeout(() => {
      setMessage('');
      setSent(false);
      setError('');
    }, 300);
  };

  const handleSend = async () => {
    if (!message.trim()) return;
    setSending(true);
    setError('');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message }),
      });
      if (!res.ok) throw new Error();
      setSent(true);
    } catch {
      setError('发送失败，请重试');
    } finally {
      setSending(false);
    }
  };

  return (
    <div
      onClick={handleClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        background: 'rgba(0,0,0,0.72)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          width: 400,
          borderRadius: 20,
          background: '#1c1c1c',
          padding: sent ? '24px 28px 28px' : '36px 32px 32px',
          position: 'relative',
          border: '1px solid rgba(255,255,255,0.10)',
          boxShadow: '0 24px 64px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.05)',
        }}
      >
        <button
          onClick={handleClose}
          style={{
            position: 'absolute', top: 18, right: 20,
            background: 'none', border: 'none',
            color: 'rgba(255,255,255,0.5)', fontSize: 24,
            cursor: 'pointer', lineHeight: 1, padding: 0,
          }}
        >×</button>

        {sent ? (
          <div style={{ textAlign: 'center', padding: '8px 0 4px' }}>
            {/* 
              信封设计思路：
              - SVG viewBox: 0 0 120 90
              - 圆角矩形主体: x=0 y=0 w=120 h=90 rx=10
              - 用 clipPath 裁切，所有图形不会超出圆角边界
              - 翻盖三角顶点: (0,0) (120,0) (60,42)
              - 左下三角: (0,0) (60,42) (0,90)
              - 右下三角: (120,0) (60,42) (120,90)
              - 底部三角: (0,90) (60,42) (120,90)
              圆形勾: 圆心在 y=0（矩形顶边），一半在外一半在内
            -->
            */}
            <div style={{
              display: 'inline-block',
              position: 'relative',
              marginBottom: 20,
              marginTop: 32,
            }}>
              <svg
                width="150"
                height="112"
                viewBox="0 0 120 90"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs>
                  {/* 圆角矩形裁切区域 */}
                  <clipPath id="envelope-clip">
                    <rect x="0" y="0" width="120" height="90" rx="10" ry="10"/>
                  </clipPath>
                </defs>

                {/* 所有图形都在 clipPath 内，完全不会溢出 */}
                <g clipPath="url(#envelope-clip)">
                  {/* 信封主体底色 */}
                  <rect x="0" y="0" width="120" height="90" fill="#e879a0"/>
                  {/* 左侧阴影三角 */}
                  <polygon points="0,0 60,42 0,90" fill="#c8628580"/>
                  {/* 右侧阴影三角 */}
                  <polygon points="120,0 60,42 120,90" fill="#c8628580"/>
                  {/* 翻盖三角 — 浅粉色 */}
                  <polygon points="0,0 120,0 60,42" fill="#fce8f0"/>
                </g>
              </svg>

              {/* 圆形勾：top=-24 让圆心在信封顶边(y=0)处，一半在外一半压住翻盖 */}
              <div style={{
                position: 'absolute',
                top: -24,
                left: '50%',
                transform: 'translateX(-50%)',
                width: 48, height: 48,
                borderRadius: '50%',
                background: '#e879a0',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                zIndex: 2,
              }}>
                <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
                  <path
                    d="M5 13l6 6L21 7"
                    stroke="white"
                    strokeWidth="3.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>

            <h2 style={{ color: '#ffffff', fontSize: 20, fontWeight: 700, margin: '0 0 10px' }}>
              感谢你的反馈！
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13, lineHeight: 1.7, margin: 0 }}>
              我们会在 24 小时内回复到您的邮箱，请注意查收！
            </p>
          </div>
        ) : (
          <>
            <h2 style={{ color: '#ffffff', fontSize: 22, fontWeight: 700, margin: '0 0 10px' }}>
              联系我们
            </h2>
            <p style={{ color: '#ffffff', fontSize: 14, margin: '0 0 22px', lineHeight: 1.6 }}>
              在这里写下你的意见，或发邮件至{' '}
              <span style={{ color: '#ffffff' }}>miatbekadiko@gmail.com</span>
            </p>

            <textarea
              value={message}
              onChange={e => setMessage(e.target.value)}
              placeholder="Description"
              maxLength={1000}
              style={{
                width: '100%', minHeight: 150,
                background: '#252525',
                border: '1.5px solid rgba(255,255,255,0.15)',
                borderRadius: 12,
                padding: '14px 16px',
                color: '#ffffff', fontSize: 15,
                resize: 'vertical', outline: 'none',
                fontFamily: 'inherit', lineHeight: 1.6,
                boxSizing: 'border-box',
              }}
              onFocus={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.35)'; }}
              onBlur={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'; }}
            />

            {error && (
              <p style={{ color: '#f43f5e', fontSize: 13, margin: '8px 0 0' }}>{error}</p>
            )}

            <button
              onClick={handleSend}
              disabled={sending}
              style={{
                width: '100%', marginTop: 20,
                padding: '15px 0', borderRadius: 12,
                background: 'linear-gradient(90deg, #e879a0, #f43f5e)',
                border: 'none', color: '#ffffff',
                fontSize: 16, fontWeight: 600,
                cursor: sending ? 'not-allowed' : 'pointer',
                opacity: sending ? 0.7 : 1,
                transition: 'opacity 0.2s ease',
                letterSpacing: 1,
              }}
            >
              {sending ? '发送中...' : '发 送'}
            </button>
          </>
        )}
      </div>
    </div>
  );
}