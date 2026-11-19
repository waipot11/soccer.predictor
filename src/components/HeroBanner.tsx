import React from 'react';
import { ArrowDown, Clock, ShieldCheck, Zap, Dices, Target, CheckCircle2, Award, Building2 } from 'lucide-react';
import { AccumulatorTicket, CorrectScoreTip } from '../types';

interface HeroBannerProps {
  accumulator: AccumulatorTicket;
  correctScoreTip: CorrectScoreTip | null;
  onScrollToSlip: () => void;
  onOpenFacebook: () => void;
  onOpenLive?: () => void;
  onRandomPick?: () => void;
  isRandomPicking?: boolean;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  accumulator,
  correctScoreTip,
  onScrollToSlip,
  onOpenFacebook,
  onOpenLive,
  onRandomPick,
  isRandomPicking = false,
}) => {
  const tip = correctScoreTip || accumulator.correctScoreTip;
  const match = tip?.selectedMatch;
  const mkt = tip?.marketRecommendations;
  const consensusRate = tip?.consensusAgreementRate || match?.consensusAgreementRate || 99.2;

  return (
    <div className="relative overflow-hidden border-b border-slate-800 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      {/* Background Graphic with Scrim */}
      <div className="absolute inset-0 opacity-20 pointer-events-none mix-blend-luminosity">
        <img
          src="/src/assets/images/football_tactical_hero_1791708490757.jpg"
          alt="Football Tactical Analysis Room"
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-transparent" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Main Hero Copy */}
          <div className="lg:col-span-8 space-y-5">
            {/* Metadata Badges */}
            <div className="flex items-center gap-2 text-xs font-medium text-emerald-400 flex-wrap">
              <span className="text-white font-bold bg-emerald-500/20 px-2.5 py-0.5 rounded border border-emerald-500/30 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                โหมดตารางแข่งจริง 100% · Render.com 24/7
              </span>
              <span className="text-amber-300 font-bold bg-amber-950/80 px-2.5 py-0.5 rounded border border-amber-500/30 flex items-center gap-1">
                <Award className="w-3.5 h-3.5 text-amber-400" />
                X2 สองโอกาส (Win Rate 90.0% สูงสุด #1 รอบ 1 เดือน)
              </span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span className="text-sky-300 font-bold">แจ้งเตือน Telegram 06:30 น.</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
              โพยเด็ดซูเปอร์โกลเด้นสลิป X2 <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-sky-300 to-amber-300">
                Double Chance 90% · Telegram &amp; Render.com
              </span>
            </h1>

            <p className="text-base text-slate-300 leading-relaxed max-w-2xl">
              อัปเกรดตามสถิติความน่าจะเป็นจริงรอบ 1 เดือนล่าสุด: ปรับโพยเด็ดหลักเป็น <strong className="text-emerald-300">X2 / 1X สองโอกาส (เข้าเป้าสูงสุด 90.0% · หลุดติดไม่เกิน 1 นัด)</strong> พร้อมทางเลือก <strong className="text-white">Asian Handicap (ROI +26.3%)</strong> และจัดส่งแจ้งเตือนคู่โกลด์เข้า <strong className="text-sky-300">Telegram Bot ทุก 06:30 น.</strong> บนเซิร์ฟเวอร์ <strong className="text-amber-300">Render.com</strong>
            </p>

            {/* Quick Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              {onRandomPick && (
                <button
                  onClick={onRandomPick}
                  disabled={isRandomPicking}
                  className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 active:scale-[0.98] rounded-lg transition-all shadow-lg shadow-amber-500/20 cursor-pointer whitespace-nowrap disabled:opacity-50"
                >
                  <Dices className={`w-4 h-4 ${isRandomPicking ? 'animate-spin' : ''}`} />
                  <span>{isRandomPicking ? 'กำลังสุ่มวิเคราะห์...' : '🎲 สุ่มคู่โกลด์ X2 ประจำวัน'}</span>
                </button>
              )}

              <button
                onClick={onScrollToSlip}
                className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 active:scale-[0.98] rounded-lg transition-all shadow-md shadow-emerald-500/20 cursor-pointer whitespace-nowrap"
              >
                <span>ตรวจโพย X2 &amp; สถิติ 100 สถาบัน</span>
                <ArrowDown className="w-4 h-4" />
              </button>

              {onOpenLive && (
                <button
                  onClick={onOpenLive}
                  className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-bold text-white bg-rose-600 hover:bg-rose-500 active:scale-[0.98] rounded-lg transition-all shadow-lg shadow-rose-600/30 cursor-pointer whitespace-nowrap border border-rose-400"
                >
                  <span className="w-2 h-2 rounded-full bg-white animate-ping"></span>
                  <span>📺 ดู LIVE สดกีฬา</span>
                </button>
              )}

              <button
                onClick={onOpenFacebook}
                className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-slate-800 hover:bg-slate-700 active:scale-[0.98] rounded-lg border border-slate-700 transition-all cursor-pointer whitespace-nowrap"
              >
                <Clock className="w-4 h-4 text-sky-400" />
                <span>บอท Telegram 06:30 &amp; Render.com</span>
              </button>
            </div>
          </div>

          {/* Quick Metrics Card - Super Golden X2 Slip Showcase */}
          <div className="lg:col-span-4">
            <div className="rounded-3xl border-2 border-emerald-500/50 bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950/35 p-6 backdrop-blur-md shadow-2xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-400 flex items-center justify-center text-slate-950 font-black text-lg shadow-md shadow-emerald-500/20">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-sm font-extrabold text-white">โพยเด็ดซูเปอร์โกลเด้น X2</h2>
                    <p className="text-[11px] text-emerald-300 font-semibold">Double Chance 90% Win Rate</p>
                  </div>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  X2 #1 RANK
                </span>
              </div>

              {/* Match Header */}
              {match && (
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between gap-1.5 text-xs text-slate-400 font-medium">
                    <span className="flex items-center gap-1 truncate">
                      <span>{match.leagueFlag}</span>
                      <span className="truncate">{match.league}</span>
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1 shrink-0">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                      <span>เตะ {new Date(match.kickOffTime).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })} น.</span>
                    </span>
                  </div>
                  <div className="text-lg font-black text-white flex items-center justify-between">
                    <span>{match.homeTeam}</span>
                    <span className="text-xs text-slate-500 font-normal px-2">พบ</span>
                    <span>{match.awayTeam}</span>
                  </div>
                  <div className="text-[11px] text-amber-300/90 bg-amber-950/40 px-2.5 py-1 rounded-lg border border-amber-500/30 flex items-center justify-between">
                    <span>⏳ ล็อกเวลาแข่งจริง:</span>
                    <span className="font-mono font-bold text-amber-300">
                      {match.tacticalAnalysis?.timeLockVerification || 'Upcoming Fixture Locked'}
                    </span>
                  </div>
                </div>
              )}

              {/* Golden X2 Box */}
              <div className="p-4 rounded-2xl bg-slate-950/90 border border-emerald-500/50 space-y-3 shadow-inner">
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <div className="text-[11px] font-semibold text-emerald-400 flex items-center gap-1">
                      <Target className="w-3.5 h-3.5" />
                      <span>โพยเด็ดตัวหลัก X2 สองโอกาส</span>
                    </div>
                    <div className="text-xl sm:text-2xl font-black text-white tracking-wide mt-1">
                      【 {mkt?.x2Pick || match?.recommendedPick || '1X / X2'} 】
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-[10px] text-slate-400">ค่าน้ำ / โอกาสเข้า</span>
                    <div className="text-2xl font-black text-emerald-400 tabular-nums">
                      @{(mkt?.x2Odds || match?.decimalOdds || 1.15).toFixed(2)}
                    </div>
                    <span className="text-[10px] text-sky-300 font-bold">เข้า {mkt?.x2Prob || 90.0}%</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
                  <span className="text-slate-400">เสริม Handicap:</span>
                  <span className="font-bold text-amber-300">
                    {mkt?.handicapPick || '-1.0'} @{(mkt?.handicapOdds || 1.80).toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Consensus Agreement & Institutes Count */}
              <div className="grid grid-cols-2 gap-2.5 pt-1">
                <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800">
                  <div className="flex items-center gap-1 text-[11px] text-slate-400">
                    <ShieldCheck className="w-3 h-3 text-emerald-400" />
                    <span>ฉันทามติ 100 สถาบัน</span>
                  </div>
                  <div className="text-base font-extrabold text-amber-300 tabular-nums mt-0.5 flex items-center gap-1">
                    <span>{consensusRate}%</span>
                    <span className="text-[10px] text-emerald-400 font-bold">(&gt;98%)</span>
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800">
                  <div className="flex items-center gap-1 text-[11px] text-slate-400">
                    <Building2 className="w-3 h-3 text-sky-400" />
                    <span>Telegram &amp; Host</span>
                  </div>
                  <div className="text-sm font-extrabold text-sky-300 tabular-nums mt-0.5">
                    06:30 น. · Render
                  </div>
                </div>
              </div>

              <div className="text-[11px] text-slate-400 flex items-center justify-between bg-slate-950/40 px-3 py-2 rounded-xl border border-slate-800/60">
                <span className="flex items-center gap-1 text-emerald-400 font-medium truncate">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">ซีล: {match?.superGoldenSealNumber || 'SG-X2-CONSENSUS'}</span>
                </span>
                <span className="text-amber-400 font-bold shrink-0">X2 MAIN</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
