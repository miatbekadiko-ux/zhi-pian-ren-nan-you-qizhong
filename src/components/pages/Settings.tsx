'use client';

import React from 'react';
import { T } from '@/lib/tokens';
import { Sidebar } from '@/components/Sidebar';
import { Icon } from '@/components/Icon';
import { TopNav } from '@/components/TopNav';
import { PremiumModal } from '@/components/PremiumModal';

function Toggle({ on }: { on?: boolean }) {
  return (
    <div style={{ width: 38, height: 22, borderRadius: 999, background: on ? T.pink : T.panel3, border: `1px solid ${on ? T.pink : T.border}`, position: 'relative', transition: 'all 0.2s' }}>
      <div style={{ position: 'absolute', top: 2, left: on ? 18 : 2, width: 16, height: 16, borderRadius: '50%', background: 'white', boxShadow: '0 1px 3px rgba(0,0,0,0.4)', transition: 'all 0.2s' }} />
    </div>
  );
}

function SegToggle({ options, active }: { options: string[]; active: number }) {
  return (
    <div style={{ display: 'flex', background: T.panel3, border: `1px solid ${T.border}`, borderRadius: 8, padding: 2 }}>
      {options.map((o, i) => (
        <div key={o} style={{ padding: '5px 12px', fontSize: 11, borderRadius: 6, background: i === active ? T.pink : 'transparent', color: i === active ? 'white' : T.textMute, fontWeight: i === active ? 500 : 400 }}>{o}</div>
      ))}
    </div>
  );
}

function SettingRow({ icon, title, sub, right, muted, pink }: {
  icon: string; title: string; sub?: string; right: React.ReactNode; muted?: boolean; pink?: boolean;
}) {
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

export function PageSettings() {
  const [premiumOpen, setPremiumOpen] = React.useState(false);
  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', background: T.bg, color: T.text, fontFamily: '"Noto Sans SC", system-ui, sans-serif', overflow: 'hidden' }}>
      <PremiumModal open={premiumOpen} onClose={() => setPremiumOpen(false)} />
      <TopNav onPremiumClick={() => setPremiumOpen(true)} />
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden', minHeight: 0 }}>
        <Sidebar active="gear" onVipClick={() => setPremiumOpen(true)} />
        <div style={{ flex: 1, padding: '36px 48px', overflow: 'auto' }}>
          <div style={{ maxWidth: 640, margin: '0 auto' }}>
            <div style={{ fontSize: 28, fontWeight: 700, marginBottom: 4 }}>设置</div>
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
              <SettingRow icon="logout" title="退出登录" pink right={<Icon name="arrow" size={14} color={T.pink} />} />
            </SettingsGroup>
            <div style={{ marginTop: 28, fontSize: 11, color: T.textMute, textAlign: 'center', letterSpacing: 1 }}>
              纸片人男友 · v0.1.0 (MVP) · made with ♡
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
