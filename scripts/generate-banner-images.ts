/**
 * 生成首页 Banner 所需的两张海报背景图片
 *
 * banner-1.png — 林夏 + 裴司寒 + 沈意，深紫霓虹舞台光（复刻竞品风格）
 * banner-2.png — 顾知予 + 周翌 + 言澈，粉紫温柔玫瑰氛围，三层景深
 *
 * 用法：
 *   npx tsx scripts/generate-banner-images.ts             # 生成图片
 *   npx tsx scripts/generate-banner-images.ts --dry-run   # 仅打印最终 prompt，不调用 API
 */

import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

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

const IMAGE_SIZE = '4096x1024';

type BannerConfig = {
  file: string;
  label: string;
  prompt: string;
  referenceImages?: Array<{ filePath: string; weight: number }>;
};

const BANNER_CONFIGS: BannerConfig[] = [
  // banner-1 已生成，如需重新生成请取消注释
  // {
  //   file: 'banner-1.png',
  //   label: '林夏 + 裴司寒 + 沈意',
  //   prompt: `...`,
  // },
  {
    file: 'banner-2.png',
    label: '顾知予（前景主角）+ 周翌（左后）+ 言澈（右后）',
    prompt: `Photorealistic cinematic fashion photography, three real Caucasian male models, wide banner composition 4:1 ratio, dramatic three-layer depth of field.

FOREGROUND — center protagonist (顾知予): short neat dark brown hair, 30 years old, Caucasian male, clean sharp European facial features, warm gentle eyes, strong but soft jawline. Wearing dark navy blazer over open-collar white shirt. Standing closest to camera, largest figure, sharp focus, direct warm gaze into camera, slight calm smile, one hand lightly touching chest. Full upper body visible.

BACKGROUND LEFT (周翌): dark curly brown hair, 27 years old, Caucasian male, fashionable artistic European features, wearing cream-white ribbed turtleneck sweater. Standing behind and to the left of center male, slightly smaller scale, slightly out of focus (shallow depth of field bokeh), body angled inward, soft thoughtful expression glancing toward camera.

BACKGROUND RIGHT (言澈): dark brown medium-length straight hair, 31 years old, Caucasian male, deep-set European eyes, strong artistic features, wearing black casual blazer. Standing behind and to the right of center male, slightly smaller scale, slightly out of focus, head tilted slightly downward, intense yet tender gaze toward camera.

THREE-LAYER COMPOSITION: foreground male sharp and large, background two males softer and smaller — creates strong cinematic depth. Natural spacing between figures, NOT crowded together, NOT touching. All three occupy LEFT 55% of frame.

Skin: visible pores, natural skin texture, realistic imperfections, NOT airbrushed, NOT plastic, NOT smooth beauty filter. Shot on Canon 5D Mark IV 85mm f/1.8, natural skin tones, slight film grain.

Background atmosphere: soft warm pink and violet romantic mood, gentle rose petals falling slowly, translucent soap bubbles floating, small glowing hearts drifting, warm pink-magenta light halo behind characters, soft golden light particles, dreamy bokeh circles in pink and purple. Lighting is soft and warm, NOT harsh, NOT dark.

RIGHT 45% of frame: completely empty soft pink-purple gradient background, rose petals and bokeh only, absolutely NO people, clean negative space for text overlay.

NOT anime, NOT CG render, NOT illustration, NOT Asian faces. Photorealistic real humans only.
No text, no watermark, no logo, no border.`,
    referenceImages: [
      { filePath: path.join(process.cwd(), 'public', 'characters', 'gu-portrait.png'),   weight: 0.9 },
      { filePath: path.join(process.cwd(), 'public', 'characters', 'zhou-portrait.png'), weight: 0.85 },
      { filePath: path.join(process.cwd(), 'public', 'characters', 'yan-portrait.png'),  weight: 0.85 },
    ],
  },
];

// ── API 调用 ───────────────────────────────────────────────────────────────
async function callImageAPI(
  prompt: string,
  referenceImages?: Array<{ filePath: string; weight: number }>,
): Promise<string> {
  if (!API_KEY) throw new Error('IMAGE_ARK_API_KEY 未在 .env.local 中设置');

  const body: Record<string, unknown> = {
    model: MODEL,
    prompt,
    n: 1,
    size: IMAGE_SIZE,
    response_format: 'url',
    watermark: false,
  };

  if (referenceImages && referenceImages.length > 0) {
    body.reference_images = referenceImages.map(({ filePath, weight }) => {
      const data = fs.readFileSync(filePath);
      const base64 = data.toString('base64');
      const ext = path.extname(filePath).slice(1).toLowerCase();
      const mime = ext === 'jpg' ? 'image/jpeg' : `image/${ext}`;
      console.log(`  🖼️  参考图: ${path.basename(filePath)} (weight=${weight})`);
      return { image: `data:${mime};base64,${base64}`, weight };
    });
  }

  const res = await fetch(`${BASE_URL}/images/generations`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
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

async function cropToBannerRatio(filePath: string): Promise<void> {
  const TARGET_WIDTH = 1910;
  const TARGET_HEIGHT = 440;

  const backupPath = filePath.replace(/\.png$/, '.original.png');
  fs.copyFileSync(filePath, backupPath);
  console.log(`  💾 已备份原图: ${path.basename(backupPath)}`);

  const image = sharp(filePath);
  const metadata = await image.metadata();
  const { width = 0, height = 0 } = metadata;

  console.log(`  📐 原始尺寸: ${width}x${height}`);

  const sourceRatio = width / height;
  const targetRatio = TARGET_WIDTH / TARGET_HEIGHT;

  let cropWidth = width;
  let cropHeight = height;
  let left = 0;
  let top = 0;

  if (sourceRatio > targetRatio) {
    cropWidth = Math.round(height * targetRatio);
    left = 0;
  } else {
    cropHeight = Math.round(width / targetRatio);
    const maxTop = height - cropHeight;
    top = Math.max(0, Math.round(maxTop * 0.3));
  }

  await sharp(filePath)
    .extract({ left, top, width: cropWidth, height: cropHeight })
    .resize(TARGET_WIDTH, TARGET_HEIGHT)
    .jpeg({ quality: 95 })
    .toFile(filePath + '.tmp');

  fs.renameSync(filePath + '.tmp', filePath);
  console.log(`  ✂️  已裁剪为 ${TARGET_WIDTH}x${TARGET_HEIGHT}（top: ${top}px）`);
}

// ── 主流程 ─────────────────────────────────────────────────────────────────
async function main() {
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

  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    console.log(`\n📁 创建输出目录: ${OUTPUT_DIR}`);
  }

  let success = 0;
  for (const cfg of BANNER_CONFIGS) {
    console.log(`\n${'━'.repeat(70)}`);
    console.log(`🎨 生成中: ${cfg.file}  (${cfg.label})`);
    try {
      const imageUrl = await callImageAPI(cfg.prompt, cfg.referenceImages);
      console.log(`  ✨ API 返回成功`);
      await downloadAndSave(imageUrl, path.join(OUTPUT_DIR, cfg.file));
      await cropToBannerRatio(path.join(OUTPUT_DIR, cfg.file));
      success++;
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
