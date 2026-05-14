/**
 * 对已存在的 banner 图片重新裁剪，无需重新调用 API
 *
 * 用法：
 *   npx tsx scripts/recrop-banners.ts
 *   npx tsx scripts/recrop-banners.ts --top-ratio 0.3   # 调整裁剪位置（0=顶部, 0.5=居中）
 *
 * top-ratio 说明：
 *   0.0  = 从顶部开始裁（容易切掉脸）
 *   0.3  = 偏上 30%（默认，适合半身人像）
 *   0.5  = 正中间
 */

import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const OUTPUT_DIR = path.join(process.cwd(), 'public', 'banners');
const TARGET_WIDTH = 1910;
const TARGET_HEIGHT = 440;

// 从命令行读取 top-ratio 参数，默认 0.3
const topRatioArg = process.argv.find(a => a.startsWith('--top-ratio='));
const TOP_RATIO = topRatioArg ? parseFloat(topRatioArg.split('=')[1]) : 0.3;

const BANNER_FILES = ['banner-1.png', 'banner-2.png'];

async function recropImage(filePath: string): Promise<void> {
  if (!fs.existsSync(filePath)) {
    console.warn(`  ⚠️  文件不存在，跳过: ${filePath}`);
    return;
  }

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
    // 图片太宽：裁右侧，保留左侧人物区域
    cropWidth = Math.round(height * targetRatio);
    left = 0;
    console.log(`  📏 模式: 裁右侧（保留左侧人物），cropWidth=${cropWidth}`);
  } else {
    // 图片太高：裁上下，按 TOP_RATIO 偏移
    cropHeight = Math.round(width / targetRatio);
    const maxTop = height - cropHeight;
    top = Math.max(0, Math.round(maxTop * TOP_RATIO));
    console.log(`  📏 模式: 裁上下，cropHeight=${cropHeight}, top=${top}px（ratio=${TOP_RATIO}）`);
  }

  // 备份原始文件（第一次运行时）
  const backupPath = filePath.replace(/\.png$/, '.original.png');
  if (!fs.existsSync(backupPath)) {
    fs.copyFileSync(filePath, backupPath);
    console.log(`  💾 已备份原图: ${path.basename(backupPath)}`);
  }

  const tmpPath = filePath + '.tmp';
  await sharp(filePath)
    .extract({ left, top, width: cropWidth, height: cropHeight })
    .resize(TARGET_WIDTH, TARGET_HEIGHT)
    .png({ quality: 95 })
    .toFile(tmpPath);

  fs.renameSync(tmpPath, filePath);
  console.log(`  ✅ 裁剪完成: ${TARGET_WIDTH}x${TARGET_HEIGHT}`);
}

async function main() {
  console.log('\n' + '═'.repeat(60));
  console.log('  Banner 图片重新裁剪工具');
  console.log(`  目标尺寸: ${TARGET_WIDTH}x${TARGET_HEIGHT}  top-ratio: ${TOP_RATIO}`);
  console.log('═'.repeat(60));

  for (const file of BANNER_FILES) {
    const filePath = path.join(OUTPUT_DIR, file);
    console.log(`\n🎨 处理: ${file}`);
    try {
      await recropImage(filePath);
    } catch (err) {
      console.error(`  ❌ 失败:`, err instanceof Error ? err.message : err);
    }
  }

  console.log('\n' + '─'.repeat(60));
  console.log('💡 如果效果不满意，可以调整 top-ratio 重新裁剪：');
  console.log('   npx tsx scripts/recrop-banners.ts --top-ratio=0.2  # 更偏上');
  console.log('   npx tsx scripts/recrop-banners.ts --top-ratio=0.4  # 更居中');
  console.log('   （每次运行会从原备份文件 .original.png 恢复后再裁剪）');
  console.log('─'.repeat(60) + '\n');
}

// 若有原备份，优先从备份文件裁剪（避免反复裁剪已裁过的图）
async function restoreFromBackupIfExists(filePath: string) {
  const backupPath = filePath.replace(/\.png$/, '.original.png');
  if (fs.existsSync(backupPath)) {
    fs.copyFileSync(backupPath, filePath);
    console.log(`  🔄 已从备份恢复原图`);
  }
}

// 重新包装 main，确保每次从原图裁剪
async function run() {
  console.log('\n' + '═'.repeat(60));
  console.log('  Banner 图片重新裁剪工具');
  console.log(`  目标尺寸: ${TARGET_WIDTH}x${TARGET_HEIGHT}  top-ratio: ${TOP_RATIO}`);
  console.log('═'.repeat(60));

  for (const file of BANNER_FILES) {
    const filePath = path.join(OUTPUT_DIR, file);
    console.log(`\n🎨 处理: ${file}`);
    try {
      await restoreFromBackupIfExists(filePath);
      await recropImage(filePath);
    } catch (err) {
      console.error(`  ❌ 失败:`, err instanceof Error ? err.message : err);
    }
  }

  console.log('\n' + '─'.repeat(60));
  console.log('💡 如果效果不满意，调整 top-ratio 重新运行：');
  console.log('   npx tsx scripts/recrop-banners.ts --top-ratio=0.2  # 更偏上');
  console.log('   npx tsx scripts/recrop-banners.ts --top-ratio=0.4  # 更居中');
  console.log('─'.repeat(60) + '\n');
}

run().catch(err => {
  console.error('\n💥 致命错误:', err);
  process.exit(1);
});
