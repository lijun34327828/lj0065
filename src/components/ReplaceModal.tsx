import { useBanquetStore } from '@/store/useBanquetStore';
import type { BanquetStyle, Decoration, Entertainment, Cuisine, Souvenir } from '@/types/banquet';
import { X, Check, Plus } from 'lucide-react';

function formatPrice(price: number): string {
  return new Intl.NumberFormat('zh-CN', {
    style: 'currency',
    currency: 'CNY',
    minimumFractionDigits: 0,
  }).format(price);
}

const categoryTitles: Record<string, string> = {
  style: '选择宴会风格',
  decoration: '选择场地布置',
  entertainment: '选择娱乐项目',
  cuisine: '选择菜品套餐',
  souvenir: '选择伴手礼品',
};

export default function ReplaceModal() {
  const {
    replaceModal,
    closeReplaceModal,
    getReplaceOptions,
    replaceStyle,
    replaceDecoration,
    replaceEntertainment,
    addEntertainment,
    replaceCuisine,
    replaceSouvenir,
    getSelectedPlan,
  } = useBanquetStore();

  const { isOpen, category, entertainmentIndex } = replaceModal;
  const options = getReplaceOptions();
  const selectedPlan = getSelectedPlan();

  if (!isOpen || !category) return null;

  const isAddMode = category === 'entertainment' && entertainmentIndex === -1;

  const handleSelect = (option: any) => {
    switch (category) {
      case 'style':
        replaceStyle(option as BanquetStyle);
        break;
      case 'decoration':
        replaceDecoration(option as Decoration);
        break;
      case 'entertainment':
        if (isAddMode) {
          addEntertainment(option as Entertainment);
        } else if (entertainmentIndex !== null) {
          replaceEntertainment(option as Entertainment, entertainmentIndex);
        }
        break;
      case 'cuisine':
        replaceCuisine(option as Cuisine);
        break;
      case 'souvenir':
        replaceSouvenir(option as Souvenir);
        break;
    }
  };

  const isSelected = (option: any): boolean => {
    if (!selectedPlan) return false;

    switch (category) {
      case 'style':
        return selectedPlan.style.id === option.id;
      case 'decoration':
        return selectedPlan.decoration.id === option.id;
      case 'entertainment':
        return selectedPlan.entertainment.some(e => e.id === option.id);
      case 'cuisine':
        return selectedPlan.cuisine.id === option.id;
      case 'souvenir':
        return selectedPlan.souvenir.id === option.id;
      default:
        return false;
    }
  };

  const getPrice = (option: any): string => {
    switch (category) {
      case 'style':
        return `档次 ${'★'.repeat(option.priceLevel)}`;
      case 'decoration':
        return formatPrice(option.price);
      case 'entertainment':
        return formatPrice(option.price);
      case 'cuisine':
        return `${formatPrice(option.pricePerPerson)}/人`;
      case 'souvenir':
        return `${formatPrice(option.pricePerPiece)}/份`;
      default:
        return '';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-ink-900/50 backdrop-blur-sm animate-fade-in"
        onClick={closeReplaceModal}
      />

      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col animate-slide-up overflow-hidden">
        <div className="px-6 py-5 border-b border-gold-200/50 bg-gradient-to-r from-wine-50 to-ivory-50">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-2xl font-bold text-wine-800">
              {isAddMode ? '添加娱乐项目' : categoryTitles[category] || '选择项目'}
            </h2>
            <button
              onClick={closeReplaceModal}
              className="p-2 rounded-lg hover:bg-wine-100 text-ink-400 hover:text-wine-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <p className="text-sm text-ink-500 mt-1">
            点击选择您想要{isAddMode ? '添加' : '替换'}的项目
          </p>
        </div>

        <div className="flex-1 overflow-y-auto p-6 scrollbar-thin-gold">
          <div className="grid grid-cols-2 gap-4">
            {options.map((option: any, index: number) => {
              const selected = isSelected(option);

              return (
                <button
                  key={option.id}
                  onClick={() => handleSelect(option)}
                  className={`relative p-4 rounded-xl border-2 text-left transition-all duration-300 group ${
                    selected
                      ? 'border-gold-500 bg-gradient-to-br from-gold-50 to-white shadow-gold'
                      : 'border-gold-200/50 bg-white hover:border-gold-300 hover:shadow-md'
                  }`}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  {(selected || (isAddMode && selected)) && (
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-gold-500 rounded-full flex items-center justify-center shadow-md z-10">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                  )}

                  {isAddMode && !selected && (
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-wine-500 rounded-full flex items-center justify-center shadow-md z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Plus className="w-4 h-4 text-white" />
                    </div>
                  )}

                  <h3 className={`font-semibold mb-1 ${
                    selected ? 'text-wine-800' : 'text-ink-600 group-hover:text-wine-700'
                  }`}>
                    {option.name}
                  </h3>
                  <p className="text-sm text-ink-400 line-clamp-2 mb-2">
                    {option.description}
                  </p>
                  <p className="text-sm font-bold text-gold-600">
                    {getPrice(option)}
                  </p>

                  {option.duration && (
                    <p className="text-xs text-ink-400 mt-1">
                      时长: {option.duration}
                    </p>
                  )}
                  {option.cuisineType && (
                    <span className="inline-block mt-1 px-2 py-0.5 bg-wine-100 text-wine-700 text-xs rounded-full">
                      {option.cuisineType}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <div className="px-6 py-4 border-t border-gold-200/50 bg-ivory-50/50">
          <button
            onClick={closeReplaceModal}
            className="w-full py-3 rounded-xl border-2 border-gold-300 text-wine-700 font-semibold hover:bg-gold-50 transition-colors"
          >
            取消
          </button>
        </div>
      </div>
    </div>
  );
}
