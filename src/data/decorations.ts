import type { Decoration, VenueType } from '@/types/banquet';

export const decorations: Decoration[] = [
  {
    id: 'rose-luxury',
    name: '玫瑰金奢华布置',
    description: '大量红玫瑰搭配金色烛台，营造奢华浪漫氛围',
    price: 18000,
    suitableVenues: ['hotel', 'villa'],
    styleTags: ['romantic', 'luxury', 'classic'],
  },
  {
    id: 'green-forest',
    name: '绿野仙踪森林布置',
    description: '绿植藤蔓与野花组合，宛如置身森林秘境',
    price: 12000,
    suitableVenues: ['outdoor', 'hotel'],
    styleTags: ['forest', 'natural', 'fresh'],
  },
  {
    id: 'chinese-red',
    name: '中国红古典布置',
    description: '红灯笼与红绸带相结合，浓郁中国风',
    price: 15000,
    suitableVenues: ['hotel', 'exhibition'],
    styleTags: ['chinese', 'classical', 'festive'],
  },
  {
    id: 'starry-sky',
    name: '璀璨星空布置',
    description: '星空灯幕与水晶吊灯，梦幻银河般的浪漫',
    price: 22000,
    suitableVenues: ['hotel', 'exhibition', 'villa'],
    styleTags: ['star', 'dream', 'romantic'],
  },
  {
    id: 'minimalist-white',
    name: '极简白绿布置',
    description: '白色与绿色的极简搭配，高级感十足',
    price: 10000,
    suitableVenues: ['restaurant', 'hotel', 'outdoor'],
    styleTags: ['minimalist', 'modern', 'advanced'],
  },
  {
    id: 'vintage-gold',
    name: '复古鎏金布置',
    description: '老上海风情的金色装饰，复古韵味',
    price: 16000,
    suitableVenues: ['hotel', 'restaurant', 'villa'],
    styleTags: ['vintage', 'retro', 'gold'],
  },
  {
    id: 'ocean-blue',
    name: '海洋蓝调布置',
    description: '蓝色渐变与白色装饰，清新海洋风',
    price: 13000,
    suitableVenues: ['outdoor', 'hotel', 'restaurant'],
    styleTags: ['ocean', 'fresh', 'blue'],
  },
  {
    id: 'garden-romantic',
    name: '花园浪漫布置',
    description: '粉色与白色鲜花拱门搭配，浪漫花园氛围',
    price: 14000,
    suitableVenues: ['outdoor', 'villa', 'hotel'],
    styleTags: ['romantic', 'garden', 'pink'],
  },
  {
    id: 'business-pro',
    name: '商务专业布置',
    description: '简洁专业的商务风格，专业大气',
    price: 8000,
    suitableVenues: ['hotel', 'exhibition', 'restaurant'],
    styleTags: ['business', 'professional', 'simple'],
  },
  {
    id: 'birthday-fun',
    name: '生日派对布置',
    description: '气球彩带与主题装饰，欢乐氛围',
    price: 6000,
    suitableVenues: ['restaurant', 'villa', 'hotel'],
    styleTags: ['birthday', 'fun', 'colorful'],
  },
  {
    id: 'family-warm',
    name: '温馨家庭布置',
    description: '暖色调家庭氛围，温馨舒适的家庭感',
    price: 7000,
    suitableVenues: ['restaurant', 'villa', 'hotel'],
    styleTags: ['warm', 'family', 'cozy'],
  },
  {
    id: 'palace-gold',
    name: '宫廷金色布置',
    description: '金色宫廷风，雍容华贵的视觉盛宴',
    price: 25000,
    suitableVenues: ['hotel', 'villa', 'exhibition'],
    styleTags: ['palace', 'luxury', 'gold'],
  },
];

export function getDecorationsByVenue(venue: VenueType): Decoration[] {
  return decorations.filter(d => d.suitableVenues.includes(venue));
}
