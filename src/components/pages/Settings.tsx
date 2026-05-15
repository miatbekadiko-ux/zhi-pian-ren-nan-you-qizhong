'use client';

import React from 'react';
import { signOut } from 'next-auth/react';
import { T } from '@/lib/tokens';
import { Sidebar } from '@/components/Sidebar';
import { Icon } from '@/components/Icon';
import { TopNav } from '@/components/TopNav';
import { PremiumModal } from '@/components/PremiumModal';

const LANG_KEY = 'zprn_lang';
const NOTIF_KEY = 'zprn_notif';
const TTS_KEY = 'zprn_tts';

const COPY = {
  zh: {
    title: '设置', sub: '调整偏好与账号选项。', pref: '偏好', lang: '语言', langSub: '界面显示语言',
    notif: '消息通知', notifSub: '男友发消息时提醒', tts: '自动播放语音', ttsSub: '收到消息自动播放 TTS',
    account: '账号', clear: '清空聊天记录', clearSub: '删除所有角色的对话历史', logout: '退出登录',
    confirmTitle: '确认清空？', confirmBody: '将删除所有角色的全部对话历史，此操作不可撤销。',
    confirmOk: '确认清空', confirmCancel: '取消', clearOk: '聊天记录已清空',
    clearFail: '清空失败，请重试', logoutFail: '退出失败，请重试',
  },
  en: {
    title: 'Settings', sub: 'Manage your preferences and account.', pref: 'Preferences',
    lang: 'Language', langSub: 'Interface display language', notif: 'Notifications',
    notifSub: 'Notify when your boyfriend messages', tts: 'Auto-play Voice',
    ttsSub: 'Auto-play TTS when message arrives', account: 'Account',
    clear: 'Clear Chat History', clearSub: 'Delete all conversation history', logout: 'Sign Out',
    confirmTitle: 'Clear all chats?', confirmBody: 'This will permanently delete all conversation history for every character. This cannot be undone.',
    confirmOk: 'Clear All', confirmCancel: 'Cancel', clearOk: 'Chat history cleared',
    clearFail: 'Failed to clear. Please try again.', logoutFail: 'Sign out failed. Please try again.',
  },
} as const;

type Lang = 'zh' | 'en';

function getLang(): Lang {
  if (typeof window === 'undefined') return 'zh';
  return (localStorage.getItem(LANG_KEY) as Lang) ?? 'zh';
}
function getBool(key: string, fallback: boolean): boolean {
  if (typeof window === 'undefined') return fallback;
  const v = localStorage.getItem(key);
  return v === null ? fallback : v === 'true';
}

function Toggle({ on, onChange }: { on: boolean; onChange: (v: boolean) => void }) {
  return (
    <div onClick={() => onChange(!on)} style={{ width: 38, height: 22, borderRadius: 999, background: on ? T.pink : T.panel3, border: `1px solid ${on ? T.pink : T.border}`, position: 'relative', transition: 'all 0.2s', cursor: 'pointer' }}>
      <div style={{ position: 'absolute', top: 2, left: on ? 18 : 2, width: 16, height: 16, borderRadius: '50%', background: 'white', boxShadow: '0 1px 3px rgba(0,0,0,0.4)', transition: 'all 0.2s' }} />
    </div>
  );
}

function SegToggle({ options, active, onChange }: { options: string[]; active: number; onChange: (i: number) => void }) {
  return (
    <div style={{ display: 'flex', background: T.panel3, border: `1px solid ${T.border}`, borderRadius: 8, padding: 2 }}>
      {options.map((o, i) => (
        <div key={o} onClick={() => onChange(i)} style={{ padding: '5px 12px', fontSize: 11, borderRadius: 6, background: i === active ? T.pink : 'transparent', color: i === active ? 'white' : T.textMute, fontWeight: i === active ? 500 : 400, cursor: 'pointer', userSelect: 'none' }}>{o}</div>
      ))}
    </div>
  );
}

function SettingRow({ icon, title, sub, right, muted, pink, onClick }: { icon: string; title: string; sub?: string; right: React.ReactNode; muted?: boolean; pink?: boolean; onClick?: () => void }) {
  return (
    <div onClick={onClick} style={{ padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 14, cursor: onClick ? 'pointer' : 'default' }}>
      <div style={{ width: 32, height: 32, borderRadius: 8, background: pink ? T.pinkSoft : T.panel3, display: 'flex', alignItems: 'center', justifyContent: 'center', color: pink ? T.pink : (muted ? T.textMute : T.textDim), flexShrink: 0 }}>
        <Icon name={icon} size={15} />
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 14, fontWeight: 500, color: pink ? T.pink : T.text }}>{title}</div>
        {sub && <div style={{ fontSize: 11, color: T.textMute, marginTop: 2 }}>{sub}</div>}
      </div>
      <div>{right}</div>
    </div>
  );
}

function SettingsGroup({ title, children }: { title: string; children: React.ReactNode }) {
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

function ConfirmModal({ title, body, okLabel, cancelLabel, loading, onOk, onCancel }: { title: string; body: string; okLabel: string; cancelLabel: string; loading: boolean; onOk: () => void; onCancel: () => void }) {
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: T.panel, border: `1px solid ${T.border}`, borderRadius: 16, padding: '28px 28px 22px', width: 320, maxWidth: '90vw' }}>
        <div style={{ fontSize: 16, fontWeight: 700, color: T.text, marginBottom: 10 }}>{title}</div>
        <div style={{ fontSize: 13, color: T.textMute, lineHeight: 1.6, marginBottom: 24 }}>{body}</div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={onCancel} disabled={loading} style={{ flex: 1, padding: '10px 0', borderRadius: 10, border: `1px solid ${T.border}`, background: 'transparent', color: T.textDim, fontSize: 13, cursor: 'pointer' }}>{cancelLabel}</button>
          <button onClick={onOk} disabled={loading} style={{ flex: 1, padding: '10px 0', borderRadius: 10, border: 'none', background: T.pink, color: 'white', fontSize: 13, fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1 }}>{loading ? '...' : okLabel}</button>
        </div>
      </div>
    </div>
  );
}

function Toast({ msg }: { msg: string }) {
  return (
    <div style={{ position: 'fixed', bottom: 32, left: '50%', transform: 'translateX(-50%)', background: 'rgba(20,20,20,0.92)', color: 'white', fontSize: 13, padding: '10px 20px', borderRadius: 10, zIndex: 99999, pointerEvents: 'none', whiteSpace: 'nowrap' }}>{msg}</div>
  );
}

export function PageSettings() {
  const [premiumOpen, setPremiumOpen] = React.useState(false);
  const [lang, setLang] = React.useState<Lang>('zh');
  const [notif, setNotif] = React.useState(true);
  const [tts, setTts] = React.useState(false);
  const [confirmOpen, setConfirmOpen] = React.useState(false);
  const [clearing, setClearing] = React.useState(false);
  const [toast, setToast] = React.useState('');

  React.useEffect(() => {
    setLang(getLang());
    setNotif(getBool(NOTIF_KEY, true));
    setTts(getBool(TTS_KEY, false));
  }, []);

  const c = COPY[lang];
  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 2500); };
  const handleLang = (i: number) => { const next: Lang = i === 0 ? 'zh' : 'en'; setLang(next); localStorage.setItem(LANG_KEY, next); };
  const handleNotif = (v: boolean) => { setNotif(v); localStorage.setItem(NOTIF_KEY, String(v)); };
  const handleTts = (v: boolean) => { setTts(v); localStorage.setItem(TTS_KEY, String(v)); };

  const handleClear = async () => {
    setClearing(true);
    try {
      const res = await fetch('/api/chat/clear', { method: 'DELETE' });
      if (!res.ok) throw new Error('failed');
      showToast(c.clearOk);
    } catch { showToast(c.clearFail); }
    finally { setClearing(false); setConfirmOpen(false); }
  };

  const handleLogout = async () => {
    try { await signOut({ callbackUrl: '/auth' }); }
    catch { showToast(c.logoutFail); }
  };

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', background: T.bg, color: T.text, fontFamily: '"Noto Sans SC", system-ui, sans-serif', overflow: 'hidden' }}>
      <PremiumModal open={premiumOpen} onClose={() => setPremiumOpen(false)} />
      {confirmOpen && <ConfirmModal title={c.confirmTitle} body={c.confirmBody} okLabel={c.confirmOk} cancelLabel={c.confirmCancel} loading={clearing} onOk={handleClear} onCancel={() => setConfirmOpen(false)} />}
      {toast && <Toast msg={toast} />}
      <TopNav onPremiumClick={() => setPremiumOpen(true)} />
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden', minHeight: 0 }}>
        <Sidebar active="gear" onVipClick={() => setPremiumOpen(true)} />
        <div style={{ flex: 1, padding: '36px 48px', overflow: 'auto' }}>
          <div style={{ maxWidth: 760, margin: '0 auto' }}>
            <div style={{ fontSize: 28, fontWeight: 700, marginBottom: 4, textAlign: 'center' }}>{c.title}</div>
            <div style={{ fontSize: 13, color: T.textMute, marginBottom: 28, textAlign: 'center' }}>{c.sub}</div>
            <SettingsGroup title={c.pref}>
              <SettingRow icon="globe" title={c.lang} sub={c.langSub} right={<SegToggle options={['中文', 'English']} active={lang === 'zh' ? 0 : 1} onChange={handleLang} />} />
              <SettingRow icon="bell" title={c.notif} sub={c.notifSub} right={<Toggle on={notif} onChange={handleNotif} />} />
              <SettingRow icon="volume" title={c.tts} sub={c.ttsSub} right={<Toggle on={tts} onChange={handleTts} />} />
            </SettingsGroup>
            <div style={{ height: 22 }} />
            <SettingsGroup title={c.account}>
              <SettingRow icon="trash" title={c.clear} sub={c.clearSub} right={<Icon name="arrow" size={14} color={T.textMute} />} muted onClick={() => setConfirmOpen(true)} />
              <SettingRow icon="logout" title={c.logout} pink right={<Icon name="arrow" size={14} color={T.pink} />} onClick={handleLogout} />
            </SettingsGroup>
            <div style={{ marginTop: 28, fontSize: 11, color: T.textMute, textAlign: 'center', letterSpacing: 1 }}>纸片人男友 · v0.1.0 (MVP) · made with ♡</div>
          </div>
        </div>
      </div>
    </div>
  );
}