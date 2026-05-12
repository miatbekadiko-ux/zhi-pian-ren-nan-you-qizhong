/**
 * 生成 8 个角色的半身像脚本
 * 使用 doubao-seedream API 生成 2048x2048 的高质量人物肖像
 * 生成的图片会自动保存到 public/characters/ 目录
 */

import fs from 'fs';
import path from 'path';

// 自动加载 .env.local
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

// ==================== 配置 ====================
const API_KEY = process.env.IMAGE_ARK_API_KEY || '';
const BASE_URL = process.env.IMAGE_BASE_URL || 'https://ark.cn-beijing.volces.com/api/v3';
const MODEL = process.env.IMAGE_MODEL || 'doubao-seedream-5-0-260128';

// 输出目录
const OUTPUT_DIR = path.join(process.cwd(), 'public', 'characters');

// ==================== 角色 Prompt ====================
const CHARACTER_PORTRAIT_PROMPTS: Record<string, string> = {
  gu: `专业商业肖像，上半身到肚脐位置的肖像照，欧美白人男性，看起来只有23岁，整体形象干净、年轻且充满都市感。深棕色短发，发型整洁且略带自然纹理。面部轮廓分明，面部干净无胡须，眼神沉稳而自信。身形高挑，体型匀称纤细。身穿一件白色短袖衬衫，版型合身，胸前带有一个口袋，扣子为金属色，整体风格简约而不失质感，透露出一种休闲与商务之间的平衡感。背景为现代都市街道场景，可以看到模糊的建筑物轮廓和街道灯光，整体色调偏冷，带有一种夜幕降临前的城市氛围。背景采用浅景深处理，焦点完全集中在人物身上，使整体画面显得更具电影质感。`,

  lin: `专业商业肖像，上半身肖像照，欧美白人男性，看起来大约20多岁，整体形象青春、阳光且富有艺术气息。一头蓬松的棕红色卷发，发型自然随性，充满活力。面部线条清秀，皮肤状态良好，五官立体，眼神清澈而略带忧郁的文艺感。身形偏瘦且修长，整体气质介于青涩与成熟之间。身穿一件深蓝色Polo衫，领口和袖口带有白色撞色条纹设计，胸前有一枚小徽章装饰，版型合身，风格休闲而不失品味。下身搭配浅色休闲裤，腰间系有棕色皮带，整体穿搭清爽自然。背景为一处开阔的海滨场景，可以看到蔚蓝的海面、延伸入海的木质栈桥以及晴朗的天空，阳光充足，色调明亮温暖。他倚靠在木质栏杆旁，整体画面透出一种度假胜地的悠闲氛围，与人物的青春气质相得益彰。`,

  pei: `专业商业肖像，上半身肖像照，欧美白人男性，看起来只有22岁，整体形象年轻、强势且散发出一种上流社会的精英气质。深黑色短发，发型向后梳理得十分整洁，轮廓硬朗。面部干净无胡须，皮肤光滑。眼神深邃而锐利，透露出一种年轻有为的自信与从容。身形壮硕，肌肉感明显，整体体型显得十分有力量感。身穿一件白色短袖Polo衫，胸前绣有深色小马标志，版型紧致贴身，将健硕的体型完美勾勒出来。下身搭配深色裤子，整体穿搭简洁大方，低调中透露着品质感，是典型的富裕阶层休闲风格。背景为一艘游艇的甲板之上，木质甲板隐约可见，整个场景透出一种私人游艇出海的奢华与惬意，与人物的富商气质高度契合。`,

  shen: `专业商业肖像，上半身肖像照，欧美白人男性，大约20多岁，整体形象阳光、自由且充满漫画家的文艺魅力。一头整洁的金棕色中长发，发丝自然垂落至肩膀，略带波浪感，在光线下呈现出温暖的蜂蜜色泽，发质光滑有质感。面部轮廓柔和而立体，皮肤略带健康的小麦色，面部干净无胡须，眼神清澈而温柔，整体气质介于阳光男孩与文艺青年之间，透着一股不经意的帅气。身材纤细修长，体型匀称而不壮硕。身穿一件浅灰色短袖衬衫，领口微微敞开，版型合身整洁，胸前有两个暗口袋设计，面料看起来轻薄透气，衣服平整无皱褶。整体穿搭简单低调，毫无刻意感，完美契合其自由洒脱的人物气质。一只手自然垂下，另一只手轻轻放在口袋里，姿态放松而自然。背景为一条繁华的都市街道，可以看到模糊的建筑轮廓、流动的车辆以及街头霓虹招牌的光晕，整体色调偏暖，光线柔和散漫，营造出一种黄昏时分城市街头的生动氛围。背景经过浅景深虚化处理，使人物主体更加突出，城市喧嚣与人物的随性气质之间形成了一种有趣的反差。`,
  kai: `专业商业肖像，欧美白人男性，28岁，科技创业者。整体形象干练且高冷，短黑发，发型整洁有型，眼神犀利。面部轮廓分明，皮肤光洁，五官立体。身材匀称，肩背挺拔。身穿深色衬衫或极简西装外套，整体风格极简高质感。背景为现代办公室或城市夜景，光线冷白，屏幕反射出细腻的科技质感。`,
  zhou: `专业商业肖像，欧美白人男性，27岁，时尚摄影师。整体形象优雅浪漫，黑棕色微卷短发，发丝有光泽。面部轮廓柔和，气质文艺且精致。身穿浅色高领毛衣或轻薄衬衫，搭配简约配饰。背景为城市黄昏或咖啡厅，光线柔和、带有浅景深，画面充满时尚杂志感。`,
  cao: `专业商业肖像，欧美白人男性，29岁，私人教练。整体形象阳光健康，短发利落，面部线条硬朗，皮肤略带健康的小麦色。身材结实，肩膀宽阔，肌肉线条明显。身穿运动背心或贴身运动短袖，背景为健身房或室外运动场，光线明亮，充满力量感。`,
  yan: `专业商业肖像，欧美白人男性，31岁，音乐制作人。整体形象神秘感十足，深色中长发微卷，眼神深沉且带温柔。面部轮廓精致，皮肤光滑。身穿黑色皮衣或针织衫，背景为录音棚或夜色舞台灯光，色调低饱和、带有音乐氛围。`
};

// ==================== 辅助函数 ====================

async function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function callImageAPI(prompt: string): Promise<string> {
  if (!API_KEY) {
    throw new Error('❌ 错误: IMAGE_ARK_API_KEY 环境变量未设置');
  }

  console.log(`📸 调用 API 生成图片...`);
  
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
      size: '2048x2048',
      response_format: 'url',
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`❌ API 错误 ${res.status}: ${errText}`);
  }

  const data = await res.json();
  const imageUrl = data.data?.[0]?.url as string;
  if (!imageUrl) {
    throw new Error('❌ API 返回数据格式错误，没有找到图片 URL');
  }

  return imageUrl;
}

async function downloadImage(url: string, filePath: string): Promise<void> {
  console.log(`⬇️  下载图片: ${url}`);
  
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`❌ 下载失败: ${res.status}`);
  }

  const buffer = await res.arrayBuffer();
  fs.writeFileSync(filePath, Buffer.from(buffer));
  console.log(`✅ 已保存到: ${filePath}`);
}

async function generatePortrait(characterId: string, characterName: string): Promise<void> {
  const prompt = CHARACTER_PORTRAIT_PROMPTS[characterId];
  if (!prompt) {
    throw new Error(`❌ 找不到角色 ${characterId} 的 Prompt`);
  }

  console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
  console.log(`🎨 正在生成 ${characterName} (${characterId}) 的半身像...`);
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);

  try {
    // 1. 调用 API 生成图片
    const imageUrl = await callImageAPI(prompt);
    console.log(`✨ 生成成功! URL: ${imageUrl}`);

    // 2. 下载图片
    const fileName = `${characterId}-portrait.png`;
    const filePath = path.join(OUTPUT_DIR, fileName);
    await downloadImage(imageUrl, filePath);

    // 3. 稍微延迟，避免请求过频繁
    await sleep(2000);

    console.log(`✅ ${characterName} 完成!\n`);
  } catch (error) {
    console.error(`❌ ${characterName} 生成失败:`, error);
    throw error;
  }
}

async function main() {
  console.log(`\n🚀 开始生成 ${Object.keys(CHARACTER_PORTRAIT_PROMPTS).length} 个角色的半身像\n`);
  console.log(`📁 输出目录: ${OUTPUT_DIR}`);
  console.log(`🤖 模型: ${MODEL}`);
  console.log(`🔑 API: ${BASE_URL}\n`);

  // 创建输出目录
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    console.log(`✅ 创建目录: ${OUTPUT_DIR}\n`);
  }

  const allCharacters = [
    { id: 'lin', name: '林夏 (阳光冒险家)' },
    { id: 'pei', name: '裴司寒 (禁欲精英律师)' },
    { id: 'shen', name: '沈意 (文艺傲娇艺术家)' },
    { id: 'gu', name: '顾知予 (温柔细心导演)' },
    { id: 'kai', name: '凌凯 (科技创业者)' },
    { id: 'zhou', name: '周翌 (时尚摄影师)' },
    { id: 'cao', name: '高驰 (私人教练)' },
    { id: 'yan', name: '言澈 (音乐制作人)' },
  ];

  const requestedIds = process.argv.slice(2);
  const characters = requestedIds.length > 0
    ? allCharacters.filter(c => requestedIds.includes(c.id))
    : allCharacters;

  if (requestedIds.length > 0 && characters.length === 0) {
    console.warn(`⚠️ 未找到匹配的角色 ID：${requestedIds.join(', ')}`);
    process.exit(1);
  }

  let successCount = 0;
  const totalCount = characters.length;

  for (const char of characters) {
    try {
      await generatePortrait(char.id, char.name);
      successCount++;
    } catch (error) {
      console.error(`\n⚠️  继续下一个...\n`);
    }
  }

  console.log(`\n${'━'.repeat(50)}`);
  console.log(`📊 生成结果: ${successCount}/${totalCount} 成功`);
  console.log(`📁 图片已保存到: ${OUTPUT_DIR}`);
  console.log(`${'━'.repeat(50)}\n`);

  if (successCount === totalCount) {
    console.log(`✅ 所有图片生成完成！下一步修改代码集成这些图片。\n`);
    process.exit(0);
  } else {
    console.log(`⚠️  部分图片生成失败，请检查错误信息。\n`);
    process.exit(1);
  }
}

// ==================== 运行 ====================
main().catch((error) => {
  console.error('\n💥 致命错误:', error);
  process.exit(1);
});
