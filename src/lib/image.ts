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
  lin: '阳光帅气亚洲男生，26岁，穿着户外冲锋衣，在山野或户外场景，自然光，清新真实风格，人像摄影',
  pei: '冷峻帅气亚洲男生，32岁，深色西装白衬衫，站在落地窗写字楼前，冷蓝色调，高级感，人像摄影',
  shen: '文艺气质亚洲男生，25岁，帽衫上有颜料痕迹，坐在画室，背景是手稿和画作，暖灯光，人像摄影',
  gu: '温柔斯文亚洲男生，30岁，米色风衣，手持胶卷相机，黄昏自然光，电影感，人像摄影',
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
