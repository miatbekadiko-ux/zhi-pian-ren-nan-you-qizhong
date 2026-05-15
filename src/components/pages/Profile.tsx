'use client';

import React from 'react';
import { T } from '@/lib/tokens';
import { Sidebar } from '@/components/Sidebar';
import { Icon } from '@/components/Icon';
import { TopNav } from '@/components/TopNav';
import { PremiumModal } from '@/components/PremiumModal';
import { useAuthState } from '@/lib/useAuth';


function PasswordField() {
  const [show, setShow] = React.useState(false);
  const [pwd, setPwd] = React.useState('');
  const [editing, setEditing] = React.useState(false);

  return (
    <div style={{ height: 44, padding: '0 14px', background: T.panel2, border: `1px solid ${T.border}`, borderRadius: 10, display: 'flex', alignItems: 'center', gap: 8, overflow: 'hidden' }}>
      <input
        type={show ? 'text' : 'password'}
        value={editing ? pwd : ''}
        readOnly={!editing}
        onChange={e => setPwd(e.target.value)}
        placeholder={editing ? '输入新密码' : '••••••••••'}
        style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', color: T.text, fontSize: 14, fontFamily: 'inherit' }}
      />
      {editing && (
        <div onClick={() => setShow(v => !v)} style={{ cursor: 'pointer', color: T.textMute, display: 'flex', alignItems: 'center' }}>
          {show ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
              <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
              <line x1="1" y1="1" x2="23" y2="23"/>
            </svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
              <circle cx="12" cy="12" r="3"/>
            </svg>
          )}
        </div>
      )}
      <span
        onClick={() => {
          if (!editing) { setPwd(''); setEditing(true); setShow(false); }
          else { setEditing(false); setShow(false); }
        }}
        style={{ color: T.pink, fontSize: 12, cursor: 'pointer', flexShrink: 0 }}
      >
        {editing ? '确认' : '修改'}
      </span>
    </div>
  );
}

export function PageProfile() {
  const [premiumOpen, setPremiumOpen] = React.useState(false);
  const { email } = useAuthState();
  const [nickname, setNickname] = React.useState('');
  const [birthday, setBirthday] = React.useState('');
  const [joinDate, setJoinDate] = React.useState('');
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);

  React.useEffect(() => {
    fetch('/api/user')
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(data => {
        setNickname(data.nickname || email?.split('@')[0] || '');
        setBirthday(data.birthday ?? '');
        const d = new Date(data.createdAt);
        setJoinDate(`${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const displayName = nickname || email?.split('@')[0] || '用户';
  const avatarChar = nickname ? nickname[0].toUpperCase() : email ? email[0].toUpperCase() : '我';

  const handleSave = async () => {
    setSaving(true);
    await fetch('/api/user', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nickname, birthday }),
    });
    setSaving(false);
    window.dispatchEvent(new Event('user-updated'));
  };

  const handleCancel = () => {
    fetch('/api/user')
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(data => { setNickname(data.nickname ?? ''); setBirthday(data.birthday ?? ''); })
      .catch(() => {});
  };

  const inputStyle: React.CSSProperties = {
    width: '100%', height: 44, padding: '0 14px',
    background: T.panel2, border: `1px solid ${T.border}`,
    borderRadius: 10, color: T.text, fontSize: 14,
    fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box',
  };

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', background: T.bg, color: T.text, fontFamily: '"Noto Sans SC", system-ui, sans-serif', overflow: 'hidden' }}>
      <PremiumModal open={premiumOpen} onClose={() => setPremiumOpen(false)} />
      <TopNav onPremiumClick={() => setPremiumOpen(true)} />
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden', minHeight: 0 }}>
        <Sidebar active="user" onVipClick={() => setPremiumOpen(true)} />
        <div style={{ flex: 1, padding: '36px 48px', overflow: 'auto' }}>
          <div style={{ maxWidth: 760, margin: '0 auto' }}>
            <div style={{ fontSize: 28, fontWeight: 700, marginBottom: 4, textAlign: 'center' }}>我的资料</div>
            <div style={{ fontSize: 13, color: T.textMute, marginBottom: 28, textAlign: 'center' }}>管理你的账号信息与个人喜好。</div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 20, paddingBottom: 26, borderBottom: `1px solid ${T.border}`, marginBottom: 26 }}>
              <div style={{ width: 96, height: 96, borderRadius: '50%', background: `linear-gradient(140deg, ${T.pinkHi}, ${T.pink})`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 36, fontWeight: 700, border: `2px solid ${T.pink}`, boxShadow: '0 0 0 4px rgba(212,83,126,0.08)', flexShrink: 0 }}>
                {loading ? <Icon name="user" size={42} /> : avatarChar}
              </div>
              <div>
                <div style={{ fontSize: 22, fontWeight: 600 }}>{loading ? '加载中…' : displayName}</div>
                <div style={{ fontSize: 13, color: T.textMute, marginTop: 2 }}>{email}{joinDate ? ` · 加入于 ${joinDate}` : ''}</div>
              </div>
            </div>

            <div style={{ fontSize: 11, letterSpacing: 2, color: T.textMute, textTransform: 'uppercase', marginBottom: 14 }}>基本信息</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <div>
                <div style={{ fontSize: 11, color: T.textMute, marginBottom: 6 }}>昵称</div>
                <input value={nickname} onChange={e => setNickname(e.target.value)} placeholder="输入昵称" style={inputStyle} />
              </div>
              <div>
                <div style={{ fontSize: 11, color: T.textMute, marginBottom: 6 }}>邮箱</div>
                <div style={{ height: 44, padding: '0 14px', background: T.panel, border: `1px solid ${T.border}`, borderRadius: 10, color: T.textMute, fontSize: 14, display: 'flex', alignItems: 'center' }}>{email}</div>
              </div>
              <div>
                <div style={{ fontSize: 11, color: T.textMute, marginBottom: 6 }}>生日</div>
                <input type="date" value={birthday} onChange={e => setBirthday(e.target.value)} style={{ ...inputStyle, colorScheme: 'dark' }} />
              </div>
              <div>
                <div style={{ fontSize: 11, color: T.textMute, marginBottom: 6 }}>密码</div>
                <PasswordField />
              </div>
            </div>

            <div style={{ display: 'flex', gap: 10, marginTop: 28 }}>
              <button onClick={handleSave} disabled={saving || loading} style={{ padding: '11px 22px', background: `linear-gradient(180deg, ${T.pinkHi}, ${T.pink})`, color: 'white', border: 'none', borderRadius: 10, fontSize: 13, fontWeight: 500, fontFamily: 'inherit', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, boxShadow: '0 6px 18px rgba(212,83,126,0.3)', opacity: saving ? 0.7 : 1 }}>
                <Icon name="save" size={14} />{saving ? '保存中…' : '保存修改'}
              </button>
              <button onClick={handleCancel} style={{ padding: '11px 22px', background: 'transparent', color: T.textDim, border: `1px solid ${T.border}`, borderRadius: 10, fontSize: 13, fontFamily: 'inherit', cursor: 'pointer' }}>取消</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}