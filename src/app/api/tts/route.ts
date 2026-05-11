import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { randomUUID } from 'crypto';

// All characters use the same voice model; personality is shaped by speed/pitch tuning.
// Only zh_male_M392_conversation_wvae_bigtts is activated on this account.
type VoiceParams = { speed_ratio: number; pitch_ratio: number; volume_ratio: number };

const CHARACTER_PARAMS: Record<string, VoiceParams> = {
  // 林夏 — 阳光自由，语速轻快，音调明亮
  lin:  { speed_ratio: 1.10, pitch_ratio: 1.05, volume_ratio: 1.0 },
  // 裴司寒 — 冷傲律师，语速慢，音调低沉
  pei:  { speed_ratio: 0.85, pitch_ratio: 0.88, volume_ratio: 1.0 },
  // 沈意 — 毒舌傲娇，稍快，音调略高
  shen: { speed_ratio: 1.05, pitch_ratio: 1.08, volume_ratio: 1.0 },
  // 顾知予 — 温柔导演，舒缓平和
  gu:   { speed_ratio: 0.90, pitch_ratio: 0.93, volume_ratio: 1.0 },
};

const DEFAULT_PARAMS: VoiceParams = { speed_ratio: 1.0, pitch_ratio: 1.0, volume_ratio: 1.0 };

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { text, characterId } = await req.json();
  if (!text?.trim()) return NextResponse.json({ error: 'No text' }, { status: 400 });

  const appId = process.env.VOLCENGINE_APP_ID;
  const token = process.env.VOLCENGINE_ACCESS_TOKEN;
  if (!appId || !token) return NextResponse.json({ error: 'TTS not configured' }, { status: 503 });

  const params = CHARACTER_PARAMS[characterId] ?? DEFAULT_PARAMS;

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
        audio: {
          voice_type: 'zh_male_M392_conversation_wvae_bigtts',
          encoding: 'mp3',
          ...params,
        },
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

    const audioBuffer = Buffer.from(json.data, 'base64');
    return new NextResponse(audioBuffer, {
      headers: { 'Content-Type': 'audio/mpeg' },
    });
  } catch (e) {
    console.error('TTS error:', e);
    return NextResponse.json({ error: 'TTS error' }, { status: 500 });
  }
}
