import React from 'react';
import { Sparkles, Dices, Award } from 'lucide-react';

interface HeaderProps {
  activeTab: 'accumulator' | 'live' | 'facebook' | 'performance';
  onTabChange: (tab: 'accumulator' | 'live' | 'facebook' | 'performance') => void;
  onAnalyzeAI: () => void;
  onRandomPick?: () => void;
  isAnalyzing: boolean;
  isRandomPicking?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onTabChange,
  onAnalyzeAI,
  onRandomPick,
  isAnalyzing,
  isRandomPicking = false,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-950/95 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-6">
        {/* Zone 1: Wordmark */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => onTabChange('accumulator')}
            className="flex items-center gap-2 text-left cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 to-amber-400 flex items-center justify-center text-slate-950 shadow-md shadow-amber-500/20 group-hover:scale-105 transition-transform">
              <Award className="w-5 h-5 text-slate-950" />
            </div>
            <div>
              <span className="text-base font-extrabold tracking-tight text-white group-hover:text-amber-400 transition-colors">
                KickAI ซูเปอร์โกลเด้นสลิป <span className="text-slate-950 text-xs px-1.5 py-0.5 rounded bg-amber-400 font-black ml-1">100-SOURCE &gt;98%</span>
              </span>
              <p className="text-[10px] text-slate-400 leading-none">100 สถาบันสถิติสากลตรงกัน &gt;98.0%</p>
            </div>
          </button>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-xs sm:text-sm font-medium">
          <button
            onClick={() => onTabChange('accumulator')}
            className={`cursor-pointer whitespace-nowrap shrink-0 transition-colors pb-1 ${
              activeTab === 'accumulator'
                ? 'text-amber-400 border-b-2 border-amber-400 font-extrabold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            ⚖️ โพยเด็ด 1xBet HDP (98%+)
          </button>

          <button
            onClick={() => onTabChange('live')}
            className={`cursor-pointer whitespace-nowrap shrink-0 transition-colors pb-1 flex items-center gap-1.5 ${
              activeTab === 'live'
                ? 'text-rose-400 border-b-2 border-rose-400 font-extrabold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
            <span>📺 ช่อง LIVE สดกีฬา</span>
          </button>

          <button
            onClick={() => onTabChange('facebook')}
            className={`cursor-pointer whitespace-nowrap shrink-0 transition-colors pb-1 ${
              activeTab === 'facebook'
                ? 'text-sky-400 border-b-2 border-sky-400 font-extrabold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            ✈️ Telegram 06:30 &amp; Render.com
          </button>

          <button
            onClick={() => onTabChange('performance')}
            className={`cursor-pointer whitespace-nowrap shrink-0 transition-colors pb-1 ${
              activeTab === 'performance'
                ? 'text-amber-400 border-b-2 border-amber-400 font-extrabold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            📊 สถิติ 1 เดือน (X2/HDP/Over/CS)
          </button>
        </nav>

        {/* Zone 3: Actions */}
        <div className="flex items-center gap-2.5 shrink-0">
          {onRandomPick && (
            <button
              onClick={onRandomPick}
              disabled={isRandomPicking}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-black text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-all cursor-pointer disabled:opacity-50 shadow-md shadow-amber-500/20"
              title="สุ่มคู่ซูเปอร์โกลเด้นสลิปที่ผ่านเกณฑ์ 1xBet HDP + ฉันทามติ 100 สถาบันเกิน 98.0%"
            >
              <Dices className={`w-3.5 h-3.5 text-slate-950 ${isRandomPicking ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">สุ่มคู่ 1xBet (&gt;98%)</span>
              <span className="sm:hidden">สุ่ม 1xBet</span>
            </button>
          )}

          <button
            onClick={onAnalyzeAI}
            disabled={isAnalyzing}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 active:scale-[0.98] rounded-lg transition-all shadow-sm shadow-emerald-500/20 whitespace-nowrap shrink-0 cursor-pointer disabled:opacity-50"
          >
            <Sparkles className={`w-3.5 h-3.5 ${isAnalyzing ? 'animate-spin' : ''}`} />
            <span>{isAnalyzing ? 'กำลังประมวลผล...' : 'คำนวณฉันทามติ AI'}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
