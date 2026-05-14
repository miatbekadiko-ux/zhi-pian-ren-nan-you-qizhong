/**
 * 生成首页 Banner 所需的两张海报背景图片
 *
 * banner-1.png — 林夏 + 裴司寒，暖粉霓虹（夜店/高级酒吧场景）
 * banner-2.png — 凌凯 + 言澈，冷蓝霓虹（赛博朋克雨夜/录音棚场景）
 *
 * 用法：
 *   npx tsx scripts/generate-banner-images.ts             # 生成图片
 *   npx tsx scripts/generate-banner-images.ts --dry-run   # 仅打印最终 prompt，不调用 API
 *
 * npm 脚本（package.json 中已添加）：
 *   pnpm generate:banners
 *   pnpm generate:banners:preview
 */

import fs from 'fs';
import path from 'path';

// ── 加载 .env.local ────────────────────────────────────────────────────────
const envPath = path.join(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, 'utf-8').split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const idx = trimmed.indexOf('=');
    if (idx === -1) continue;
    const key = trimmed.slice(0, idx).trim();
    const value = trimmed.slice(idx + 1).trim();
    if (!(key in process.env)) process.env[key] = value;
  }
}

// ── 配置 ───────────────────────────────────────────────────────────────────
const API_KEY  = process.env.IMAGE_ARK_API_KEY || '';
const BASE_URL = process.env.IMAGE_BASE_URL || 'https://ark.cn-beijing.volces.com/api/v3';
const MODEL    = process.env.IMAGE_MODEL     || 'doubao-seedream-5-0-260128';
const OUTPUT_DIR = path.join(process.cwd(), 'public', 'banners');
const DRY_RUN  = process.argv.includes('--dry-run');

// Banner 图片尺寸（21:9，3,919,104 像素，超过 API 最低要求 3,686,400 像素）
// 若 API 报错，可改为 '2560x1440'（16:9）或 '3072x1312'（约 21:9）
const IMAGE_SIZE = '3024x1296';

// ── Banner 专用 Prompt（角色外貌 + 场景叠加层）──────────────────────────────
const BANNER_CONFIGS: Array<{ file: string; label: string; prompt: string }> = [
  {
    file: 'banner-1.png',
    label: '林夏 + 凌凯',
    prompt: [
      `Wide cinematic commercial poster, two real handsome Caucasian Western male models, photorealistic photography, real human skin with visible pores, strong masculine facial features, NOT Asian, NOT K-pop, NOT anime, NOT CG.`,
      ``,
      `Left male: dark short neat hair, 28 years old, sharp cold eyes, strong jawline, wearing pink-white tuxedo with pink bow tie, confident expression.`,
      `Right male: curly auburn red hair, 20s, fresh youthful face, clear eyes, wearing white tuxedo with pink bow tie, natural sunny expression.`,
      ``,
      `Background: dreamy pink purple gradient, sparkling bokeh lights, floating soap bubbles, romantic festive atmosphere.`,
      ``,
      `Composition: IMPORTANT - both males stand on the LEFT side occupying left 55% of frame, right 45% must be completely empty clean background with no people for text overlay.`,
      `Style: professional fashion photography, editorial magazine, Canon 5D, 85mm lens, natural skin texture, visible pores, masculine features, strong jawline, hyperrealistic, 8K, NOT anime, NOT illustration.`,
      `No text, no logo, no watermark.`,
    ].join('\n'),
  },
  {
    file: 'banner-2.png',
    label: '裴司寒 + 言澈',
    prompt: [
      `Wide cinematic commercial poster, two real handsome Caucasian Western male models, photorealistic photography, real human skin, strong masculine features, NOT Asian, NOT anime, NOT CG, NOT illustration.`,
      ``,
      `Left male (background, smaller): dark medium wavy hair, 31 years old, mysterious deep eyes, wearing black tuxedo with black bow tie, slightly turned sideways, standing behind.`,
      `Right male (foreground, main, larger and closer): black short slicked-back hair, 22 years old, sharp strong jawline, muscular build, wearing white tuxedo with pink bow tie, looking directly at camera, cold confident expression.`,
      ``,
      `Background: dreamy pink purple gradient, sparkling bokeh lights, floating soap bubbles, romantic festive atmosphere.`,
      ``,
      `Composition: IMPORTANT - both males positioned on the LEFT side occupying left 55% of frame, right 45% must be completely empty clean background with no people for text overlay.`,
      `Style: professional fashion photography, editorial magazine, Canon 5D, 85mm lens, natural skin texture, masculine features, hyperrealistic, 8K, NOT anime, NOT illustration.`,
      `No text, no logo, no watermark.`,
    ].join('\n'),
  },
];

// ── API 调用 ───────────────────────────────────────────────────────────────
async function callImageAPI(prompt: string): Promise<string> {
  if (!API_KEY) throw new Error('IMAGE_ARK_API_KEY 未在 .env.local 中设置');

  const res = await fetch(`${BASE_URL}/images/generations`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: MODEL,
      prompt,
      n: 1,
      size: IMAGE_SIZE,
      response_format: 'url',
      watermark: false,
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`API 错误 ${res.status}: ${errText}`);
  }

  const data = await res.json();
  const imageUrl = data.data?.[0]?.url as string | undefined;
  if (!imageUrl) throw new Error('API 返回数据中未找到图片 URL: ' + JSON.stringify(data));
  return imageUrl;
}

async function downloadAndSave(url: string, filePath: string): Promise<void> {
  console.log(`  ⬇️  下载中: ${url.slice(0, 80)}...`);
  const res = await fetch(url);
  if (!res.ok) throw new Error(`图片下载失败: ${res.status}`);
  const buffer = Buffer.from(await res.arrayBuffer());
  fs.writeFileSync(filePath, buffer);
  console.log(`  ✅ 已保存: ${filePath}  (${(buffer.length / 1024).toFixed(0)} KB)`);
}

// ── 主流程 ─────────────────────────────────────────────────────────────────
async function main() {
  // ① 打印所有最终 prompt，供用户确认
  console.log('\n' + '═'.repeat(70));
  console.log('  Banner 图片生成脚本 — Prompt 预览');
  console.log('  模型: ' + MODEL + '  尺寸: ' + IMAGE_SIZE);
  console.log('═'.repeat(70));

  for (const cfg of BANNER_CONFIGS) {
    console.log(`\n┌── ${cfg.file}  (${cfg.label})`);
    console.log('│');
    for (const line of cfg.prompt.split('\n')) {
      console.log('│  ' + line);
    }
    console.log('└' + '─'.repeat(68));
  }

  if (DRY_RUN) {
    console.log('\n🔍 Dry-run 模式，仅打印 prompt，未调用 API。');
    console.log('   确认 prompt 无误后，去掉 --dry-run 参数重新运行即可生成图片。\n');
    return;
  }

  // ② 生成图片
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    console.log(`\n📁 创建输出目录: ${OUTPUT_DIR}`);
  }

  let success = 0;
  for (const cfg of BANNER_CONFIGS) {
    console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
    console.log(`🎨 生成中: ${cfg.file}  (${cfg.label})`);
    try {
      const imageUrl = await callImageAPI(cfg.prompt);
      console.log(`  ✨ API 返回成功`);
      await downloadAndSave(imageUrl, path.join(OUTPUT_DIR, cfg.file));
      success++;
      // 避免请求过于密集
      if (success < BANNER_CONFIGS.length) await new Promise(r => setTimeout(r, 2000));
    } catch (err) {
      console.error(`  ❌ 失败:`, err instanceof Error ? err.message : err);
    }
  }

  console.log('\n' + '━'.repeat(70));
  console.log(`📊 结果: ${success}/${BANNER_CONFIGS.length} 张图片生成成功`);
  if (success > 0) console.log(`📁 图片位置: ${OUTPUT_DIR}`);
  console.log('━'.repeat(70) + '\n');
  process.exit(success === BANNER_CONFIGS.length ? 0 : 1);
}

main().catch(err => {
  console.error('\n💥 致命错误:', err);
  process.exit(1);
});
