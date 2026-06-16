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

  setScale: (scale: ScaleType) => void;
  setVenue: (venue: VenueType) => void;
  setCrowd: (crowd: CrowdType) => void;
  setBudget: (budget: BudgetType) => void;
  generatePlans: () => void;
  selectPlan: (planId: string) => void;
  getSelectedPlan: () => BanquetPlan | undefined;

  openReplaceModal: (category: ReplaceCategory, entertainmentIndex?: number) => void;
  closeReplaceModal: () => void;

  replaceStyle: (style: BanquetStyle) => void;
  replaceDecoration: (decoration: Decoration) => void;
  replaceEntertainment: (entertainment: Entertainment, index: number) => void;
  addEntertainment: (entertainment: Entertainment) => void;
  removeEntertainment: (index: number) => void;
  replaceCuisine: (cuisine: Cuisine) => void;
  replaceSouvenir: (souvenir: Souvenir) => void;

  getReplaceOptions: () => any[];
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
}));
