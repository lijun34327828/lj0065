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
  TimelineSegment,
  BanquetTimeline,
  TimelineSegmentType,
} from '@/types/banquet';
import { generateBanquetPlans, recalculatePlanBudget } from '@/utils/banquetAI';
import { banquetStyles } from '@/data/styles';
import { decorations } from '@/data/decorations';
import { entertainmentOptions } from '@/data/entertainment';
import { cuisines } from '@/data/cuisines';
import { souvenirs } from '@/data/souvenirs';

function nextSegId(): string {
  return `seg-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

function parseDurationToMinutes(duration: string): number | null {
  if (duration === '全程') return null;
  const hourMatch = duration.match(/([\d.]+)\s*小时/);
  if (hourMatch) return Math.round(parseFloat(hourMatch[1]) * 60);
  const minMatch = duration.match(/([\d.]+)\s*分钟/);
  if (minMatch) return Math.round(parseFloat(minMatch[1]));
  return null;
}

function getDishCountForCuisine(cuisine: Cuisine): number {
  const dishCountMap: Record<string, number> = {
    'chinese-cantonese-economy': 9,
    'chinese-shandong-standard': 8,
    'chinese-huaiyang-premium': 8,
    'chinese-manhan-luxury': 12,
    'western-french-economy': 3,
    'western-italian-standard': 5,
    'western-french-premium': 7,
    'western-molecular-luxury': 8,
    'buffet-international-economy': 8,
    'buffet-seafood-standard': 8,
    'japanese-kaiseki-premium': 7,
    'japanese-omakase-luxury': 10,
  };
  return dishCountMap[cuisine.id] || 8;
}

export function generateDefaultTimeline(plan: BanquetPlan): BanquetTimeline {
  const segments: TimelineSegment[] = [];
  const guestCount = plan.guestCount;
  const dishCount = getDishCountForCuisine(plan.cuisine);

  segments.push({
    id: nextSegId(),
    type: 'welcome',
    label: '迎宾',
    durationMinutes: guestCount > 100 ? 40 : 30,
    note: '宾客签到，引导入座',
  });

  segments.push({
    id: nextSegId(),
    type: 'opening',
    label: '开场',
    durationMinutes: 10,
    note: '主持人开场白，介绍宴会主题',
  });

  segments.push({
    id: nextSegId(),
    type: 'speech',
    label: '致辞',
    durationMinutes: 15,
    note: '主办方/嘉宾致辞',
  });

  const timedEntertainment = plan.entertainment
    .map(e => ({ name: e.name, minutes: parseDurationToMinutes(e.duration), description: e.description }))
    .filter(e => e.minutes !== null);

  const dishesBeforeFirstEnt = Math.min(2, dishCount);
  for (let i = 0; i < dishesBeforeFirstEnt; i++) {
    segments.push({
      id: nextSegId(),
      type: 'dish',
      label: `上菜 · 第${i + 1}道`,
      durationMinutes: 8,
      note: '',
    });
  }

  let dishIndex = dishesBeforeFirstEnt;
  let entIndex = 0;

  while (dishIndex < dishCount || entIndex < timedEntertainment.length) {
    if (entIndex < timedEntertainment.length) {
      const ent = timedEntertainment[entIndex];
      segments.push({
        id: nextSegId(),
        type: 'entertainment',
        label: ent.name,
        durationMinutes: ent.minutes!,
        note: ent.description,
      });
      entIndex++;
    }

    const dishesToAdd = Math.min(2, dishCount - dishIndex);
    for (let i = 0; i < dishesToAdd; i++) {
      segments.push({
        id: nextSegId(),
        type: 'dish',
        label: `上菜 · 第${dishIndex + 1}道`,
        durationMinutes: 8,
        note: '',
      });
      dishIndex++;
    }

    if (entIndex >= timedEntertainment.length && dishIndex >= dishCount) break;
  }

  segments.push({
    id: nextSegId(),
    type: 'lottery',
    label: '抽奖互动',
    durationMinutes: 15,
    note: '幸运抽奖，互动环节',
  });

  segments.push({
    id: nextSegId(),
    type: 'farewell',
    label: '送客',
    durationMinutes: 15,
    note: '感谢宾客，赠送伴手礼',
  });

  return {
    startHour: 18,
    startMinute: 0,
    segments,
  };
}

export function computeSegmentTimes(timeline: BanquetTimeline): { startTime: string; endTime: string }[] {
  const results: { startTime: string; endTime: string }[] = [];
  let currentMinutes = timeline.startHour * 60 + timeline.startMinute;

  for (const segment of timeline.segments) {
    const startH = Math.floor(currentMinutes / 60) % 24;
    const startM = currentMinutes % 60;
    const startTime = `${String(startH).padStart(2, '0')}:${String(startM).padStart(2, '0')}`;

    currentMinutes += segment.durationMinutes;

    const endH = Math.floor(currentMinutes / 60) % 24;
    const endM = currentMinutes % 60;
    const endTime = `${String(endH).padStart(2, '0')}:${String(endM).padStart(2, '0')}`;

    results.push({ startTime, endTime });
  }

  return results;
}

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

  generateTimeline: () => void;
  addTimelineSegment: (segment: Omit<TimelineSegment, 'id'>) => void;
  updateTimelineSegment: (segmentId: string, updates: Partial<TimelineSegment>) => void;
  removeTimelineSegment: (segmentId: string) => void;
  moveTimelineSegment: (segmentId: string, direction: 'up' | 'down') => void;
  setTimelineStartTime: (hour: number, minute: number) => void;
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
      const plansWithTimelines = plans.map(plan => ({
        ...plan,
        timeline: generateDefaultTimeline(plan),
      }));

      set({
        plans: plansWithTimelines,
        selectedPlanId: plansWithTimelines.length > 0 ? plansWithTimelines[0].id : null,
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

  generateTimeline: () => {
    const state = get();
    const plan = state.getSelectedPlan();
    if (!plan) return;

    const timeline = generateDefaultTimeline(plan);
    const updatedPlan = { ...plan, timeline };

    set({
      plans: state.plans.map(p => p.id === plan.id ? updatedPlan : p),
    });
  },

  addTimelineSegment: (segment) => {
    const state = get();
    const plan = state.getSelectedPlan();
    if (!plan || !plan.timeline) return;

    const newSegment: TimelineSegment = { ...segment, id: nextSegId() };
    const updatedTimeline: BanquetTimeline = {
      ...plan.timeline,
      segments: [...plan.timeline.segments, newSegment],
    };
    const updatedPlan = { ...plan, timeline: updatedTimeline };

    set({
      plans: state.plans.map(p => p.id === plan.id ? updatedPlan : p),
    });
  },

  updateTimelineSegment: (segmentId, updates) => {
    const state = get();
    const plan = state.getSelectedPlan();
    if (!plan || !plan.timeline) return;

    const updatedSegments = plan.timeline.segments.map(seg =>
      seg.id === segmentId ? { ...seg, ...updates } : seg
    );
    const updatedTimeline: BanquetTimeline = {
      ...plan.timeline,
      segments: updatedSegments,
    };
    const updatedPlan = { ...plan, timeline: updatedTimeline };

    set({
      plans: state.plans.map(p => p.id === plan.id ? updatedPlan : p),
    });
  },

  removeTimelineSegment: (segmentId) => {
    const state = get();
    const plan = state.getSelectedPlan();
    if (!plan || !plan.timeline) return;

    const updatedSegments = plan.timeline.segments.filter(seg => seg.id !== segmentId);
    const updatedTimeline: BanquetTimeline = {
      ...plan.timeline,
      segments: updatedSegments,
    };
    const updatedPlan = { ...plan, timeline: updatedTimeline };

    set({
      plans: state.plans.map(p => p.id === plan.id ? updatedPlan : p),
    });
  },

  moveTimelineSegment: (segmentId, direction) => {
    const state = get();
    const plan = state.getSelectedPlan();
    if (!plan || !plan.timeline) return;

    const segments = [...plan.timeline.segments];
    const idx = segments.findIndex(seg => seg.id === segmentId);
    if (idx === -1) return;

    const swapIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= segments.length) return;

    [segments[idx], segments[swapIdx]] = [segments[swapIdx], segments[idx]];

    const updatedTimeline: BanquetTimeline = {
      ...plan.timeline,
      segments,
    };
    const updatedPlan = { ...plan, timeline: updatedTimeline };

    set({
      plans: state.plans.map(p => p.id === plan.id ? updatedPlan : p),
    });
  },

  setTimelineStartTime: (hour, minute) => {
    const state = get();
    const plan = state.getSelectedPlan();
    if (!plan || !plan.timeline) return;

    const updatedTimeline: BanquetTimeline = {
      ...plan.timeline,
      startHour: Math.max(0, Math.min(23, hour)),
      startMinute: Math.max(0, Math.min(59, minute)),
    };
    const updatedPlan = { ...plan, timeline: updatedTimeline };

    set({
      plans: state.plans.map(p => p.id === plan.id ? updatedPlan : p),
    });
  },

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

    let timelineSection = '';
    if (plan.timeline && plan.timeline.segments.length > 0) {
      const times = computeSegmentTimes(plan.timeline);
      const startStr = `${String(plan.timeline.startHour).padStart(2, '0')}:${String(plan.timeline.startMinute).padStart(2, '0')}`;
      timelineSection = `
【宴会当天流程时间轴】
  开始时间: ${startStr}

${plan.timeline.segments.map((seg, i) => {
  const typeLabels: Record<TimelineSegmentType, string> = {
    welcome: '迎宾', opening: '开场', speech: '致辞', dish: '上菜',
    entertainment: '娱乐', lottery: '抽奖', farewell: '送客', custom: '自定义',
  };
  const lines = [`  ${times[i].startTime}-${times[i].endTime}  ${seg.label} (${seg.durationMinutes}分钟) [${typeLabels[seg.type]}]`];
  if (seg.note) lines.push(`    ${seg.note}`);
  return lines.join('\n');
}).join('\n\n')}
`;
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
${timelineSection}
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
