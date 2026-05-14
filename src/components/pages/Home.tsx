'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { T } from '@/lib/tokens';
import { Sidebar } from '@/components/Sidebar';
import { Icon } from '@/components/Icon';
import { characters } from '@/lib/characters';
import { useAuthState } from '@/lib/useAuth';
import { PremiumModal } from '@/components/PremiumModal';
import { TopNav } from '@/components/TopNav';

const BANNER_CSS = `
  @keyframes pb-in-r  { from { opacity:0; transform:translateX(48px); } to { opacity:1; transform:none; } }
  @keyframes pb-in-l  { from { opacity:0; transform:translateX(-48px); } to { opacity:1; transform:none; } }
  @keyframes pb-out-l { from { opacity:1; transform:none; } to { opacity:0; transform:translateX(-48px); } }
  @keyframes pb-out-r { from { opacity:1; transform:none; } to { opacity:0; transform:translateX(48px); } }
`;

const POSTER_PAIRS = [
  { ids: ['lin', 'kai'] },
  { ids: ['cao', 'pei', 'yan'] },
] as const;

type PosterProps = {
  ids: readonly string[];
  anim: string;
  isEnter: boolean;
  posterIndex: number;
  onStart: () => void;
  onNavigate: (id: string) => void;
};

function Poster({ ids, anim, isEnter, posterIndex, onStart, onNavigate }: PosterProps) {

  // ── 第一张 ──────────────────────────────────────────────────────
  if (posterIndex === 0) {
    return (
      <div style={{ position:'absolute', inset:0, animation:`${anim} 0.54s cubic-bezier(0.22,1,0.36,1) both`, pointerEvents:isEnter?'auto':'none', overflow:'hidden' }}>
        <img src="/banners/banner-1.png" alt="" style={{ position:'absolute', inset:0, width:'100%', height:'100%', objectFit:'cover', objectPosition:'left top' }} />
        <div style={{ position:'absolute', right:0, top:0, width:'38%', height:'100%', display:'flex', flexDirection:'column', justifyContent:'center', padding:'0 32px 0 16px', zIndex:5 }}>
          <div style={{ fontSize:13, fontWeight:700, color:'#FFD23F', letterSpacing:1.5, marginBottom:8, textShadow:'0 0 10px rgba(255,210,63,0.8)', textTransform:'uppercase' }}>限时特惠</div>
          <div style={{ fontFamily:'"Noto Sans SC", sans-serif', fontSize:48, fontWeight:900, color:'#fff', lineHeight:1.05, marginBottom:16, textShadow:'0 0 30px rgba(212,83,126,0.9), 0 0 60px rgba(212,83,126,0.4), 2px 2px 0 rgba(0,0,0,0.5)', letterSpacing:-1 }}>
            会员<br />7折优惠
          </div>
          <button onClick={onStart} style={{ height:42, padding:'0 28px', background:'linear-gradient(135deg,#E96A92,#D4537E)', color:'white', borderRadius:8, fontSize:14, fontWeight:700, border:'none', cursor:'pointer', boxShadow:'0 4px 20px rgba(212,83,126,0.6)', alignSelf:'flex-start', letterSpacing:0.5 }}>立即订阅</button>
        </div>
      </div>
    );
  }

  // ── 第二张 ──────────────────────────────────────────────────────
  if (posterIndex === 1) {
    return (
      <div style={{ position:'absolute', inset:0, animation:`${anim} 0.54s cubic-bezier(0.22,1,0.36,1) both`, pointerEvents:isEnter?'auto':'none', overflow:'hidden' }}>
        <img src="/banners/banner-2.png" alt="" style={{ position:'absolute', inset:0, width:'100%', height:'100%', objectFit:'cover', objectPosition:'left top' }} />
        <div style={{ position:'absolute', right:0, top:0, width:'50%', height:'100%', display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center', textAlign:'center', padding:'0 32px', zIndex:5 }}>
          <div style={{ fontSize:15, fontWeight:800, color:'#F9A8D4', letterSpacing:2, marginBottom:8, textShadow:'0 0 14px rgba(249,168,212,1)' }}>遇见懂你的人</div>
          <div style={{ fontFamily:'"Noto Sans SC", sans-serif', fontSize:58, fontWeight:900, color:'#fff', lineHeight:1.05, marginBottom:24, textShadow:'0 0 30px rgba(129,140,248,0.9), 0 0 60px rgba(236,72,153,0.4), 2px 2px 0 rgba(0,0,0,0.5)', letterSpacing:-1, whiteSpace:'pre-line' }}>
            {'你有多久\n没被在意过'}
          </div>
          <button onClick={() => onNavigate(ids[1])} style={{ height:46, padding:'0 40px', background:'linear-gradient(135deg,#C026D3,#DB2777)', color:'white', borderRadius:8, fontSize:14, fontWeight:700, border:'none', cursor:'pointer', boxShadow:'0 4px 20px rgba(129,140,248,0.5)', letterSpacing:0.5 }}>去遇见他</button>
        </div>
      </div>
    );
  }

}

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
    return (
      <Poster
        key={key}
        ids={pair.ids}
        anim={isEnter ? enterAnim : exitAnim}
        isEnter={isEnter}
        posterIndex={pIdx}
        onStart={onStart}
        onNavigate={onNavigate}
      />
    );
  };

  return (
    <>
      <style>{BANNER_CSS}</style>
      <div style={{ height:280, position:'relative', overflow:'hidden', background:'#06000e', maxWidth:'100%', borderRadius:16 }}>
        {exitIdx !== null && renderPoster(exitIdx, false, `exit-${exitIdx}-${animKey}`)}
        {renderPoster(idx, true, `enter-${idx}-${animKey}`)}

        <button onClick={prev} type="button" aria-label="上一张" style={{ position:'absolute', left:20, top:'50%', transform:'translateY(-50%)', background:'none', border:'none', cursor:'pointer', zIndex:10, padding:8, display:'flex', alignItems:'center', filter:'drop-shadow(0 2px 8px rgba(0,0,0,0.6))' }}>
          <Icon name="arrow" size={26} color="rgba(255,255,255,0.82)" />
        </button>
        <button onClick={next} type="button" aria-label="下一张" style={{ position:'absolute', right:20, top:'50%', transform:'translateY(-50%) rotate(180deg)', background:'none', border:'none', cursor:'pointer', zIndex:10, padding:8, display:'flex', alignItems:'center', filter:'drop-shadow(0 2px 8px rgba(0,0,0,0.6))' }}>
          <Icon name="arrow" size={26} color="rgba(255,255,255,0.82)" />
        </button>

        <div style={{ position:'absolute', bottom:16, left:'50%', transform:'translateX(-50%)', display:'flex', gap:8, zIndex:10 }}>
          {POSTER_PAIRS.map((_, i) => (
            <div key={i} onClick={() => go(i, i > idx ? 'r' : 'l')} style={{ width:i===idx?22:6, height:6, borderRadius:3, background:i===idx?'rgba(255,255,255,0.9)':'rgba(255,255,255,0.32)', transition:'width 0.32s ease', cursor:'pointer' }} />
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
        background: T.panel2, border:'1px solid transparent', borderRadius:24,
        overflow:'hidden', display:'flex', flexDirection:'column',
        boxShadow: isHover ? '0 28px 70px rgba(212,83,126,0.18)' : '0 8px 22px rgba(0,0,0,0.35)',
        transition:'transform 0.28s ease, box-shadow 0.28s ease',
        transform: isHover ? 'scale(1.02)' : 'scale(1)',
        cursor:'pointer',
      }}
      onClick={onChat}
    >
      <div style={{ position:'relative', height:380, overflow:'hidden' }}>
        <div style={{ position:'absolute', inset:0, background:c.grad }} />
        <div style={{ position:'absolute', inset:0, backgroundImage:'repeating-linear-gradient(135deg, rgba(255,255,255,0.025) 0 1px, transparent 1px 14px)' }} />
        <div style={{ position:'absolute', inset:0, background:'radial-gradient(120% 90% at 50% 30%, transparent 50%, rgba(0,0,0,0.45) 100%)' }} />
        {c.portraitUrl && (
          <img src={c.portraitUrl} alt={c.name} style={{ position:'absolute', inset:0, width:'100%', height:'100%', objectFit:'cover' }} />
        )}
        {isNew && (
          <div style={{ position:'absolute', top:16, right:16, padding:'6px 10px', borderRadius:99, background:'rgba(255,255,255,0.12)', color:'#fff', fontSize:11, fontWeight:700, letterSpacing:0.5, backdropFilter:'blur(8px)', zIndex:4 }}>新</div>
        )}
        <div style={{ position:'absolute', left:0, right:0, bottom:0, height:200, background:`linear-gradient(180deg, transparent 0%, rgba(22,20,22,0.55) 45%, ${T.panel2} 100%)`, pointerEvents:'none', zIndex:2 }} />
        <div style={{ position:'absolute', left:16, right:16, bottom:14, pointerEvents:'none', zIndex:3 }}>
          <div style={{ display:'flex', alignItems:'baseline', gap:10, marginBottom:2 }}>
            <span style={{ fontSize:24, fontWeight:600, color:'white', textShadow:'0 2px 12px rgba(0,0,0,0.6)' }}>{c.name}</span>
            <span style={{ fontSize:24, fontWeight:500, color:'rgba(255,255,255,0.9)', letterSpacing:0.5 }}>{c.age}岁</span>
          </div>
        </div>
      </div>
      <div style={{ padding:'18px 18px 24px' }}>
        <div style={{ fontSize:13, color:T.textDim, lineHeight:1.7 }}>{c.story}</div>
      </div>
    </div>
  );
}

export function PageHome() {
  const router = useRouter();
  const { isLoggedIn } = useAuthState();
  const [premiumOpen, setPremiumOpen] = React.useState(false);

  const handleChat = (characterId: string) => {
    localStorage.setItem('selectedCharacterId', characterId);
    router.push('/chat');
  };

  const navTarget = isLoggedIn ? '/chat' : '/auth';

  return (
    <div style={{ width:'100%', height:'100%', minHeight:0, display:'flex', flexDirection:'column', background:T.bg, color:T.text, fontFamily:'"Noto Sans SC", system-ui, sans-serif', overflow:'hidden' }}>
      <PremiumModal open={premiumOpen} onClose={() => setPremiumOpen(false)} />
      <TopNav onPremiumClick={() => setPremiumOpen(true)} />
      <div style={{ flex:1, display:'flex', minHeight:0, overflow:'hidden' }}>
        <Sidebar active="home" onVipClick={() => setPremiumOpen(true)} />
        <div style={{ flex:1, minHeight:0, overflow:'auto' }}>
          <div style={{ padding:'20px 24px 0 24px' }}>
            <PromoBanner onStart={() => router.push(navTarget)} onNavigate={handleChat} />
          </div>
          <div style={{ flex:1, padding:'32px 44px' }}>
            <div style={{ marginBottom:20, maxWidth:680 }}>
              <div style={{ fontSize:24, fontWeight:700, lineHeight:1.2, color:'#fff' }}>
                遇见你的 <span style={{ color:T.pinkHi }}>AI男友</span>
              </div>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(4, minmax(0, 1fr))', gap:22 }}>
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