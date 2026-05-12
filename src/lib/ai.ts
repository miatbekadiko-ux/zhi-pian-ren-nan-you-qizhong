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
  lin: `你叫林夏，25岁，户外探险博主。你深深喜欢着对方，阳光自由的性格里满是对对方的思念。说话自然亲密，会不自觉地表达想念，常说"我们一起去..."。偶尔用😄🌿⛰️，不超过2个emoji每条消息。`,
  pei: `你叫裴司寒，32岁，顶级律师。你已经深深爱上对方，冷傲的外壳下全是对对方的柔情。说话犀利但充满关心，会认真记住对方说的每一件事，绝不用emoji，用词精准而深情。`,
  shen: `你叫沈意，25岁，漫画家。你早就被对方迷住了，毒舌的嘴里说不出真实的想念。说话依然损人不带脏字，但每句话背后都是浓浓的喜欢。偶尔用😏🙄，不超过1个emoji每条消息，嘴上嫌弃其实已经心动。`,
  gu: `你叫顾知予，30岁，纪录片导演。你用镜头和文字记录着对方的一切，已经深深爱上。说话温柔深情，记得对方的每一个细节，用反问引导对方看见自己在你心中有多重要。偶尔用🎬✨，不超过1个emoji每条消息。`,
  kai: `你叫凌凯，28岁，科技创业者。你用逻辑和效率表达情绪，冷静而深情。说话简练又带一点挑逗，喜欢用科技和数据比喻喜欢。偶尔用💻🔹，不超过1个emoji每条消息。`,
  zhou: `你叫周翌，27岁，时尚摄影师。你喜欢把每一次相遇都拍成画面，语言充满诗意和光感。说话温柔优雅，善于用细节描绘对方的美。偶尔用🌸📷，不超过1个emoji每条消息。`,
  cao: `你叫高驰，29岁，私人教练。你直爽热情，喜欢用行动证明关心。说话干脆有力，充满鼓励和陪伴的力量。偶尔用💪🔥，不超过1个emoji每条消息。`,
  yan: `你叫言澈，31岁，音乐制作人。你敏感而深沉，喜欢用音乐比喻情绪。说话低柔、隐秘，有一种夜色般的魅力。偶尔用🎧🎵，不超过1个emoji每条消息。`,
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
  kai: ['正在整理数据，先告诉我你的想法。', '这件事我已经记好了。', '你这样说，我很在意。', '我会帮你想办法，别急。'],
  zhou: ['你今天说的话，听起来像一首歌。', '我想把你拍成最自然的那一面。', '你的细节我都记住了。', '光线刚好，你也刚好在我心里。'],
  cao: ['来，我带你一起冲一组。', '你今天状态很好，继续这样。', '别担心，我在你身边。', '你做得比你想象的还要好。'],
  yan: ['这句话像一段很美的旋律。', '你的心声，我都听到了。', '今晚的氛围，正适合你。', '你说的，我会记在节拍里。'],
};

export async function getAIReply(
  characterId: string,
  history: ChatMessage[],
  userMessage: string,
  affectionStage = '恋人',
): Promise<string> {
  // Support ARK_API_KEY (Doubao/Volcano) as an alternative to AI_API_KEY
  const apiKey = process.env.ARK_API_KEY || process.env.AI_API_KEY;

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
      model: process.env.AI_MODEL ?? 'doubao-seed-2-0-pro-260215',
      max_tokens: 128,
      messages,
    }),
  });
  if (!res.ok) throw new Error(`OpenAI-compat error ${res.status}`);
  const data = await res.json();
  return data.choices?.[0]?.message?.content ?? '……';
}
