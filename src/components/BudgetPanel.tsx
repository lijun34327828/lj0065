import { useBanquetStore } from '@/store/useBanquetStore';
import {
  Wallet,
  Building2,
  Flower2,
  Music,
  Utensils,
  Gift,
  BadgeDollarSign,
  Maximize2,
  Download,
} from 'lucide-react';

function formatPrice(price: number): string {
  return new Intl.NumberFormat('zh-CN', {
    style: 'currency',
    currency: 'CNY',
    minimumFractionDigits: 0,
  }).format(price);
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

export default function BudgetPanel() {
  const { getSelectedPlan, plans, exportPlan, openDetailModal } = useBanquetStore();
  const selectedPlan = getSelectedPlan();

  if (plans.length === 0 || !selectedPlan) {
    return null;
  }

  const { breakdown, totalBudget } = selectedPlan;
  const items = [
    { icon: Building2, label: '场地费用', amount: breakdown.venue, color: 'bg-wine-500' },
    { icon: Flower2, label: '场地布置', amount: breakdown.decoration, color: 'bg-pink-500' },
    { icon: Music, label: '娱乐项目', amount: breakdown.entertainment, color: 'bg-purple-500' },
    { icon: Utensils, label: '餐饮费用', amount: breakdown.cuisine, color: 'bg-amber-500' },
    { icon: Gift, label: '伴手礼品', amount: breakdown.souvenir, color: 'bg-teal-500' },
    { icon: BadgeDollarSign, label: '服务费', amount: breakdown.service, color: 'bg-slate-500' },
  ];

  return (
    <div className="fixed bottom-0 left-80 right-0 bg-white/95 backdrop-blur-md border-t border-gold-200/50 shadow-[0_-4px_20px_-4px_rgba(114,47,55,0.1)] z-20">
      <div className="max-w-5xl mx-auto px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
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

          <div className="flex items-center gap-6">
            {items.slice(0, 4).map((item, index) => (
              <BudgetItem
                key={index}
                icon={item.icon}
                label={item.label}
                amount={item.amount}
                color={item.color}
              />
            ))}
          </div>

          <button
            onClick={exportPlan}
            className="btn-gold px-8 py-3 text-base flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            导出方案
          </button>
        </div>
      </div>
    </div>
  );
}
