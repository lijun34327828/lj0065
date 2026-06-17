import { useState } from 'react';
import { useBanquetStore } from '@/store/useBanquetStore';
import {
  Palette,
  Flower2,
  Music,
  Utensils,
  Gift,
  ChevronDown,
  ChevronUp,
  Edit3,
  Plus,
  X,
  Users,
  Clock,
  Maximize2,
} from 'lucide-react';
import type { ReplaceCategory } from '@/types/banquet';

function formatPrice(price: number): string {
  return new Intl.NumberFormat('zh-CN', {
    style: 'currency',
    currency: 'CNY',
    minimumFractionDigits: 0,
  }).format(price);
}

interface SectionProps {
  title: string;
  icon: any;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

function Section({ title, icon: Icon, children, defaultOpen = true }: SectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="bg-white/70 rounded-xl border border-gold-200/40 overflow-hidden transition-all duration-300">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-5 py-4 flex items-center justify-between hover:bg-gold-50/50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-wine-500 to-wine-700 flex items-center justify-center text-white">
            <Icon className="w-5 h-5" />
          </div>
          <h3 className="font-semibold text-lg text-ink-600">{title}</h3>
        </div>
        {isOpen ? (
          <ChevronUp className="w-5 h-5 text-ink-400" />
        ) : (
          <ChevronDown className="w-5 h-5 text-ink-400" />
        )}
      </button>

      <div
        className={`transition-all duration-300 overflow-hidden ${
          isOpen ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="px-5 pb-5">{children}</div>
      </div>
    </div>
  );
}

interface ItemCardProps {
  name: string;
  description: string;
  price?: string;
  extra?: React.ReactNode;
  onReplace?: () => void;
  onRemove?: () => void;
  showReplace?: boolean;
  showRemove?: boolean;
}

function ItemCard({ name, description, price, extra, onReplace, onRemove, showReplace = true, showRemove = false }: ItemCardProps) {
  return (
    <div className="relative p-4 bg-gradient-to-br from-ivory-50 to-white rounded-lg border border-gold-200/50 group hover:border-gold-300 hover:shadow-md transition-all duration-300">
      <div className="flex items-start justify-between">
        <div className="flex-1 pr-8">
          <h4 className="font-semibold text-wine-800 mb-1">{name}</h4>
          <p className="text-sm text-ink-500">{description}</p>
          {extra}
        </div>
        {price && (
          <p className="text-lg font-bold text-gold-600 whitespace-nowrap">{price}</p>
        )}
      </div>

      <div className="absolute top-3 right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        {showReplace && (
          <button
            onClick={onReplace}
            className="p-1.5 rounded-lg bg-wine-100 text-wine-600 hover:bg-wine-200 transition-colors"
            title="替换"
          >
            <Edit3 className="w-3.5 h-3.5" />
          </button>
        )}
        {showRemove && (
          <button
            onClick={onRemove}
            className="p-1.5 rounded-lg bg-red-100 text-red-500 hover:bg-red-200 transition-colors"
            title="移除"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
}

export default function PlanDetail() {
  const { getSelectedPlan, openReplaceModal, addEntertainment, removeEntertainment, isGenerating, plans, openDetailModal } = useBanquetStore();
  const selectedPlan = getSelectedPlan();

  if (isGenerating) {
    return (
      <div className="flex-1 p-8 overflow-y-auto scrollbar-thin-gold">
        <div className="max-w-3xl mx-auto space-y-6">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="h-32 bg-white/60 rounded-xl border border-gold-200/30 animate-pulse-soft"
              style={{ animationDelay: `${i * 150}ms` }}
            />
          ))}
        </div>
      </div>
    );
  }

  if (plans.length === 0 || !selectedPlan) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gold-100 flex items-center justify-center">
            <Palette className="w-12 h-12 text-gold-400" />
          </div>
          <h3 className="text-xl font-semibold text-ink-500 mb-2">等待生成方案</h3>
          <p className="text-ink-400">请先在左侧选择宴会参数</p>
          <p className="text-ink-400">点击「AI 智能匹配方案」按钮</p>
        </div>
      </div>
    );
  }

  const handleReplace = (category: ReplaceCategory, entertainmentIndex?: number) => {
    openReplaceModal(category, entertainmentIndex);
  };

  return (
    <div className="flex-1 p-8 pb-56 overflow-y-auto scrollbar-thin-gold bg-texture">
      <div className="max-w-3xl mx-auto">
        <div className="mb-6 animate-fade-in">
          <div className="flex items-end justify-between mb-2">
            <div className="flex items-center gap-3">
              <h2 className="font-display text-3xl font-bold text-wine-800">
                {selectedPlan.name}
              </h2>
              <button
                onClick={openDetailModal}
                className="p-2 rounded-lg bg-wine-50 text-wine-600 hover:bg-wine-100 transition-colors border border-wine-200/50"
                title="全屏查看详情"
              >
                <Maximize2 className="w-4 h-4" />
              </button>
            </div>
            <div className="text-right">
              <p className="text-sm text-ink-400 mb-1">预计总预算</p>
              <p className="text-3xl font-bold text-gold-600">
                {formatPrice(selectedPlan.totalBudget)}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4 text-sm text-ink-500">
            <span className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              {selectedPlan.guestCount} 位宾客
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-gold-500" />
              匹配度 {selectedPlan.matchScore}%
            </span>
          </div>
          <div className="divider-gold mt-4" />
        </div>

        <div className="space-y-4">
          <Section title="宴会风格" icon={Palette}>
            <ItemCard
              name={selectedPlan.style.name}
              description={selectedPlan.style.description}
              onReplace={() => handleReplace('style')}
            />
          </Section>

          <Section title="场地布置" icon={Flower2}>
            <ItemCard
              name={selectedPlan.decoration.name}
              description={selectedPlan.decoration.description}
              price={formatPrice(selectedPlan.decoration.price)}
              onReplace={() => handleReplace('decoration')}
            />
          </Section>

          <Section title="娱乐项目" icon={Music}>
            <div className="space-y-3">
              {selectedPlan.entertainment.map((item, index) => (
                <ItemCard
                  key={item.id}
                  name={item.name}
                  description={item.description}
                  price={formatPrice(item.price)}
                  extra={
                    <div className="flex items-center gap-2 mt-2 text-xs text-ink-400">
                      <Clock className="w-3.5 h-3.5" />
                      <span>时长: {item.duration}</span>
                    </div>
                  }
                  onReplace={() => handleReplace('entertainment', index)}
                  onRemove={() => removeEntertainment(index)}
                  showRemove={selectedPlan.entertainment.length > 1}
                />
              ))}
              <button
                onClick={() => handleReplace('entertainment', -1)}
                className="w-full py-3 border-2 border-dashed border-gold-300 rounded-lg text-gold-600 hover:border-gold-500 hover:bg-gold-50/50 transition-all flex items-center justify-center gap-2 group"
              >
                <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
                <span className="font-medium">添加娱乐项目</span>
              </button>
            </div>
          </Section>

          <Section title="菜品套餐" icon={Utensils}>
            <ItemCard
              name={selectedPlan.cuisine.name}
              description={selectedPlan.cuisine.description}
              price={`${formatPrice(selectedPlan.cuisine.pricePerPerson)}/人`}
              extra={
                <div className="mt-2">
                  <span className="inline-block px-2 py-0.5 bg-wine-100 text-wine-700 text-xs rounded-full">
                    {selectedPlan.cuisine.cuisineType}
                  </span>
                  <span className="ml-2 text-xs text-ink-400">
                    总计: {formatPrice(selectedPlan.breakdown.cuisine)}
                  </span>
                </div>
              }
              onReplace={() => handleReplace('cuisine')}
            />
          </Section>

          <Section title="伴手礼品" icon={Gift}>
            <ItemCard
              name={selectedPlan.souvenir.name}
              description={selectedPlan.souvenir.description}
              price={`${formatPrice(selectedPlan.souvenir.pricePerPiece)}/份`}
              extra={
                <div className="mt-2">
                  <span className="text-xs text-ink-400">
                    {selectedPlan.guestCount} 份 · 总计: {formatPrice(selectedPlan.breakdown.souvenir)}
                  </span>
                </div>
              }
              onReplace={() => handleReplace('souvenir')}
            />
          </Section>
        </div>
      </div>
    </div>
  );
}
