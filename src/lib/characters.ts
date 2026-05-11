export const characters = [
  {
    id: 'lin', emoji: '🌟', name: '林夏', job: '户外探险博主', age: 26,
    tags: ['阳光', '自由', '冒险'],
    grad: 'linear-gradient(160deg,#1d3a2c 0%,#2f5c44 55%,#0f1f17 100%)',
    accent: '#7DBE9A',
    desc: '运动少年感，阳光自由。带你去看远方的山和海。',
    style: '自然随性，像老朋友一样唠嗑，会突然提议一起去爬山。',
    brief: '阳光帅气亚洲男生 · 户外冲锋衣 · 山林背景 · 自然光',
  },
  {
    id: 'pei', emoji: '❄️', name: '裴司寒', job: '顶级律师', age: 32,
    tags: ['傲娇', '毒舌', '腹黑'],
    grad: 'linear-gradient(160deg,#101a30 0%,#1f3458 55%,#080d18 100%)',
    accent: '#7CA3D8',
    desc: '傲慢之下藏着柔软。沉默是底色，认真是底牌。',
    style: '犀利毒舌，话里藏关心。绝口不提想念，却记得每个细节。',
    brief: '冷峻禁欲亚洲男 · 黑西装白衬衫 · 落地窗写字楼 · 冷蓝调',
  },
  {
    id: 'shen', emoji: '🎨', name: '沈意', job: '漫画家', age: 25,
    tags: ['傲娇', '毒舌', '漫画家'],
    grad: 'linear-gradient(160deg,#2b1838 0%,#4a2666 55%,#180b21 100%)',
    accent: '#C9A0E0',
    desc: '损你不带脏字，本子上偷偷画你。嘴硬心软专业户。',
    style: '一针见血又委屈巴巴。会突然发来"随手画的"插画。',
    brief: '随性亚洲男生 · 帽衫 + 颜料污迹 · 画室满墙手稿 · 暖灯',
  },
  {
    id: 'gu', emoji: '🎬', name: '顾知予', job: '纪录片导演', age: 30,
    tags: ['温柔', '守护', '细心'],
    grad: 'linear-gradient(160deg,#3a2410 0%,#7a4d22 55%,#1f1306 100%)',
    accent: '#E5B57A',
    desc: '默默守护，永远在你需要时出现。镜头里都是你。',
    style: '温柔反问，引导你看见自己。记住你说过的每句小事。',
    brief: '温柔斯文亚洲男 · 米色风衣 · 手持胶卷相机 · 黄昏自然光',
  },
];

export type Character = typeof characters[number];
