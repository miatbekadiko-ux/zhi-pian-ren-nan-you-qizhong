'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { T } from '@/lib/tokens';
import { Sidebar } from '@/components/Sidebar';
import { Halos } from '@/components/Halos';
import { Icon } from '@/components/Icon';

function Field({ label, icon, rightIcon, placeholder, value, onChange, type = 'text', error }: {
  label: string; icon?: string; rightIcon?: string; placeholder?: string;
  value: string; onChange: (v: string) => void; type?: string; error?: string;
}) {
  return (
    <div>
      <div style={{ fontSize: 11, color: T.textMute, letterSpacing: 1.5, marginBottom: 6, textTransform: 'uppercase' }}>{label}</div>
      <div style={{ display: 'flex', alignItems: 'center', background: T.panel3, border: `1px solid ${error ? '#e05c5c' : T.border}`, borderRadius: 10, padding: '0 12px', height: 42 }}>
        {icon && <span style={{ color: T.textMute, marginRight: 10, display: 'flex' }}><Icon name={icon} size={16} /></span>}
        <input
          type={type}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', color: T.text, fontSize: 14, fontFamily: 'inherit' }}
        />
        {rightIcon && <span style={{ color: T.textMute, display: 'flex' }}><Icon name={rightIcon} size={16} /></span>}
      </div>
      {error && <div style={{ fontSize: 11, color: '#e05c5c', marginTop: 4 }}>{error}</div>}
    </div>
  );
}

function validateEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function PageLogin() {
  const router = useRouter();
  const [tab, setTab] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string; confirm?: string }>({});

  const handleLogin = () => {
    const errs: typeof errors = {};
    if (!email) errs.email = '请输入邮箱地址';
    else if (!validateEmail(email)) errs.email = '邮箱格式不正确';
    if (!password) errs.password = '请输入密码';
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('userEmail', email);
    router.push('/');
  };

  const handleRegister = () => {
    const errs: typeof errors = {};
    if (!email) errs.email = '请输入邮箱地址';
    else if (!validateEmail(email)) errs.email = '邮箱格式不正确';
    if (!password) errs.password = '请输入密码';
    if (!confirm) errs.confirm = '请确认密码';
    else if (confirm !== password) errs.confirm = '两次密码不一致';
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('userEmail', email);
    router.push('/');
  };

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', background: T.bg, color: T.text, fontFamily: '"Noto Sans SC", system-ui, sans-serif', overflow: 'hidden', position: 'relative' }}>
      <Sidebar active="" />
      <div style={{ flex: 1, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
        <Halos />
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(rgba(255,255,255,0.025) 1px, transparent 1px)', backgroundSize: '28px 28px', pointerEvents: 'none' }} />
        <div style={{ width: 380, background: T.panel2, border: `1px solid ${T.border}`, borderRadius: 18, padding: '36px 32px', position: 'relative', boxShadow: '0 30px 80px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.03)' }}>
          <div style={{ textAlign: 'center', marginBottom: 6 }}>
            <div style={{ fontFamily: '"Noto Serif SC", serif', fontWeight: 600, color: T.pink, fontSize: 30, letterSpacing: 1 }}>纸片人男友</div>
          </div>
          <div style={{ textAlign: 'center', color: T.textDim, fontSize: 13, marginBottom: 26, letterSpacing: 0.5 }}>今天，想和谁说说话？</div>

          {/* Tabs */}
          <div style={{ display: 'flex', borderBottom: `1px solid ${T.border}`, marginBottom: 22 }}>
            <div
              onClick={() => { setTab('login'); setErrors({}); }}
              style={{ flex: 1, textAlign: 'center', padding: '10px 0', fontSize: 14, color: tab === 'login' ? T.text : T.textMute, position: 'relative', fontWeight: tab === 'login' ? 500 : 400, cursor: 'pointer' }}
            >
              登录
              {tab === 'login' && <div style={{ position: 'absolute', bottom: -1, left: '20%', right: '20%', height: 2, background: T.pink, borderRadius: 2 }} />}
            </div>
            <div
              onClick={() => { setTab('register'); setErrors({}); }}
              style={{ flex: 1, textAlign: 'center', padding: '10px 0', fontSize: 14, color: tab === 'register' ? T.text : T.textMute, position: 'relative', fontWeight: tab === 'register' ? 500 : 400, cursor: 'pointer' }}
            >
              注册
              {tab === 'register' && <div style={{ position: 'absolute', bottom: -1, left: '20%', right: '20%', height: 2, background: T.pink, borderRadius: 2 }} />}
            </div>
          </div>

          {/* Form fields */}
          <Field label="邮箱" icon="mail" placeholder="请输入邮箱地址" value={email} onChange={setEmail} error={errors.email} />
          <div style={{ height: 12 }} />
          <Field label="密码" icon="lock" rightIcon="eye" placeholder="请输入密码" type="password" value={password} onChange={setPassword} error={errors.password} />

          {tab === 'register' && (
            <>
              <div style={{ height: 12 }} />
              <Field label="确认密码" icon="lock" placeholder="再次输入密码" type="password" value={confirm} onChange={setConfirm} error={errors.confirm} />
            </>
          )}

          {tab === 'login' && (
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 10, marginBottom: 18 }}>
              <span style={{ fontSize: 12, color: T.textMute }}>忘记密码？</span>
            </div>
          )}

          <div style={{ height: tab === 'login' ? 0 : 18 }} />

          {tab === 'login' ? (
            <button onClick={handleLogin} style={{ width: '100%', padding: '12px 0', background: `linear-gradient(180deg, ${T.pinkHi}, ${T.pink})`, color: 'white', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 600, letterSpacing: 1, cursor: 'pointer', boxShadow: '0 8px 22px rgba(212,83,126,0.35)' }}>登 录</button>
          ) : (
            <button onClick={handleRegister} style={{ width: '100%', padding: '12px 0', background: `linear-gradient(180deg, ${T.pinkHi}, ${T.pink})`, color: 'white', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 600, letterSpacing: 1, cursor: 'pointer', boxShadow: '0 8px 22px rgba(212,83,126,0.35)' }}>注 册</button>
          )}

          <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '22px 0 16px' }}>
            <div style={{ flex: 1, height: 1, background: T.border }} />
            <span style={{ fontSize: 11, color: T.textMute, letterSpacing: 1 }}>或</span>
            <div style={{ flex: 1, height: 1, background: T.border }} />
          </div>

          <div style={{ textAlign: 'center', fontSize: 12, color: T.textDim }}>
            {tab === 'login'
              ? <>还没有账号？<span onClick={() => { setTab('register'); setErrors({}); }} style={{ color: T.pink, fontWeight: 500, cursor: 'pointer' }}>立即注册</span></>
              : <>已有账号？<span onClick={() => { setTab('login'); setErrors({}); }} style={{ color: T.pink, fontWeight: 500, cursor: 'pointer' }}>立即登录</span></>
            }
          </div>
        </div>
        <div style={{ position: 'absolute', bottom: 28, left: 0, right: 0, textAlign: 'center', color: T.textMute, fontSize: 11, letterSpacing: 4 }}>PAPER · BOYFRIEND · 2026</div>
      </div>
    </div>
  );
}
