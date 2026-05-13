'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { T } from '@/lib/tokens';
import { Sidebar } from '@/components/Sidebar';
import { Icon } from '@/components/Icon';
import { characters } from '@/lib/characters';
import { useAuthState } from '@/lib/useAuth';
import { PremiumModal } from '@/components/PremiumModal';

const BANNER_CSS = `
  @keyframes pb-in-r  { from { opacity:0; transform:translateX(48px); } to { opacity:1; transform:none; } }
  @keyframes pb-in-l  { from { opacity:0; transform:translateX(-48px); } to { opacity:1; transform:none; } }
  @keyframes pb-out-l { from { opacity:1; transform:none; } to { opacity:0; transform:translateX(-48px); } }
  @keyframes pb-out-r { from { opacity:1; transform:none; } to { opacity:0; transform:translateX(48px); } }
`;

type PosterChar = { id: string; portraitUrl?: string; grad: string; emoji: string };

function DualBg({ left, right }: { left: PosterChar; right: PosterChar }) {
  return (
    <>
      <div style={{ position: 'absolute', left: 0, top: 0, width: '52%', height: '100%', overflow: 'hidden' }}>
        {left.portraitUrl
          ? <img src={left.portraitUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top center', display: 'block' }} />
          : <div style={{ width: '100%', height: '100%', background: left.grad }} />}
        <div style={{ position: 'absolute', top: 0, right: 0, width: '42%', height: '100%', background: 'linear-gradient(to right, transparent, rgba(7,5,12,0.92))' }} />
      </div>
      <div style={{ position: 'absolute', right: 0, top: 0, width: '52%', height: '100%', overflow: 'hidden' }}>
        {right.portraitUrl
          ? <img src={right.portraitUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top center', display: 'block' }} />
          : <div style={{ width: '100%', height: '100%', background: right.grad }} />}
        <div style={{ position: 'absolute', top: 0, left: 0, width: '42%', height: '100%', background: 'linear-gradient(to left, transparent, rgba(7,5,12,0.92))' }} />
      </div>
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.52) 0%, transparent 52%)' }} />
    </>
  );
}

function Poster1({ left, right, anim, isEnter, onStart }: { left: PosterChar; right: PosterChar; anim: string; isEnter: boolean; onStart: () => void }) {
  return (
    <div style={{ position: 'absolute', inset: 0, animation: `${anim} 0.54s cubic-bezier(0.22,1,0.36,1) both`, pointerEvents: isEnter ? 'auto' : 'none', overflow: 'hidden' }}>
      <DualBg left={left} right={right} />
      {/* Warm pink atmospheric glow on right */}
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 78% 38%, rgba(220,90,130,0.14), transparent 58%)' }} />
      {/* RIGHT-aligned copy — serif, light weight */}
      <div style={{ position: 'absolute', top: 0, right: 0, bottom: 0, width: '44%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-end', padding: '0 52px 0 16px', textAlign: 'right' }}>
        <div style={{ fontFamily: '"Noto Serif SC", Georgia, "Times New Roman", serif', fontSize: 48, fontWeight: 300, color: '#fff', lineHeight: 1.1, marginBottom: 38, letterSpacing: -0.5, textShadow: '0 2px 28px rgba(0,0,0,0.45)' }}>
          现在免费体验！
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'rgba(255,255,255,0.68)', fontSize: 12, marginBottom: 24 }}>
          <span style={{ display: 'flex' }}>{[1, 2, 3, 4].map(i => <span key={i} style={{ color: '#FFD23F' }}>★</span>)}</span>
          <span>已有 12,840 位用户</span>
        </div>
        <button onClick={onStart} style={{ height: 44, padding: '0 30px', background: 'transparent', border: '1.5px solid rgba(255,255,255,0.58)', color: '#fff', borderRadius: 999, fontSize: 14, fontWeight: 300, fontFamily: '"Noto Serif SC", Georgia, serif', cursor: 'pointer', letterSpacing: 2 }}>
          立即开始
        </button>
      </div>
    </div>
  );
}

function Poster2({ left, right, anim, isEnter, onNavigate }: { left: PosterChar; right: PosterChar; anim: string; isEnter: boolean; onNavigate: (id: string) => void }) {
  return (
    <div style={{ position: 'absolute', inset: 0, animation: `${anim} 0.54s cubic-bezier(0.22,1,0.36,1) both`, pointerEvents: isEnter ? 'auto' : 'none', overflow: 'hidden' }}>
      <DualBg left={left} right={right} />
      {/* Cool blue-purple atmospheric tone on left */}
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(18,8,32,0.48) 0%, transparent 52%)' }} />
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 22% 52%, rgba(55,18,95,0.22), transparent 58%)' }} />
      {/* LEFT-aligned copy — heavy sans-serif */}
      <div style={{ position: 'absolute', top: 0, left: 0, bottom: 0, width: '50%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start', padding: '0 36px 0 52px' }}>
        <div style={{ fontFamily: '"Noto Sans SC", "PingFang SC", "Microsoft YaHei", sans-serif', fontSize: 38, fontWeight: 900, color: '#fff', lineHeight: 1.28, marginBottom: 22, letterSpacing: 0, textShadow: '0 2px 18px rgba(0,0,0,0.55)', maxWidth: 290 }}>
          你有多久，没被人真正在意过
        </div>
        <div style={{ width: 52, height: 2, background: 'rgba(255,255,255,0.42)', marginBottom: 30 }} />
        <button onClick={() => onNavigate(left.id)} style={{ height: 46, padding: '0 28px', background: '#D4537E', border: 'none', color: '#fff', borderRadius: 999, fontSize: 15, fontWeight: 700, fontFamily: '"Noto Sans SC", sans-serif', cursor: 'pointer', boxShadow: '0 8px 28px rgba(212,83,126,0.5)', letterSpacing: 1 }}>
          去见见他
        </button>
      </div>
    </div>
  );
}

const POSTER_PAIRS = [
  { leftId: 'lin', rightId: 'pei' },
  { leftId: 'kai', rightId: 'yan' },
] as const;

function PromoBanner({ onStart, onNavigate }: { onStart: () => void; onNavigate: (id: string) => void }) {
  const [idx, setIdx] = React.useState(0);
  const [exitIdx, setExitIdx] = React.useState<number | null>(null);
  const [dir, setDir] = React.useState<'r' | 'l'>('r');
  const [animKey, setAnimKey] = React.useState(0);
  const exitTimer = React.useRef<ReturnType<typeof setTimeout>>();

  const go = React.useCallback((newIdx: number, newDir: 'r' | 'l') => {
    clearTimeout(exitTimer.current);
    setExitIdx(idx);
    setDir(newDir);
    setIdx(newIdx);
    setAnimKey(k => k + 1);
    exitTimer.current = setTimeout(() => setExitIdx(null), 560);
  }, [idx]);

  React.useEffect(() => {
    const t = setInterval(() => go(idx === POSTER_PAIRS.length - 1 ? 0 : idx + 1, 'r'), 6000);
    return () => clearInterval(t);
  }, [idx, go]);

  React.useEffect(() => () => clearTimeout(exitTimer.current), []);

  const prev = () => go(idx === 0 ? POSTER_PAIRS.length - 1 : idx - 1, 'l');
  const next = () => go(idx === POSTER_PAIRS.length - 1 ? 0 : idx + 1, 'r');

  const enterAnim = dir === 'r' ? 'pb-in-r' : 'pb-in-l';
  const exitAnim  = dir === 'r' ? 'pb-out-l' : 'pb-out-r';

  const renderPoster = (pIdx: number, isEnter: boolean, key: React.Key) => {
    const pair = POSTER_PAIRS[pIdx];
    if (!pair) return null;
    const left  = characters.find(c => c.id === pair.leftId)!;
    const right = characters.find(c => c.id === pair.rightId)!;
    const anim  = isEnter ? enterAnim : exitAnim;
    return pIdx === 0
      ? <Poster1 key={key} left={left} right={right} anim={anim} isEnter={isEnter} onStart={onStart} />
      : <Poster2 key={key} left={left} right={right} anim={anim} isEnter={isEnter} onNavigate={onNavigate} />;
  };

  return (
    <>
      <style>{BANNER_CSS}</style>
      <div style={{ height: 360, marginTop: 24, position: 'relative', overflow: 'hidden', borderRadius: 24, background: '#07050c' }}>
        {exitIdx !== null && renderPoster(exitIdx, false, `exit-${exitIdx}-${animKey}`)}
        {renderPoster(idx, true, `enter-${idx}-${animKey}`)}

        {/* Bare arrow — left */}
        <button onClick={prev} type="button" aria-label="上一张" style={{ position: 'absolute', left: 20, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', zIndex: 10, padding: 8, display: 'flex', alignItems: 'center', filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.6))' }}>
          <Icon name="arrow" size={26} color="rgba(255,255,255,0.82)" />
        </button>
        {/* Bare arrow — right */}
        <button onClick={next} type="button" aria-label="下一张" style={{ position: 'absolute', right: 20, top: '50%', transform: 'translateY(-50%) rotate(180deg)', background: 'none', border: 'none', cursor: 'pointer', zIndex: 10, padding: 8, display: 'flex', alignItems: 'center', filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.6))' }}>
          <Icon name="arrow" size={26} color="rgba(255,255,255,0.82)" />
        </button>

        {/* Dot indicators */}
        <div style={{ position: 'absolute', bottom: 16, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 8, zIndex: 10 }}>
          {POSTER_PAIRS.map((_, i) => (
            <div key={i} onClick={() => go(i, i > idx ? 'r' : 'l')} style={{ width: i === idx ? 22 : 6, height: 6, borderRadius: 3, background: i === idx ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.32)', transition: 'width 0.32s ease', cursor: 'pointer' }} />
          ))}
        </div>
      </div>
    </>
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
        {c.portraitUrl && (
          <img
            src={c.portraitUrl}
            alt={c.name}
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
          />
        )}
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
        <div style={{ fontSize: 13, color: T.textDim, lineHeight: 1.7 }}>{c.story}</div>
      </div>
    </div>
  );
}

export function PageHome() {
  const router = useRouter();
  const { isLoggedIn, email } = useAuthState();
  const [premiumOpen, setPremiumOpen] = React.useState(false);

  const handleChat = (characterId: string) => {
    localStorage.setItem('selectedCharacterId', characterId);
    router.push('/chat');
  };

  const navTarget = isLoggedIn ? '/chat' : '/auth';

  return (
    <div style={{ width: '100%', height: '100%', minHeight: 0, display: 'flex', flexDirection: 'column', background: T.bg, color: T.text, fontFamily: '"Noto Sans SC", system-ui, sans-serif', overflow: 'hidden' }}>
      <PremiumModal open={premiumOpen} onClose={() => setPremiumOpen(false)} />
      <div style={{ position: 'sticky', top: 0, zIndex: 30, height: 68, padding: '0 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#111111', borderBottom: `1px solid ${T.border}` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div style={{ fontSize: 24, fontWeight: 700, color: '#fff', lineHeight: 1.05, letterSpacing: -0.5 }}>
              纸片人<span style={{ color: T.pink }}>男友</span>
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 28 }}>
          {isLoggedIn ? (
            <>
              <button onClick={() => setPremiumOpen(true)} type="button" style={{ height: 40, padding: '0 24px', borderRadius: 24, border: 'none', background: 'linear-gradient(140deg, #FF4B8B 0%, #8B00FF 100%)', fontWeight: 700, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 10, whiteSpace: 'nowrap', boxShadow: '0 0 0 4px rgba(255, 75, 139, 0.3)' }}>
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
            <button onClick={() => router.push('/auth')} type="button" style={{ padding: '12px 24px', borderRadius: 999, border: '2px solid transparent', borderImage: 'linear-gradient(140deg, #FFD700, #FFB347) 1', background: '#111', color: '#FFD700', fontWeight: 700, cursor: 'pointer' }}>
              登录 / 注册
            </button>
          )}
        </div>
      </div>
      <div style={{ flex: 1, display: 'flex', minHeight: 0, overflow: 'hidden' }}>
        <Sidebar active="home" onVipClick={() => setPremiumOpen(true)} />
        <div style={{ flex: 1, minHeight: 0, overflow: 'auto' }}>
          <div style={{ padding: '0 44px' }}>
            <PromoBanner onStart={() => router.push(navTarget)} onNavigate={handleChat} />
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
