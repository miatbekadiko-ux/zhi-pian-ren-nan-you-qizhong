'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { signIn, useSession } from 'next-auth/react';
import { T } from '@/lib/tokens';
import { Sidebar } from '@/components/Sidebar';
import { Halos } from '@/components/Halos';
import { Icon } from '@/components/Icon';

function Field({ label, icon, placeholder, value, onChange, type = 'text', error, rightSlot }: {
  label: string; icon?: string; placeholder?: string;
  value: string; onChange: (v: string) => void; type?: string; error?: string;
  rightSlot?: React.ReactNode;
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
        {rightSlot}
      </div>
      {error && <div style={{ fontSize: 11, color: '#e05c5c', marginTop: 4 }}>{error}</div>}
    </div>
  );
}

function PasswordField({ label, placeholder, value, onChange, error }: {
  label: string; placeholder?: string; value: string;
  onChange: (v: string) => void; error?: string;
}) {
  const [show, setShow] = useState(false);
  return (
    <Field
      label={label}
      icon="lock"
      placeholder={placeholder}
      type={show ? 'text' : 'password'}
      value={value}
      onChange={onChange}
      error={error}
      rightSlot={
        <span
          onClick={() => setShow(v => !v)}
          style={{ color: show ? T.pink : T.textMute, display: 'flex', cursor: 'pointer', padding: '0 2px' }}
        >
          <Icon name="eye" size={16} />
        </span>
      }
    />
  );
}

function validateEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function PageLogin() {
  const router = useRouter();
  const { status } = useSession();
  const [tab, setTab] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [birthday, setBirthday] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string; confirm?: string; general?: string }>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (status === 'authenticated') router.replace('/');
  }, [status, router]);

  const handleLogin = async () => {
    const errs: typeof errors = {};
    if (!email) errs.email = '请输入邮箱地址';
    else if (!validateEmail(email)) errs.email = '邮箱格式不正确';
    if (!password) errs.password = '请输入密码';
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setLoading(true);
    const result = await signIn('credentials', { email, password, redirect: false });
    setLoading(false);
    if (result?.error) {
      setErrors({ general: '邮箱或密码不正确' });
      return;
    }
    router.push('/');
  };

  const handleRegister = async () => {
    const errs: typeof errors = {};
    if (!email) errs.email = '请输入邮箱地址';
    else if (!validateEmail(email)) errs.email = '邮箱格式不正确';
    if (!password) errs.password = '请输入密码';
    if (!confirm) errs.confirm = '请确认密码';
    else if (confirm !== password) errs.confirm = '两次密码不一致';
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setLoading(true);
    const res = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, birthday: birthday || undefined }),
    });
    if (!res.ok) {
      const data = await res.json();
      setLoading(false);
      setErrors({ email: data.error ?? '注册失败，请稍后重试' });
      return;
    }
    const result = await signIn('credentials', { email, password, redirect: false });
    setLoading(false);
    if (result?.error) {
      setErrors({ general: '注册成功但登录失败，请手动登录' });
      setTab('login');
      return;
    }
    router.push('/');
  };

  const switchTab = (t: 'login' | 'register') => {
    setTab(t);
    setErrors({});
  };

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', background: T.bg, color: T.text, fontFamily: '"Noto Sans SC", system-ui, sans-serif', overflow: 'hidden', position: 'relative' }}>
      <Sidebar active="" />
      <div style={{ flex: 1, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
        <Halos />
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(rgba(255,255,255,0.025) 1px, transparent 1px)', backgroundSize: '28px 28px', pointerEvents: 'none' }} />

        <div style={{
          width: 380,
          minHeight: 520,
          background: T.panel2,
          border: `1px solid ${T.border}`,
          borderRadius: 18,
          padding: '36px 32px',
          position: 'relative',
          boxShadow: '0 30px 80px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.03)',
          display: 'flex',
          flexDirection: 'column',
        }}>
          <div style={{ textAlign: 'center', marginBottom: 6 }}>
            <div style={{ fontFamily: '"Noto Serif SC", serif', fontWeight: 600, color: T.pink, fontSize: 30, letterSpacing: 1 }}>纸片人男友</div>
          </div>
          <div style={{ textAlign: 'center', color: T.textDim, fontSize: 13, marginBottom: 26, letterSpacing: 0.5 }}>今天，想和谁说说话？</div>

          {/* Tabs */}
          <div style={{ display: 'flex', borderBottom: `1px solid ${T.border}`, marginBottom: 22 }}>
            {(['login', 'register'] as const).map(t => (
              <div
                key={t}
                onClick={() => switchTab(t)}
                style={{ flex: 1, textAlign: 'center', padding: '10px 0', fontSize: 14, color: tab === t ? T.text : T.textMute, position: 'relative', fontWeight: tab === t ? 500 : 400, cursor: 'pointer' }}
              >
                {t === 'login' ? '登录' : '注册'}
                {tab === t && <div style={{ position: 'absolute', bottom: -1, left: '20%', right: '20%', height: 2, background: T.pink, borderRadius: 2 }} />}
              </div>
            ))}
          </div>

          {/* Fields */}
          <Field label="邮箱" icon="mail" placeholder="请输入邮箱地址" value={email} onChange={setEmail} error={errors.email} />
          <div style={{ height: 12 }} />
          <PasswordField label="密码" placeholder="请输入密码" value={password} onChange={setPassword} error={errors.password} />

          {tab === 'register' && (
            <>
              <div style={{ height: 12 }} />
              <PasswordField label="确认密码" placeholder="再次输入密码" value={confirm} onChange={setConfirm} error={errors.confirm} />
              <div style={{ height: 12 }} />
              <div>
                <div style={{ fontSize: 11, color: T.textMute, letterSpacing: 1.5, marginBottom: 6, textTransform: 'uppercase' }}>生日（选填）</div>
                <div style={{ display: 'flex', alignItems: 'center', background: T.panel3, border: `1px solid ${T.border}`, borderRadius: 10, padding: '0 12px', height: 42 }}>
                  <input
                    type="date"
                    value={birthday}
                    onChange={e => setBirthday(e.target.value)}
                    style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', color: birthday ? T.text : T.textMute, fontSize: 14, fontFamily: 'inherit', colorScheme: 'dark' }}
                  />
                </div>
              </div>
            </>
          )}

          {errors.general && (
            <div style={{ marginTop: 10, fontSize: 12, color: '#e05c5c', textAlign: 'center' }}>{errors.general}</div>
          )}

          {tab === 'login' && (
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 10, marginBottom: 18 }}>
              <span style={{ fontSize: 12, color: T.textMute }}>忘记密码？</span>
            </div>
          )}

          <div style={{ flex: 1 }} />

          <div style={{ marginTop: 18 }}>
            <button
              onClick={tab === 'login' ? handleLogin : handleRegister}
              disabled={loading}
              style={{ width: '100%', padding: '12px 0', background: `linear-gradient(180deg, ${T.pinkHi}, ${T.pink})`, color: 'white', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 600, letterSpacing: 1, cursor: loading ? 'default' : 'pointer', opacity: loading ? 0.7 : 1, boxShadow: '0 8px 22px rgba(212,83,126,0.35)' }}
            >
              {loading ? (tab === 'login' ? '登录中…' : '注册中…') : (tab === 'login' ? '登 录' : '注 册')}
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '22px 0 16px' }}>
              <div style={{ flex: 1, height: 1, background: T.border }} />
              <span style={{ fontSize: 11, color: T.textMute, letterSpacing: 1 }}>或</span>
              <div style={{ flex: 1, height: 1, background: T.border }} />
            </div>

            <div style={{ textAlign: 'center', fontSize: 12, color: T.textDim }}>
              {tab === 'login'
                ? <>还没有账号？<span onClick={() => switchTab('register')} style={{ color: T.pink, fontWeight: 500, cursor: 'pointer' }}>立即注册</span></>
                : <>已有账号？<span onClick={() => switchTab('login')} style={{ color: T.pink, fontWeight: 500, cursor: 'pointer' }}>立即登录</span></>
              }
            </div>
          </div>
        </div>

        <div style={{ position: 'absolute', bottom: 28, left: 0, right: 0, textAlign: 'center', color: T.textMute, fontSize: 11, letterSpacing: 4 }}>PAPER · BOYFRIEND · 2026</div>
      </div>
    </div>
  );
}
