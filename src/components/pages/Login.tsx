'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { signIn, useSession } from 'next-auth/react';
import { Turnstile } from '@marsidev/react-turnstile'; // ← 新增
import { T } from '@/lib/tokens';
import { Sidebar } from '@/components/Sidebar';
import { Halos } from '@/components/Halos';
import { Icon } from '@/components/Icon';
import { TopNav, useSidebarCollapsed } from '@/components/TopNav';
import { PremiumModal } from '@/components/PremiumModal';

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
  const { collapsed } = useSidebarCollapsed();
  const [premiumOpen, setPremiumOpen] = useState(false);
  const [tab, setTab] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [birthday, setBirthday] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string; confirm?: string; general?: string }>({});
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState<string>(''); // ← 新增

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

    // ← 新增：Turnstile 未通过时阻止提交
    if (!turnstileToken) {
      setErrors({ general: '请先完成人机验证' });
      return;
    }

    setLoading(true);
    const res = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email,
        password,
        birthday: birthday || undefined,
        turnstileToken, // ← 新增：把 token 一起发给后端验证
      }),
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

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    await signIn('google', { callbackUrl: '/' });
  };

  const switchTab = (t: 'login' | 'register') => {
    setTab(t);
    setErrors({});
    setTurnstileToken(''); // ← 切换 tab 时重置 token
  };

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', background: T.bg, color: T.text, fontFamily: '"Noto Sans SC", system-ui, sans-serif', overflow: 'hidden' }}>
      <PremiumModal open={premiumOpen} onClose={() => setPremiumOpen(false)} />
      <TopNav onPremiumClick={() => setPremiumOpen(true)} />
      <div style={{ flex: 1, display: 'flex', minHeight: 0, overflow: 'hidden' }}>
        <Sidebar active="" collapsed={collapsed} onVipClick={() => setPremiumOpen(true)} />
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

                {/* ← 新增：Turnstile 人机验证组件，放在注册按钮上方 */}
                <div style={{ marginTop: 16 }}>
                  <Turnstile
                    siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!}
                    onSuccess={(token) => setTurnstileToken(token)}
                    onExpire={() => setTurnstileToken('')}
                    onError={() => setTurnstileToken('')}
                    options={{ theme: 'dark', language: 'zh-CN' }}
                  />
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

              <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '16px 0' }}>
                <div style={{ flex: 1, height: 1, background: T.border }} />
                <span style={{ fontSize: 11, color: T.textMute, letterSpacing: 1 }}>或</span>
                <div style={{ flex: 1, height: 1, background: T.border }} />
              </div>

              <button
                onClick={handleGoogleSignIn}
                disabled={googleLoading}
                style={{
                  width: '100%', padding: '11px 0', background: 'transparent',
                  border: `1px solid ${T.border}`, borderRadius: 10, fontSize: 14,
                  color: T.text, fontWeight: 500, cursor: googleLoading ? 'default' : 'pointer',
                  opacity: googleLoading ? 0.7 : 1, display: 'flex', alignItems: 'center',
                  justifyContent: 'center', gap: 10, marginBottom: 16, fontFamily: 'inherit',
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                {googleLoading ? '跳转中…' : `使用 Google 账号${tab === 'login' ? '登录' : '注册'}`}
              </button>

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
    </div>
  );
}