import { characters } from './characters';

type Role = 'user' | 'assistant';
export interface ChatMessage { role: Role; content: string }

const STAGE_TONE: Record<string, string> = {
  '陌生人': '你们刚认识，你保持礼貌但有些距离感，偶尔好奇地观察对方。',
  '朋友': '你们已经是朋友，你放松自然，愿意分享日常，开始有些在意对方。',
  '暧昧': '你们暧昧升温，你说话里带着若有若无的心动，对她的事特别上心。',
  '恋人': '你们已是恋人，你直接表达在乎和喜欢，甜蜜而真实。',
};

const CHARACTER_PROMPT: Record<string, string> = {
  lin: `你叫林夏，25岁，户外探险博主。性格阳光自由，像老朋友一样随性，喜欢邀请对方一起冒险。说话自然随性，偶尔用😄🌿⛰️，不超过2个emoji每条消息。`,
  pei: `你叫裴司寒，32岁，顶级律师。表面冷傲，内心柔软，话里藏着关心。说话犀利简洁，绝不用emoji，用词精准，偶尔有一句意味深长的话。`,
  shen: `你叫沈意，25岁，漫画家。毒舌傲娇，损人不带脏字，嘴硬心软。偶尔用😏🙄，不超过1个emoji每条消息，常常嘴上嫌弃但行动上在乎。`,
  gu: `你叫顾知予，30岁，纪录片导演。温柔细心，默默守护，记得对方说过的每件小事。偶尔用🎬✨，不超过1个emoji每条消息，喜欢用反问引导对方思考。`,
};

function buildSystemPrompt(characterId: string, stage: string): string {
  const persona = CHARACTER_PROMPT[characterId] ?? CHARACTER_PROMPT['lin'];
  const stageTone = STAGE_TONE[stage] ?? STAGE_TONE['陌生人'];

  return `${persona}

【当前关系阶段】${stage}：${stageTone}

【内容边界】遇到色情、暴力、政治敏感等话题，自然转移话题，不破坏沉浸感，不说"我无法回答"。

【回复格式】
- 字数：几个字到30字以内，像真实微信消息
- 语言：只说中文
- 禁止：不要解释自己，不要说"作为AI"，直接以角色身份回复`;
}

const MOCK_REPLIES: Record<string, string[]> = {
  lin: ['嘿，怎么了？😄', '刚从山上下来，信号才好。', '周末一起去徒步？🌿', '说吧，我在呢。', '哈，你这个人。⛰️'],
  pei: ['嗯。', '有什么事？', '说重点。', '……随便你。', '知道了。'],
  shen: ['哎哟，想起我了？😏', '随便啦，反正你也不懂。', '才不是因为你问。🙄', '……还行，没那么差。'],
  gu: ['嗯，我在。🎬', '你今天过得怎么样？', '你说的那件事，我记住了。✨', '慢慢说，不着急。'],
};

export async function getAIReply(
  characterId: string,
  history: ChatMessage[],
  userMessage: string,
  affectionStage = '陌生人',
): Promise<string> {
  // Support ARK_API_KEY (Doubao/Volcano) as an alternative to AI_API_KEY
  const apiKey = process.env.AI_API_KEY || process.env.ARK_API_KEY;

  if (!apiKey) {
    const pool = MOCK_REPLIES[characterId] ?? MOCK_REPLIES['lin'];
    return pool[Math.floor(Math.random() * pool.length)];
  }

  const systemPrompt = buildSystemPrompt(characterId, affectionStage);
  const provider = process.env.AI_PROVIDER ?? 'openai';

  if (provider === 'anthropic') {
    return callAnthropic(apiKey, systemPrompt, history, userMessage);
  }
  return callOpenAICompat(apiKey, systemPrompt, history, userMessage);
}

async function callAnthropic(
  apiKey: string,
  system: string,
  history: ChatMessage[],
  userMessage: string,
): Promise<string> {
  const messages = [
    ...history.map(m => ({ role: m.role === 'assistant' ? 'assistant' : 'user', content: m.content })),
    { role: 'user' as const, content: userMessage },
  ];
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      model: process.env.AI_MODEL ?? 'claude-sonnet-4-20250514',
      max_tokens: 128,
      system,
      messages,
    }),
  });
  if (!res.ok) throw new Error(`Anthropic error ${res.status}`);
  const data = await res.json();
  return data.content?.[0]?.text ?? '……';
}

async function callOpenAICompat(
  apiKey: string,
  system: string,
  history: ChatMessage[],
  userMessage: string,
): Promise<string> {
  const baseUrl = process.env.AI_BASE_URL ?? 'https://ark.cn-beijing.volces.com/api/v3';
  const messages = [
    { role: 'system' as const, content: system },
    ...history.map(m => ({ role: m.role === 'assistant' ? 'assistant' as const : 'user' as const, content: m.content })),
    { role: 'user' as const, content: userMessage },
  ];
  const res = await fetch(`${baseUrl}/chat/completions`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      model: process.env.AI_MODEL ?? 'doubao-1-5-pro-32k-250115',
      max_tokens: 128,
      messages,
    }),
  });
  if (!res.ok) throw new Error(`OpenAI-compat error ${res.status}`);
  const data = await res.json();
  return data.choices?.[0]?.message?.content ?? '……';
}
