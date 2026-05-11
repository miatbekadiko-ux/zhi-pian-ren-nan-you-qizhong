import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';

// Each character maps to a Doubao TTS voice
const CHARACTER_VOICES: Record<string, string> = {
  lin: 'zh_male_xiaodongbei_dream_bigtts',   // 阳光少年感
  pei: 'zh_male_qingshu_moon_bigtts',          // 冷静沉稳
  shen: 'zh_male_rap_kuke_moon_bigtts',        // 随性毒舌
  gu: 'zh_male_story_moon_bigtts',             // 温柔叙事
};

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { text, characterId } = await req.json();
  if (!text?.trim()) return NextResponse.json({ error: 'No text' }, { status: 400 });

  const arkKey = process.env.ARK_API_KEY || process.env.AI_API_KEY;
  const ttsModel = process.env.DOUBAO_API_KEY || process.env.VOLCENGINE_API_KEY;

  if (!arkKey || !ttsModel) {
    return NextResponse.json({ error: 'TTS not configured' }, { status: 503 });
  }

  const voice = CHARACTER_VOICES[characterId] ?? CHARACTER_VOICES['lin'];
  const baseUrl = process.env.AI_BASE_URL ?? 'https://ark.cn-beijing.volces.com/api/v3';

  try {
    const res = await fetch(`${baseUrl}/audio/speech`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${arkKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: ttsModel,
        input: text.slice(0, 200),
        voice,
        response_format: 'mp3',
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error('TTS API error:', res.status, err);
      return NextResponse.json({ error: 'TTS API failed' }, { status: 502 });
    }

    const audio = await res.arrayBuffer();
    return new NextResponse(audio, {
      headers: { 'Content-Type': 'audio/mpeg' },
    });
  } catch (e) {
    console.error('TTS error:', e);
    return NextResponse.json({ error: 'TTS error' }, { status: 500 });
  }
}
