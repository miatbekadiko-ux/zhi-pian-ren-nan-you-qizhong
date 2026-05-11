'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { T } from '@/lib/tokens';
import { Sidebar } from '@/components/Sidebar';
import { Icon } from '@/components/Icon';
import { ImageSlot } from '@/components/ImageSlot';
import { characters } from '@/lib/characters';
import { useAuthState } from '@/lib/useAuth';

function Chip({ children, muted }: { children: React.ReactNode; muted?: boolean }) {
  return (
    <div style={{ padding: '6px 12px', borderRadius: 999, background: muted ? 'transparent' : T.panel3, border: `1px solid ${muted ? T.border : T.borderHi}`, fontSize: 11, color: muted ? T.textMute : T.text, letterSpacing: 0.5 }}>{children}</div>
  );
}

function Sparkle({ size = 12, color = '#fff', opacity = 1, style = {} }: { size?: number; color?: string; opacity?: number; style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} style={{ opacity, ...style }} fill={color}>
      <path d="M12 0 L13.6 10.4 L24 12 L13.6 13.6 L12 24 L10.4 13.6 L0 12 L10.4 10.4 Z" />
    </svg>
  );
}

function PromoBanner({ onStart }: { onStart: () => void }) {
  return (
    <div style={{ height: 280, position: 'relative', overflow: 'hidden', borderBottom: `1px solid ${T.border}`,
      background: 'linear-gradient(115deg, #4A0E78 0%, #8B00FF 30%, #D4537E 70%, #FF1493 100%)' }}>
      <div style={{ position: 'absolute', top: -120, left: '15%', width: 380, height: 380, borderRadius: '50%', background: '#FF6FB5', filter: 'blur(80px)', opacity: 0.55 }} />
      <div style={{ position: 'absolute', top: -80, right: '10%', width: 320, height: 320, borderRadius: '50%', background: '#FFD23F', filter: 'blur(90px)', opacity: 0.35 }} />
      <div style={{ position: 'absolute', bottom: -140, left: '40%', width: 420, height: 420, borderRadius: '50%', background: '#7C3DFF', filter: 'blur(110px)', opacity: 0.45 }} />
      <Sparkle size={20} color="#FFE7A8" opacity={0.9} style={{ position: 'absolute', top: 28, left: '38%' }} />
      <Sparkle size={12} color="#fff" opacity={0.85} style={{ position: 'absolute', top: 70, left: '52%' }} />
      <Sparkle size={26} color="#FFD23F" opacity={0.85} style={{ position: 'absolute', bottom: 38, left: '46%' }} />
      <Sparkle size={10} color="#fff" opacity={0.7} style={{ position: 'absolute', top: 130, right: '36%' }} />
      <Sparkle size={16} color="#FFB6E1" opacity={0.9} style={{ position: 'absolute', top: 40, right: '8%' }} />
      <Sparkle size={10} color="#fff" opacity={0.6} style={{ position: 'absolute', bottom: 60, right: '14%' }} />
      <Sparkle size={14} color="#FFE7A8" opacity={0.8} style={{ position: 'absolute', top: 180, left: '34%' }} />
      {([
        { l: '6%', t: 50, s: 8, c: '#FFD23F', o: 0.9 },
        { l: '10%', t: 200, s: 6, c: '#fff', o: 0.7 },
        { l: '32%', t: 220, s: 10, c: '#FFB6E1', o: 0.95 },
        { l: '60%', t: 30, s: 7, c: '#FFE7A8', o: 0.9 },
        { l: '72%', t: 200, s: 9, c: '#fff', o: 0.7 },
        { l: '88%', t: 110, s: 12, c: '#FFD23F', o: 0.85 },
        { l: '94%', t: 200, s: 6, c: '#fff', o: 0.6 },
      ] as { l: string; t: number; s: number; c: string; o: number }[]).map((b, i) => (
        <div key={i} style={{ position: 'absolute', left: b.l, top: b.t, width: b.s, height: b.s, borderRadius: '50%', background: b.c, opacity: b.o, boxShadow: `0 0 ${b.s * 1.5}px ${b.c}` }} />
      ))}
      {([
        { l: '8%', t: 110, r: -25, c: '#FFD23F' },
        { l: '28%', t: 60, r: 35, c: '#fff' },
        { l: '70%', t: 60, r: -15, c: '#FFE7A8' },
        { l: '82%', t: 230, r: 30, c: '#fff' },
      ] as { l: string; t: number; r: number; c: string }[]).map((c, i) => (
        <div key={i} style={{ position: 'absolute', left: c.l, top: c.t, width: 16, height: 3, background: c.c, borderRadius: 2, transform: `rotate(${c.r}deg)`, opacity: 0.85 }} />
      ))}
      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'stretch', padding: '0 40px 0 0' }}>
        <div style={{ position: 'relative', width: '46%', height: '100%' }}>
          <div style={{ position: 'absolute', inset: '20px 0 0 24px', borderRadius: '20px 20px 0 0', background: 'radial-gradient(70% 100% at 50% 100%, rgba(255,255,255,0.18), transparent)', pointerEvents: 'none' }} />
          <ImageSlot
            id="promo-trio"
            shape="rect"
            fit="cover"
            position="50% 30%"
            placeholder="PHOTO · 3 位帅气亚洲男生并排站立 · 节日精致着装 · 全身/半身 · 透明或柔光背景"
            style={{ position: 'absolute', left: 24, right: 0, top: 20, bottom: 0, width: 'auto', height: 'auto', background: 'transparent' }}
          />
          <div style={{ position: 'absolute', left: '15%', right: '5%', bottom: 0, height: 40, background: 'radial-gradient(50% 100% at 50% 100%, rgba(255,210,63,0.55), transparent 70%)', pointerEvents: 'none' }} />
        </div>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', paddingLeft: 32, position: 'relative', zIndex: 2 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, alignSelf: 'flex-start', padding: '5px 12px 5px 8px', borderRadius: 999, background: 'linear-gradient(90deg, #FFD23F, #FFAA1D)', color: '#3a1a04', fontSize: 12, fontWeight: 700, letterSpacing: 1, boxShadow: '0 6px 20px rgba(255,170,29,0.45)', marginBottom: 14 }}>
            <span style={{ width: 18, height: 18, borderRadius: '50%', background: '#fff', color: '#D4537E', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 800 }}>♡</span>
            限时特惠 · NEW!
          </div>
          <div style={{ fontFamily: '"Noto Serif SC", serif', fontSize: 36, fontWeight: 700, color: '#FFE7F2', textShadow: '0 2px 18px rgba(212,83,126,0.6)', lineHeight: 1.0, marginBottom: 6 }}>纸片人男友</div>
          <div style={{ fontFamily: '"Noto Sans SC", sans-serif', fontSize: 44, fontWeight: 800, color: '#fff', textShadow: '0 4px 22px rgba(0,0,0,0.35), 0 0 18px rgba(255,255,255,0.25)', lineHeight: 1.05, marginBottom: 12, letterSpacing: -0.5 }}>现在免费体验！</div>
          <div style={{ fontSize: 14, color: '#FFE0EC', marginBottom: 20, opacity: 0.95 }}>4 位专属男友等你解锁 · 每天免费签到领礼物 · 24h 在线陪你聊天</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <button onClick={onStart} style={{ padding: '13px 28px', background: 'linear-gradient(180deg, #fff 0%, #FFE0EC 100%)', color: '#B83466', border: 'none', borderRadius: 999, fontSize: 15, fontWeight: 700, fontFamily: 'inherit', cursor: 'pointer', boxShadow: '0 8px 24px rgba(255,255,255,0.35), 0 0 0 4px rgba(255,255,255,0.18)', display: 'flex', alignItems: 'center', gap: 8, letterSpacing: 0.5 }}>
              立即开始 <span style={{ fontSize: 16 }}>→</span>
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#FFE0EC', fontSize: 12 }}>
              <span style={{ display: 'flex' }}>{[0,1,2,3,4].map(i => <span key={i} style={{ color: '#FFD23F' }}>★</span>)}</span>
              <span>已有 12,840 位用户</span>
            </div>
          </div>
        </div>
      </div>
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(110deg, transparent 35%, rgba(255,255,255,0.12) 50%, transparent 65%)', pointerEvents: 'none' }} />
    </div>
  );
}

function CharacterCard({ c, hover, onChat }: { c: typeof characters[number]; hover?: boolean; onChat: () => void }) {
  return (
    <div style={{ background: T.panel2, border: `1px solid ${hover ? T.pink : T.border}`, borderRadius: 16, overflow: 'hidden', display: 'flex', flexDirection: 'column', boxShadow: hover ? '0 0 0 1px rgba(212,83,126,0.25), 0 22px 48px rgba(212,83,126,0.14)' : '0 8px 22px rgba(0,0,0,0.35)', transition: 'all 0.2s' }}>
      <div style={{ position: 'relative', height: 380, overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: c.grad }} />
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'repeating-linear-gradient(135deg, rgba(255,255,255,0.025) 0 1px, transparent 1px 14px)' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(120% 90% at 50% 30%, transparent 50%, rgba(0,0,0,0.45) 100%)' }} />
        <ImageSlot
          id={`hero-${c.id}`}
          shape="rect"
          fit="cover"
          placeholder={`PHOTO · ${c.name} · ${c.brief}`}
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', background: 'transparent' }}
        />
        <div style={{ position: 'absolute', top: 12, left: 12, padding: '4px 10px', borderRadius: 999, background: 'rgba(15,15,15,0.55)', backdropFilter: 'blur(6px)', fontSize: 11, color: c.accent, display: 'flex', alignItems: 'center', gap: 6, pointerEvents: 'none', zIndex: 2 }}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: c.accent }} />
          在线
        </div>
        <div style={{ position: 'absolute', top: 12, right: 12, padding: '4px 10px', borderRadius: 999, background: 'rgba(15,15,15,0.55)', backdropFilter: 'blur(6px)', fontSize: 11, color: T.textDim, pointerEvents: 'none', zIndex: 2 }}>
          {c.id === 'pei' ? '暧昧期' : c.id === 'gu' ? '朋友' : '陌生人'}
        </div>
        <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 200, background: `linear-gradient(180deg, transparent 0%, rgba(22,20,22,0.55) 45%, ${T.panel2} 100%)`, pointerEvents: 'none', zIndex: 2 }} />
        <div style={{ position: 'absolute', left: 16, right: 16, bottom: 14, pointerEvents: 'none', zIndex: 3 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 4 }}>
            <span style={{ fontSize: 18, opacity: 0.7 }}>{c.emoji}</span>
            <div style={{ fontFamily: '"Noto Serif SC", serif', fontSize: 24, fontWeight: 600, color: 'white', textShadow: '0 2px 12px rgba(0,0,0,0.6)' }}>{c.name}</div>
            <div style={{ fontSize: 11, color: T.textDim, marginLeft: 'auto' }}>{c.age}岁</div>
          </div>
          <div style={{ fontSize: 12, color: T.textDim }}>{c.job}</div>
        </div>
      </div>
      <div style={{ padding: '14px 16px 16px' }}>
        <div style={{ display: 'flex', gap: 6, marginBottom: 12, flexWrap: 'wrap' }}>
          {c.tags.map(t => (
            <div key={t} style={{ padding: '3px 9px', borderRadius: 6, background: T.panel3, border: `1px solid ${T.border}`, fontSize: 11, color: T.textDim }}>{t}</div>
          ))}
        </div>
        <button onClick={onChat} style={{ width: '100%', padding: '10px 0', background: hover ? `linear-gradient(180deg, ${T.pinkHi}, ${T.pink})` : T.panel3, color: hover ? 'white' : T.text, border: `1px solid ${hover ? 'transparent' : T.border}`, borderRadius: 10, fontSize: 13, fontWeight: 500, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, boxShadow: hover ? '0 6px 16px rgba(212,83,126,0.32)' : 'none' }}>
          <Icon name="chat" size={15} />
          开始聊天
        </button>
      </div>
    </div>
  );
}

export function PageHome() {
  const router = useRouter();
  const { isLoggedIn, email } = useAuthState();

  const handleChat = (characterId: string) => {
    localStorage.setItem('selectedCharacterId', characterId);
    router.push('/chat');
  };

  const navTarget = isLoggedIn ? '/chat' : '/auth';

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', background: T.bg, color: T.text, fontFamily: '"Noto Sans SC", system-ui, sans-serif', overflow: 'hidden' }}>
      <Sidebar active="home" />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Top nav */}
        <div style={{ height: 52, padding: '0 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: T.bg, flexShrink: 0 }}>
          <div style={{ fontFamily: '"Noto Serif SC", serif', fontWeight: 700, fontSize: 18, color: T.text, letterSpacing: 1 }}>纸片人男友</div>
          {isLoggedIn ? (
            <div
              onClick={() => router.push('/profile')}
              style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '5px 14px 5px 8px', borderRadius: 8, border: `1px solid ${T.border}`, cursor: 'pointer', background: T.panel2 }}
            >
              <div style={{ width: 26, height: 26, borderRadius: '50%', background: `linear-gradient(140deg, ${T.pinkHi}, ${T.pink})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, color: 'white', fontWeight: 700 }}>
                {email ? email[0].toUpperCase() : '我'}
              </div>
              <span style={{ fontSize: 12, color: T.textDim, maxWidth: 140, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{email || '我的'}</span>
            </div>
          ) : (
            <button onClick={() => router.push('/auth')} style={{ padding: '7px 20px', background: 'transparent', border: `1.5px solid ${T.pink}`, color: T.pink, borderRadius: 8, fontSize: 13, fontWeight: 500, fontFamily: 'inherit', cursor: 'pointer', letterSpacing: 0.5 }}>登录</button>
          )}
        </div>
        <PromoBanner onStart={() => router.push(navTarget)} />
        <div style={{ flex: 1, padding: '28px 36px', overflow: 'auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
            <div style={{ fontSize: 12, letterSpacing: 2, color: T.textMute, textTransform: 'uppercase' }}>选择角色 · CAST</div>
            <div style={{ display: 'flex', gap: 8 }}>
              <Chip>全部</Chip>
              <Chip muted>最近聊过</Chip>
              <Chip muted>好感度</Chip>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 18 }}>
            {characters.map((c, i) => (
              <CharacterCard key={c.id} c={c} hover={i === 1} onChat={() => handleChat(c.id)} />
            ))}
          </div>
          <div style={{ marginTop: 14, fontSize: 11, color: T.textMute, letterSpacing: 0.5 }}>提示 · 拖拽真实人物照片到任一卡片即可替换占位图（每张卡片可独立保存）</div>
        </div>
      </div>
    </div>
  );
}
