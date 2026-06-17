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
  Wallet,
  Building2,
  BadgeDollarSign,
  Download,
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

interface BudgetItemProps {
  icon: any;
  label: string;
  amount: number;
  color: string;
}

function BudgetItem({ icon: Icon, label, amount, color }: BudgetItemProps) {
  return (
    <div className="flex items-center gap-3">
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${color}`}>
        <Icon className="w-4 h-4 text-white" />
      </div>
      <div className="flex-1">
        <p className="text-sm text-ink-500">{label}</p>
      </div>
      <p className="font-semibold text-ink-700">{formatPrice(amount)}</p>
    </div>
  );
}

export default function PlanDetailModal() {
  const {
    detailModalOpen,
    closeDetailModal,
    getSelectedPlan,
    openReplaceModal,
    removeEntertainment,
    exportPlan,
    plans,
  } = useBanquetStore();

  const selectedPlan = getSelectedPlan();

  if (!detailModalOpen) return null;

  if (plans.length === 0 || !selectedPlan) {
    return null;
  }

  const { breakdown, totalBudget } = selectedPlan;
  const budgetItems = [
    { icon: Building2, label: '场地费用', amount: breakdown.venue, color: 'bg-wine-500' },
    { icon: Flower2, label: '场地布置', amount: breakdown.decoration, color: 'bg-pink-500' },
    { icon: Music, label: '娱乐项目', amount: breakdown.entertainment, color: 'bg-purple-500' },
    { icon: Utensils, label: '餐饮费用', amount: breakdown.cuisine, color: 'bg-amber-500' },
    { icon: Gift, label: '伴手礼品', amount: breakdown.souvenir, color: 'bg-teal-500' },
    { icon: BadgeDollarSign, label: '服务费', amount: breakdown.service, color: 'bg-slate-500' },
  ];

  const handleReplace = (category: ReplaceCategory, entertainmentIndex?: number) => {
    openReplaceModal(category, entertainmentIndex);
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-ivory-100 animate-fade-in">
      <div className="flex-shrink-0 bg-white/95 backdrop-blur-md border-b border-gold-200/50 shadow-md">
        <div className="max-w-6xl mx-auto px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-wine-500 to-wine-700 flex items-center justify-center shadow-md">
                <Maximize2 className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="font-display text-2xl font-bold text-wine-800">
                  方案详情
                </h2>
                <p className="text-sm text-ink-400">全屏查看完整方案，无遮挡浏览</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={exportPlan}
                className="btn-gold px-6 py-2.5 text-sm flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                导出方案
              </button>
              <button
                onClick={closeDetailModal}
                className="p-2.5 rounded-xl border-2 border-gold-200 text-ink-500 hover:border-wine-300 hover:text-wine-600 hover:bg-wine-50 transition-all"
                title="关闭"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        <div className="h-full overflow-y-auto scrollbar-thin-gold bg-texture">
          <div className="max-w-6xl mx-auto px-8 py-8">
            <div className="mb-8 animate-fade-in">
              <div className="flex items-end justify-between mb-3">
                <h1 className="font-display text-4xl font-bold text-wine-800">
                  {selectedPlan.name}
                </h1>
                <div className="text-right">
                  <p className="text-sm text-ink-400 mb-1">预计总预算</p>
                  <p className="text-4xl font-bold text-gold-600">
                    {formatPrice(selectedPlan.totalBudget)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-6 text-base text-ink-500">
                <span className="flex items-center gap-1.5">
                  <Users className="w-5 h-5" />
                  {selectedPlan.guestCount} 位宾客
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-gold-500" />
                  匹配度 {selectedPlan.matchScore}%
                </span>
              </div>
              <div className="divider-gold mt-6" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-4">
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

                <div className="h-8" />
              </div>

              <div className="lg:col-span-1">
                <div className="sticky top-6 space-y-4">
                  <div className="bg-white rounded-2xl border border-gold-200/50 shadow-lg overflow-hidden">
                    <div className="px-6 py-5 bg-gradient-to-br from-gold-50 to-ivory-50 border-b border-gold-200/30">
                      <div className="flex items-center gap-3 mb-1">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center shadow-gold">
                          <Wallet className="w-5 h-5 text-wine-900" />
                        </div>
                        <div>
                          <p className="text-sm text-ink-400">预算总览</p>
                          <p className="text-2xl font-bold text-wine-800 font-display">
                            {formatPrice(totalBudget)}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="p-5 space-y-3">
                      {budgetItems.map((item, index) => (
                        <BudgetItem
                          key={index}
                          icon={item.icon}
                          label={item.label}
                          amount={item.amount}
                          color={item.color}
                        />
                      ))}
                    </div>
                    <div className="px-5 py-4 border-t border-gold-200/30 bg-ivory-50/50">
                      <button
                        onClick={exportPlan}
                        className="w-full btn-gold py-3 text-base flex items-center justify-center gap-2"
                      >
                        <Download className="w-4 h-4" />
                        导出方案
                      </button>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-wine-50 to-ivory-50 rounded-2xl border border-wine-200/40 p-5">
                    <h4 className="font-semibold text-wine-800 mb-3 flex items-center gap-2">
                      <Maximize2 className="w-4 h-4" />
                      全屏视图优势
                    </h4>
                    <ul className="text-sm text-ink-500 space-y-2">
                      <li className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-gold-500 mt-1.5 flex-shrink-0" />
                        无遮挡浏览完整方案内容
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-gold-500 mt-1.5 flex-shrink-0" />
                        预算面板悬浮侧边，随时可见
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-gold-500 mt-1.5 flex-shrink-0" />
                        支持一键导出完整方案
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
