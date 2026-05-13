'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { T } from '@/lib/tokens';
import { Sidebar } from '@/components/Sidebar';
import { Icon } from '@/components/Icon';
import { characters, Character } from '@/lib/characters';
import { useAuthState } from '@/lib/useAuth';
import { PremiumModal } from '@/components/PremiumModal';

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

function Avatar({ c, size = 36 }: { c: Character; size?: number }) {
  return (
    <div style={{ width: size, height: size, borderRadius: '50%', background: c.grad, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: size * 0.5, flexShrink: 0, border: `1px solid ${T.border}` }}>{c.emoji}</div>
  );
}

function ConvoRow({ c, last, time, active: isActive, unread, onClick }: { c: Character; last: string; time: string; active?: boolean; unread?: number; onClick?: () => void }) {
  return (
    <div onClick={onClick} style={{ display: 'flex', gap: 10, padding: '12px 14px', position: 'relative', background: isActive ? T.panel2 : 'transparent', cursor: 'pointer' }}>
      {isActive && <div style={{ position: 'absolute', left: 0, top: 12, bottom: 12, width: 2, background: T.pink, borderRadius: 2 }} />}
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

  const stopPlayback = () => {
    if (audioRef.current) { audioRef.current.pause(); audioRef.current = null; }
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    setPlaying(false);
  };

  const togglePlay = async () => {
    if (playing) { stopPlayback(); return; }
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
        audio.onended = () => { URL.revokeObjectURL(url); audioRef.current = null; setPlaying(false); };
        audio.onerror = () => { URL.revokeObjectURL(url); audioRef.current = null; setPlaying(false); };
        audio.play();
        return;
      }
    } catch { /* fall through */ }
    if (!('speechSynthesis' in window)) { setPlaying(false); return; }
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'zh-CN';
    u.onend = () => setPlaying(false);
    u.onerror = () => setPlaying(false);
    window.speechSynthesis.speak(u);
  };

  const showImage = imageUrl && (!imgState || imgState === 'done');

  return (
    <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
      <Avatar c={c} size={32} />
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 4 }}>
        <div style={{ maxWidth: 380, padding: '10px 14px', background: T.panel2, border: `1px solid ${T.border}`, color: T.text, fontSize: 14, lineHeight: 1.5, borderRadius: '4px 14px 14px 14px', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{text}</div>
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
  const { isLoggedIn, email } = useAuthState();
  const [premiumOpen, setPremiumOpen] = useState(false);
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
    if (stored && characters.find(c => c.id === stored)) setActiveId(stored);
  }, []);

  useEffect(() => {
    if (!isLoggedIn) return;
    loadConvoPreviews();
  }, [isLoggedIn, loadConvoPreviews]);

  useEffect(() => {
    if (!isLoggedIn) { setMessages([]); return; }
    fetch(`/api/chat?characterId=${activeId}`)
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(data => {
        setMessages(data.messages.map((m: { id: number; role: string; content: string; imageUrl?: string | null }) => ({
          id: m.id,
          role: (m.role === 'user' ? 'user' : 'ai') as 'user' | 'ai',
          text: m.content,
          imageUrl: m.imageUrl,
          // historical messages: no imgState → show image directly
        })));
      })
      .catch(() => {});
  }, [activeId, isLoggedIn]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const active = characters.find(c => c.id === activeId) ?? characters[1];

  const switchCharacter = (id: string) => {
    setActiveId(id);
    localStorage.setItem('selectedCharacterId', id);
    setMessages([]);
    setInput('');
    setIsTyping(false);
  };

  const sendMessage = useCallback(async () => {
    const text = input.trim();
    if (!text || isTyping) return;
    if (!isLoggedIn) { setShowLoginModal(true); return; }

    const tempId = tempIdRef.current--;
    setInput('');
    // Add user message immediately — stays visible throughout the whole AI response cycle
    setMessages(prev => [...prev, { id: tempId, role: 'user', text }]);
    setIsTyping(true);

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
      const hasImage = !!data.aiMessage.imageUrl;

      setIsTyping(false);
      setMessages(prev => [
        // Replace temp user msg with real one; keep all other existing messages
        ...prev.filter(m => m.id !== tempId),
        { id: data.userMessage.id, role: 'user' as const, text: data.userMessage.content ?? text },
        {
          id: aiMsgId,
          role: 'ai' as const,
          text: data.aiMessage.content,
          imageUrl: data.aiMessage.imageUrl,
          // Start with 'pending': text bubble shows, image section hidden
          imgState: hasImage ? 'pending' as const : undefined,
        },
      ]);

      setConvoPreviews(prev => ({
        ...prev,
        [activeId]: { lastMessagePreview: data.aiMessage.content, updatedAt: new Date().toISOString() },
      }));

      // Two-step image reveal: 400ms → show loading dots; 1800ms → show image
      if (hasImage) {
        setTimeout(() => {
          setMessages(prev => prev.map(m => m.id === aiMsgId ? { ...m, imgState: 'loading' as const } : m));
        }, 400);
        setTimeout(() => {
          setMessages(prev => prev.map(m => m.id === aiMsgId ? { ...m, imgState: 'done' as const } : m));
        }, 1800);
      }
    } catch {
      setIsTyping(false);
      // On error: preserve the user message (convert temp id so it survives future message loads)
      setMessages(prev => prev.map(m => m.id === tempId ? { ...m, id: -tempId + 9e6 } : m));
    }
  }, [input, isTyping, isLoggedIn, activeId]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Close three-dot menu when clicking outside
  useEffect(() => {
    if (!menuOpen) return;
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [menuOpen]);

  const resetChat = useCallback(() => {
    setMenuOpen(false);
    setMessages([]);
  }, []);

  // Sort conversations by most recent interaction
  const conversations = characters.map(c => {
    const preview = convoPreviews[c.id];
    return {
      c,
      last: preview?.lastMessagePreview ?? '还没有消息，快来打招呼吧~',
      time: preview?.updatedAt ? formatMsgTime(preview.updatedAt) : '',
      updatedAt: preview?.updatedAt ?? '1970-01-01T00:00:00Z',
      active: c.id === activeId,
    };
  }).sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

  return (
    <>
      <style>{CHAT_CSS}</style>
      <PremiumModal open={premiumOpen} onClose={() => setPremiumOpen(false)} />
      <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', background: T.bg, color: T.text, fontFamily: '"Noto Sans SC", system-ui, sans-serif', overflow: 'hidden' }}>

        {/* ── Top navbar (identical to home) ── */}
        <div style={{ flexShrink: 0, height: 68, padding: '0 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#111111', borderBottom: `1px solid ${T.border}`, zIndex: 30 }}>
          <div style={{ fontSize: 24, fontWeight: 700, color: '#fff', lineHeight: 1.05, letterSpacing: -0.5 }}>
            纸片人<span style={{ color: T.pink }}>男友</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 28 }}>
            {isLoggedIn ? (
              <>
                <button onClick={() => setPremiumOpen(true)} type="button" style={{ height: 40, padding: '0 24px', borderRadius: 24, border: 'none', background: 'linear-gradient(140deg, #FF4B8B 0%, #8B00FF 100%)', fontWeight: 700, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 10, whiteSpace: 'nowrap', boxShadow: '0 0 0 4px rgba(255,75,139,0.3)' }}>
                  <Icon name="diamond" size={16} color="#8B5CF6" />
                  <span style={{ color: '#fff' }}>高级会员</span>
                  <span style={{ color: '#FF9CD6' }}>7折优惠</span>
                </button>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14, color: '#fff', fontSize: 13, minWidth: 140, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
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

        {/* ── Content row below navbar ── */}
        <div style={{ flex: 1, display: 'flex', overflow: 'hidden', minHeight: 0 }}>

          {/* Col 1: Collapsed icon sidebar */}
          <Sidebar active="chat" collapsed onVipClick={() => setPremiumOpen(true)} />

          {/* Col 2: Conversation list */}
          <div style={{ width: 260, background: T.panel, borderRight: `1px solid ${T.border}`, display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
            <div style={{ padding: '20px 18px 14px', flexShrink: 0 }}>
              <div style={{ fontFamily: '"Noto Serif SC", serif', fontSize: 20, fontWeight: 600 }}>聊天</div>
              <div style={{ fontSize: 11, color: T.textMute, marginTop: 2, letterSpacing: 1 }}>{characters.length} 位男友 · 同时只能与一位</div>
            </div>
            <div style={{ padding: '0 12px 12px', flexShrink: 0 }}>
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

          {/* Col 3+4: Right big area — flex column */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, overflow: 'hidden' }}>

            {/* ── Shared character header spanning chat + info panel ── */}
            <div style={{ height: 58, padding: '0 16px 0 22px', display: 'flex', alignItems: 'center', borderBottom: `1px solid ${T.border}`, background: T.panel, flexShrink: 0, gap: 12 }}>
              <Avatar c={active} size={34} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 15, fontWeight: 500, color: T.text, display: 'flex', alignItems: 'baseline', gap: 0 }}>
                  {active.name}
                  <span style={{ fontSize: 13, fontWeight: 400, color: T.textDim, marginLeft: 14 }}>{active.age}岁</span>
                </div>
                <div style={{ fontSize: 11, color: active.accent, display: 'flex', alignItems: 'center', gap: 5, marginTop: 2 }}>
                  <span style={{ width: 6, height: 6, background: active.accent, borderRadius: '50%', display: 'inline-block' }} />在线
                </div>
              </div>

              {/* Right action buttons */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>

                {/* Three-dot menu */}
                <div ref={menuRef} style={{ position: 'relative' }}>
                  <button
                    onClick={() => setMenuOpen(v => !v)}
                    type="button"
                    style={{ width: 36, height: 36, borderRadius: 8, background: 'transparent', border: `1px solid ${T.border}`, color: T.textMute, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, letterSpacing: 1 }}
                  >···</button>
                  {menuOpen && (
                    <div style={{ position: 'absolute', top: 42, right: 0, width: 148, background: T.panel2, border: `1px solid ${T.border}`, borderRadius: 10, overflow: 'hidden', zIndex: 50, boxShadow: '0 8px 28px rgba(0,0,0,0.45)' }}>
                      <button
                        onClick={resetChat}
                        type="button"
                        style={{ width: '100%', padding: '11px 16px', background: 'transparent', border: 'none', color: T.text, fontSize: 13, textAlign: 'left', cursor: 'pointer', display: 'block' }}
                      >重置聊天</button>
                      <div style={{ height: 1, background: T.border }} />
                      <button
                        onClick={resetChat}
                        type="button"
                        style={{ width: '100%', padding: '11px 16px', background: 'transparent', border: 'none', color: '#f87171', fontSize: 13, textAlign: 'left', cursor: 'pointer', display: 'block' }}
                      >删除聊天</button>
                    </div>
                  )}
                </div>

                {/* Panel toggle */}
                <button
                  onClick={() => setPanelOpen(v => !v)}
                  type="button"
                  title={panelOpen ? '收起人物信息' : '展开人物信息'}
                  style={{ width: 36, height: 36, borderRadius: 8, background: 'transparent', border: `1px solid ${T.border}`, color: T.textMute, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  <div style={{ transform: panelOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.25s ease', display: 'flex', alignItems: 'center' }}>
                    <Icon name="arrow" size={14} color={T.textMute} />
                  </div>
                </button>
              </div>
            </div>

            {/* ── Chat + character panel row ── */}
            <div style={{ flex: 1, display: 'flex', overflow: 'hidden', minHeight: 0 }}>

              {/* Chat messages + input */}
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, background: T.bg }}>
                <div style={{ flex: 1, overflow: 'auto', padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: 18 }}>
                  <DateSep label="今天" />
                  {messages.length === 0 && (
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

              {/* Character info panel — conditional */}
              {panelOpen && (
                <div style={{ width: 280, background: T.panel, borderLeft: `1px solid ${T.border}`, display: 'flex', flexDirection: 'column', overflow: 'hidden', flexShrink: 0 }}>
                  {/* 20px breathing gap before image */}
                  <div style={{ height: 20, flexShrink: 0 }} />
                  {/* Portrait image — 56% of panel height */}
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
                  {/* Info — name + age inline, story */}
                  <div style={{ flex: 1, overflow: 'auto', padding: '18px 22px' }}>
                    <div style={{ fontFamily: '"Noto Serif SC", serif', fontSize: 20, fontWeight: 600, color: T.text, display: 'flex', alignItems: 'baseline', gap: 0 }}>
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
