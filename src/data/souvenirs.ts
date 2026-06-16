import type { Souvenir, BudgetType, CrowdType } from '@/types/banquet';

export const souvenirs: Souvenir[] = [
  {
    id: 'candy-box-economy',
    name: '喜糖礼盒',
    description: '精美糖果礼盒，多种口味可选',
    pricePerPiece: 30,
    level: 'economy',
    suitableCrowds: ['wedding', 'birthday', 'family'],
  },
  {
    id: 'cookie-box-economy',
    name: '手工曲奇礼盒',
    description: '手工烘焙曲奇，多种口味',
    pricePerPiece: 50,
    level: 'economy',
    suitableCrowds: ['birthday', 'friend', 'family', 'wedding'],
  },
  {
    id: 'tea-set-standard',
    name: '精品茶礼套装',
    description: '高档茶叶配精美茶具',
    pricePerPiece: 100,
    level: 'standard',
    suitableCrowds: ['business', 'family', 'wedding'],
  },
  {
    id: 'honey-jam-standard',
    name: '蜂蜜果酱礼盒',
    description: '天然蜂蜜与手工果酱',
    pricePerPiece: 80,
    level: 'standard',
    suitableCrowds: ['wedding', 'birthday', 'friend', 'family'],
  },
  {
    id: 'wine-premium',
    name: '珍藏红酒礼盒',
    description: '进口精选红酒，配精美酒具',
    pricePerPiece: 300,
    level: 'premium',
    suitableCrowds: ['business', 'wedding', 'friend'],
  },
  {
    id: 'chocolate-premium',
    name: '手工巧克力礼盒',
    description: '比利时进口手工巧克力',
    pricePerPiece: 200,
    level: 'premium',
    suitableCrowds: ['wedding', 'birthday', 'friend', 'business'],
  },
  {
    id: 'scented-candle-standard',
    name: '香氛蜡烛套装',
    description: '天然香氛蜡烛，多种香型',
    pricePerPiece: 120,
    level: 'standard',
    suitableCrowds: ['friend', 'birthday', 'wedding'],
  },
  {
    id: 'crystal-luxury',
    name: '水晶摆件礼盒',
    description: '精美水晶工艺品，高端定制',
    pricePerPiece: 500,
    level: 'luxury',
    suitableCrowds: ['business', 'wedding', 'family'],
  },
  {
    id: 'silk-luxury',
    name: '真丝围巾礼盒',
    description: '桑蚕丝围巾，典雅高贵',
    pricePerPiece: 400,
    level: 'luxury',
    suitableCrowds: ['wedding', 'business', 'family'],
  },
  {
    id: 'ginseng-luxury',
    name: '人参滋补礼盒',
    description: '长白山人参，滋补养生',
    pricePerPiece: 600,
    level: 'luxury',
    suitableCrowds: ['business', 'family', 'wedding'],
  },
  {
    id: 'plant-eco-economy',
    name: '多肉植物盆栽',
    description: '可爱多肉植物，环保小礼物',
    pricePerPiece: 25,
    level: 'economy',
    suitableCrowds: ['friend', 'birthday', 'family'],
  },
  {
    id: 'perfume-sample-premium',
    name: '香氛体验礼盒',
    description: '大牌香水小样礼盒，多种香型',
    pricePerPiece: 250,
    level: 'premium',
    suitableCrowds: ['wedding', 'friend', 'birthday'],
  },
];

export function getSouvenirsByBudgetAndCrowd(
  budget: BudgetType,
  crowd: CrowdType
): Souvenir[] {
  const budgetOrder: BudgetType[] = ['economy', 'standard', 'premium', 'luxury'];
  const currentIndex = budgetOrder.indexOf(budget);
  const allowedLevels = budgetOrder.slice(
    Math.max(0, currentIndex - 1),
    Math.min(4, currentIndex + 1)
  );

  return souvenirs.filter(
    s => allowedLevels.includes(s.level) && s.suitableCrowds.includes(crowd)
  );
}
