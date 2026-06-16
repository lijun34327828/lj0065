import type { ScaleType, VenueType, CrowdType, BudgetType, ParamOption } from '@/types/banquet';

export const scaleOptions: Record<ScaleType, ParamOption> = {
  small: {
    id: 'small',
    label: '小型宴会',
    description: '20-50人',
    icon: 'Users',
  },
  medium: {
    id: 'medium',
    label: '中型宴会',
    description: '50-100人',
    icon: 'Users',
  },
  large: {
    id: 'large',
    label: '大型宴会',
    description: '100-200人',
    icon: 'Users',
  },
  grand: {
    id: 'grand',
    label: '盛大宴会',
    description: '200人以上',
    icon: 'Crown',
  },
};

export const venueOptions: Record<VenueType, ParamOption> = {
  hotel: {
    id: 'hotel',
    label: '星级酒店',
    description: '专业宴会厅配套完善',
    icon: 'Building2',
  },
  outdoor: {
    id: 'outdoor',
    label: '户外场地',
    description: '花园草坪自然风光',
    icon: 'Trees',
  },
  restaurant: {
    id: 'restaurant',
    label: '特色餐厅',
    description: '精致用餐氛围',
    icon: 'UtensilsCrossed',
  },
  villa: {
    id: 'villa',
    label: '私家庄园',
    description: '私密高端专属体验',
    icon: 'Home',
  },
  exhibition: {
    id: 'exhibition',
    label: '会展中心',
    description: '超大空间灵活布置',
    icon: 'LayoutGrid',
  },
};

export const crowdOptions: Record<CrowdType, ParamOption> = {
  wedding: {
    id: 'wedding',
    label: '婚礼婚宴',
    description: '浪漫温馨的婚礼盛宴',
    icon: 'Heart',
  },
  business: {
    id: 'business',
    label: '商务宴请',
    description: '正式专业的商务活动',
    icon: 'Briefcase',
  },
  birthday: {
    id: 'birthday',
    label: '生日派对',
    description: '欢乐庆生欢聚时光',
    icon: 'Cake',
  },
  family: {
    id: 'family',
    label: '家庭聚会',
    description: '温馨和睦的家族团聚',
    icon: 'Home',
  },
  friend: {
    id: 'friend',
    label: '朋友聚会',
    description: '轻松愉快的好友派对',
    icon: 'Sparkles',
  },
};

export const budgetOptions: Record<BudgetType, ParamOption> = {
  economy: {
    id: 'economy',
    label: '经济实惠',
    description: '人均300-500元',
    icon: 'Wallet',
  },
  standard: {
    id: 'standard',
    label: '标准品质',
    description: '人均500-800元',
    icon: 'CreditCard',
  },
  premium: {
    id: 'premium',
    label: '高端精致',
    description: '人均800-1500元',
    icon: 'Gem',
  },
  luxury: {
    id: 'luxury',
    label: '奢华尊享',
    description: '人均1500元以上',
    icon: 'Crown',
  },
};

export const guestCountMap: Record<ScaleType, number> = {
  small: 35,
  medium: 75,
  large: 150,
  grand: 300,
};

export const venueBasePriceMap: Record<VenueType, number> = {
  hotel: 20000,
  outdoor: 15000,
  restaurant: 8000,
  villa: 35000,
  exhibition: 25000,
};
