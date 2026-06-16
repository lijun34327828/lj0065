export type ScaleType = 'small' | 'medium' | 'large' | 'grand';
export type VenueType = 'hotel' | 'outdoor' | 'restaurant' | 'villa' | 'exhibition';
export type CrowdType = 'wedding' | 'business' | 'birthday' | 'family' | 'friend';
export type BudgetType = 'economy' | 'standard' | 'premium' | 'luxury';

export interface BanquetParams {
  scale: ScaleType | null;
  venue: VenueType | null;
  crowd: CrowdType | null;
  budget: BudgetType | null;
}

export interface BanquetStyle {
  id: string;
  name: string;
  description: string;
  keywords: string[];
  priceLevel: number;
}

export interface Decoration {
  id: string;
  name: string;
  description: string;
  price: number;
  suitableVenues: VenueType[];
  styleTags: string[];
}

export interface Entertainment {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: string;
  suitableCrowds: CrowdType[];
}

export interface Cuisine {
  id: string;
  name: string;
  description: string;
  pricePerPerson: number;
  cuisineType: string;
  level: BudgetType;
  suitableCrowds: CrowdType[];
}

export interface Souvenir {
  id: string;
  name: string;
  description: string;
  pricePerPiece: number;
  level: BudgetType;
  suitableCrowds: CrowdType[];
}

export interface BudgetBreakdown {
  venue: number;
  decoration: number;
  entertainment: number;
  cuisine: number;
  souvenir: number;
  service: number;
}

export interface BanquetPlan {
  id: string;
  name: string;
  style: BanquetStyle;
  decoration: Decoration;
  entertainment: Entertainment[];
  cuisine: Cuisine;
  souvenir: Souvenir;
  totalBudget: number;
  breakdown: BudgetBreakdown;
  matchScore: number;
  guestCount: number;
}

export interface ParamOption {
  id: string;
  label: string;
  description: string;
  icon: string;
}

export type ReplaceCategory = 'style' | 'decoration' | 'entertainment' | 'cuisine' | 'souvenir';
