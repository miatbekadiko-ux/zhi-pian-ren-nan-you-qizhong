'use client';

import React from 'react';

interface ContactModalProps {
  open: boolean;
  onClose: () => void;
}

function EnvelopeIcon() {
  // 信封尺寸 100x72，中心点 (50, 36)
  // 4个三角形颜色：
  // 上(翻盖): 浅粉白 #fdeef4
  // 下: 深粉 #d44e78
  // 左: 中粉 #e8608a
  // 右: 中粉 #e8608a
  const W = 100;
  const H = 72;
  const cx = W / 2; // 50
  const cy = H / 2; // 36

  return (
    <div style={{ position: 'relative', display: 'inline-block', marginBottom: 28, marginTop: 18 }}>
      <svg
        width={W}
        height={H}
        viewBox={`0 0 ${W} ${H}`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <clipPath id="env-rect">
            <rect x="0" y="0" width={W} height={H} rx="8"/>
          </clipPath>
        </defs>
        <g clipPath="url(#env-rect)">
          {/* 底色 */}
          <rect x="0" y="0" width={W} height={H} fill="#ef5f8e"/>
          {/* 上三角 — 翻盖，浅粉白 */}
          <polygon points={`0,0 ${W},0 ${cx},${cy}`} fill="#fdeef4"/>
          {/* 下三角 — 深粉 */}
          <polygon points={`0,${H} ${W},${H} ${cx},${cy}`} fill="#c94870"/>
          {/* 左三角 — 中粉偏暗 */}
          <polygon points={`0,0 0,${H} ${cx},${cy}`} fill="#d85580"/>
          {/* 右三角 — 中粉偏暗 */}
          <polygon points={`${W},0 ${W},${H} ${cx},${cy}`} fill="#d85580"/>
        </g>
      </svg>

      {/* 圆形勾 — 压在上翻盖中心 */}
      <div style={{
        position: 'absolute',
        top: -16,
        left: '50%',
        transform: 'translateX(-50%)',
        width: 36, height: 36,
        borderRadius: '50%',
        background: '#ef5f8e',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 2,
        boxShadow: '0 2px 10px rgba(239,95,142,0.6)',
      }}>
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <path d="M3.5 9l4 4 7-8" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
    </div>
  );
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
        background: 'rgba(0,0,0,0.75)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          width: 400,
          borderRadius: 20,
          background: '#1a1a1a',
          padding: sent ? '48px 32px 44px' : '36px 32px 32px',
          position: 'relative',
          border: '1px solid rgba(255,255,255,0.08)',
          boxShadow: '0 32px 80px rgba(0,0,0,0.7)',
          boxSizing: 'border-box',
          textAlign: sent ? 'center' : 'left',
        }}
      >
        <button
          onClick={handleClose}
          style={{
            position: 'absolute', top: 18, right: 20,
            background: 'none', border: 'none',
            color: 'rgba(255,255,255,0.4)', fontSize: 22,
            cursor: 'pointer', lineHeight: 1, padding: 0,
          }}
        >×</button>

        {sent ? (
          <>
            <EnvelopeIcon />
            <h2 style={{
              color: '#ffffff', fontSize: 24, fontWeight: 800,
              margin: '0 0 16px', letterSpacing: '-0.3px',
            }}>
              感谢您的反馈
            </h2>
            <p style={{
              color: 'rgba(255,255,255,0.6)', fontSize: 14,
              lineHeight: 1.8, margin: 0,
            }}>
              我们会在 24 小时内回复到您的邮箱，请注意查收
            </p>
          </>
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