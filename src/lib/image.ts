const TRIGGER_KEYWORDS = [
  '你在干什么', '干嘛呢', '在干嘛', '在做什么',
  '我想看看你', '想看看你', '看看你',
  '好想你', '想你了', '想你',
  '发张照片', '拍张照片', '发个照片', '发一张',
  '今天天气好棒', '天气真好',
];

export function shouldGenerateImage(userMessage: string): boolean {
  return TRIGGER_KEYWORDS.some(k => userMessage.includes(k));
}

// Descriptive prompts per character for text-to-image generation
const CHARACTER_PROMPTS: Record<string, string> = {
  lin: '专业商业肖像，欧美白人男性，看起来大约20多岁，整体形象青春、阳光且富有艺术气息。一头蓬松的棕红色卷发，发型自然随性，充满活力。面部线条清秀，皮肤状态良好，五官立体，眼神清澈而略带忧郁的文艺感。身形偏瘦且修长，整体气质介于青涩与成熟之间。',
  pei: '专业商业肖像，欧美白人男性，看起来只有22岁，整体形象年轻、强势且散发出一种上流社会的精英气质。深黑色短发，发型向后梳理得十分整洁，轮廓硬朗。面部干净无胡须，皮肤光滑。眼神深邃而锐利，透露出一种年轻有为的自信与从容。身形壮硕，肌肉感明显，整体体型显得十分有力量感。',
  shen: '专业商业肖像，欧美白人男性，大约20多岁，整体形象阳光、自由且充满漫画家的文艺魅力。一头整洁的金棕色中长发，发丝自然垂落至肩膀，略带波浪感，在光线下呈现出温暖的蜂蜜色泽，发质光滑有质感。面部轮廓柔和而立体，皮肤略带健康的小麦色，面部干净无胡须，眼神清澈而温柔，整体气质介于阳光男孩与文艺青年之间，透着一股不经意的帅气。身材纤细修长，体型匀称而不壮硕。',
  gu: '专业商业肖像，上半身到肚脐位置，欧美白人男性，看起来只有23岁，整体形象干净、年轻且充满都市感。深棕色短发，发型整洁且略带自然纹理。面部轮廓分明，面部干净无胡须，眼神沉稳而自信。身形高挑，体型匀称纤细。',
  kai: '专业商业肖像，欧美白人男性，28岁，科技创业者。整体形象干练且高冷，短黑发，发型整洁有型，眼神犀利。面部轮廓分明，皮肤光洁，五官立体。身材匀称，肩背挺拔。身穿深色衬衫或简约西装外套，整体风格极简高质感。背景为现代办公室或城市夜景，带有女性化的冷色氛围和屏幕光反射。',
  zhou: '专业商业肖像，欧美白人男性，27岁，时尚摄影师。整体形象优雅浪漫，黑棕色微卷短发，发丝有光泽。面部轮廓柔和，气质文艺且精致。身穿浅色高领毛衣或轻薄衬衫，搭配简约配饰。背景为城市黄昏或咖啡厅，光线柔和、带有浅景深，画面充满时尚杂志感。',
  cao: '专业商业肖像，欧美白人男性，29岁，私人教练。整体形象阳光健康，短发利落，面部线条硬朗，皮肤略带健康的小麦色。身材结实，肩膀宽阔，肌肉线条明显。身穿运动背心或贴身运动短袖，背景为健身房或室外运动场，光线明亮，充满力量感。',
  yan: '专业商业肖像，欧美白人男性，31岁，音乐制作人。整体形象神秘感十足，深色中长发微卷，眼神深沉且带温柔。面部轮廓精致，皮肤光滑。身穿黑色皮衣或针织衫，背景为录音棚或夜色舞台灯光，色调低饱和、带有音乐氛围。',
};

export async function generateCharacterImage(characterId: string): Promise<string> {
  const apiKey = process.env.IMAGE_ARK_API_KEY;
  if (!apiKey) return 'placeholder';

  const prompt = CHARACTER_PROMPTS[characterId] ?? CHARACTER_PROMPTS['lin'];
  const baseUrl = process.env.IMAGE_BASE_URL ?? 'https://ark.cn-beijing.volces.com/api/v3';
  const model = process.env.IMAGE_MODEL ?? 'doubao-seedream-5-0-260128';

  try {
    const res = await fetch(`${baseUrl}/images/generations`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        prompt,
        n: 1,
        size: '2048x2048',
        response_format: 'url',
        watermark: false,
      }),
    });

    if (!res.ok) {
      console.error('Image API error:', res.status, await res.text());
      return 'placeholder';
    }

    const data = await res.json();
    return (data.data?.[0]?.url as string) ?? 'placeholder';
  } catch (e) {
    console.error('Image generation error:', e);
    return 'placeholder';
  }
}
