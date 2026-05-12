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
  const groups = React.useMemo(() => {
    const result: Array<typeof characters[number][]> = [];
    for (let i = 0; i < characters.length; i += 2) {
      result.push(characters.slice(i, i + 2));
    }
    return result;
  }, []);
  const [activeIndex, setActiveIndex] = React.useState(0);
  const activeGroup = groups[activeIndex] || [];
  const posterPositions = [
    { left: '0%', top: '16%', width: '46%', transform: 'rotate(-8deg)', zIndex: 1 },
    { left: '20%', top: '4%', width: '56%', transform: 'rotate(0deg)', zIndex: 3 },
  ];

  React.useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((value) => (value === groups.length - 1 ? 0 : value + 1));
    }, 5000);
    return () => clearInterval(interval);
  }, [groups.length]);

  const prevSlide = () => setActiveIndex((value) => (value === 0 ? groups.length - 1 : value - 1));
  const nextSlide = () => setActiveIndex((value) => (value === groups.length - 1 ? 0 : value + 1));

  return (
    <div style={{ minHeight: 220, height: 220, flex: '0 0 220px', marginTop: 24, boxSizing: 'border-box', position: 'relative', zIndex: 0, overflow: 'hidden', borderRadius: 24, background: 'linear-gradient(115deg, #4A0E78 0%, #8B00FF 30%, #D4537E 70%, #FF1493 100%)' }}>
      <div style={{ position: 'absolute', top: -110, left: '16%', width: 320, height: 320, borderRadius: '50%', background: '#FF6FB5', filter: 'blur(80px)', opacity: 0.5 }} />
      <div style={{ position: 'absolute', top: -70, right: '12%', width: 260, height: 260, borderRadius: '50%', background: '#FFD23F', filter: 'blur(90px)', opacity: 0.32 }} />
      <div style={{ position: 'absolute', bottom: -120, left: '42%', width: 380, height: 380, borderRadius: '50%', background: '#7C3DFF', filter: 'blur(110px)', opacity: 0.42 }} />
      {[
        { l: '8%', t: 50, s: 10, c: '#FFD23F', o: 0.92 },
        { l: '12%', t: 190, s: 6, c: '#fff', o: 0.65 },
        { l: '34%', t: 210, s: 12, c: '#FFB6E1', o: 0.9 },
        { l: '62%', t: 30, s: 8, c: '#FFE7A8', o: 0.88 },
        { l: '74%', t: 190, s: 10, c: '#fff', o: 0.65 },
        { l: '88%', t: 110, s: 14, c: '#FFD23F', o: 0.8 },
        { l: '96%', t: 200, s: 8, c: '#fff', o: 0.55 },
      ].map((b, i) => (
        <div key={i} style={{ position: 'absolute', left: b.l, top: b.t, width: b.s, height: b.s, borderRadius: '50%', background: b.c, opacity: b.o, boxShadow: `0 0 ${b.s * 1.5}px ${b.c}` }} />
      ))}
      {[
        { l: '10%', t: 110, r: -20, c: '#FFD23F' },
        { l: '30%', t: 62, r: 40, c: '#fff' },
        { l: '72%', t: 62, r: -18, c: '#FFE7A8' },
        { l: '84%', t: 230, r: 28, c: '#fff' },
      ].map((c, i) => (
        <div key={i} style={{ position: 'absolute', left: c.l, top: c.t, width: 16, height: 3, background: c.c, borderRadius: 2, transform: `rotate(${c.r}deg)`, opacity: 0.85 }} />
      ))}
      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'stretch', padding: '0' }}>
        <div style={{ position: 'relative', width: '46%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '18px 14px 10px', boxSizing: 'border-box' }}>
          <div style={{ position: 'absolute', inset: '18px 18px 18px 18px', background: 'rgba(0,0,0,0.16)', borderRadius: 24, filter: 'blur(14px)' }} />
          <div style={{ position: 'relative', width: '100%', height: '100%', pointerEvents: 'none' }}>
            {activeGroup.map((c, index) => {
              const position = posterPositions[index] || posterPositions[1];
              return (
                <div key={c.id} style={{ position: 'absolute', left: position.left, top: position.top, width: position.width, transform: position.transform, zIndex: position.zIndex, borderRadius: 24, overflow: 'hidden', background: T.panel2, boxShadow: '0 26px 80px rgba(0,0,0,0.35)' }}>
                  <ImageSlot
                    id={`promo-carousel-${activeIndex}-${c.id}`}
                    shape="rect"
                    fit="cover"
                    placeholder={`PHOTO · ${c.name} · ${c.brief}`}
                    style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', background: 'transparent' }}
                  />
                  <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: '44%', background: 'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.7) 100%)' }} />
                  <div style={{ position: 'absolute', left: 16, right: 16, bottom: 16, color: '#fff' }}>
                    <div style={{ fontSize: 13, fontWeight: 700, lineHeight: 1.2, textShadow: '0 2px 12px rgba(0,0,0,0.5)' }}>{c.name}</div>
                    <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.92)', marginTop: 4 }}>{c.job}</div>
                  </div>
                </div>
              );
            })}
          </div>
          <button onClick={prevSlide} type="button" style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', width: 42, height: 42, borderRadius: 999, border: '1px solid rgba(255,255,255,0.24)', background: 'rgba(0,0,0,0.35)', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9 }}>
            <Icon name="arrow" size={18} color="#fff" />
          </button>
          <button onClick={nextSlide} type="button" style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%) rotate(180deg)', width: 42, height: 42, borderRadius: 999, border: '1px solid rgba(255,255,255,0.24)', background: 'rgba(0,0,0,0.35)', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9 }}>
            <Icon name="arrow" size={18} color="#fff" />
          </button>
        </div>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', paddingLeft: 54, position: 'relative', zIndex: 2 }}>
          <div style={{ fontFamily: '"Noto Sans SC", sans-serif', fontSize: 42, fontWeight: 800, color: '#fff', textShadow: '0 4px 22px rgba(0,0,0,0.35), 0 0 18px rgba(255,255,255,0.25)', lineHeight: 1.05, marginBottom: 30, letterSpacing: -0.5 }}>现在免费体验！</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
            <button onClick={onStart} style={{ height: 40, padding: '0 28px', background: 'linear-gradient(180deg, #fff 0%, #FFE0EC 100%)', color: '#B83466', border: 'none', borderRadius: 999, fontSize: 15, fontWeight: 700, fontFamily: 'inherit', cursor: 'pointer', boxShadow: '0 8px 24px rgba(255,255,255,0.35), 0 0 0 4px rgba(255,255,255,0.18)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', letterSpacing: 0.5 }}>
              立即开始
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#FFE0EC', fontSize: 12 }}>
              <span style={{ display: 'flex' }}>{[1, 2, 3, 4].map(i => <span key={i} style={{ color: '#FFD23F' }}>★</span>)}</span>
              <span>已有 12,840 位用户</span>
            </div>
          </div>
        </div>
      </div>
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(110deg, transparent 35%, rgba(255,255,255,0.12) 50%, transparent 65%)', pointerEvents: 'none' }} />
    </div>
  );
}

function CharacterCard({ c, onChat }: { c: typeof characters[number]; onChat: () => void }) {
  const [isHover, setIsHover] = React.useState(false);
  const isNew = c.id === 'kai' || c.id === 'yan';
  return (
    <div
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
      style={{
        background: T.panel2,
        border: '1px solid transparent',
        borderRadius: 24,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: isHover ? '0 28px 70px rgba(212,83,126,0.18)' : '0 8px 22px rgba(0,0,0,0.35)',
        transition: 'transform 0.28s ease, box-shadow 0.28s ease',
        transform: isHover ? 'scale(1.02)' : 'scale(1)',
        cursor: 'pointer',
      }}
      onClick={onChat}
    >
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
        {isNew && (
          <div style={{ position: 'absolute', top: 16, right: 16, padding: '6px 10px', borderRadius: 99, background: 'rgba(255,255,255,0.12)', color: '#fff', fontSize: 11, fontWeight: 700, letterSpacing: 0.5, backdropFilter: 'blur(8px)', zIndex: 4 }}>
            新
          </div>
        )}
        <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 200, background: `linear-gradient(180deg, transparent 0%, rgba(22,20,22,0.55) 45%, ${T.panel2} 100%)`, pointerEvents: 'none', zIndex: 2 }} />
        <div style={{ position: 'absolute', left: 16, right: 16, bottom: 14, pointerEvents: 'none', zIndex: 3 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 2 }}>
            <span style={{ fontSize: 24, fontWeight: 600, color: 'white', textShadow: '0 2px 12px rgba(0,0,0,0.6)' }}>{c.name}</span>
            <span style={{ fontSize: 24, fontWeight: 500, color: 'rgba(255,255,255,0.9)', letterSpacing: 0.5 }}>{c.age}岁</span>
          </div>
        </div>
      </div>
      <div style={{ padding: '18px 18px 24px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ fontSize: 13, color: T.textDim, lineHeight: 1.7 }}>{c.story}</div>
        </div>
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
    <div style={{ width: '100%', height: '100%', minHeight: 0, display: 'flex', flexDirection: 'column', background: T.bg, color: T.text, fontFamily: '"Noto Sans SC", system-ui, sans-serif', overflow: 'hidden' }}>
      <div style={{ position: 'sticky', top: 0, zIndex: 30, height: 68, padding: '0 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#111111', borderBottom: `1px solid ${T.border}` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div style={{ fontSize: 42, fontWeight: 700, color: '#fff', lineHeight: 1.05, letterSpacing: -0.5 }}>
              纸片人<span style={{ color: T.pink }}>男友</span>
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 28 }}>
          {isLoggedIn ? (
            <>
              <button onClick={() => router.push('/settings')} type="button" style={{ height: 40, padding: '0 24px', borderRadius: 24, border: '4px solid transparent', borderImage: 'linear-gradient(140deg, #FF4B8B 0%, #8B00FF 100%) 1', background: '#111', fontWeight: 700, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 10, whiteSpace: 'nowrap' }}>
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
            <button onClick={() => router.push('/auth')} type="button" style={{ padding: '12px 24px', borderRadius: 999, border: '2px solid transparent', borderImage: 'linear-gradient(140deg, #FFD700, #FFB347) 1', background: '#111', color: '#FFD700', fontWeight: 700, cursor: 'pointer' }}>
              登录 / 注册
            </button>
          )}
        </div>
      </div>
      <div style={{ flex: 1, display: 'flex', minHeight: 0, overflow: 'hidden' }}>
        <Sidebar active="home" />
        <div style={{ flex: 1, minHeight: 0, overflow: 'auto' }}>
          <div style={{ padding: '0 44px' }}>
            <PromoBanner onStart={() => router.push(navTarget)} />
          </div>
          <div style={{ flex: 1, padding: '32px 44px' }}>
            <div style={{ marginBottom: 20, maxWidth: 680 }}>
              <div style={{ fontSize: 24, fontWeight: 700, lineHeight: 1.2, color: '#fff' }}>
                遇见你的 <span style={{ color: T.pinkHi }}>AI男友</span>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 22 }}>
              {characters.map(c => (
                <CharacterCard key={c.id} c={c} onChat={() => handleChat(c.id)} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
