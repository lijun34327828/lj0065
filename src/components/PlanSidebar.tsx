import { useBanquetStore } from '@/store/useBanquetStore';
import { Sparkles, Check, TrendingUp } from 'lucide-react';

function formatPrice(price: number): string {
  return new Intl.NumberFormat('zh-CN', {
    style: 'currency',
    currency: 'CNY',
    minimumFractionDigits: 0,
  }).format(price);
}

export default function PlanSidebar() {
  const { plans, selectedPlanId, selectPlan, isGenerating } = useBanquetStore();

  if (isGenerating) {
    return (
      <div className="w-80 bg-ivory-50/90 backdrop-blur-sm border-r border-gold-200/50 p-6">
        <h2 className="font-display text-xl font-semibold text-wine-800 mb-6 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-gold-500" />
          方案列表
        </h2>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="p-4 rounded-xl bg-white/60 border border-gold-200/30 animate-pulse-soft"
              style={{ animationDelay: `${i * 200}ms` }}
            >
              <div className="h-5 bg-gold-100 rounded w-3/4 mb-2" />
              <div className="h-4 bg-gold-50 rounded w-1/2 mb-3" />
              <div className="h-6 bg-wine-100 rounded w-2/3" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (plans.length === 0) {
    return (
      <div className="w-80 bg-ivory-50/90 backdrop-blur-sm border-r border-gold-200/50 p-6">
        <h2 className="font-display text-xl font-semibold text-wine-800 mb-6 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-gold-500" />
          方案列表
        </h2>
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="w-16 h-16 rounded-full bg-gold-100 flex items-center justify-center mb-4">
            <Sparkles className="w-8 h-8 text-gold-400" />
          </div>
          <p className="text-ink-500 text-sm">选择参数后</p>
          <p className="text-ink-500 text-sm">AI 将为您生成专属方案</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-80 bg-ivory-50/90 backdrop-blur-sm border-r border-gold-200/50 p-6 overflow-y-auto scrollbar-thin-gold">
      <h2 className="font-display text-xl font-semibold text-wine-800 mb-6 flex items-center gap-2">
        <Sparkles className="w-5 h-5 text-gold-500" />
        方案列表
        <span className="ml-auto text-sm font-normal text-ink-400">
          共 {plans.length} 套
        </span>
      </h2>

      <div className="space-y-4">
        {plans.map((plan, index) => {
          const isSelected = plan.id === selectedPlanId;

          return (
            <button
              key={plan.id}
              onClick={() => selectPlan(plan.id)}
              className={`w-full text-left p-5 rounded-xl transition-all duration-300 relative overflow-hidden group animate-slide-up ${
                isSelected
                  ? 'bg-gradient-to-br from-wine-50 to-white border-2 border-gold-500 shadow-gold'
                  : 'bg-white/60 border border-gold-200/30 hover:border-gold-300 hover:bg-white hover:shadow-md'
              }`}
              style={{ animationDelay: `${index * 100}ms`, opacity: 0 }}
            >
              {isSelected && (
                <div className="absolute top-3 right-3 w-6 h-6 bg-gold-500 rounded-full flex items-center justify-center shadow-md">
                  <Check className="w-4 h-4 text-white" />
                </div>
              )}

              {index === 0 && (
                <div className="absolute top-3 left-3">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-gradient-to-r from-gold-500 to-gold-600 text-white text-xs font-bold rounded-full">
                    <TrendingUp className="w-3 h-3" />
                    推荐
                  </span>
                </div>
              )}

              <div className={index === 0 ? 'mt-5' : 'mt-0'}>
                <h3 className={`font-bold text-lg mb-1 ${
                  isSelected ? 'text-wine-800' : 'text-ink-600 group-hover:text-wine-700'
                }`}>
                  {plan.name}
                </h3>
                <p className="text-sm text-ink-400 mb-3">
                  {plan.style.name} · {plan.cuisine.cuisineType}
                </p>

                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-xs text-ink-400 mb-0.5">预估总价</p>
                    <p className={`text-2xl font-bold ${
                      isSelected ? 'text-wine-700' : 'text-gold-600'
                    }`}>
                      {formatPrice(plan.totalBudget)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-ink-400 mb-0.5">匹配度</p>
                    <div className="flex items-center gap-1">
                      <div className="w-16 h-2 bg-gold-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-gold-400 to-gold-600 rounded-full transition-all duration-500"
                          style={{ width: `${plan.matchScore}%` }}
                        />
                      </div>
                      <span className="text-sm font-semibold text-gold-600">
                        {plan.matchScore}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {isSelected && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-gold-400 via-gold-500 to-gold-400" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
