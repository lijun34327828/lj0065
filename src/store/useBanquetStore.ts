import { create } from 'zustand';
import type {
  BanquetParams,
  BanquetPlan,
  ScaleType,
  VenueType,
  CrowdType,
  BudgetType,
  Decoration,
  Entertainment,
  Cuisine,
  Souvenir,
  BanquetStyle,
  ReplaceCategory,
} from '@/types/banquet';
import { generateBanquetPlans, recalculatePlanBudget } from '@/utils/banquetAI';
import { banquetStyles } from '@/data/styles';
import { decorations } from '@/data/decorations';
import { entertainmentOptions } from '@/data/entertainment';
import { cuisines } from '@/data/cuisines';
import { souvenirs } from '@/data/souvenirs';

interface BanquetState {
  params: BanquetParams;
  plans: BanquetPlan[];
  selectedPlanId: string | null;
  isGenerating: boolean;
  replaceModal: {
    isOpen: boolean;
    category: ReplaceCategory | null;
    entertainmentIndex: number | null;
  };
  detailModalOpen: boolean;
  exportToast: { show: boolean; message: string };

  setScale: (scale: ScaleType) => void;
  setVenue: (venue: VenueType) => void;
  setCrowd: (crowd: CrowdType) => void;
  setBudget: (budget: BudgetType) => void;
  generatePlans: () => void;
  selectPlan: (planId: string) => void;
  getSelectedPlan: () => BanquetPlan | undefined;

  openReplaceModal: (category: ReplaceCategory, entertainmentIndex?: number) => void;
  closeReplaceModal: () => void;

  openDetailModal: () => void;
  closeDetailModal: () => void;

  replaceStyle: (style: BanquetStyle) => void;
  replaceDecoration: (decoration: Decoration) => void;
  replaceEntertainment: (entertainment: Entertainment, index: number) => void;
  addEntertainment: (entertainment: Entertainment) => void;
  removeEntertainment: (index: number) => void;
  replaceCuisine: (cuisine: Cuisine) => void;
  replaceSouvenir: (souvenir: Souvenir) => void;

  getReplaceOptions: () => any[];
  exportPlan: () => void;
  hideExportToast: () => void;
}

export const useBanquetStore = create<BanquetState>((set, get) => ({
  params: {
    scale: null,
    venue: null,
    crowd: null,
    budget: null,
  },
  plans: [],
  selectedPlanId: null,
  isGenerating: false,
  replaceModal: {
    isOpen: false,
    category: null,
    entertainmentIndex: null,
  },
  detailModalOpen: false,
  exportToast: { show: false, message: '' },

  setScale: (scale) => set((state) => ({
    params: { ...state.params, scale },
  })),

  setVenue: (venue) => set((state) => ({
    params: { ...state.params, venue },
  })),

  setCrowd: (crowd) => set((state) => ({
    params: { ...state.params, crowd },
  })),

  setBudget: (budget) => set((state) => ({
    params: { ...state.params, budget },
  })),

  generatePlans: () => {
    set({ isGenerating: true });

    setTimeout(() => {
      const params = get().params;
      const plans = generateBanquetPlans(params);

      set({
        plans,
        selectedPlanId: plans.length > 0 ? plans[0].id : null,
        isGenerating: false,
      });
    }, 1500);
  },

  selectPlan: (planId) => set({ selectedPlanId: planId }),

  getSelectedPlan: () => {
    const state = get();
    return state.plans.find(p => p.id === state.selectedPlanId);
  },

  openReplaceModal: (category, entertainmentIndex = null) => set({
    replaceModal: {
      isOpen: true,
      category,
      entertainmentIndex,
    },
  }),

  closeReplaceModal: () => set({
    replaceModal: {
      isOpen: false,
      category: null,
      entertainmentIndex: null,
    },
  }),

  replaceStyle: (style) => {
    const state = get();
    const plan = state.getSelectedPlan();
    if (!plan) return;

    const updatedPlan = { ...plan, style };
    const recalculated = recalculatePlanBudget(updatedPlan, state.params);

    set({
      plans: state.plans.map(p => p.id === plan.id ? recalculated : p),
      replaceModal: { isOpen: false, category: null, entertainmentIndex: null },
    });
  },

  replaceDecoration: (decoration) => {
    const state = get();
    const plan = state.getSelectedPlan();
    if (!plan) return;

    const updatedPlan = { ...plan, decoration };
    const recalculated = recalculatePlanBudget(updatedPlan, state.params);

    set({
      plans: state.plans.map(p => p.id === plan.id ? recalculated : p),
      replaceModal: { isOpen: false, category: null, entertainmentIndex: null },
    });
  },

  replaceEntertainment: (entertainment, index) => {
    const state = get();
    const plan = state.getSelectedPlan();
    if (!plan) return;

    const newEntertainment = [...plan.entertainment];
    newEntertainment[index] = entertainment;

    const updatedPlan = { ...plan, entertainment: newEntertainment };
    const recalculated = recalculatePlanBudget(updatedPlan, state.params);

    set({
      plans: state.plans.map(p => p.id === plan.id ? recalculated : p),
      replaceModal: { isOpen: false, category: null, entertainmentIndex: null },
    });
  },

  addEntertainment: (entertainment) => {
    const state = get();
    const plan = state.getSelectedPlan();
    if (!plan) return;

    const updatedPlan = {
      ...plan,
      entertainment: [...plan.entertainment, entertainment],
    };
    const recalculated = recalculatePlanBudget(updatedPlan, state.params);

    set({
      plans: state.plans.map(p => p.id === plan.id ? recalculated : p),
      replaceModal: { isOpen: false, category: null, entertainmentIndex: null },
    });
  },

  removeEntertainment: (index) => {
    const state = get();
    const plan = state.getSelectedPlan();
    if (!plan || plan.entertainment.length <= 1) return;

    const newEntertainment = plan.entertainment.filter((_, i) => i !== index);
    const updatedPlan = { ...plan, entertainment: newEntertainment };
    const recalculated = recalculatePlanBudget(updatedPlan, state.params);

    set({
      plans: state.plans.map(p => p.id === plan.id ? recalculated : p),
    });
  },

  replaceCuisine: (cuisine) => {
    const state = get();
    const plan = state.getSelectedPlan();
    if (!plan) return;

    const updatedPlan = { ...plan, cuisine };
    const recalculated = recalculatePlanBudget(updatedPlan, state.params);

    set({
      plans: state.plans.map(p => p.id === plan.id ? recalculated : p),
      replaceModal: { isOpen: false, category: null, entertainmentIndex: null },
    });
  },

  replaceSouvenir: (souvenir) => {
    const state = get();
    const plan = state.getSelectedPlan();
    if (!plan) return;

    const updatedPlan = { ...plan, souvenir };
    const recalculated = recalculatePlanBudget(updatedPlan, state.params);

    set({
      plans: state.plans.map(p => p.id === plan.id ? recalculated : p),
      replaceModal: { isOpen: false, category: null, entertainmentIndex: null },
    });
  },

  getReplaceOptions: () => {
    const state = get();
    const { category } = state.replaceModal;

    switch (category) {
      case 'style':
        return banquetStyles;
      case 'decoration':
        return decorations;
      case 'entertainment':
        return entertainmentOptions;
      case 'cuisine':
        return cuisines;
      case 'souvenir':
        return souvenirs;
      default:
        return [];
    }
  },

  openDetailModal: () => set({ detailModalOpen: true }),
  closeDetailModal: () => set({ detailModalOpen: false }),

  exportPlan: () => {
    const state = get();
    const plan = state.getSelectedPlan();
    if (!plan) {
      set({ exportToast: { show: true, message: '暂无方案可导出' } });
      setTimeout(() => set({ exportToast: { show: false, message: '' } }), 2500);
      return;
    }

    function formatPrice(price: number): string {
      return new Intl.NumberFormat('zh-CN', {
        style: 'currency',
        currency: 'CNY',
        minimumFractionDigits: 0,
      }).format(price);
    }

    const content = `==============================
宴会策划方案 - ${plan.name}
==============================

【方案概况】
  宾客人数: ${plan.guestCount} 位
  匹配度: ${plan.matchScore}%
  总预算: ${formatPrice(plan.totalBudget)}

【预算明细】
  场地费用: ${formatPrice(plan.breakdown.venue)}
  场地布置: ${formatPrice(plan.breakdown.decoration)}
  娱乐项目: ${formatPrice(plan.breakdown.entertainment)}
  餐饮费用: ${formatPrice(plan.breakdown.cuisine)}
  伴手礼品: ${formatPrice(plan.breakdown.souvenir)}
  服务费:   ${formatPrice(plan.breakdown.service)}

【宴会风格】
  ${plan.style.name}
  ${plan.style.description}

【场地布置】
  ${plan.decoration.name}
  ${plan.decoration.description}
  费用: ${formatPrice(plan.decoration.price)}

【娱乐项目】
${plan.entertainment.map((e, i) => `  ${i + 1}. ${e.name}
     ${e.description}
     时长: ${e.duration}
     费用: ${formatPrice(e.price)}`).join('\n\n')}

【菜品套餐】
  ${plan.cuisine.name} (${plan.cuisine.cuisineType})
  ${plan.cuisine.description}
  单价: ${formatPrice(plan.cuisine.pricePerPerson)}/人
  小计: ${formatPrice(plan.breakdown.cuisine)}

【伴手礼品】
  ${plan.souvenir.name}
  ${plan.souvenir.description}
  单价: ${formatPrice(plan.souvenir.pricePerPiece)}/份
  小计: ${formatPrice(plan.breakdown.souvenir)}

==============================
生成时间: ${new Date().toLocaleString('zh-CN')}
==============================`;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `宴会方案_${plan.name}_${Date.now()}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    set({ exportToast: { show: true, message: `方案「${plan.name}」已导出成功！` } });
    setTimeout(() => set({ exportToast: { show: false, message: '' } }), 2500);
  },

  hideExportToast: () => set({ exportToast: { show: false, message: '' } }),
}));
