'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { T } from '@/lib/tokens';
import { Sidebar } from '@/components/Sidebar';
import { Icon } from '@/components/Icon';
import { characters, Character } from '@/lib/characters';
import { useAuthState } from '@/lib/useAuth';


type Msg = { id: number; role: 'user' | 'ai'; text: string; imageUrl?: string | null };

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

function HeaderBtn({ icon }: { icon: string }) {
  return <div style={{ width: 36, height: 36, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', color: T.textMute, background: T.panel2, border: `1px solid ${T.border}` }}><Icon name={icon} size={15} /></div>;
}

function SmallBtn({ children }: { children: React.ReactNode }) {
  return <div style={{ width: 32, height: 32, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, color: T.textMute, cursor: 'pointer' }}>{children}</div>;
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

function BubbleAI({ c, text, imageUrl }: { c: Character; text: string; imageUrl?: string | null }) {
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

    // Try real TTS API first
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

    // Fallback: browser Web Speech API
    if (!('speechSynthesis' in window)) { setPlaying(false); return; }
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'zh-CN';
    u.onend = () => setPlaying(false);
    u.onerror = () => setPlaying(false);
    window.speechSynthesis.speak(u);
  };

  return (
    <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
      <Avatar c={c} size={32} />
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 4 }}>
        <div style={{ maxWidth: 380, padding: '10px 14px', background: T.panel2, border: `1px solid ${T.border}`, color: T.text, fontSize: 14, lineHeight: 1.5, borderRadius: '4px 14px 14px 14px', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{text}</div>
        {imageUrl && (
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
          <span style={{ color: T.borderHi }}>·</span>
          <span style={{ color: T.pink }}>♡ 收藏</span>
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
        {[0, 1, 2].map(i => <div key={i} style={{ width: 6, height: 6, borderRadius: '50%', background: T.textDim, opacity: 0.5 + i * 0.15 }} />)}
      </div>
    </div>
  );
}

function Section({ title, body }: { title: string; body: string }) {
  return (
    <div style={{ marginTop: 18, paddingTop: 18, borderTop: `1px solid ${T.border}` }}>
      <div style={{ fontSize: 10, letterSpacing: 2, color: T.textMute, textTransform: 'uppercase', marginBottom: 8 }}>{title}</div>
      <div style={{ fontSize: 13, color: T.textDim, lineHeight: 1.6 }}>{body}</div>
    </div>
  );
}

function QuickAct({ label, sub }: { label: string; sub: string }) {
  return (
    <div style={{ background: T.panel2, border: `1px solid ${T.border}`, borderRadius: 8, padding: '10px 12px' }}>
      <div style={{ fontSize: 12, color: T.text, marginBottom: 2 }}>{label}</div>
      <div style={{ fontSize: 10, color: T.textMute }}>{sub}</div>
    </div>
  );
}

function LoginModal({ c, onClose, onLogin }: { c: Character; onClose: () => void; onLogin: () => void }) {
  return (
    <div
      onClick={onClose}
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{ width: 340, background: T.panel2, border: `1px solid ${T.border}`, borderRadius: 18, padding: '32px 28px 28px', position: 'relative', boxShadow: '0 30px 80px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.04)' }}
      >
        <button
          onClick={onClose}
          style={{ position: 'absolute', top: 14, right: 14, width: 28, height: 28, borderRadius: 8, background: 'transparent', border: 'none', color: T.textMute, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}
        >✕</button>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
          <div style={{ width: 56, height: 56, borderRadius: '50%', background: c.grad, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, marginBottom: 14, border: `1px solid ${T.border}` }}>{c.emoji}</div>
          <div style={{ fontFamily: '"Noto Serif SC", serif', fontSize: 18, fontWeight: 600, color: T.text, marginBottom: 8 }}>登录后才能和{c.name}说话</div>
          <div style={{ fontSize: 13, color: T.textDim, lineHeight: 1.6, marginBottom: 24 }}>加入纸片人男友，4 位专属男友<br />随时随地陪你聊天</div>
          <button
            onClick={onLogin}
            style={{ width: '100%', padding: '12px 0', background: `linear-gradient(180deg, ${T.pinkHi}, ${T.pink})`, color: 'white', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 600, letterSpacing: 1, cursor: 'pointer', boxShadow: '0 8px 22px rgba(212,83,126,0.35)', marginBottom: 10 }}
          >立即登录</button>
          <button
            onClick={onLogin}
            style={{ width: '100%', padding: '11px 0', background: 'transparent', color: T.textDim, border: `1px solid ${T.border}`, borderRadius: 10, fontSize: 14, cursor: 'pointer' }}
          >免费注册账号</button>
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
  const { isLoggedIn } = useAuthState();
  const [activeId, setActiveId] = useState<string>('pei');
  const [messages, setMessages] = useState<Msg[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [input, setInput] = useState('');
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [convoPreviews, setConvoPreviews] = useState<Record<string, ConvoPreview>>({});
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
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

  // Read selected character from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('selectedCharacterId');
    if (stored && characters.find(c => c.id === stored)) {
      setActiveId(stored);
    }
  }, []);

  // Load conversation previews when logged in
  useEffect(() => {
    if (!isLoggedIn) return;
    loadConvoPreviews();
  }, [isLoggedIn, loadConvoPreviews]);

  // Load history from DB when character or login state changes
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
    setMessages(prev => [...prev, { id: tempId, role: 'user', text }]);
    setIsTyping(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ characterId: activeId, content: text }),
      });
      const data = await res.json();
      setIsTyping(false);
      setMessages(prev => [
        ...prev.filter(m => m.id !== tempId),
        { id: data.userMessage.id, role: 'user' as const, text: data.userMessage.content },
        { id: data.aiMessage.id, role: 'ai' as const, text: data.aiMessage.content, imageUrl: data.aiMessage.imageUrl },
      ]);
      // Update local preview immediately
      setConvoPreviews(prev => ({
        ...prev,
        [activeId]: { lastMessagePreview: data.aiMessage.content, updatedAt: new Date().toISOString() },
      }));
    } catch {
      setIsTyping(false);
    }
  }, [input, isTyping, isLoggedIn, activeId]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const conversations = characters.map(c => {
    const preview = convoPreviews[c.id];
    return {
      c,
      last: preview?.lastMessagePreview ?? '还没有消息，快来打招呼吧~',
      time: preview?.updatedAt ? formatMsgTime(preview.updatedAt) : '',
      active: c.id === activeId,
    };
  });

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', background: T.bg, color: T.text, fontFamily: '"Noto Sans SC", system-ui, sans-serif', overflow: 'hidden' }}>
      <Sidebar active="chat" />
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
          {conversations.map((row) => (
            <ConvoRow key={row.c.id} {...row} onClick={() => switchCharacter(row.c.id)} />
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
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: T.bg, position: 'relative' }}>
        <div style={{ height: 64, padding: '0 22px', display: 'flex', alignItems: 'center', borderBottom: `1px solid ${T.border}`, gap: 12, background: T.panel }}>
          <Avatar c={active} size={36} />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 15, fontWeight: 500, color: T.text }}>{active.name}</div>
            <div style={{ fontSize: 11, color: active.accent, display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ width: 6, height: 6, background: active.accent, borderRadius: '50%', display: 'inline-block' }} />在线 · 暧昧期
            </div>
          </div>
          <HeaderBtn icon="bell" />
          <HeaderBtn icon="cal" />
        </div>
        <div style={{ flex: 1, overflow: 'auto', padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: 18 }}>
          <DateSep label="今天" />
          {messages.length === 0 && (
            <div style={{ textAlign: 'center', color: T.textMute, fontSize: 13, marginTop: 20 }}>和{active.name}说些什么吧~</div>
          )}
          {messages.map(msg =>
            msg.role === 'user'
              ? <BubbleUser key={msg.id} text={msg.text} />
              : <BubbleAI key={msg.id} c={active} text={msg.text} imageUrl={msg.imageUrl} />
          )}
          {isTyping && <Typing c={active} />}
          <div ref={bottomRef} />
        </div>
        <div style={{ padding: '14px 24px 18px', borderTop: `1px solid ${T.border}`, background: T.panel }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 10, background: T.panel2, border: `1px solid ${T.border}`, borderRadius: 14, padding: 8 }}>
            <div style={{ display: 'flex', gap: 2, padding: '6px 4px' }}>
              <SmallBtn>🎁</SmallBtn>
              <SmallBtn>📷</SmallBtn>
            </div>
            <textarea
              ref={textareaRef}
              value={input}
              onChange={e => setInput(e.target.value.slice(0, 500))}
              onKeyDown={handleKeyDown}
              placeholder={`和${active.name}说些什么…`}
              rows={1}
              style={{
                flex: 1, background: 'transparent', border: 'none', outline: 'none',
                color: T.text, fontSize: 14, fontFamily: 'inherit', resize: 'none',
                padding: '10px 4px', lineHeight: 1.5, maxHeight: 120, overflowY: 'auto',
              }}
            />
            <div style={{ fontSize: 11, color: T.textMute, padding: '0 6px', flexShrink: 0 }}>{input.length} / 500</div>
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
      <div style={{ width: 280, background: T.panel, borderLeft: `1px solid ${T.border}`, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div style={{ height: 280, background: active.grad, position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 140, opacity: 0.16 }}>{active.emoji}</div>
          <div style={{ position: 'absolute', inset: 0, backgroundImage: 'repeating-linear-gradient(135deg, rgba(255,255,255,0.03) 0 1px, transparent 1px 14px)' }} />
          <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 100, background: `linear-gradient(180deg, transparent, ${T.panel})` }} />
          <div style={{ position: 'absolute', top: 12, left: 14, padding: '4px 10px', background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(6px)', borderRadius: 999, fontSize: 10, color: T.textDim, letterSpacing: 1 }}>PORTRAIT · 占位图</div>
        </div>
        <div style={{ padding: '18px 20px', flex: 1, overflow: 'auto' }}>
          <div style={{ fontFamily: '"Noto Serif SC", serif', fontSize: 22, fontWeight: 600 }}>{active.emoji} {active.name}</div>
          <div style={{ fontSize: 12, color: T.textDim, marginTop: 2 }}>{active.job} · {active.age}岁</div>
          <div style={{ display: 'flex', gap: 6, marginTop: 14 }}>
            {active.tags.map(t => <div key={t} style={{ padding: '3px 9px', borderRadius: 6, background: T.panel3, border: `1px solid ${T.border}`, fontSize: 11, color: T.textDim }}>{t}</div>)}
          </div>
          <Section title="关于他" body={active.desc} />
          <Section title="说话风格" body={active.style} />
          <div style={{ marginTop: 18 }}>
            <div style={{ fontSize: 10, letterSpacing: 2, color: T.textMute, textTransform: 'uppercase', marginBottom: 8 }}>关系</div>
            <div style={{ display: 'flex', gap: 4 }}>
              {['陌生人', '朋友', '暧昧', '恋人'].map((s, i) => (
                <div key={s} style={{ flex: 1, textAlign: 'center', padding: '6px 0', fontSize: 11, color: i === 2 ? T.text : T.textMute, background: i === 2 ? T.pinkSoft : T.panel3, border: `1px solid ${i === 2 ? T.pink : T.border}`, borderRadius: 6 }}>{s}</div>
              ))}
            </div>
          </div>
          <div style={{ marginTop: 18, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            <QuickAct label="送礼物" sub="今日剩 2 次" />
            <QuickAct label="切换背景" sub="已解锁 3 / 8" />
            <QuickAct label="收藏夹" sub="14 句心动" />
            <QuickAct label="他的动态" sub="今天发了 1 条" />
          </div>
        </div>
      </div>
      {showLoginModal && (
        <LoginModal
          c={active}
          onClose={() => setShowLoginModal(false)}
          onLogin={() => router.push('/auth')}
        />
      )}
    </div>
  );
}
