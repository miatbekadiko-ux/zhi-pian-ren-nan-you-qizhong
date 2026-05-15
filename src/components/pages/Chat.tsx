'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { T } from '@/lib/tokens';
import { Sidebar } from '@/components/Sidebar';
import { Icon } from '@/components/Icon';
import { characters, Character } from '@/lib/characters';
import { useAuthState } from '@/lib/useAuth';
import { PremiumModal } from '@/components/PremiumModal';
import { TopNav, useSidebarCollapsed } from '@/components/TopNav';

const CHAT_CSS = `
  @keyframes typing-dot {
    0%, 60%, 100% { transform: translateY(0); opacity: 0.35; }
    30% { transform: translateY(-4px); opacity: 1; }
  }
  @keyframes img-dot {
    0%, 60%, 100% { opacity: 0.3; }
    30% { opacity: 1; }
  }
`;

type ImgState = 'pending' | 'loading' | 'done';
type Msg = { id: number; role: 'user' | 'ai'; text: string; imageUrl?: string | null; imgState?: ImgState };

async function autoPlayTTS(text: string, characterId: string) {
  if (typeof window === 'undefined') return;
  if (localStorage.getItem('zprn_tts') !== 'true') return;
  try {
    const res = await fetch('/api/tts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, characterId }),
    });
    if (res.ok) {
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);
      audio.onended = () => URL.revokeObjectURL(url);
      audio.onerror = () => URL.revokeObjectURL(url);
      audio.play();
      return;
    }
  } catch { /* fall through to browser TTS */ }
  if ('speechSynthesis' in window) {
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'zh-CN';
    window.speechSynthesis.speak(u);
  }
}

function Avatar({ c, size = 36 }: { c: Character; size?: number }) {
  if (c.portraitUrl) {
    return (
      <div style={{ width: size, height: size, borderRadius: '50%', overflow: 'hidden', flexShrink: 0, border: `1px solid ${T.border}` }}>
        <img src={c.portraitUrl} alt={c.name} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top center', display: 'block' }} />
      </div>
    );
  }
  return (
    <div style={{ width: size, height: size, borderRadius: '50%', background: c.grad, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: size * 0.5, flexShrink: 0, border: `1px solid ${T.border}` }}>{c.emoji}</div>
  );
}

function ConvoRow({ c, last, time, active: isActive, unread, onClick }: { c: Character; last: string; time: string; active?: boolean; unread?: number; onClick?: () => void }) {
  const [hovered, setHovered] = React.useState(false);
  const overlay = isActive || hovered;
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex', gap: 14, padding: '16px 18px',
        margin: '2px 6px', borderRadius: 16, position: 'relative',
        background: overlay ? 'rgba(255,255,255,0.10)' : 'transparent',
        border: '1px solid transparent',
        cursor: 'pointer', transition: 'background 0.2s ease',
      }}
    >
      {isActive && <div style={{ position: 'absolute', left: -6, top: 14, bottom: 14, width: 3, background: T.pink, borderRadius: 2 }} />}
      <Avatar c={c} size={48} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <div style={{ fontSize: 15, fontWeight: 600, color: T.text }}>{c.name}</div>
          <div style={{ fontSize: 11, color: T.textMute }}>{time}</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4 }}>
          <div style={{ flex: 1, fontSize: 13, color: T.textMute, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{last}</div>
          {unread && <div style={{ minWidth: 20, height: 20, padding: '0 6px', borderRadius: 10, background: T.pink, color: 'white', fontSize: 11, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600 }}>{unread}</div>}
        </div>
      </div>
    </div>
  );
}

function DateSep({ label }: { label: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
      <div style={{ flex: 1, height: 1, background: T.border, maxWidth: 80 }} />
      <div style={{ fontSize: 11, color: T.textMute, letterSpacing: 1 }}>{label}</div>
      <div style={{ flex: 1, height: 1, background: T.border, maxWidth: 80 }} />
    </div>
  );
}

function BubbleUser({ text }: { text: string }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
      <div style={{ maxWidth: '70%', padding: '10px 14px', background: `linear-gradient(180deg, ${T.pinkHi}, ${T.pink})`, color: 'white', fontSize: 14, lineHeight: 1.5, borderRadius: '14px 14px 4px 14px', boxShadow: '0 4px 14px rgba(212,83,126,0.25)', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{text}</div>
    </div>
  );
}

function ImageLoadingBubble({ c }: { c: Character }) {
  return (
    <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start', paddingLeft: 42 }}>
      <div style={{ padding: '10px 14px', background: T.panel2, border: `1px solid ${T.border}`, borderRadius: '4px 14px 14px 14px', display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: T.textDim }}>
        <span>正在发送图片</span>
        <div style={{ display: 'flex', gap: 3 }}>
          {[0, 1, 2].map(i => (
            <div key={i} style={{ width: 5, height: 5, borderRadius: '50%', background: c.accent, animation: `img-dot 1.2s ease-in-out ${i * 0.18}s infinite` }} />
          ))}
        </div>
      </div>
    </div>
  );
}

function BubbleAI({ c, text, imageUrl, imgState }: { c: Character; text: string; imageUrl?: string | null; imgState?: ImgState }) {
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const playingRef = useRef(false);

  useEffect(() => {
    return () => {
      if (audioRef.current) { audioRef.current.pause(); audioRef.current = null; }
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    };
  }, []);

  const stopPlayback = () => {
    playingRef.current = false;
    if (audioRef.current) { audioRef.current.pause(); audioRef.current = null; }
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    setPlaying(false);
  };

  const togglePlay = async () => {
    if (playingRef.current) { stopPlayback(); return; }
    playingRef.current = true;
    setPlaying(true);
    try {
      const res = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, characterId: c.id }),
      });
      if (res.ok) {
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        const audio = new Audio(url);
        audioRef.current = audio;
        audio.onended = () => { playingRef.current = false; URL.revokeObjectURL(url); audioRef.current = null; setPlaying(false); };
        audio.onerror = () => { playingRef.current = false; URL.revokeObjectURL(url); audioRef.current = null; setPlaying(false); };
        audio.play();
        return;
      }
    } catch { /* fall through */ }
    if (!('speechSynthesis' in window)) { playingRef.current = false; setPlaying(false); return; }
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'zh-CN';
    u.onend = () => { playingRef.current = false; setPlaying(false); };
    u.onerror = () => { playingRef.current = false; setPlaying(false); };
    window.speechSynthesis.speak(u);
  };

  const showImage = imageUrl && (!imgState || imgState === 'done');

  return (
    <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
      <Avatar c={c} size={32} />
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 4 }}>
        <div style={{ maxWidth: 380, padding: '10px 14px', background: T.panel2, border: `1px solid ${T.border}`, color: T.text, fontSize: 14, lineHeight: 1.5, borderRadius: '4px 14px 14px 14px', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{text}</div>
        {imgState === 'loading' && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', marginTop: 4, background: T.panel3, border: `1px solid ${T.border}`, borderRadius: 10, fontSize: 12, color: T.textMute }}>
            <div style={{ display: 'flex', gap: 3 }}>
              {[0, 1, 2].map(i => (
                <div key={i} style={{ width: 5, height: 5, borderRadius: '50%', background: c.accent, animation: `img-dot 1.2s ease-in-out ${i * 0.18}s infinite` }} />
              ))}
            </div>
            <span>照片生成中，稍等一下…</span>
          </div>
        )}
        {showImage && (
          <div style={{ width: 200, height: 266, borderRadius: 12, overflow: 'hidden', border: `1px solid ${T.border}`, position: 'relative', background: imageUrl === 'placeholder' ? c.grad : '#111' }}>
            {imageUrl === 'placeholder' ? (
              <>
                <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 72, opacity: 0.18 }}>{c.emoji}</div>
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '8px 12px', background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(6px)', fontSize: 11, color: 'rgba(255,255,255,0.65)', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ width: 5, height: 5, borderRadius: '50%', background: c.accent, flexShrink: 0, display: 'inline-block' }} />
                  {c.name} 发来了一张照片
                </div>
              </>
            ) : (
              <img src={imageUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            )}
          </div>
        )}
        <div onClick={togglePlay} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '3px 8px', fontSize: 11, color: playing ? c.accent : T.textMute, cursor: 'pointer' }}>
          <Icon name="play" size={10} />
          <span>{playing ? '播放中…' : '播放语音'}</span>
        </div>
      </div>
    </div>
  );
}

function Typing({ c }: { c: Character }) {
  return (
    <div style={{ display: 'flex', gap: 10, alignItems: 'flex-end' }}>
      <Avatar c={c} size={32} />
      <div style={{ padding: '12px 16px', background: T.panel2, border: `1px solid ${T.border}`, borderRadius: '4px 14px 14px 14px', display: 'flex', gap: 4 }}>
        {[0, 1, 2].map(i => (
          <div key={i} style={{ width: 6, height: 6, borderRadius: '50%', background: T.textDim, animation: `typing-dot 1.2s ease-in-out ${i * 0.15}s infinite` }} />
        ))}
      </div>
    </div>
  );
}

function LoginModal({ c, onClose, onLogin }: { c: Character; onClose: () => void; onLogin: () => void }) {
  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
      <div onClick={e => e.stopPropagation()} style={{ width: 340, background: T.panel2, border: `1px solid ${T.border}`, borderRadius: 18, padding: '32px 28px 28px', position: 'relative', boxShadow: '0 30px 80px rgba(0,0,0,0.6)' }}>
        <button onClick={onClose} style={{ position: 'absolute', top: 14, right: 14, width: 28, height: 28, borderRadius: 8, background: 'transparent', border: 'none', color: T.textMute, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>✕</button>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
          <div style={{ width: 56, height: 56, borderRadius: '50%', background: c.grad, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, marginBottom: 14, border: `1px solid ${T.border}` }}>{c.emoji}</div>
          <div style={{ fontFamily: '"Noto Serif SC", serif', fontSize: 18, fontWeight: 600, color: T.text, marginBottom: 8 }}>登录后才能和{c.name}说话</div>
          <div style={{ fontSize: 13, color: T.textDim, lineHeight: 1.6, marginBottom: 24 }}>加入纸片人男友，{characters.length} 位专属男友<br />随时随地陪你聊天</div>
          <button onClick={onLogin} style={{ width: '100%', padding: '12px 0', background: `linear-gradient(180deg, ${T.pinkHi}, ${T.pink})`, color: 'white', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 600, letterSpacing: 1, cursor: 'pointer', boxShadow: '0 8px 22px rgba(212,83,126,0.35)', marginBottom: 10 }}>立即登录</button>
          <button onClick={onLogin} style={{ width: '100%', padding: '11px 0', background: 'transparent', color: T.textDim, border: `1px solid ${T.border}`, borderRadius: 10, fontSize: 14, cursor: 'pointer' }}>免费注册账号</button>
        </div>
      </div>
    </div>
  );
}


function MenuBtn({ onClick, children, color }: { onClick: () => void; children: React.ReactNode; color?: string }) {
  const [hovered, setHovered] = React.useState(false);
  return (
    <button
      onClick={onClick}
      type="button"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width: '100%', padding: '13px 16px', border: 'none',
        background: hovered ? 'rgba(255,255,255,0.06)' : 'transparent',
        color: color || 'inherit', fontSize: 14, textAlign: 'left', cursor: 'pointer',
        display: 'flex', alignItems: 'center', gap: 12,
        transition: 'background 0.15s ease',
      }}
    >
      {children}
    </button>
  );
}

function formatMsgTime(iso: string): string {
  const d = new Date(iso);
  const now = new Date();
  if (d.toDateString() === now.toDateString()) {
    return `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
  }
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  if (d.toDateString() === yesterday.toDateString()) return '昨天';
  return `${d.getMonth() + 1}/${d.getDate()}`;
}

type ConvoPreview = { lastMessagePreview: string | null; updatedAt: string };

export function PageChat() {
  const router = useRouter();
  const { isLoggedIn } = useAuthState();
  const [premiumOpen, setPremiumOpen] = useState(false);
  const { collapsed } = useSidebarCollapsed();
  const [activeId, setActiveId] = useState<string>('pei');
  const [messages, setMessages] = useState<Msg[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [input, setInput] = useState('');
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [convoPreviews, setConvoPreviews] = useState<Record<string, ConvoPreview>>({});
  const [panelOpen, setPanelOpen] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const tempIdRef = useRef(-1);
  const isTypingRef = useRef(false);
  const sendingRef = useRef(false);
  const activeIdRef = useRef(activeId);
  const [messagesLoading, setMessagesLoading] = useState(false);

  const loadConvoPreviews = useCallback(() => {
    fetch('/api/conversations')
      .then(r => r.ok ? r.json() : [])
      .then((list: Array<{ characterId: string; lastMessagePreview: string | null; updatedAt: string }>) => {
        const map: Record<string, ConvoPreview> = {};
        for (const c of list) map[c.characterId] = { lastMessagePreview: c.lastMessagePreview, updatedAt: c.updatedAt };
        setConvoPreviews(map);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const stored = localStorage.getItem('selectedCharacterId');
    if (stored && characters.find(c => c.id === stored)) {
      setActiveId(stored);
    }
  }, []);

  useEffect(() => {
    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        const stored = localStorage.getItem('selectedCharacterId');
        if (stored && characters.find(c => c.id === stored) && stored !== activeId) {
          switchCharacter(stored);
        }
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, [activeId]);

  useEffect(() => {
    if (!isLoggedIn) return;
    loadConvoPreviews();
  }, [isLoggedIn, loadConvoPreviews]);

  // ── 只在 activeId 真正切换时拉历史消息，与发消息逻辑完全隔离 ──
  // 用 ref 存 isLoggedIn，避免 isLoggedIn 变化触发重拉覆盖乐观更新
  const isLoggedInRef = useRef(isLoggedIn);
  useEffect(() => { isLoggedInRef.current = isLoggedIn; }, [isLoggedIn]);

  useEffect(() => {
    if (!isLoggedInRef.current) { setMessages([]); setMessagesLoading(false); return; }
    // 发消息期间 activeId 不变，这个 effect 不会触发，安全
    let cancelled = false;
    const controller = new AbortController();
    setMessagesLoading(true);
    fetch(`/api/chat?characterId=${activeId}`, { signal: controller.signal })
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(data => {
        if (cancelled) return;
        // 只有在没有进行中的发送时才覆盖（双重保险）
        if (sendingRef.current || isTypingRef.current) { setMessagesLoading(false); return; }
        setMessages(data.messages.map((m: { id: number; role: string; content: string; imageUrl?: string | null }) => ({
          id: m.id,
          role: (m.role === 'user' ? 'user' : 'ai') as 'user' | 'ai',
          text: m.content,
          imageUrl: m.imageUrl,
        })));
        setMessagesLoading(false);
      })
      .catch(err => {
        if (err.name !== 'AbortError') console.error(err);
        if (!cancelled) setMessagesLoading(false);
      });
    return () => { cancelled = true; controller.abort(); };
  }, [activeId]);  // ← 只依赖 activeId，isLoggedIn 变化不触发重拉

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const active = characters.find(c => c.id === activeId) ?? characters[1];

  useEffect(() => { activeIdRef.current = activeId; }, [activeId]);

  const switchCharacter = (id: string) => {
    activeIdRef.current = id;
    sendingRef.current = false;
    isTypingRef.current = false;
    setIsTyping(false);
    setInput('');
    setActiveId(id);
    localStorage.setItem('selectedCharacterId', id);
    // 不插入占位数据：未发过消息的角色不应出现在列表里
  };

  const sendMessage = useCallback(async () => {
    const text = input.trim();
    if (!text || isTyping || sendingRef.current) return;
    if (!isLoggedIn) { setShowLoginModal(true); return; }

    const currentCharacterId = activeId;
    const tempId = tempIdRef.current--;
    const capturedTempId = tempId;

    // 标记发送中，阻止 useEffect 拉取覆盖
    sendingRef.current = true;
    isTypingRef.current = true;

    setInput('');
    // 乐观追加用户消息
    setMessages(prev => [...prev, { id: capturedTempId, role: 'user', text }]);
    setIsTyping(true);
    setConvoPreviews(prev => ({ ...prev, [currentCharacterId]: { lastMessagePreview: text, updatedAt: new Date().toISOString() } }));

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ characterId: activeId, content: text }),
      });
      if (!res.ok) throw new Error('request failed');
      const data = await res.json();
      if (!data?.userMessage || !data?.aiMessage) throw new Error('invalid response');

      const aiMsgId = data.aiMessage.id;
      const generatingImage = !!data.generatingImage;

      if (activeIdRef.current !== currentCharacterId) {
        sendingRef.current = false;
        isTypingRef.current = false;
        return;
      }

      isTypingRef.current = false;
      setIsTyping(false);

      // 用真实 ID 替换临时消息，追加 AI 回复
      setMessages(prev => {
        // 去掉临时消息，换成真实用户消息 + AI 消息
        const withoutTemp = prev.filter(m => m.id !== capturedTempId);
        const realUser: Msg = { id: data.userMessage.id, role: 'user', text: data.userMessage.content ?? text };
        const aiMsg: Msg = { id: aiMsgId, role: 'ai', text: data.aiMessage.content, imageUrl: null, imgState: generatingImage ? 'loading' : undefined };
        // 防止重复（极端情况）
        const alreadyHasAi = withoutTemp.some(m => m.id === aiMsgId);
        const alreadyHasUser = withoutTemp.some(m => m.id === realUser.id);
        const base = alreadyHasUser ? withoutTemp : [...withoutTemp, realUser];
        return alreadyHasAi ? base : [...base, aiMsg];
      });

      autoPlayTTS(data.aiMessage.content, activeId);
      setConvoPreviews(prev => ({ ...prev, [currentCharacterId]: { lastMessagePreview: data.aiMessage.content, updatedAt: new Date().toISOString() } }));
      sendingRef.current = false;

      if (generatingImage) {
        (async () => {
          for (let i = 0; i < 30; i++) {
            await new Promise(r => setTimeout(r, 2000));
            try {
              const r = await fetch(`/api/chat/image?messageId=${aiMsgId}`);
              const d = await r.json();
              if (d.imageUrl) {
                setMessages(prev => prev.map(m => m.id === aiMsgId ? { ...m, imageUrl: d.imageUrl, imgState: 'done' as const } : m));
                return;
              }
            } catch { /* continue polling */ }
          }
          setMessages(prev => prev.map(m => m.id === aiMsgId ? { ...m, imageUrl: 'placeholder', imgState: 'done' as const } : m));
        })();
      }
    } catch {
      sendingRef.current = false;
      isTypingRef.current = false;
      setIsTyping(false);
      // 发送失败：把临时消息标记为错误态（给个新 id 避免 key 冲突）
      setMessages(prev => prev.map(m => m.id === capturedTempId ? { ...m, id: capturedTempId - 9e6 } : m));
    }
  }, [input, isTyping, isLoggedIn, activeId]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  useEffect(() => {
    if (!menuOpen) return;
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [menuOpen]);

  const resetChat = useCallback(async () => {
    setMenuOpen(false);
    await fetch(`/api/conversations?characterId=${activeId}`, { method: 'DELETE' });
    setMessages([]);
  }, [activeId]);

  const deleteChat = useCallback(async () => {
    setMenuOpen(false);
    await fetch(`/api/conversations?characterId=${activeId}`, { method: 'DELETE' });
    setMessages([]);
    setConvoPreviews(prev => { const next = { ...prev }; delete next[activeId]; return next; });
  }, [activeId]);

  // 只显示真实有过对话的角色（有 convoPreviews 数据才入列表）
  const conversations = characters
    .filter(c => !!convoPreviews[c.id])
    .map(c => {
      const preview = convoPreviews[c.id]!;
      return { c, last: preview.lastMessagePreview ?? '', time: formatMsgTime(preview.updatedAt), updatedAt: preview.updatedAt, active: c.id === activeId };
    })
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

  return (
    <>
      <style>{CHAT_CSS}</style>
      <PremiumModal open={premiumOpen} onClose={() => setPremiumOpen(false)} />
      <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', background: T.bg, color: T.text, fontFamily: '"Noto Sans SC", system-ui, sans-serif', overflow: 'hidden' }}>

        <TopNav onPremiumClick={() => setPremiumOpen(true)} />

        <div style={{ flex: 1, display: 'flex', overflow: 'hidden', minHeight: 0 }}>

          <Sidebar active="chat" collapsed={collapsed} onVipClick={() => setPremiumOpen(true)} />

          {/* 左侧聊天列表 */}
          <div style={{ width: 300, background: T.panel, borderRight: `1px solid ${T.border}`, display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
            <div style={{ height: 72, padding: '0 24px', display: 'flex', alignItems: 'center', flexShrink: 0 }}>
              <div style={{ fontSize: 24, fontWeight: 700 }}>聊天</div>
            </div>
            <div style={{ padding: '0 12px 10px', flexShrink: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 10px', background: T.panel3, border: `1px solid ${T.border}`, borderRadius: 8, fontSize: 12, color: T.textMute }}>
                <span>🔍</span>搜索消息
              </div>
            </div>
            <div style={{ flex: 1, overflow: 'auto' }}>
              {conversations.map((row) => (
                <ConvoRow key={row.c.id} {...row} onClick={() => switchCharacter(row.c.id)} />
              ))}
            </div>
          </div>

          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, overflow: 'hidden' }}>
            {/* 聊天头部 */}
            <div style={{ height: 72, padding: '0 16px 0 24px', display: 'flex', alignItems: 'center', borderBottom: `1px solid ${T.border}`, background: T.panel, flexShrink: 0, gap: 14 }}>
              <Avatar c={active} size={46} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 24, fontWeight: 700, color: T.text }}>{active.name}</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0 }}>
                {/* 三点菜单按钮 */}
                <div ref={menuRef} style={{ position: 'relative' }}>
                  <button
                    onClick={() => setMenuOpen(v => !v)}
                    type="button"
                    style={{ width: 52, height: 52, borderRadius: 12, background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.85)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                      <circle cx="12" cy="3.5" r="2.5"/>
                      <circle cx="12" cy="12" r="2.5"/>
                      <circle cx="12" cy="20.5" r="2.5"/>
                    </svg>
                  </button>
                  {menuOpen && (
                    <div style={{
                      position: 'absolute', top: 56, right: 0, width: 180,
                      background: '#1e1e24',
                      border: '1px solid rgba(255,255,255,0.08)',
                      borderRadius: 14, overflow: 'hidden', zIndex: 50,
                      boxShadow: '0 20px 60px rgba(0,0,0,0.7), 0 4px 16px rgba(0,0,0,0.5)',
                    }}>
                      <MenuBtn onClick={resetChat} color={T.text}>
                        <div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-3.27"/>
                          </svg>
                        </div>
                        重置聊天
                      </MenuBtn>
                      <div style={{ height: 1, background: 'rgba(255,255,255,0.06)', margin: '0 12px' }} />
                      <MenuBtn onClick={deleteChat} color="#f87171">
                        <div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(248,113,113,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#f87171" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/>
                          </svg>
                        </div>
                        删除聊天
                      </MenuBtn>
                    </div>
                  )}
                </div>
                {/* 折叠面板按钮 */}
                <button
                  onClick={() => setPanelOpen(v => !v)}
                  type="button"
                  style={{ width: 52, height: 52, borderRadius: 12, background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.85)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  <svg width="24" height="18" viewBox="0 0 24 18" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                    <line x1="0" y1="2" x2="24" y2="2"/>
                    <line x1="4" y1="9" x2="24" y2="9"/>
                    <line x1="9" y1="16" x2="24" y2="16"/>
                  </svg>
                </button>
              </div>
            </div>

            <div style={{ flex: 1, display: 'flex', overflow: 'hidden', minHeight: 0 }}>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, background: T.bg }}>
                <div style={{ flex: 1, overflow: 'auto', padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: 18 }}>
                  <DateSep label="今天" />
                  {messagesLoading && (
                    <div style={{ textAlign: 'center', color: T.textMute, fontSize: 13, marginTop: 20, opacity: 0.5 }}>加载中…</div>
                  )}
                  {!messagesLoading && messages.length === 0 && (
                    <div style={{ textAlign: 'center', color: T.textMute, fontSize: 13, marginTop: 20 }}>和{active.name}说些什么吧~</div>
                  )}
                  {messages.map(msg => {
                    if (msg.role === 'user') return <BubbleUser key={msg.id} text={msg.text} />;
                    return (
                      <React.Fragment key={msg.id}>
                        <BubbleAI c={active} text={msg.text} imageUrl={msg.imageUrl} imgState={msg.imgState} />
                        {msg.imageUrl && msg.imgState === 'loading' && <ImageLoadingBubble c={active} />}
                      </React.Fragment>
                    );
                  })}
                  {isTyping && <Typing c={active} />}
                  <div ref={bottomRef} />
                </div>
                <div style={{ padding: '12px 22px 16px', borderTop: `1px solid ${T.border}`, background: T.panel, flexShrink: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'flex-end', gap: 10, background: T.panel2, border: `1px solid ${T.border}`, borderRadius: 14, padding: '6px 8px' }}>
                    <textarea
                      ref={textareaRef}
                      value={input}
                      onChange={e => setInput(e.target.value.slice(0, 500))}
                      onKeyDown={handleKeyDown}
                      placeholder={`和${active.name}说些什么…`}
                      rows={1}
                      style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', color: T.text, fontSize: 14, fontFamily: 'inherit', resize: 'none', padding: '10px 8px', lineHeight: 1.5, maxHeight: 120, overflowY: 'auto' }}
                    />
                    <div style={{ fontSize: 11, color: T.textMute, padding: '0 4px', flexShrink: 0 }}>{input.length}/500</div>
                    <button
                      onClick={sendMessage}
                      disabled={!input.trim()}
                      style={{ width: 38, height: 38, borderRadius: 10, background: `linear-gradient(180deg, ${T.pinkHi}, ${T.pink})`, border: 'none', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: input.trim() ? 'pointer' : 'default', opacity: input.trim() ? 1 : 0.5, boxShadow: '0 6px 16px rgba(212,83,126,0.35)', flexShrink: 0 }}
                    >
                      <Icon name="send" size={16} />
                    </button>
                  </div>
                </div>
              </div>

              {panelOpen && (
                <div style={{ width: 280, background: T.panel, borderLeft: `1px solid ${T.border}`, display: 'flex', flexDirection: 'column', overflow: 'hidden', flexShrink: 0 }}>
                  <div style={{ flex: '0 0 56%', position: 'relative', overflow: 'hidden' }}>
                    {active.portraitUrl ? (
                      <img src={active.portraitUrl} alt={active.name} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top center', display: 'block' }} />
                    ) : (
                      <>
                        <div style={{ position: 'absolute', inset: 0, background: active.grad }} />
                        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 120, opacity: 0.18 }}>{active.emoji}</div>
                      </>
                    )}
                    <div style={{ position: 'absolute', inset: 0, backgroundImage: 'repeating-linear-gradient(135deg, rgba(255,255,255,0.025) 0 1px, transparent 1px 14px)' }} />
                    <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 80, background: `linear-gradient(180deg, transparent, ${T.panel})` }} />
                  </div>
                  <div style={{ flex: 1, overflow: 'auto', padding: '18px 22px' }}>
                    <div style={{ fontFamily: '"Noto Serif SC", serif', fontSize: 20, fontWeight: 600, color: T.text, display: 'flex', alignItems: 'baseline' }}>
                      {active.name}
                      <span style={{ fontSize: 14, fontWeight: 400, color: T.textDim, marginLeft: 16 }}>{active.age}岁</span>
                    </div>
                    <div style={{ fontSize: 13, color: T.textDim, marginTop: 14, lineHeight: 1.7 }}>{active.story}</div>
                  </div>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
      {showLoginModal && (
        <LoginModal c={active} onClose={() => setShowLoginModal(false)} onLogin={() => router.push('/auth')} />
      )}
    </>
  );
}