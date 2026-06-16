import type { Entertainment, CrowdType } from '@/types/banquet';

export const entertainmentOptions: Entertainment[] = [
  {
    id: 'jazz-band',
    name: '爵士乐队',
    description: '专业爵士乐队现场演奏，营造优雅氛围',
    price: 8000,
    duration: '3小时',
    suitableCrowds: ['wedding', 'business', 'friend'],
  },
  {
    id: 'magic-show',
    name: '魔术表演',
    description: '精彩魔术互动表演，增添神秘乐趣',
    price: 5000,
    duration: '45分钟',
    suitableCrowds: ['birthday', 'friend', 'family'],
  },
  {
    id: 'string-quartet',
    name: '弦乐四重奏',
    description: '古典弦乐演奏，高雅艺术享受',
    price: 12000,
    duration: '2小时',
    suitableCrowds: ['wedding', 'business', 'family'],
  },
  {
    id: 'dj-party',
    name: 'DJ 派对',
    description: '专业DJ打碟，嗨翻全场',
    price: 6000,
    duration: '4小时',
    suitableCrowds: ['birthday', 'friend', 'wedding'],
  },
  {
    id: 'photo-booth',
    name: '互动拍照区',
    description: '创意拍照道具与即时打印',
    price: 3000,
    duration: '全程',
    suitableCrowds: ['wedding', 'birthday', 'friend', 'family'],
  },
  {
    id: 'lion-dance',
    name: '舞狮表演',
    description: '传统舞狮表演，喜庆吉祥',
    price: 10000,
    duration: '30分钟',
    suitableCrowds: ['wedding', 'business', 'family'],
  },
  {
    id: 'emcee',
    name: '专业主持人',
    description: '资深司仪主持，把控全场节奏',
    price: 4000,
    duration: '全程',
    suitableCrowds: ['wedding', 'business', 'birthday', 'family'],
  },
  {
    id: 'cake-ceremony',
    name: '切蛋糕仪式',
    description: '定制主题蛋糕与仪式策划',
    price: 2500,
    duration: '30分钟',
    suitableCrowds: ['birthday', 'wedding', 'family'],
  },
  {
    id: 'lottery',
    name: '抽奖互动',
    description: '创意抽奖环节，调动气氛',
    price: 2000,
    duration: '30分钟',
    suitableCrowds: ['business', 'birthday', 'friend', 'family'],
  },
  {
    id: 'fireworks',
    name: '烟花表演',
    description: '绚丽烟花秀，璀璨夜空',
    price: 15000,
    duration: '15分钟',
    suitableCrowds: ['wedding', 'birthday', 'friend'],
  },
  {
    id: 'chinese-opera',
    name: '戏曲表演',
    description: '国粹京剧/昆曲表演，文化底蕴',
    price: 12000,
    duration: '1小时',
    suitableCrowds: ['business', 'family', 'wedding'],
  },
  {
    id: 'floral-workshop',
    name: '花艺体验',
    description: '现场花艺教学，互动体验',
    price: 6000,
    duration: '1.5小时',
    suitableCrowds: ['wedding', 'friend', 'family'],
  },
];

export function getEntertainmentByCrowd(crowd: CrowdType): Entertainment[] {
  return entertainmentOptions.filter(e => e.suitableCrowds.includes(crowd));
}
