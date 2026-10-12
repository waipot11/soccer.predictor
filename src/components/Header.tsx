import React from 'react';
import { Sparkles } from 'lucide-react';

interface HeaderProps {
  activeTab: 'accumulator' | 'facebook' | 'performance';
  onTabChange: (tab: 'accumulator' | 'facebook' | 'performance') => void;
  onAnalyzeAI: () => void;
  isAnalyzing: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onTabChange,
  onAnalyzeAI,
  isAnalyzing,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Single text wordmark */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => onTabChange('accumulator')}
            className="text-lg font-bold tracking-tight text-white hover:text-emerald-400 transition-colors whitespace-nowrap shrink-0 text-left cursor-pointer"
          >
            KickAI 3-Fold Accumulator
          </button>
        </div>

        {/* Zone 2: 4-5 clean single-line text navigation links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium">
          <button
            onClick={() => onTabChange('accumulator')}
            className={`cursor-pointer whitespace-nowrap shrink-0 transition-colors pb-0.5 ${
              activeTab === 'accumulator'
                ? 'text-emerald-400 border-b-2 border-emerald-400 font-semibold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            ทีเด็ดสเต็ป 3 ดาว (Win ล้วนๆ &gt;@3.5)
          </button>

          <button
            onClick={() => onTabChange('facebook')}
            className={`cursor-pointer whitespace-nowrap shrink-0 transition-colors pb-0.5 ${
              activeTab === 'facebook'
                ? 'text-emerald-400 border-b-2 border-emerald-400 font-semibold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            ระบบโพสต์ Facebook ออโต้ (6 ชม.)
          </button>

          <button
            onClick={() => onTabChange('performance')}
            className={`cursor-pointer whitespace-nowrap shrink-0 transition-colors pb-0.5 ${
              activeTab === 'performance'
                ? 'text-emerald-400 border-b-2 border-emerald-400 font-semibold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            สถิติย้อนหลัง & ความแม่นยำ
          </button>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onAnalyzeAI}
            disabled={isAnalyzing}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 active:scale-[0.98] rounded-lg transition-all shadow-sm shadow-emerald-500/20 whitespace-nowrap shrink-0 cursor-pointer disabled:opacity-50"
          >
            <Sparkles className={`w-3.5 h-3.5 ${isAnalyzing ? 'animate-spin' : ''}`} />
            <span>{isAnalyzing ? 'กำลังประมวลผล AI...' : 'วิเคราะห์สถิติ AI สด'}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
