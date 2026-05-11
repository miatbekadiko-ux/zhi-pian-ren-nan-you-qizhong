/**
 * 三合一 API 快速验证
 * npx tsx scripts/test-apis.ts
 */

import * as fs from 'fs';
import * as path from 'path';
import { randomUUID } from 'crypto';

// ── 读取 .env.local ─────────────────────────────────────────
const envPath = path.join(process.cwd(), '.env.local');
const envVars: Record<string, string> = {};
fs.readFileSync(envPath, 'utf-8').split('\n').forEach(line => {
  const [k, ...v] = line.split('=');
  if (k && !k.startsWith('#')) envVars[k.trim()] = v.join('=').trim();
});

const ARK_API_KEY  = envVars['ARK_API_KEY'];
const AI_BASE_URL  = envVars['AI_BASE_URL'] ?? 'https://ark.cn-beijing.volces.com/api/v3';
const AI_MODEL     = envVars['AI_MODEL'] ?? 'doubao-seed-2-0';

const VOLCENGINE_APP_ID         = envVars['VOLCENGINE_APP_ID'];
const VOLCENGINE_ACCESS_TOKEN   = envVars['VOLCENGINE_ACCESS_TOKEN'];

const IMAGE_ARK_API_KEY = envVars['IMAGE_ARK_API_KEY'];
const IMAGE_BASE_URL    = envVars['IMAGE_BASE_URL'] ?? 'https://ark.cn-beijing.volces.com/api/v3';
const IMAGE_MODEL       = envVars['IMAGE_MODEL'] ?? 'doubao-seedream-5-0';

// ── 1. LLM ──────────────────────────────────────────────────
async function testLLM() {
  console.log('\n【1/3】LLM — Doubao-Seed-2.0');
  console.log(`  model: ${AI_MODEL}  key: ${ARK_API_KEY?.slice(0, 12)}...`);
  try {
    const res = await fetch(`${AI_BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${ARK_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: AI_MODEL,
        max_tokens: 30,
        messages: [
          { role: 'system', content: '你是一个简单助手，只回复中文。' },
          { role: 'user', content: '你好，随便说一句话。' },
        ],
      }),
    });
    const data = await res.json();
    if (!res.ok) { console.error('  ❌ HTTP', res.status, JSON.stringify(data)); return; }
    const reply = data.choices?.[0]?.message?.content ?? '(空)';
    console.log(`  ✅ 回复: "${reply}"`);
  } catch (e: any) { console.error('  ❌ 错误:', e.message); }
}

// ── 2. TTS ──────────────────────────────────────────────────
async function testTTS() {
  console.log('\n【2/3】TTS — 火山引擎豆包语音合成2.0');
  console.log(`  appid: ${VOLCENGINE_APP_ID}  token: ${VOLCENGINE_ACCESS_TOKEN?.slice(0, 8)}...`);
  try {
    const res = await fetch('https://openspeech.bytedance.com/api/v1/tts', {
      method: 'POST',
      headers: {
        Authorization: `Bearer;${VOLCENGINE_ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        app: { appid: VOLCENGINE_APP_ID, token: VOLCENGINE_ACCESS_TOKEN, cluster: 'volcano_tts' },
        user: { uid: 'test_user' },
        audio: { voice_type: 'zh_female_vv_uranus_bigtts', encoding: 'mp3' },
        request: { reqid: randomUUID(), text: '今天天气不错，你最近怎么样？', text_type: 'plain', operation: 'query' },
      }),
    });
    const json = await res.json();
    if (json.code !== 3000) { console.error('  ❌ code:', json.code, json.message ?? json); return; }
    const buf = Buffer.from(json.data, 'base64');
    const outPath = path.join(process.cwd(), 'scripts', 'tts-test.mp3');
    fs.writeFileSync(outPath, buf);
    console.log(`  ✅ 成功！保存到 scripts/tts-test.mp3（${(buf.length / 1024).toFixed(1)} KB）`);
  } catch (e: any) { console.error('  ❌ 错误:', e.message); }
}

// ── 3. 图像生成 ──────────────────────────────────────────────
async function testImage() {
  console.log('\n【3/3】图像生成 — Doubao-Seedream-5.0');
  console.log(`  model: ${IMAGE_MODEL}  key: ${IMAGE_ARK_API_KEY?.slice(0, 12)}...`);
  try {
    const res = await fetch(`${IMAGE_BASE_URL}/images/generations`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${IMAGE_ARK_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: IMAGE_MODEL,
        prompt: '阳光帅气亚洲男生，26岁，穿着户外冲锋衣，在山野场景，人像摄影',
        n: 1,
        size: '2048x2048',
        response_format: 'url',
      }),
    });
    const data = await res.json();
    if (!res.ok) { console.error('  ❌ HTTP', res.status, JSON.stringify(data)); return; }
    const url = data.data?.[0]?.url;
    if (!url) { console.error('  ❌ 无 URL，响应:', JSON.stringify(data)); return; }
    console.log(`  ✅ 成功！图片 URL: ${url.slice(0, 80)}...`);
  } catch (e: any) { console.error('  ❌ 错误:', e.message); }
}

// ── 主流程 ───────────────────────────────────────────────────
async function main() {
  console.log('═══════════════════════════════════════');
  console.log(' 纸片男友 — API 三合一快速验证');
  console.log('═══════════════════════════════════════');
  await testLLM();
  await testTTS();
  await testImage();
  console.log('\n═══ 验证完毕 ═══\n');
}

main().catch(console.error);
