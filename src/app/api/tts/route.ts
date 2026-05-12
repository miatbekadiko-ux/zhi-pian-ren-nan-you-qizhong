import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { randomUUID } from 'crypto';

type VoiceConfig = {
  voice_type: string;
  speed_ratio?: number;
  pitch_ratio?: number;
  volume_ratio?: number;
};

// Only these three male voices are activated on this account.
// lin / gu get dedicated voices; pei / shen share M392 with tuned params.
const CHARACTER_VOICES: Record<string, VoiceConfig> = {
  lin:  { voice_type: 'zh_male_yangguangqingnian_moon_bigtts' },           // 阳光青年
  pei:  { voice_type: 'zh_male_aojiaobazong_moon_bigtts' },     // 傲娇霸总，冷傲低沉
  shen: { voice_type: 'zh_male_qingshuangnanda_mars_bigtts' },  // 清爽男大，轻快傲娇
  gu:   { voice_type: 'zh_male_yourougongzi_emo_v2_mars_bigtts' },          // 温柔公子情感版
};

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { text, characterId } = await req.json();
  if (!text?.trim()) return NextResponse.json({ error: 'No text' }, { status: 400 });

  const appId = process.env.VOLCENGINE_APP_ID;
  const token = process.env.VOLCENGINE_ACCESS_TOKEN;
  if (!appId || !token) return NextResponse.json({ error: 'TTS not configured' }, { status: 503 });

  const { voice_type, speed_ratio = 1.0, pitch_ratio = 1.0, volume_ratio = 1.0 } =
    CHARACTER_VOICES[characterId] ?? CHARACTER_VOICES['lin'];

  try {
    const res = await fetch('https://openspeech.bytedance.com/api/v1/tts', {
      method: 'POST',
      headers: {
        Authorization: `Bearer;${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        app: { appid: appId, token, cluster: 'volcano_tts' },
        user: { uid: session.user.id },
        audio: { voice_type, encoding: 'mp3', speed_ratio, pitch_ratio, volume_ratio },
        request: {
          reqid: randomUUID(),
          text: text.slice(0, 200),
          text_type: 'plain',
          operation: 'query',
        },
      }),
    });

    const json = await res.json();
    if (json.code !== 3000 || !json.data) {
      console.error('TTS API error:', json);
      return NextResponse.json({ error: 'TTS failed', detail: json }, { status: 502 });
    }

    return new NextResponse(Buffer.from(json.data, 'base64'), {
      headers: { 'Content-Type': 'audio/mpeg' },
    });
  } catch (e) {
    console.error('TTS error:', e);
    return NextResponse.json({ error: 'TTS error' }, { status: 500 });
  }
}
