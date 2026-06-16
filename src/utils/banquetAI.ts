import type {
  BanquetParams,
  BanquetPlan,
  BanquetStyle,
  Decoration,
  Entertainment,
  Cuisine,
  Souvenir,
  BudgetBreakdown,
} from '@/types/banquet';
import { banquetStyles } from '@/data/styles';
import { decorations } from '@/data/decorations';
import { entertainmentOptions } from '@/data/entertainment';
import { cuisines } from '@/data/cuisines';
import { souvenirs } from '@/data/souvenirs';
import { guestCountMap, venueBasePriceMap } from '@/data/params';

const styleCrowdMap: Record<string, string[]> = {
  'classical-chinese': ['wedding', 'family', 'business'],
  'modern-minimalist': ['business', 'friend', 'birthday'],
  'romantic-western': ['wedding', 'friend', 'birthday'],
  'forest-natural': ['wedding', 'friend', 'birthday'],
  'luxury-palace': ['wedding', 'business', 'family'],
  'vintage-retro': ['birthday', 'friend', 'family'],
  'ocean-fresh': ['birthday', 'friend', 'wedding'],
  'star-night': ['wedding', 'birthday', 'friend'],
};

const styleBudgetMap: Record<string, number[]> = {
  'classical-chinese': [2, 3, 4],
  'modern-minimalist': [1, 2, 3],
  'romantic-western': [2, 3, 4],
  'forest-natural': [1, 2, 3],
  'luxury-palace': [3, 4],
  'vintage-retro': [1, 2, 3],
  'ocean-fresh': [1, 2, 3],
  'star-night': [2, 3, 4],
};

function scoreStyle(style: BanquetStyle, params: BanquetParams): number {
  let score = 50;

  if (params.crowd) {
    const suitableCrowds = styleCrowdMap[style.id] || [];
    if (suitableCrowds.includes(params.crowd)) {
      score += 25;
    } else {
      score -= 15;
    }
  }

  if (params.budget) {
    const budgetLevels: Record<string, number> = {
      economy: 1,
      standard: 2,
      premium: 3,
      luxury: 4,
    };
    const currentLevel = budgetLevels[params.budget];
    const suitableLevels = styleBudgetMap[style.id] || [];
    if (suitableLevels.includes(currentLevel)) {
      score += 20;
    } else {
      score -= 10;
    }
  }

  if (params.scale === 'grand' && style.priceLevel >= 3) {
    score += 10;
  }
  if (params.scale === 'small' && style.priceLevel <= 2) {
    score += 5;
  }

  return Math.max(0, Math.min(100, score));
}

function scoreDecoration(decoration: Decoration, params: BanquetParams): number {
  let score = 50;

  if (params.venue) {
    if (decoration.suitableVenues.includes(params.venue)) {
      score += 25;
    } else {
      score -= 20;
    }
  }

  if (params.budget) {
    const budgetLevels: Record<string, number> = {
      economy: 1,
      standard: 2,
      premium: 3,
      luxury: 4,
    };
    const currentLevel = budgetLevels[params.budget];
    const decorPriceTier = decoration.price < 8000 ? 1 : decoration.price < 15000 ? 2 : decoration.price < 20000 ? 3 : 4;
    const diff = Math.abs(currentLevel - decorPriceTier);
    score += (3 - diff) * 8;
  }

  return Math.max(0, Math.min(100, score));
}

function scoreEntertainment(item: Entertainment, params: BanquetParams): number {
  let score = 50;

  if (params.crowd) {
    if (item.suitableCrowds.includes(params.crowd)) {
      score += 30;
    } else {
      score -= 15;
    }
  }

  if (params.scale) {
    const scaleOrder = ['small', 'medium', 'large', 'grand'];
    const scaleIndex = scaleOrder.indexOf(params.scale);
    const priceTier = item.price < 3000 ? 1 : item.price < 7000 ? 2 : item.price < 12000 ? 3 : 4;
    const diff = Math.abs(scaleIndex + 1 - priceTier);
    score += (3 - diff) * 5;
  }

  return Math.max(0, Math.min(100, score));
}

function scoreCuisine(cuisine: Cuisine, params: BanquetParams): number {
  let score = 50;

  if (params.crowd) {
    if (cuisine.suitableCrowds.includes(params.crowd)) {
      score += 25;
    } else {
      score -= 20;
    }
  }

  if (params.budget) {
    const budgetOrder = ['economy', 'standard', 'premium', 'luxury'];
    const budgetIndex = budgetOrder.indexOf(params.budget);
    const cuisineIndex = budgetOrder.indexOf(cuisine.level);
    const diff = Math.abs(budgetIndex - cuisineIndex);
    score += (3 - diff) * 12;
  }

  return Math.max(0, Math.min(100, score));
}

function scoreSouvenir(souvenir: Souvenir, params: BanquetParams): number {
  let score = 50;

  if (params.crowd) {
    if (souvenir.suitableCrowds.includes(params.crowd)) {
      score += 25;
    } else {
      score -= 20;
    }
  }

  if (params.budget) {
    const budgetOrder = ['economy', 'standard', 'premium', 'luxury'];
    const budgetIndex = budgetOrder.indexOf(params.budget);
    const souvenirIndex = budgetOrder.indexOf(souvenir.level);
    const diff = Math.abs(budgetIndex - souvenirIndex);
    score += (3 - diff) * 10;
  }

  return Math.max(0, Math.min(100, score));
}

function calculateTotalBudget(
  params: BanquetParams,
  decoration: Decoration,
  entertainment: Entertainment[],
  cuisine: Cuisine,
  souvenir: Souvenir
): { total: number; breakdown: BudgetBreakdown } {
  const guestCount = params.scale ? guestCountMap[params.scale] : 50;
  const venuePrice = params.venue ? venueBasePriceMap[params.venue] : 15000;
  const entertainmentPrice = entertainment.reduce((sum, e) => sum + e.price, 0);
  const cuisinePrice = cuisine.pricePerPerson * guestCount;
  const souvenirPrice = souvenir.pricePerPiece * guestCount;
  const serviceFee = (venuePrice + decoration.price + entertainmentPrice + cuisinePrice + souvenirPrice) * 0.1;

  const breakdown: BudgetBreakdown = {
    venue: venuePrice,
    decoration: decoration.price,
    entertainment: entertainmentPrice,
    cuisine: cuisinePrice,
    souvenir: souvenirPrice,
    service: Math.round(serviceFee),
  };

  const total = venuePrice + decoration.price + entertainmentPrice + cuisinePrice + souvenirPrice + serviceFee;

  return { total: Math.round(total), breakdown };
}

function generatePlan(
  id: string,
  name: string,
  params: BanquetParams,
  style: BanquetStyle,
  decoration: Decoration,
  entertainment: Entertainment[],
  cuisine: Cuisine,
  souvenir: Souvenir
): BanquetPlan {
  const { total, breakdown } = calculateTotalBudget(
    params,
    decoration,
    entertainment,
    cuisine,
    souvenir
  );

  const styleScore = scoreStyle(style, params);
  const decorScore = scoreDecoration(decoration, params);
  const cuisineScore = scoreCuisine(cuisine, params);
  const souvenirScore = scoreSouvenir(souvenir, params);
  const avgEntertainmentScore = entertainment.length > 0
    ? entertainment.reduce((sum, e) => sum + scoreEntertainment(e, params), 0) / entertainment.length
    : 50;

  const matchScore = Math.round(
    styleScore * 0.2 + decorScore * 0.2 + avgEntertainmentScore * 0.15 + cuisineScore * 0.25 + souvenirScore * 0.2
  );

  return {
    id,
    name,
    style,
    decoration,
    entertainment,
    cuisine,
    souvenir,
    totalBudget: total,
    breakdown,
    matchScore,
    guestCount: params.scale ? guestCountMap[params.scale] : 50,
  };
}

export function generateBanquetPlans(params: BanquetParams): BanquetPlan[] {
  if (!params.scale || !params.venue || !params.crowd || !params.budget) {
    return [];
  }

  const scoredStyles = banquetStyles
    .map(style => ({ style, score: scoreStyle(style, params) }))
    .sort((a, b) => b.score - a.score);

  const scoredDecorations = decorations
    .filter(d => d.suitableVenues.includes(params.venue!))
    .map(d => ({ decoration: d, score: scoreDecoration(d, params) }))
    .sort((a, b) => b.score - a.score);

  const scoredEntertainment = entertainmentOptions
    .map(e => ({ entertainment: e, score: scoreEntertainment(e, params) }))
    .sort((a, b) => b.score - a.score);

  const scoredCuisines = cuisines
    .map(c => ({ cuisine: c, score: scoreCuisine(c, params) }))
    .sort((a, b) => b.score - a.score);

  const scoredSouvenirs = souvenirs
    .map(s => ({ souvenir: s, score: scoreSouvenir(s, params) }))
    .sort((a, b) => b.score - a.score);

  const planVariants = [
    { styleIdx: 0, decorIdx: 0, cuisineIdx: 0, souvenirIdx: 0, entCount: 3, name: '臻选推荐方案' },
    { styleIdx: 1, decorIdx: 2, cuisineIdx: 1, souvenirIdx: 1, entCount: 2, name: '经典品质方案' },
    { styleIdx: 2, decorIdx: 1, cuisineIdx: 2, souvenirIdx: 2, entCount: 2, name: '创意特色方案' },
  ];

  const plans: BanquetPlan[] = [];

  planVariants.forEach((variant, idx) => {
    const style = scoredStyles[Math.min(variant.styleIdx, scoredStyles.length - 1)]?.style;
    const decoration = scoredDecorations[Math.min(variant.decorIdx, scoredDecorations.length - 1)]?.decoration;
    const cuisine = scoredCuisines[Math.min(variant.cuisineIdx, scoredCuisines.length - 1)]?.cuisine;
    const souvenir = scoredSouvenirs[Math.min(variant.souvenirIdx, scoredSouvenirs.length - 1)]?.souvenir;
    const entertainment = scoredEntertainment.slice(0, variant.entCount).map(e => e.entertainment);

    if (style && decoration && cuisine && souvenir && entertainment.length > 0) {
      plans.push(
        generatePlan(
          `plan-${idx + 1}`,
          variant.name,
          params,
          style,
          decoration,
          entertainment,
          cuisine,
          souvenir
        )
      );
    }
  });

  return plans.sort((a, b) => b.matchScore - a.matchScore);
}

export function recalculatePlanBudget(
  plan: BanquetPlan,
  params: BanquetParams
): BanquetPlan {
  const { total, breakdown } = calculateTotalBudget(
    params,
    plan.decoration,
    plan.entertainment,
    plan.cuisine,
    plan.souvenir
  );

  return {
    ...plan,
    totalBudget: total,
    breakdown,
  };
}
