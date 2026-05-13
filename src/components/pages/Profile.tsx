'use client';

import React from 'react';
import { T } from '@/lib/tokens';
import { Sidebar } from '@/components/Sidebar';
import { Icon } from '@/components/Icon';
import { TopNav } from '@/components/TopNav';
import { PremiumModal } from '@/components/PremiumModal';

function FormField({ label, value, readOnly, rightIcon, rightAction }: {
  label: string; value: string; readOnly?: boolean; rightIcon?: string; rightAction?: string;
}) {
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

function Stat({ label, val, sub }: { label: string; val: string; sub: string }) {
  return (
    <div style={{ textAlign: 'center', padding: '0 14px', borderLeft: `1px solid ${T.border}` }}>
      <div style={{ fontSize: 11, color: T.textMute, letterSpacing: 1, marginBottom: 4 }}>{label}</div>
      <div style={{ fontSize: 22, fontWeight: 600, color: T.text }}>{val}</div>
      <div style={{ fontSize: 10, color: T.textMute, marginTop: 2 }}>{sub}</div>
    </div>
  );
}

export function PageProfile() {
  const [premiumOpen, setPremiumOpen] = React.useState(false);
  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', background: T.bg, color: T.text, fontFamily: '"Noto Sans SC", system-ui, sans-serif', overflow: 'hidden' }}>
      <PremiumModal open={premiumOpen} onClose={() => setPremiumOpen(false)} />
      <TopNav onPremiumClick={() => setPremiumOpen(true)} />
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden', minHeight: 0 }}>
        <Sidebar active="user" onVipClick={() => setPremiumOpen(true)} />
        <div style={{ flex: 1, padding: '36px 48px', overflow: 'auto' }}>
          <div style={{ maxWidth: 960, margin: '0 auto' }}>
            <div style={{ fontSize: 28, fontWeight: 700, marginBottom: 4 }}>我的资料</div>
            <div style={{ fontSize: 13, color: T.textMute, marginBottom: 28 }}>管理你的账号信息与个人喜好。</div>
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
                <div style={{ fontSize: 22, fontWeight: 600 }}>小花同学</div>
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
            <div style={{ background: `linear-gradient(135deg, ${T.pinkSoft} 0%, ${T.panel2} 60%)`, border: `1px solid ${T.border}`, borderRadius: 14, padding: '16px 20px', marginBottom: 28, display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{ fontSize: 11, letterSpacing: 2, color: T.pink, textTransform: 'uppercase' }}>♡ 心动语录</div>
              <div style={{ flex: 1, fontFamily: '"Noto Serif SC", serif', fontSize: 16, color: T.text, fontStyle: 'italic' }}>&ldquo;还好。你找我有事？&rdquo; — 裴司寒</div>
              <div style={{ fontSize: 12, color: T.pink, cursor: 'pointer' }}>更换 →</div>
            </div>
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
    </div>
  );
}
