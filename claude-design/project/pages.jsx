// Shared tokens
const T = {
  bg: '#0E0D0E',
  panel: '#161416',
  panel2: '#1C1A1C',
  panel3: '#252225',
  border: '#2A272A',
  borderHi: '#3A363A',
  text: '#F4F0F2',
  textDim: '#A39BA0',
  textMute: '#6B6469',
  pink: '#D4537E',
  pinkSoft: '#2A1520',
  pinkHi: '#E96A92',
};

// Sidebar icons (simple inline SVGs)
const Icon = ({ name, size = 20, color = 'currentColor' }) => {
  const common = { width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: color, strokeWidth: 1.6, strokeLinecap: 'round', strokeLinejoin: 'round' };
  switch (name) {
    case 'home': return <svg {...common}><path d="M3 11l9-7 9 7"/><path d="M5 10v10h14V10"/></svg>;
    case 'chat': return <svg {...common}><path d="M21 12a8 8 0 0 1-11.6 7.1L4 21l1.9-5.4A8 8 0 1 1 21 12z"/></svg>;
    case 'user': return <svg {...common}><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 4-7 8-7s8 3 8 7"/></svg>;
    case 'gear': return <svg {...common}><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 0 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 0 1 0-4h.1A1.7 1.7 0 0 0 4.6 9a1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 0 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 0 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/></svg>;
    case 'send': return <svg {...common}><path d="M22 2L11 13"/><path d="M22 2l-7 20-4-9-9-4 20-7z"/></svg>;
    case 'play': return <svg {...common}><polygon points="6 4 20 12 6 20 6 4" fill={color} stroke="none"/></svg>;
    case 'eye': return <svg {...common}><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/></svg>;
    case 'cal': return <svg {...common}><rect x="3" y="4" width="18" height="17" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>;
    case 'cam': return <svg {...common}><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>;
    case 'globe': return <svg {...common}><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/></svg>;
    case 'bell': return <svg {...common}><path d="M18 16V11a6 6 0 1 0-12 0v5l-2 3h16z"/><path d="M10 21a2 2 0 0 0 4 0"/></svg>;
    case 'volume': return <svg {...common}><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.5 8.5a5 5 0 0 1 0 7"/><path d="M19 5a9 9 0 0 1 0 14"/></svg>;
    case 'trash': return <svg {...common}><path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M10 11v6M14 11v6"/></svg>;
    case 'logout': return <svg {...common}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="M16 17l5-5-5-5M21 12H9"/></svg>;
    case 'arrow': return <svg {...common}><path d="M9 6l6 6-6 6"/></svg>;
    case 'save': return <svg {...common}><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><path d="M17 21v-8H7v8M7 3v5h8"/></svg>;
    case 'lock': return <svg {...common}><rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 1 1 8 0v4"/></svg>;
    case 'mail': return <svg {...common}><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/></svg>;
    case 'gem': return <svg viewBox="0 0 24 24" width={size} height={size} fill={color}><path d="M5.5 3h13l3.5 5-10 13L2 8l3.5-5zM7 4l-2.7 4H9L7 4zm10 0l-2 4h4.7L17 4zm-5 0l-2 4h4l-2-4zM4.7 9l5.5 8.5L8.4 9H4.7zm5.7 0l1.6 9.5L13.6 9h-3.2zm5.2 0l-1.8 8.5L19.3 9h-3.7z"/></svg>;
    default: return null;
  }
};

const characters = [
  { id: 'lin',  emoji: '🌟', name: '林夏',   job: '户外探险博主', age: 26, tags: ['阳光', '自由', '冒险'], grad: 'linear-gradient(160deg,#1d3a2c 0%,#2f5c44 55%,#0f1f17 100%)', accent: '#7DBE9A',
    desc: '运动少年感，阳光自由。带你去看远方的山和海。',
    style: '自然随性，像老朋友一样唠嗑，会突然提议一起去爬山。',
    brief: '阳光帅气亚洲男生 · 户外冲锋衣 · 山林背景 · 自然光' },
  { id: 'pei',  emoji: '❄️', name: '裴司寒', job: '顶级律师',     age: 32, tags: ['傲娇', '毒舌', '腹黑'], grad: 'linear-gradient(160deg,#101a30 0%,#1f3458 55%,#080d18 100%)', accent: '#7CA3D8',
    desc: '傲慢之下藏着柔软。沉默是底色，认真是底牌。',
    style: '犀利毒舌，话里藏关心。绝口不提想念，却记得每个细节。',
    brief: '冷峻禁欲亚洲男 · 黑西装白衬衫 · 落地窗写字楼 · 冷蓝调' },
  { id: 'shen', emoji: '🎨', name: '沈意',   job: '漫画家',       age: 25, tags: ['傲娇', '毒舌', '漫画家'], grad: 'linear-gradient(160deg,#2b1838 0%,#4a2666 55%,#180b21 100%)', accent: '#C9A0E0',
    desc: '损你不带脏字，本子上偷偷画你。嘴硬心软专业户。',
    style: '一针见血又委屈巴巴。会突然发来"随手画的"插画。',
    brief: '随性亚洲男生 · 帽衫 + 颜料污迹 · 画室满墙手稿 · 暖灯' },
  { id: 'gu',   emoji: '🎬', name: '顾知予', job: '纪录片导演',   age: 30, tags: ['温柔', '守护', '细心'], grad: 'linear-gradient(160deg,#3a2410 0%,#7a4d22 55%,#1f1306 100%)', accent: '#E5B57A',
    desc: '默默守护，永远在你需要时出现。镜头里都是你。',
    style: '温柔反问，引导你看见自己。记住你说过的每句小事。',
    brief: '温柔斯文亚洲男 · 米色风衣 · 手持胶卷相机 · 黄昏自然光' },
];

// ────────────────────────────────────────────────────────────────────────────
// Sidebar (shared)
// ────────────────────────────────────────────────────────────────────────────
function Sidebar({ active, locked = false }) {
  const items = [
    { key: 'home', icon: 'home' },
    { key: 'chat', icon: 'chat' },
    { key: 'user', icon: 'user' },
    { key: 'gear', icon: 'gear' },
  ];
  return (
    <div style={{ width: 64, background: T.panel, borderRight: `1px solid ${T.border}`, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '16px 0 18px', gap: 6, flexShrink: 0 }}>
      <div style={{ width: 36, height: 36, borderRadius: '50%', background: `linear-gradient(140deg, ${T.pinkHi}, ${T.pink})`, color: 'white', fontFamily: '"Noto Serif SC", serif', fontWeight: 700, fontSize: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 14px rgba(212,83,126,0.35)', marginBottom: 12 }}>纸</div>
      {items.map(it => {
        const isActive = !locked && it.key === active;
        return (
          <div key={it.key} style={{
            width: 40, height: 40, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: isActive ? T.pinkSoft : 'transparent',
            color: isActive ? T.pink : (locked ? '#3a3437' : T.textMute),
          }}>
            <Icon name={it.icon} size={19} />
          </div>
        );
      })}
      {/* Premium button — pinned to bottom */}
      <div style={{ flex: 1 }} />
      <div style={{ position: 'relative', width: 40, height: 40 }}>
        {/* halo */}
        <div style={{ position: 'absolute', inset: -6, borderRadius: 14, background: 'radial-gradient(circle, rgba(212,83,126,0.55) 0%, rgba(139,0,255,0.35) 50%, transparent 75%)', filter: 'blur(6px)', pointerEvents: 'none' }} />
        <div title="升级 Premium" style={{
          position: 'relative', width: 40, height: 40, borderRadius: 11,
          background: 'linear-gradient(140deg, #FFB347 0%, #D4537E 45%, #8B00FF 100%)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#FFF6CC',
          boxShadow: active === 'vip'
            ? '0 6px 22px rgba(212,83,126,0.7), inset 0 1px 0 rgba(255,255,255,0.5), 0 0 0 2px rgba(255,255,255,0.25)'
            : '0 4px 16px rgba(212,83,126,0.5), inset 0 1px 0 rgba(255,255,255,0.4)',
          cursor: 'pointer',
          transform: active === 'vip' ? 'scale(1.05)' : 'none',
          transition: 'all 0.2s'
        }}>
          <Icon name="gem" size={18} color="#FFF6CC" />
          {/* tiny NEW dot */}
          <div style={{ position: 'absolute', top: -3, right: -3, minWidth: 14, height: 14, padding: '0 4px', borderRadius: 7, background: '#FFD23F', color: '#3a1a04', fontSize: 9, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1.5px solid ' + T.panel, letterSpacing: 0.3 }}>VIP</div>
        </div>
      </div>
    </div>
  );
}

// Soft pink halo bg for ambient screens
const Halos = ({ opacity = 0.18 }) => (
  <>
    <div style={{ position: 'absolute', top: -180, left: -160, width: 480, height: 480, borderRadius: '50%', background: T.pink, filter: 'blur(140px)', opacity, pointerEvents: 'none' }} />
    <div style={{ position: 'absolute', bottom: -200, right: -140, width: 460, height: 460, borderRadius: '50%', background: '#7C3D9C', filter: 'blur(140px)', opacity: opacity * 0.7, pointerEvents: 'none' }} />
  </>
);

// ────────────────────────────────────────────────────────────────────────────
// Page 1 — Login
// ────────────────────────────────────────────────────────────────────────────
function PageLogin() {
  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', background: T.bg, color: T.text, fontFamily: '"Noto Sans SC", system-ui, sans-serif', overflow: 'hidden', position: 'relative' }}>
      <Sidebar active="" locked />
      <div style={{ flex: 1, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
        <Halos />
        {/* faint grid overlay for texture */}
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(rgba(255,255,255,0.025) 1px, transparent 1px)', backgroundSize: '28px 28px', pointerEvents: 'none' }} />

        <div style={{ width: 380, background: T.panel2, border: `1px solid ${T.border}`, borderRadius: 18, padding: '36px 32px', position: 'relative', boxShadow: '0 30px 80px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.03)' }}>
          {/* Title */}
          <div style={{ textAlign: 'center', marginBottom: 6 }}>
            <div style={{ fontFamily: '"Noto Serif SC", serif', fontWeight: 600, color: T.pink, fontSize: 30, letterSpacing: 1 }}>纸片人男友</div>
          </div>
          <div style={{ textAlign: 'center', color: T.textDim, fontSize: 13, marginBottom: 26, letterSpacing: 0.5 }}>今天，想和谁说说话？</div>

          {/* Tabs */}
          <div style={{ display: 'flex', borderBottom: `1px solid ${T.border}`, marginBottom: 22 }}>
            <div style={{ flex: 1, textAlign: 'center', padding: '10px 0', fontSize: 14, color: T.text, position: 'relative', fontWeight: 500 }}>
              登录
              <div style={{ position: 'absolute', bottom: -1, left: '20%', right: '20%', height: 2, background: T.pink, borderRadius: 2 }} />
            </div>
            <div style={{ flex: 1, textAlign: 'center', padding: '10px 0', fontSize: 14, color: T.textMute }}>注册</div>
          </div>

          {/* Email */}
          <Field label="邮箱" icon="mail" placeholder="请输入邮箱地址" value="hello@example.com" />
          <div style={{ height: 12 }} />
          <Field label="密码" icon="lock" rightIcon="eye" placeholder="请输入密码" value="••••••••••" />

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 10, marginBottom: 18 }}>
            <span style={{ fontSize: 12, color: T.textMute }}>忘记密码？</span>
          </div>

          {/* Button */}
          <button style={{ width: '100%', padding: '12px 0', background: `linear-gradient(180deg, ${T.pinkHi}, ${T.pink})`, color: 'white', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 600, letterSpacing: 1, cursor: 'pointer', boxShadow: '0 8px 22px rgba(212,83,126,0.35)' }}>登 录</button>

          {/* Divider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '22px 0 16px' }}>
            <div style={{ flex: 1, height: 1, background: T.border }} />
            <span style={{ fontSize: 11, color: T.textMute, letterSpacing: 1 }}>或</span>
            <div style={{ flex: 1, height: 1, background: T.border }} />
          </div>

          <div style={{ textAlign: 'center', fontSize: 12, color: T.textDim }}>
            还没有账号？<span style={{ color: T.pink, fontWeight: 500, cursor: 'pointer' }}>立即注册</span>
          </div>
        </div>

        {/* tagline */}
        <div style={{ position: 'absolute', bottom: 28, left: 0, right: 0, textAlign: 'center', color: T.textMute, fontSize: 11, letterSpacing: 4 }}>PAPER · BOYFRIEND · 2026</div>
      </div>
    </div>
  );
}

function Field({ label, icon, rightIcon, placeholder, value }) {
  return (
    <div>
      <div style={{ fontSize: 11, color: T.textMute, letterSpacing: 1.5, marginBottom: 6, textTransform: 'uppercase' }}>{label}</div>
      <div style={{ display: 'flex', alignItems: 'center', background: T.panel3, border: `1px solid ${T.border}`, borderRadius: 10, padding: '0 12px', height: 42 }}>
        {icon && <span style={{ color: T.textMute, marginRight: 10, display: 'flex' }}><Icon name={icon} size={16} /></span>}
        <input defaultValue={value} placeholder={placeholder} style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', color: T.text, fontSize: 14, fontFamily: 'inherit' }} />
        {rightIcon && <span style={{ color: T.textMute, display: 'flex' }}><Icon name={rightIcon} size={16} /></span>}
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// Page 2 — Home
// ────────────────────────────────────────────────────────────────────────────
function PageHome() {
  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', background: T.bg, color: T.text, fontFamily: '"Noto Sans SC", system-ui, sans-serif', overflow: 'hidden' }}>
      <Sidebar active="home" />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Top nav */}
        <div style={{ height: 52, padding: '0 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: T.bg, flexShrink: 0 }}>
          <div style={{ fontFamily: '"Noto Serif SC", serif', fontWeight: 700, fontSize: 18, color: T.text, letterSpacing: 1 }}>纸片人男友</div>
          <button style={{ padding: '7px 20px', background: 'transparent', border: `1.5px solid ${T.pink}`, color: T.pink, borderRadius: 8, fontSize: 13, fontWeight: 500, fontFamily: 'inherit', cursor: 'pointer', letterSpacing: 0.5 }}>登录</button>
        </div>

        {/* Banner — vibrant promo */}
        <PromoBanner />

        {/* Cards area */}
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
            {characters.map((c, i) => <CharacterCard key={c.id} c={c} hover={i === 1} />)}
          </div>
          <div style={{ marginTop: 14, fontSize: 11, color: T.textMute, letterSpacing: 0.5 }}>提示 · 拖拽真实人物照片到任一卡片即可替换占位图（每张卡片可独立保存）</div>
        </div>
      </div>
    </div>
  );
}

function Chip({ children, muted }) {
  return (
    <div style={{ padding: '6px 12px', borderRadius: 999, background: muted ? 'transparent' : T.panel3, border: `1px solid ${muted ? T.border : T.borderHi}`, fontSize: 11, color: muted ? T.textMute : T.text, letterSpacing: 0.5 }}>{children}</div>
  );
}

// Sparkle/star deco — keep shapes very simple
function Sparkle({ size = 12, color = '#fff', opacity = 1, style = {} }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} style={{ opacity, ...style }} fill={color}>
      <path d="M12 0 L13.6 10.4 L24 12 L13.6 13.6 L12 24 L10.4 13.6 L0 12 L10.4 10.4 Z" />
    </svg>
  );
}

function PromoBanner() {
  return (
    <div style={{ height: 280, position: 'relative', overflow: 'hidden', borderBottom: `1px solid ${T.border}`,
      background: 'linear-gradient(115deg, #4A0E78 0%, #8B00FF 30%, #D4537E 70%, #FF1493 100%)' }}>
      {/* light blooms */}
      <div style={{ position: 'absolute', top: -120, left: '15%', width: 380, height: 380, borderRadius: '50%', background: '#FF6FB5', filter: 'blur(80px)', opacity: 0.55 }} />
      <div style={{ position: 'absolute', top: -80, right: '10%', width: 320, height: 320, borderRadius: '50%', background: '#FFD23F', filter: 'blur(90px)', opacity: 0.35 }} />
      <div style={{ position: 'absolute', bottom: -140, left: '40%', width: 420, height: 420, borderRadius: '50%', background: '#7C3DFF', filter: 'blur(110px)', opacity: 0.45 }} />

      {/* sparkle dust */}
      <Sparkle size={20} color="#FFE7A8" opacity={0.9} style={{ position: 'absolute', top: 28, left: '38%' }} />
      <Sparkle size={12} color="#fff" opacity={0.85} style={{ position: 'absolute', top: 70, left: '52%' }} />
      <Sparkle size={26} color="#FFD23F" opacity={0.85} style={{ position: 'absolute', bottom: 38, left: '46%' }} />
      <Sparkle size={10} color="#fff" opacity={0.7} style={{ position: 'absolute', top: 130, right: '36%' }} />
      <Sparkle size={16} color="#FFB6E1" opacity={0.9} style={{ position: 'absolute', top: 40, right: '8%' }} />
      <Sparkle size={10} color="#fff" opacity={0.6} style={{ position: 'absolute', bottom: 60, right: '14%' }} />
      <Sparkle size={14} color="#FFE7A8" opacity={0.8} style={{ position: 'absolute', top: 180, left: '34%' }} />

      {/* tiny bubble dots */}
      {[
        { l: '6%', t: 50, s: 8, c: '#FFD23F', o: 0.9 },
        { l: '10%', t: 200, s: 6, c: '#fff', o: 0.7 },
        { l: '32%', t: 220, s: 10, c: '#FFB6E1', o: 0.95 },
        { l: '60%', t: 30, s: 7, c: '#FFE7A8', o: 0.9 },
        { l: '72%', t: 200, s: 9, c: '#fff', o: 0.7 },
        { l: '88%', t: 110, s: 12, c: '#FFD23F', o: 0.85 },
        { l: '94%', t: 200, s: 6, c: '#fff', o: 0.6 },
      ].map((b, i) => (
        <div key={i} style={{ position: 'absolute', left: b.l, top: b.t, width: b.s, height: b.s, borderRadius: '50%', background: b.c, opacity: b.o, boxShadow: `0 0 ${b.s * 1.5}px ${b.c}` }} />
      ))}

      {/* confetti diagonal lines */}
      {[
        { l: '8%', t: 110, r: -25, c: '#FFD23F' },
        { l: '28%', t: 60, r: 35, c: '#fff' },
        { l: '70%', t: 60, r: -15, c: '#FFE7A8' },
        { l: '82%', t: 230, r: 30, c: '#fff' },
      ].map((c, i) => (
        <div key={i} style={{ position: 'absolute', left: c.l, top: c.t, width: 16, height: 3, background: c.c, borderRadius: 2, transform: `rotate(${c.r}deg)`, opacity: 0.85 }} />
      ))}

      {/* Content row */}
      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'stretch', padding: '0 40px 0 0' }}>
        {/* Left — boys photo slot */}
        <div style={{ position: 'relative', width: '46%', height: '100%' }}>
          {/* gloss bg behind slot */}
          <div style={{ position: 'absolute', inset: '20px 0 0 24px', borderRadius: '20px 20px 0 0', background: 'radial-gradient(70% 100% at 50% 100%, rgba(255,255,255,0.18), transparent)', pointerEvents: 'none' }} />
          <image-slot
            id="promo-trio"
            shape="rect"
            fit="cover"
            position="50% 30%"
            placeholder="PHOTO · 3 位帅气亚洲男生并排站立 · 节日精致着装 · 全身/半身 · 透明或柔光背景"
            style={{ position: 'absolute', left: 24, right: 0, top: 20, bottom: 0, width: 'auto', height: 'auto', background: 'transparent' }}
          ></image-slot>
          {/* spotlight under feet */}
          <div style={{ position: 'absolute', left: '15%', right: '5%', bottom: 0, height: 40, background: 'radial-gradient(50% 100% at 50% 100%, rgba(255,210,63,0.55), transparent 70%)', pointerEvents: 'none' }} />
        </div>

        {/* Right — promo copy */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', paddingLeft: 32, position: 'relative', zIndex: 2 }}>
          {/* NEW pill */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, alignSelf: 'flex-start', padding: '5px 12px 5px 8px', borderRadius: 999, background: 'linear-gradient(90deg, #FFD23F, #FFAA1D)', color: '#3a1a04', fontSize: 12, fontWeight: 700, letterSpacing: 1, boxShadow: '0 6px 20px rgba(255,170,29,0.45)', marginBottom: 14 }}>
            <span style={{ width: 18, height: 18, borderRadius: '50%', background: '#fff', color: '#D4537E', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 800 }}>♡</span>
            限时特惠 · NEW!
          </div>

          {/* Headline */}
          <div style={{ fontFamily: '"Noto Serif SC", serif', fontSize: 36, fontWeight: 700, color: '#FFE7F2', textShadow: '0 2px 18px rgba(212,83,126,0.6)', lineHeight: 1.0, marginBottom: 6 }}>
            纸片人男友
          </div>
          <div style={{ fontFamily: '"Noto Sans SC", sans-serif', fontSize: 44, fontWeight: 800, color: '#fff', textShadow: '0 4px 22px rgba(0,0,0,0.35), 0 0 18px rgba(255,255,255,0.25)', lineHeight: 1.05, marginBottom: 12, letterSpacing: -0.5 }}>
            现在免费体验！
          </div>
          <div style={{ fontSize: 14, color: '#FFE0EC', marginBottom: 20, opacity: 0.95 }}>
            4 位专属男友等你解锁 · 每天免费签到领礼物 · 24h 在线陪你聊天
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <button style={{
              padding: '13px 28px',
              background: 'linear-gradient(180deg, #fff 0%, #FFE0EC 100%)',
              color: '#B83466', border: 'none', borderRadius: 999,
              fontSize: 15, fontWeight: 700, fontFamily: 'inherit', cursor: 'pointer',
              boxShadow: '0 8px 24px rgba(255,255,255,0.35), 0 0 0 4px rgba(255,255,255,0.18)',
              display: 'flex', alignItems: 'center', gap: 8, letterSpacing: 0.5
            }}>
              立即开始 <span style={{ fontSize: 16 }}>→</span>
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#FFE0EC', fontSize: 12 }}>
              <span style={{ display: 'flex' }}>{[0,1,2,3,4].map(i => <span key={i} style={{ color: '#FFD23F' }}>★</span>)}</span>
              <span>已有 12,840 位用户</span>
            </div>
          </div>
        </div>
      </div>

      {/* sweep highlight overlay */}
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(110deg, transparent 35%, rgba(255,255,255,0.12) 50%, transparent 65%)', pointerEvents: 'none' }} />
    </div>
  );
}

function CharacterCard({ c, hover }) {
  return (
    <div style={{ background: T.panel2, border: `1px solid ${hover ? T.pink : T.border}`, borderRadius: 16, overflow: 'hidden', display: 'flex', flexDirection: 'column', boxShadow: hover ? '0 0 0 1px rgba(212,83,126,0.25), 0 22px 48px rgba(212,83,126,0.14)' : '0 8px 22px rgba(0,0,0,0.35)', transition: 'all 0.2s' }}>
      {/* Tall portrait area — ~78% of card height */}
      <div style={{ position: 'relative', height: 380, overflow: 'hidden' }}>
        {/* moody graded fallback bg, visible behind empty slot */}
        <div style={{ position: 'absolute', inset: 0, background: c.grad }} />
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'repeating-linear-gradient(135deg, rgba(255,255,255,0.025) 0 1px, transparent 1px 14px)' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(120% 90% at 50% 30%, transparent 50%, rgba(0,0,0,0.45) 100%)' }} />

        {/* user-fillable photo slot */}
        <image-slot
          id={`hero-${c.id}`}
          shape="rect"
          fit="cover"
          placeholder={`PHOTO · ${c.name} · ${c.brief}`}
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', background: 'transparent' }}
        ></image-slot>

        {/* status badge */}
        <div style={{ position: 'absolute', top: 12, left: 12, padding: '4px 10px', borderRadius: 999, background: 'rgba(15,15,15,0.55)', backdropFilter: 'blur(6px)', fontSize: 11, color: c.accent, display: 'flex', alignItems: 'center', gap: 6, pointerEvents: 'none', zIndex: 2 }}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: c.accent }} />
          在线
        </div>
        {/* relationship chip top-right */}
        <div style={{ position: 'absolute', top: 12, right: 12, padding: '4px 10px', borderRadius: 999, background: 'rgba(15,15,15,0.55)', backdropFilter: 'blur(6px)', fontSize: 11, color: T.textDim, pointerEvents: 'none', zIndex: 2 }}>
          {c.id === 'pei' ? '暧昧期' : c.id === 'gu' ? '朋友' : '陌生人'}
        </div>

        {/* bottom gradient mask + overlay text */}
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
        <button style={{ width: '100%', padding: '10px 0', background: hover ? `linear-gradient(180deg, ${T.pinkHi}, ${T.pink})` : T.panel3, color: hover ? 'white' : T.text, border: `1px solid ${hover ? 'transparent' : T.border}`, borderRadius: 10, fontSize: 13, fontWeight: 500, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, boxShadow: hover ? '0 6px 16px rgba(212,83,126,0.32)' : 'none' }}>
          <Icon name="chat" size={15} />
          开始聊天
        </button>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// Page 3 — Chat (core)
// ────────────────────────────────────────────────────────────────────────────
function PageChat() {
  const active = characters[1]; // 裴司寒
  const conversations = [
    { c: characters[0], last: '明天有空？带你去看一片野花海。', time: '10:24' },
    { c: characters[1], last: '...随便你。', time: '现在', active: true, unread: 2 },
    { c: characters[2], last: '又不是给你画的。哼。', time: '昨天' },
    { c: characters[3], last: '你今天提过的那家面馆，我记下了。', time: '昨天' },
  ];

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', background: T.bg, color: T.text, fontFamily: '"Noto Sans SC", system-ui, sans-serif', overflow: 'hidden' }}>
      <Sidebar active="chat" />

      {/* Conversation list */}
      <div style={{ width: 260, background: T.panel, borderRight: `1px solid ${T.border}`, display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '20px 18px 14px' }}>
          <div style={{ fontFamily: '"Noto Serif SC", serif', fontSize: 20, fontWeight: 600 }}>聊天</div>
          <div style={{ fontSize: 11, color: T.textMute, marginTop: 2, letterSpacing: 1 }}>4 位男友 · 同时只能与一位</div>
        </div>
        <div style={{ padding: '0 12px 12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 10px', background: T.panel3, border: `1px solid ${T.border}`, borderRadius: 8, fontSize: 12, color: T.textMute }}>
            <span>🔍</span>搜索消息
          </div>
        </div>
        <div style={{ flex: 1, overflow: 'auto' }}>
          {conversations.map((row, i) => (
            <ConvoRow key={i} {...row} />
          ))}
        </div>
        <div style={{ padding: 14, borderTop: `1px solid ${T.border}`, display: 'flex', alignItems: 'center', gap: 10, background: T.panel }}>
          <div style={{ width: 32, height: 32, borderRadius: '50%', background: T.panel3, border: `1px solid ${T.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12 }}>花</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 13, color: T.text }}>小花同学</div>
            <div style={{ fontSize: 11, color: T.textMute }}>已签到 · 第 12 天</div>
          </div>
        </div>
      </div>

      {/* Chat area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: T.bg, position: 'relative' }}>
        {/* header */}
        <div style={{ height: 64, padding: '0 22px', display: 'flex', alignItems: 'center', borderBottom: `1px solid ${T.border}`, gap: 12, background: T.panel }}>
          <Avatar c={active} size={36} />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 15, fontWeight: 500, color: T.text }}>{active.name}</div>
            <div style={{ fontSize: 11, color: active.accent, display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ width: 6, height: 6, background: active.accent, borderRadius: '50%' }} />在线 · 暧昧期
            </div>
          </div>
          <HeaderBtn icon="bell" />
          <HeaderBtn icon="cal" />
        </div>

        {/* Messages */}
        <div style={{ flex: 1, overflow: 'auto', padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: 18 }}>
          <DateSep label="今天 · 21:18" />

          <BubbleAI c={active} text="嗯，有点忙。怎么了？" />
          <BubbleUser text="你今天忙吗？" />
          <BubbleAI c={active} text="还好。你找我有事？" hasPlay />
          <BubbleUser text="没事，就是想和你说说话。" />
          <BubbleAI c={active} text="...随便你。" hasPlay />
          <Typing c={active} />
        </div>

        {/* Input */}
        <div style={{ padding: '14px 24px 18px', borderTop: `1px solid ${T.border}`, background: T.panel }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 10, background: T.panel2, border: `1px solid ${T.border}`, borderRadius: 14, padding: 8 }}>
            <div style={{ display: 'flex', gap: 2, padding: '6px 4px' }}>
              <SmallBtn>🎁</SmallBtn>
              <SmallBtn>📷</SmallBtn>
            </div>
            <div style={{ flex: 1, padding: '10px 4px', fontSize: 14, color: T.textMute, minHeight: 24 }}>
              和{active.name}说些什么…
            </div>
            <div style={{ fontSize: 11, color: T.textMute, padding: '0 6px' }}>0 / 500</div>
            <button style={{ width: 38, height: 38, borderRadius: 10, background: `linear-gradient(180deg, ${T.pinkHi}, ${T.pink})`, border: 'none', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 6px 16px rgba(212,83,126,0.35)' }}>
              <Icon name="send" size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Right info panel */}
      <div style={{ width: 280, background: T.panel, borderLeft: `1px solid ${T.border}`, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div style={{ height: 280, background: active.grad, position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 140, opacity: 0.16 }}>{active.emoji}</div>
          <div style={{ position: 'absolute', inset: 0, backgroundImage: 'repeating-linear-gradient(135deg, rgba(255,255,255,0.03) 0 1px, transparent 1px 14px)' }} />
          <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 100, background: `linear-gradient(180deg, transparent, ${T.panel})` }} />
          <div style={{ position: 'absolute', top: 12, left: 14, padding: '4px 10px', background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(6px)', borderRadius: 999, fontSize: 10, color: T.textDim, letterSpacing: 1 }}>PORTRAIT · 占位图</div>
        </div>
        <div style={{ padding: '18px 20px', flex: 1, overflow: 'auto' }}>
          <div style={{ fontFamily: '"Noto Serif SC", serif', fontSize: 22, fontWeight: 600 }}>{active.emoji} {active.name}</div>
          <div style={{ fontSize: 12, color: T.textDim, marginTop: 2 }}>{active.job} · 32岁</div>

          <div style={{ display: 'flex', gap: 6, marginTop: 14 }}>
            {active.tags.map(t => <div key={t} style={{ padding: '3px 9px', borderRadius: 6, background: T.panel3, border: `1px solid ${T.border}`, fontSize: 11, color: T.textDim }}>{t}</div>)}
          </div>

          <Section title="关于他" body={active.desc} />
          <Section title="说话风格" body={active.style} />

          {/* Affinity stage (no number) */}
          <div style={{ marginTop: 18 }}>
            <div style={{ fontSize: 10, letterSpacing: 2, color: T.textMute, textTransform: 'uppercase', marginBottom: 8 }}>关系</div>
            <div style={{ display: 'flex', gap: 4 }}>
              {['陌生人', '朋友', '暧昧', '恋人'].map((s, i) => (
                <div key={s} style={{ flex: 1, textAlign: 'center', padding: '6px 0', fontSize: 11, color: i === 2 ? T.text : T.textMute, background: i === 2 ? T.pinkSoft : T.panel3, border: `1px solid ${i === 2 ? T.pink : T.border}`, borderRadius: 6 }}>{s}</div>
              ))}
            </div>
          </div>

          {/* Quick actions */}
          <div style={{ marginTop: 18, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            <QuickAct label="送礼物" sub="今日剩 2 次" />
            <QuickAct label="切换背景" sub="已解锁 3 / 8" />
            <QuickAct label="收藏夹" sub="14 句心动" />
            <QuickAct label="他的动态" sub="今天发了 1 条" />
          </div>
        </div>
      </div>
    </div>
  );
}

function ConvoRow({ c, last, time, active, unread }) {
  return (
    <div style={{ display: 'flex', gap: 10, padding: '12px 14px', position: 'relative', background: active ? T.panel2 : 'transparent', cursor: 'pointer' }}>
      {active && <div style={{ position: 'absolute', left: 0, top: 12, bottom: 12, width: 2, background: T.pink, borderRadius: 2 }} />}
      <Avatar c={c} size={40} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <div style={{ fontSize: 13, fontWeight: 500, color: T.text }}>{c.name}</div>
          <div style={{ fontSize: 10, color: T.textMute }}>{time}</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 2 }}>
          <div style={{ flex: 1, fontSize: 12, color: T.textMute, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{last}</div>
          {unread && <div style={{ minWidth: 18, height: 18, padding: '0 5px', borderRadius: 9, background: T.pink, color: 'white', fontSize: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600 }}>{unread}</div>}
        </div>
      </div>
    </div>
  );
}

function Avatar({ c, size = 36 }) {
  return (
    <div style={{ width: size, height: size, borderRadius: '50%', background: c.grad, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: size * 0.5, flexShrink: 0, border: `1px solid ${T.border}` }}>{c.emoji}</div>
  );
}

function HeaderBtn({ icon }) {
  return <div style={{ width: 36, height: 36, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', color: T.textMute, background: T.panel2, border: `1px solid ${T.border}` }}><Icon name={icon} size={15} /></div>;
}

function SmallBtn({ children }) {
  return <div style={{ width: 32, height: 32, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, color: T.textMute, cursor: 'pointer' }}>{children}</div>;
}

function DateSep({ label }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
      <div style={{ flex: 1, height: 1, background: T.border, maxWidth: 80 }} />
      <div style={{ fontSize: 11, color: T.textMute, letterSpacing: 1 }}>{label}</div>
      <div style={{ flex: 1, height: 1, background: T.border, maxWidth: 80 }} />
    </div>
  );
}

function BubbleUser({ text }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
      <div style={{ maxWidth: '70%', padding: '10px 14px', background: `linear-gradient(180deg, ${T.pinkHi}, ${T.pink})`, color: 'white', fontSize: 14, lineHeight: 1.5, borderRadius: '14px 14px 4px 14px', boxShadow: '0 4px 14px rgba(212,83,126,0.25)' }}>{text}</div>
    </div>
  );
}

function BubbleAI({ c, text, hasPlay }) {
  return (
    <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
      <Avatar c={c} size={32} />
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 4 }}>
        <div style={{ maxWidth: 380, padding: '10px 14px', background: T.panel2, border: `1px solid ${T.border}`, color: T.text, fontSize: 14, lineHeight: 1.5, borderRadius: '4px 14px 14px 14px' }}>{text}</div>
        {hasPlay && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '3px 8px', fontSize: 11, color: T.textMute, cursor: 'pointer' }}>
            <Icon name="play" size={10} />
            <span>播放语音</span>
            <span style={{ color: T.borderHi }}>·</span>
            <span>0:04</span>
            <span style={{ color: T.borderHi }}>·</span>
            <span style={{ color: T.pink }}>♡ 收藏</span>
          </div>
        )}
      </div>
    </div>
  );
}

function Typing({ c }) {
  return (
    <div style={{ display: 'flex', gap: 10, alignItems: 'flex-end' }}>
      <Avatar c={c} size={32} />
      <div style={{ padding: '12px 16px', background: T.panel2, border: `1px solid ${T.border}`, borderRadius: '4px 14px 14px 14px', display: 'flex', gap: 4 }}>
        {[0, 1, 2].map(i => <div key={i} style={{ width: 6, height: 6, borderRadius: '50%', background: T.textDim, opacity: 0.5 + i * 0.15 }} />)}
      </div>
    </div>
  );
}

function Section({ title, body }) {
  return (
    <div style={{ marginTop: 18, paddingTop: 18, borderTop: `1px solid ${T.border}` }}>
      <div style={{ fontSize: 10, letterSpacing: 2, color: T.textMute, textTransform: 'uppercase', marginBottom: 8 }}>{title}</div>
      <div style={{ fontSize: 13, color: T.textDim, lineHeight: 1.6 }}>{body}</div>
    </div>
  );
}

function QuickAct({ label, sub }) {
  return (
    <div style={{ background: T.panel2, border: `1px solid ${T.border}`, borderRadius: 8, padding: '10px 12px' }}>
      <div style={{ fontSize: 12, color: T.text, marginBottom: 2 }}>{label}</div>
      <div style={{ fontSize: 10, color: T.textMute }}>{sub}</div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// Page 4 — Profile
// ────────────────────────────────────────────────────────────────────────────
function PageProfile() {
  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', background: T.bg, color: T.text, fontFamily: '"Noto Sans SC", system-ui, sans-serif', overflow: 'hidden' }}>
      <Sidebar active="user" />
      <div style={{ flex: 1, padding: '36px 48px', overflow: 'auto' }}>
        <div style={{ maxWidth: 680 }}>
          <div style={{ fontFamily: '"Noto Serif SC", serif', fontSize: 28, fontWeight: 600, marginBottom: 4 }}>我的资料</div>
          <div style={{ fontSize: 13, color: T.textMute, marginBottom: 28 }}>管理你的账号信息与个人喜好。</div>

          {/* Avatar row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 20, paddingBottom: 26, borderBottom: `1px solid ${T.border}`, marginBottom: 26 }}>
            <div style={{ position: 'relative', width: 96, height: 96 }}>
              <div style={{ width: 96, height: 96, borderRadius: '50%', background: T.panel2, border: `2px solid ${T.pink}`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: T.pink, boxShadow: '0 0 0 4px rgba(212,83,126,0.08)' }}>
                <Icon name="user" size={42} />
              </div>
              <div style={{ position: 'absolute', right: 0, bottom: 2, width: 30, height: 30, borderRadius: '50%', background: T.pink, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', border: `2px solid ${T.bg}` }}>
                <Icon name="cam" size={14} />
              </div>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: '"Noto Serif SC", serif', fontSize: 22, fontWeight: 600 }}>小花同学</div>
              <div style={{ fontSize: 13, color: T.textMute, marginTop: 2 }}>user@example.com · 加入于 2026.03.14</div>
              <div style={{ display: 'flex', gap: 10, marginTop: 12 }}>
                <button style={{ padding: '7px 14px', background: 'transparent', border: `1px solid ${T.pink}`, color: T.pink, borderRadius: 8, fontSize: 12, fontFamily: 'inherit', cursor: 'pointer' }}>修改头像</button>
                <button style={{ padding: '7px 14px', background: T.panel2, border: `1px solid ${T.border}`, color: T.textDim, borderRadius: 8, fontSize: 12, fontFamily: 'inherit', cursor: 'pointer' }}>查看我的主页</button>
              </div>
            </div>
            <Stat label="签到" val="12" sub="连续天数" />
            <Stat label="收藏" val="14" sub="心动语录" />
            <Stat label="货币" val="320" sub="纸币" />
          </div>

          {/* Heart line */}
          <div style={{ background: `linear-gradient(135deg, ${T.pinkSoft} 0%, ${T.panel2} 60%)`, border: `1px solid ${T.border}`, borderRadius: 14, padding: '16px 20px', marginBottom: 28, display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ fontSize: 11, letterSpacing: 2, color: T.pink, textTransform: 'uppercase' }}>♡ 心动语录</div>
            <div style={{ flex: 1, fontFamily: '"Noto Serif SC", serif', fontSize: 16, color: T.text, fontStyle: 'italic' }}>"还好。你找我有事？" — 裴司寒</div>
            <div style={{ fontSize: 12, color: T.pink, cursor: 'pointer' }}>更换 →</div>
          </div>

          {/* Form */}
          <div style={{ fontSize: 11, letterSpacing: 2, color: T.textMute, textTransform: 'uppercase', marginBottom: 14 }}>基本信息</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <FormField label="昵称" value="小花同学" />
            <FormField label="邮箱" value="user@example.com" readOnly />
            <FormField label="生日" value="1998 年 4 月 12 日" rightIcon="cal" />
            <FormField label="密码" value="••••••••••" rightAction="修改" />
            <FormField label="界面语言" value="中文（简体）" rightIcon="globe" />
            <FormField label="首选男友" value="❄️ 裴司寒" rightIcon="arrow" />
          </div>

          <div style={{ display: 'flex', gap: 10, marginTop: 28 }}>
            <button style={{ padding: '11px 22px', background: `linear-gradient(180deg, ${T.pinkHi}, ${T.pink})`, color: 'white', border: 'none', borderRadius: 10, fontSize: 13, fontWeight: 500, fontFamily: 'inherit', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, boxShadow: '0 6px 18px rgba(212,83,126,0.3)' }}>
              <Icon name="save" size={14} />保存修改
            </button>
            <button style={{ padding: '11px 22px', background: 'transparent', color: T.textDim, border: `1px solid ${T.border}`, borderRadius: 10, fontSize: 13, fontFamily: 'inherit', cursor: 'pointer' }}>取消</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function FormField({ label, value, readOnly, rightIcon, rightAction }) {
  return (
    <div>
      <div style={{ fontSize: 11, color: T.textMute, marginBottom: 6, letterSpacing: 0.5 }}>{label}</div>
      <div style={{ display: 'flex', alignItems: 'center', background: readOnly ? T.panel : T.panel2, border: `1px solid ${T.border}`, borderRadius: 10, padding: '0 14px', height: 44 }}>
        <div style={{ flex: 1, fontSize: 14, color: readOnly ? T.textMute : T.text }}>{value}</div>
        {rightIcon && <span style={{ color: T.textMute, display: 'flex' }}><Icon name={rightIcon} size={15} /></span>}
        {rightAction && <span style={{ color: T.pink, fontSize: 12, fontWeight: 500, cursor: 'pointer' }}>{rightAction}</span>}
      </div>
    </div>
  );
}

function Stat({ label, val, sub }) {
  return (
    <div style={{ textAlign: 'center', padding: '0 14px', borderLeft: `1px solid ${T.border}` }}>
      <div style={{ fontSize: 11, color: T.textMute, letterSpacing: 1, marginBottom: 4 }}>{label}</div>
      <div style={{ fontFamily: '"Noto Serif SC", serif', fontSize: 22, fontWeight: 600, color: T.text }}>{val}</div>
      <div style={{ fontSize: 10, color: T.textMute, marginTop: 2 }}>{sub}</div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// Page 5 — Settings
// ────────────────────────────────────────────────────────────────────────────
function PageSettings() {
  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', background: T.bg, color: T.text, fontFamily: '"Noto Sans SC", system-ui, sans-serif', overflow: 'hidden' }}>
      <Sidebar active="gear" />
      <div style={{ flex: 1, padding: '36px 48px', overflow: 'auto' }}>
        <div style={{ maxWidth: 520 }}>
          <div style={{ fontFamily: '"Noto Serif SC", serif', fontSize: 28, fontWeight: 600, marginBottom: 4 }}>设置</div>
          <div style={{ fontSize: 13, color: T.textMute, marginBottom: 28 }}>调整偏好与账号选项。</div>

          <SettingsGroup title="偏好">
            <SettingRow icon="globe" title="语言" sub="界面显示语言" right={<SegToggle options={['中文', 'English']} active={0} />} />
            <SettingRow icon="bell" title="消息通知" sub="男友发消息时提醒" right={<Toggle on />} />
            <SettingRow icon="volume" title="自动播放语音" sub="收到消息自动播放 TTS" right={<Toggle />} />
          </SettingsGroup>

          <div style={{ height: 22 }} />

          <SettingsGroup title="聊天体验">
            <SettingRow icon="cal" title="每日签到提醒" sub="每天 21:00 推送一次" right={<Toggle on />} />
            <SettingRow icon="chat" title="敏感内容过滤" sub="角色自动温柔转移话题" right={<Toggle on />} />
          </SettingsGroup>

          <div style={{ height: 22 }} />

          <SettingsGroup title="账号">
            <SettingRow icon="trash" title="清空聊天记录" sub="删除所有角色的对话历史" right={<Icon name="arrow" size={14} color={T.textMute} />} muted />
            <SettingRow icon="logout" title="退出登录" sub="" pink right={<Icon name="arrow" size={14} color={T.pink} />} />
          </SettingsGroup>

          <div style={{ marginTop: 28, fontSize: 11, color: T.textMute, textAlign: 'center', letterSpacing: 1 }}>
            纸片人男友 · v0.1.0 (MVP) · made with ♡
          </div>
        </div>
      </div>
    </div>
  );
}

function SettingsGroup({ title, children }) {
  return (
    <div>
      <div style={{ fontSize: 11, letterSpacing: 2, color: T.textMute, textTransform: 'uppercase', marginBottom: 10, paddingLeft: 4 }}>{title}</div>
      <div style={{ background: T.panel, border: `1px solid ${T.border}`, borderRadius: 14, overflow: 'hidden' }}>
        {React.Children.map(children, (child, i) => (
          <div style={{ borderTop: i === 0 ? 'none' : `1px solid ${T.border}` }}>{child}</div>
        ))}
      </div>
    </div>
  );
}

function SettingRow({ icon, title, sub, right, muted, pink }) {
  const iconBg = pink ? T.pinkSoft : T.panel3;
  const iconColor = pink ? T.pink : (muted ? T.textMute : T.textDim);
  return (
    <div style={{ padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 14 }}>
      <div style={{ width: 32, height: 32, borderRadius: 8, background: iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: iconColor, flexShrink: 0 }}>
        <Icon name={icon} size={15} />
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 13, fontWeight: 500, color: pink ? T.pink : T.text }}>{title}</div>
        {sub && <div style={{ fontSize: 11, color: T.textMute, marginTop: 2 }}>{sub}</div>}
      </div>
      <div>{right}</div>
    </div>
  );
}

function Toggle({ on }) {
  return (
    <div style={{ width: 38, height: 22, borderRadius: 999, background: on ? T.pink : T.panel3, border: `1px solid ${on ? T.pink : T.border}`, position: 'relative', transition: 'all 0.2s' }}>
      <div style={{ position: 'absolute', top: 2, left: on ? 18 : 2, width: 16, height: 16, borderRadius: '50%', background: 'white', boxShadow: '0 1px 3px rgba(0,0,0,0.4)', transition: 'all 0.2s' }} />
    </div>
  );
}

function SegToggle({ options, active }) {
  return (
    <div style={{ display: 'flex', background: T.panel3, border: `1px solid ${T.border}`, borderRadius: 8, padding: 2 }}>
      {options.map((o, i) => (
        <div key={o} style={{ padding: '5px 12px', fontSize: 11, borderRadius: 6, background: i === active ? T.pink : 'transparent', color: i === active ? 'white' : T.textMute, fontWeight: i === active ? 500 : 400 }}>{o}</div>
      ))}
    </div>
  );
}

// Expose
Object.assign(window, { PageLogin, PageHome, PageChat, PageProfile, PageSettings });
