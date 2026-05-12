/**
 * 火山引擎 端到端实时语音大模型 WebSocket 连接测试
 * 运行方法：npx tsx scripts/test-realtime-voice.ts
 */

import WebSocket from 'ws';
import * as http from 'http';
import * as https from 'https';
import * as fs from 'fs';
import * as path from 'path';

const APP_ID       = '4702809703';
const ACCESS_TOKEN = 'ZeUphw7cA26AoFnJX8kzTb_hlKLNG3ug';
const APP_KEY      = 'PlgvMymc7f3tQnJ6';
const RESOURCE_ID  = 'volc.speech.dialog';
const WS_BASE      = 'wss://openspeech.bytedance.com/api/v3/realtime/dialogue';

// 依次尝试的鉴权配置
const AUTH_VARIANTS = [
  {
    label: '方案A: Bearer: （冒号）+ resource_id+appid+token',
    url: WS_BASE,
    headers: {
      'Authorization': `Bearer: resource_id=${RESOURCE_ID}; appid=${APP_ID}; token=${ACCESS_TOKEN}`,
    },
  },
  {
    label: '方案B: resource_id 在 Authorization，appid+token 在独立 header',
    url: WS_BASE,
    headers: {
      'Authorization': `Bearer ${ACCESS_TOKEN}`,
      'X-App-Id': APP_ID,
      'X-Resource-Id': RESOURCE_ID,
    },
  },
  {
    label: '方案C: 纯 Bearer token + resource_id 在 URL query',
    url: `${WS_BASE}?resource_id=${RESOURCE_ID}&appid=${APP_ID}`,
    headers: {
      'Authorization': `Bearer ${ACCESS_TOKEN}`,
    },
  },
  {
    label: '方案D: resource_id 大写字段',
    url: WS_BASE,
    headers: {
      'Authorization': `Bearer; appid=${APP_ID}; Resource-Id=${RESOURCE_ID}; token=${ACCESS_TOKEN}`,
    },
  },
  {
    label: '方案E: 全部放 query 参数',
    url: `${WS_BASE}?appid=${APP_ID}&resource_id=${RESOURCE_ID}&token=${ACCESS_TOKEN}`,
    headers: {},
  },
] as const;

async function tryConnect(variant: typeof AUTH_VARIANTS[number]): Promise<boolean> {
  return new Promise((resolve) => {
    console.log(`\n🔍 尝试 ${variant.label}`);
    console.log(`   URL: ${variant.url}`);
    console.log(`   Headers:`, JSON.stringify(variant.headers, null, 2));

    const ws = new WebSocket(variant.url, { headers: variant.headers as Record<string, string> });

    // 捕获 HTTP 级别的错误响应（400/401/403 等）
    ws.on('unexpected-response', (req: http.ClientRequest, res: http.IncomingMessage) => {
      let body = '';
      res.on('data', (chunk: Buffer) => { body += chunk.toString(); });
      res.on('end', () => {
        console.log(`   ❌ HTTP ${res.statusCode}: ${body || '(空响应)'}`);
        resolve(false);
      });
    });

    ws.on('open', () => {
      console.log(`   ✅ 连接成功！`);
      ws.close();
      resolve(true);
    });

    ws.on('error', (err: Error) => {
      // 如果已经通过 unexpected-response 处理了，这里会重复触发，忽略
      if (!err.message.includes('Unexpected server response')) {
        console.log(`   ❌ 错误: ${err.message}`);
        resolve(false);
      }
    });

    setTimeout(() => {
      if (ws.readyState === WebSocket.CONNECTING || ws.readyState === WebSocket.OPEN) {
        ws.close();
        console.log('   ⏱ 超时');
        resolve(false);
      }
    }, 8000);
  });
}

async function main() {
  console.log('══════════════════════════════════════════');
  console.log(' 火山引擎 端到端实时语音 - 鉴权格式探测');
  console.log('══════════════════════════════════════════');

  for (const variant of AUTH_VARIANTS) {
    const ok = await tryConnect(variant);
    if (ok) {
      console.log('\n🎉 找到可用鉴权方案！开始完整测试...\n');
      await fullTest(variant);
      return;
    }
  }

  console.log('\n❌ 所有鉴权方案均失败。');
  console.log('   可能原因：');
  console.log('   1. 需要先在控制台激活 volc.speech.dialog 服务');
  console.log('   2. Access Token 已过期或无效');
  console.log('   3. App Key 需要参与请求签名（HMAC-SHA256）');
  console.log('   请检查火山引擎控制台：语音技术 → 语音服务 → 应用管理');
}

// ── 找到正确鉴权后执行完整测试 ──────────────────────────
async function fullTest(variant: typeof AUTH_VARIANTS[number]) {
  return new Promise<void>((resolve) => {
    const ws = new WebSocket(variant.url, { headers: variant.headers as Record<string, string> });
    let receivedAudio = Buffer.alloc(0);

    ws.on('open', () => {
      // 1. 发 StartSession
      const startMsg = {
        event: 'StartSession',
        payload: {
          resource_id: RESOURCE_ID,
          input_audio: {
            format: 'raw',
            codec: 'pcm',
            sample_rate: 16000,
            bits: 16,
            channel: 1,
          },
          output_audio: {
            format: 'raw',
            codec: 'pcm',
            sample_rate: 24000,
          },
        },
      };
      ws.send(JSON.stringify(startMsg));
      console.log('📤 StartSession 已发送');

      // 2. 延迟 500ms 后发音频
      setTimeout(() => streamAudio(ws), 500);
    });

    ws.on('message', (data: Buffer | string, isBinary: boolean) => {
      if (isBinary) {
        const buf = Buffer.isBuffer(data) ? data : Buffer.from(data as unknown as ArrayBuffer);
        receivedAudio = Buffer.concat([receivedAudio, buf]);
        process.stdout.write(`\r🔊 收到音频 ${(receivedAudio.length / 1024).toFixed(1)} KB`);
      } else {
        const text = Buffer.isBuffer(data) ? data.toString() : (data as string);
        try {
          const msg = JSON.parse(text);
          console.log('\n📩', JSON.stringify(msg, null, 2));
          const evt: string = msg.event ?? msg.type ?? '';
          if (evt.toLowerCase().includes('finish') || evt.toLowerCase().includes('end')) {
            finish(ws);
          }
          if (evt.toLowerCase().includes('error')) {
            console.error('\n❌ 服务端错误:', msg);
            finish(ws);
          }
        } catch {
          console.log('\n📩 原始文本:', text);
        }
      }
    });

    ws.on('error', (err: Error) => console.error('\n❌ 错误:', err.message));
    ws.on('close', () => { saveAudio(); resolve(); });

    setTimeout(() => { console.log('\n⏱ 超时关闭'); finish(ws); }, 20000);

    function finish(socket: WebSocket) {
      try { socket.send(JSON.stringify({ event: 'FinishSession', payload: {} })); } catch {}
      setTimeout(() => { try { socket.close(); } catch {} }, 1000);
    }

    function saveAudio() {
      if (receivedAudio.length > 0) {
        const p = path.join(process.cwd(), 'scripts', 'received.pcm');
        fs.writeFileSync(p, receivedAudio);
        console.log(`\n✅ 保存音频 → scripts/received.pcm（${(receivedAudio.length / 1024).toFixed(1)} KB）`);
        console.log('   播放: ffplay -f s16le -ar 24000 -ac 1 scripts/received.pcm');
      } else {
        console.log('\n⚠️  未收到音频');
      }
    }
  });
}

// ── 流式发送测试音频（无 WAV 文件则用 440Hz 正弦波）──────
function streamAudio(ws: WebSocket) {
  const wavPath = path.join(process.cwd(), 'scripts', 'test.wav');
  let pcm: Buffer;

  if (fs.existsSync(wavPath)) {
    pcm = fs.readFileSync(wavPath).slice(44); // 跳过 WAV 44 字节 header
    console.log(`📂 使用 scripts/test.wav（${(pcm.length / 1024).toFixed(1)} KB）`);
  } else {
    // 生成 3 秒 440Hz 正弦波
    const sr = 16000, dur = 3000, n = Math.floor(sr * dur / 1000);
    pcm = Buffer.alloc(n * 2);
    for (let i = 0; i < n; i++) {
      pcm.writeInt16LE(Math.round(Math.sin(2 * Math.PI * 440 * i / sr) * 3000), i * 2);
    }
    console.log('🎵 发送 3 秒测试音调（未找到 scripts/test.wav）');
  }

  const chunkSize = Math.floor(16000 * 100 / 1000) * 2; // 100ms 块
  let offset = 0;

  const timer = setInterval(() => {
    if (ws.readyState !== WebSocket.OPEN) { clearInterval(timer); return; }
    const chunk = pcm.slice(offset, offset + chunkSize);
    if (chunk.length === 0) {
      clearInterval(timer);
      ws.send(JSON.stringify({ event: 'FinishAudio', payload: {} }));
      console.log('📤 FinishAudio 已发送，等待回复...');
      return;
    }
    ws.send(chunk);
    offset += chunkSize;
  }, 100);
}

main().catch(console.error);
