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

// ── 角色外貌核心描述（复用自 scripts/generate-portraits.ts，去掉服装/背景描述）─
const CHAR_BASE = {
  lin: `欧美白人男性，看起来大约20多岁，整体形象青春、阳光且富有艺术气息。一头蓬松的棕红色卷发，发型自然随性，充满活力。面部线条清秀，皮肤状态良好，五官立体，眼神清澈而略带忧郁的文艺感。身形偏瘦且修长，整体气质介于青涩与成熟之间。`,

  pei: `欧美白人男性，看起来只有22岁，整体形象年轻、强势且散发出一种上流社会的精英气质。深黑色短发，发型向后梳理得十分整洁，轮廓硬朗。面部干净无胡须，皮肤光滑。眼神深邃而锐利，透露出一种年轻有为的自信与从容。身形壮硕，肌肉感明显，整体体型显得十分有力量感。`,

  kai: `欧美白人男性，28岁，整体形象干练且高冷，短黑发，发型整洁有型，眼神犀利。面部轮廓分明，皮肤光洁，五官立体。身材匀称，肩背挺拔。`,

  yan: `欧美白人男性，31岁，整体形象神秘感十足，深色中长发微卷，眼神深沉且带温柔。面部轮廓精致，皮肤光滑。`,
};

// ── Banner 专用 Prompt（角色外貌 + 场景叠加层）──────────────────────────────
const BANNER_CONFIGS: Array<{ file: string; label: string; prompt: string }> = [
  {
    file:  'banner-1.png',
    label: '林夏 + 裴司寒 · 暖粉霓虹',
    prompt: [
      `超宽横幅电影级写实海报，两位帅气欧美白人男性，面部到胸口特写构图，`,
      `两人共处同一完整无缝连续场景，无任何分隔线或拼接痕迹，画面浑然一体。`,
      ``,
      `左侧男性（林夏）：${CHAR_BASE.lin}`,
      `右侧男性（裴司寒）：${CHAR_BASE.pei}`,
      ``,
      `场景：都市夜晚高级酒吧吧台或高端夜店VIP包厢，四周被霓虹灯光环绕。`,
      `色调：热粉色×品红×紫罗兰×霓虹紫，超高饱和暖粉霓虹撞色，浪漫迷幻夜色都市氛围。`,
      `光效：背景叠加霓虹光晕蔓延、柔和彩色散景光斑、隐约镭射光束。`,
      `表情：两人表情自然，略带魅惑与从容。`,
      ``,
      `构图要求：人物与主要视觉元素集中于画面左侧2/3区域，右侧1/3背景相对干净简洁，以便叠加文字。`,
      `无任何文字、Logo、水印。超写实摄影质感，细节丰富，8K画质。`,
    ].join('\n'),
  },
  {
    file:  'banner-2.png',
    label: '凌凯 + 言澈 · 冷蓝霓虹',
    prompt: [
      `超宽横幅电影级写实海报，两位帅气欧美白人男性，面部到胸口特写构图，`,
      `两人共处同一完整无缝连续场景，无任何分隔线或拼接痕迹，画面浑然一体。`,
      ``,
      `左侧男性（凌凯）：${CHAR_BASE.kai}身穿深色极简衬衫或简约西装外套，风格极简高质感。`,
      `右侧男性（言澈）：${CHAR_BASE.yan}身穿黑色皮衣或深色针织衫。`,
      ``,
      `场景：赛博朋克风格雨夜霓虹街头，蓝紫色霓虹招牌映照湿润地面反光，或黑暗音乐录音棚夜景。`,
      `色调：电光蓝×青色×深紫，纯冷色调霓虹，与 banner-1 形成强烈"暖粉vs冷蓝"视觉反差。`,
      `光效：蓝紫光晕弥漫、霓虹招牌反射光、雨夜湿润质感，整体氛围冷峻孤独、富有电影感。`,
      `表情：两人表情深邃冷峻，略带疏离感，眼神锐利。`,
      ``,
      `构图要求：人物与主要视觉元素集中于画面左侧2/3区域，右侧1/3背景相对干净简洁，以便叠加文字。`,
      `无任何文字、Logo、水印。超写实摄影质感，细节丰富，8K画质。`,
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
