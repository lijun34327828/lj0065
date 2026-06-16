import { useBanquetStore } from '@/store/useBanquetStore';
import { scaleOptions, venueOptions, crowdOptions, budgetOptions } from '@/data/params';
import type { ScaleType, VenueType, CrowdType, BudgetType } from '@/types/banquet';
import {
  Users,
  Crown,
  Building2,
  Trees,
  UtensilsCrossed,
  Home,
  LayoutGrid,
  Heart,
  Briefcase,
  Cake,
  Sparkles,
  Wallet,
  CreditCard,
  Gem,
} from 'lucide-react';

const iconMap: Record<string, any> = {
  Users,
  Crown,
  Building2,
  Trees,
  UtensilsCrossed,
  Home,
  LayoutGrid,
  Heart,
  Briefcase,
  Cake,
  Sparkles,
  Wallet,
  CreditCard,
  Gem,
};

interface ParamCardProps {
  id: string;
  label: string;
  description: string;
  iconName: string;
  isSelected: boolean;
  onClick: () => void;
  delay: number;
}

function ParamCard({ id, label, description, iconName, isSelected, onClick, delay }: ParamCardProps) {
  const IconComponent = iconMap[iconName] || Sparkles;

  return (
    <button
      onClick={onClick}
      className={`group relative p-4 rounded-xl border-2 transition-all duration-300 text-left animate-slide-up ${
        isSelected
          ? 'border-gold-500 bg-gradient-to-br from-gold-50 to-white shadow-gold scale-[1.02]'
          : 'border-gold-200/50 bg-white/60 hover:border-gold-300 hover:bg-white hover:shadow-md'
      }`}
      style={{ animationDelay: `${delay}ms`, opacity: 0 }}
    >
      {isSelected && (
        <div className="absolute -top-1 -right-1 w-5 h-5 bg-gold-500 rounded-full flex items-center justify-center shadow-md">
          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        </div>
      )}

      <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 transition-colors duration-300 ${
        isSelected ? 'bg-gold-500 text-wine-900' : 'bg-wine-50 text-wine-600 group-hover:bg-wine-100'
      }`}>
        <IconComponent className="w-5 h-5" />
      </div>

      <h3 className={`font-semibold text-base mb-1 transition-colors duration-300 ${
        isSelected ? 'text-wine-800' : 'text-ink-600 group-hover:text-wine-700'
      }`}>
        {label}
      </h3>
      <p className="text-sm text-ink-400">{description}</p>
    </button>
  );
}

interface ParamSectionProps {
  title: string;
  options: Record<string, any>;
  selected: string | null;
  onSelect: (value: any) => void;
  delayStart: number;
}

function ParamSection({ title, options, selected, onSelect, delayStart }: ParamSectionProps) {
  const optionEntries = Object.entries(options);

  return (
    <div className="mb-8">
      <h2 className="font-display text-xl font-semibold text-wine-800 mb-4 flex items-center gap-2">
        <span className="w-1 h-6 bg-gradient-to-b from-gold-400 to-gold-600 rounded-full" />
        {title}
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
        {optionEntries.map(([key, option], index) => (
          <ParamCard
            key={key}
            id={key}
            label={option.label}
            description={option.description}
            iconName={option.icon}
            isSelected={selected === key}
            onClick={() => onSelect(key)}
            delay={delayStart + index * 80}
          />
        ))}
      </div>
    </div>
  );
}

export default function ParamSelector() {
  const { params, setScale, setVenue, setCrowd, setBudget, generatePlans, isGenerating, plans } = useBanquetStore();

  const allSelected = params.scale && params.venue && params.crowd && params.budget;

  return (
    <div className="bg-ivory-50/80 backdrop-blur-sm rounded-2xl p-6 border border-gold-200/50 shadow-card">
      <ParamSection
        title="宴会规模"
        options={scaleOptions}
        selected={params.scale}
        onSelect={(v: ScaleType) => setScale(v)}
        delayStart={0}
      />

      <ParamSection
        title="举办场地"
        options={venueOptions}
        selected={params.venue}
        onSelect={(v: VenueType) => setVenue(v)}
        delayStart={100}
      />

      <ParamSection
        title="宾客人群"
        options={crowdOptions}
        selected={params.crowd}
        onSelect={(v: CrowdType) => setCrowd(v)}
        delayStart={200}
      />

      <ParamSection
        title="预算区间"
        options={budgetOptions}
        selected={params.budget}
        onSelect={(v: BudgetType) => setBudget(v)}
        delayStart={300}
      />

      <div className="pt-4">
        <button
          onClick={generatePlans}
          disabled={!allSelected || isGenerating}
          className={`w-full py-4 rounded-xl font-bold text-lg transition-all duration-500 relative overflow-hidden ${
            allSelected && !isGenerating
              ? 'bg-gradient-to-r from-wine-600 via-wine-700 to-wine-600 text-white hover:shadow-gold hover:scale-[1.01] cursor-pointer'
              : 'bg-ink-200 text-ink-400 cursor-not-allowed'
          }`}
        >
          {isGenerating ? (
            <span className="flex items-center justify-center gap-3">
              <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              AI 智能匹配中...
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2">
              <Sparkles className="w-5 h-5" />
              {plans.length > 0 ? '重新生成方案' : 'AI 智能匹配方案'}
            </span>
          )}

          {allSelected && !isGenerating && (
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
          )}
        </button>

        {!allSelected && (
          <p className="text-center text-sm text-ink-400 mt-3">
            请先选择以上四个维度的参数
          </p>
        )}
      </div>
    </div>
  );
}
