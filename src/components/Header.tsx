import { Sparkles, Cpu, Layers } from 'lucide-react';

export default function Header() {
  return (
    <header className="bg-gradient-to-r from-wine-800 via-wine-700 to-wine-800 text-white py-4 px-8 shadow-lg relative overflow-hidden">
      <div className="absolute inset-0 bg-texture opacity-30" />
      <div className="absolute top-0 left-1/4 w-64 h-64 bg-gold-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-48 h-48 bg-gold-400/10 rounded-full blur-2xl" />

      <div className="relative z-10 max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center shadow-gold">
            <Sparkles className="w-6 h-6 text-wine-900" />
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold tracking-wide">
              <span className="text-gold-gradient">宴会策划</span>
              <span className="text-white"> · 语义匹配 AI</span>
            </h1>
            <p className="text-sm text-wine-200 mt-0.5">智能方案搭配 · 一键生成专属宴会方案</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full backdrop-blur-sm border border-gold-400/30">
            <Cpu className="w-4 h-4 text-gold-400" />
            <span className="text-sm text-wine-100">8825 算力支持</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full backdrop-blur-sm border border-gold-400/30">
            <Layers className="w-4 h-4 text-gold-400" />
            <span className="text-sm text-wine-100">3825 可视化编辑</span>
          </div>
        </div>
      </div>
    </header>
  );
}
