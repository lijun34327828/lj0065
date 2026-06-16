import type { BanquetStyle } from '@/types/banquet';

export const banquetStyles: BanquetStyle[] = [
  {
    id: 'classical-chinese',
    name: '古典中式',
    description: '传统中式典雅，红色金色为主色调，展现东方韵味',
    keywords: ['中式', '传统', '典雅', '红色', '金色'],
    priceLevel: 3,
  },
  {
    id: 'modern-minimalist',
    name: '现代简约',
    description: '简洁大气的现代风格，线条流畅质感高级',
    keywords: ['现代', '简约', '高级', '简洁', '质感'],
    priceLevel: 2,
  },
  {
    id: 'romantic-western',
    name: '浪漫西式',
    description: '欧式浪漫风情，花艺与烛光交织的梦幻氛围',
    keywords: ['西式', '浪漫', '梦幻', '花艺', '烛光'],
    priceLevel: 3,
  },
  {
    id: 'forest-natural',
    name: '森系自然',
    description: '清新自然的森林风格，绿意盎然生机勃发',
    keywords: ['森系', '自然', '清新', '绿色', '森林'],
    priceLevel: 2,
  },
  {
    id: 'luxury-palace',
    name: '奢华宫廷',
    description: '金碧辉煌的宫廷风格，雍容华贵尽显尊贵',
    keywords: ['奢华', '宫廷', '尊贵', '华丽', '金色'],
    priceLevel: 4,
  },
  {
    id: 'vintage-retro',
    name: '复古怀旧',
    description: '复古怀旧的老上海风情，韵味悠长',
    keywords: ['复古', '怀旧', '老上海', '韵味'],
    priceLevel: 2,
  },
  {
    id: 'ocean-fresh',
    name: '海洋清新',
    description: '蓝色海洋主题，清新浪漫的海滨风情',
    keywords: ['海洋', '清新', '蓝色', '海滨', '清爽'],
    priceLevel: 2,
  },
  {
    id: 'star-night',
    name: '星空梦幻',
    description: '璀璨星空主题，梦幻浪漫的夜空氛围',
    keywords: ['星空', '梦幻', '夜空', '璀璨', '浪漫'],
    priceLevel: 3,
  },
];
