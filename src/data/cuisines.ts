import type { Cuisine, BudgetType, CrowdType } from '@/types/banquet';

export const cuisines: Cuisine[] = [
  {
    id: 'chinese-cantonese-economy',
    name: '粤式经典套餐',
    description: '经典粤菜八菜一汤，白灼虾、烧鹅、清蒸鱼',
    pricePerPerson: 300,
    cuisineType: '粤菜',
    level: 'economy',
    suitableCrowds: ['wedding', 'business', 'family', 'friend'],
  },
  {
    id: 'chinese-shandong-standard',
    name: '鲁菜精选套餐',
    description: '山东特色菜肴，糖醋鲤鱼、九转大肠、葱烧海参',
    pricePerPerson: 500,
    cuisineType: '鲁菜',
    level: 'standard',
    suitableCrowds: ['business', 'family', 'wedding'],
  },
  {
    id: 'chinese-huaiyang-premium',
    name: '淮扬精致套餐',
    description: '淮扬名馔，狮子头、文思豆腐、松鼠桂鱼',
    pricePerPerson: 800,
    cuisineType: '淮扬菜',
    level: 'premium',
    suitableCrowds: ['business', 'wedding', 'family'],
  },
  {
    id: 'chinese-manhan-luxury',
    name: '满汉全席尊享版',
    description: '精选满汉全席菜品，山珍海味应有尽有',
    pricePerPerson: 1800,
    cuisineType: '宫廷菜',
    level: 'luxury',
    suitableCrowds: ['wedding', 'business', 'family'],
  },
  {
    id: 'western-french-economy',
    name: '法式简餐套餐',
    description: '经典法式三道菜，牛排、汤品、甜点',
    pricePerPerson: 350,
    cuisineType: '西餐',
    level: 'economy',
    suitableCrowds: ['friend', 'birthday', 'business'],
  },
  {
    id: 'western-italian-standard',
    name: '意式风情套餐',
    description: '意大利美食，意面、披萨、提拉米苏',
    pricePerPerson: 450,
    cuisineType: '西餐',
    level: 'standard',
    suitableCrowds: ['friend', 'birthday', 'family'],
  },
  {
    id: 'western-french-premium',
    name: '法式大餐套餐',
    description: '法式七道式，鹅肝、松露、龙虾',
    pricePerPerson: 1000,
    cuisineType: '西餐',
    level: 'premium',
    suitableCrowds: ['business', 'wedding', 'friend'],
  },
  {
    id: 'western-molecular-luxury',
    name: '分子料理尊享',
    description: '创新分子料理，科技与美食的完美结合',
    pricePerPerson: 2000,
    cuisineType: '创新菜',
    level: 'luxury',
    suitableCrowds: ['business', 'friend', 'wedding'],
  },
  {
    id: 'buffet-international-economy',
    name: '国际自助套餐',
    description: '中西式自助，冷热菜品丰富',
    pricePerPerson: 280,
    cuisineType: '自助餐',
    level: 'economy',
    suitableCrowds: ['family', 'friend', 'birthday', 'business'],
  },
  {
    id: 'buffet-seafood-standard',
    name: '海鲜自助套餐',
    description: '海鲜自助无限量，螃蟹、虾、生蚝',
    pricePerPerson: 600,
    cuisineType: '自助餐',
    level: 'standard',
    suitableCrowds: ['friend', 'birthday', 'family', 'business'],
  },
  {
    id: 'japanese-kaiseki-premium',
    name: '日式怀石料理',
    description: '传统怀石料理，精致摆盘，应季食材',
    pricePerPerson: 1200,
    cuisineType: '日料',
    level: 'premium',
    suitableCrowds: ['business', 'friend', 'wedding'],
  },
  {
    id: 'japanese-omakase-luxury',
    name: '寿司 Omakase',
    description: '主厨精选，新鲜空运食材，尊享体验',
    pricePerPerson: 2500,
    cuisineType: '日料',
    level: 'luxury',
    suitableCrowds: ['business', 'friend', 'birthday'],
  },
];

export function getCuisinesByBudgetAndCrowd(
  budget: BudgetType,
  crowd: CrowdType
): Cuisine[] {
  const budgetOrder: BudgetType[] = ['economy', 'standard', 'premium', 'luxury'];
  const currentIndex = budgetOrder.indexOf(budget);
  const allowedLevels = budgetOrder.slice(
    Math.max(0, currentIndex - 1),
    Math.min(4, currentIndex + 2)
  );

  return cuisines.filter(
    c => allowedLevels.includes(c.level) && c.suitableCrowds.includes(crowd)
  );
}
