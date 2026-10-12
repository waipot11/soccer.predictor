import React from 'react';
import { ArrowDown, Clock, ShieldCheck, Zap } from 'lucide-react';
import { AccumulatorTicket } from '../types';

interface HeroBannerProps {
  accumulator: AccumulatorTicket;
  onScrollToSlip: () => void;
  onOpenFacebook: () => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  accumulator,
  onScrollToSlip,
  onOpenFacebook,
}) => {
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
            {/* Clean unboxed metadata separator */}
            <div className="flex items-center gap-2 text-xs font-medium text-emerald-400 flex-wrap">
              <span className="text-white font-bold bg-emerald-500/20 px-2 py-0.5 rounded border border-emerald-500/30">
                ● โหมดตารางแข่งจริง (Real Match Schedules)
              </span>
              <span className="text-emerald-300 font-bold bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/30">
                ★ Win ล้วนๆ 100% (1X2 Match Winner)
              </span>
              <span aria-hidden="true">·</span>
              <span>Gemini 3.8 Flash Grounding</span>
              <span aria-hidden="true">·</span>
              <span>เป้าหมายความแม่นยำเกิน 97%</span>
              <span aria-hidden="true">·</span>
              <span>ค่าน้ำรวมเกิน @3.5 เท่า</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
              ระบบวิเคราะห์บอล AI สเต็ป 3 ดาว (Win ล้วนๆ) <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">
                Pure Win 3-Fold Treble (Real Mode)
              </span>
            </h1>

            <p className="text-base text-slate-300 leading-relaxed max-w-2xl">
              คัดกรองคู่แข่งขันจริงตามตารางเตะวันนี้ เน้นเฉพาะ <b>Win ล้วนๆ 100% (ชนะ 90 นาทีเต็มแบบเด็ดขาด ไร้สูงต่ำหรือสองโอกาส)</b> คัดสรรเฉพาะ 3 คู่ที่มีความมั่นใจสูงเกิน 97% และให้อัตราตอบแทนรวมคุ้มค่ามากกว่า @3.5 เท่า พร้อมระบบตั้งโพสต์ Facebook อัตโนมัติล่วงหน้า 6 ชั่วโมง
            </p>

            {/* Quick Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={onScrollToSlip}
                className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 active:scale-[0.98] rounded-lg transition-all shadow-md shadow-emerald-500/20 cursor-pointer whitespace-nowrap"
              >
                <span>ตรวจตั๋วสเต็ป 3 วันนี้ (@{accumulator.combinedOdds.toFixed(2)})</span>
                <ArrowDown className="w-4 h-4" />
              </button>

              <button
                onClick={onOpenFacebook}
                className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-slate-800 hover:bg-slate-700 active:scale-[0.98] rounded-lg border border-slate-700 transition-all cursor-pointer whitespace-nowrap"
              >
                <Clock className="w-4 h-4 text-emerald-400" />
                <span>ระบบตั้งเวลาโพสต์ Facebook (6 ชม.)</span>
              </button>
            </div>
          </div>

          {/* Quick Metrics & Emblem Card */}
          <div className="lg:col-span-4">
            <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-6 backdrop-blur-md shadow-xl space-y-4">
              <div className="flex items-center gap-4">
                <img
                  src="/src/assets/images/accumulator_master_badge_1791708502468.jpg"
                  alt="Accumulator Master Trophy Seal"
                  className="w-16 h-16 rounded-lg object-cover border border-emerald-500/30 shrink-0"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <h2 className="text-sm font-bold text-white">ตั๋วสเต็ป 3 ประจำวัน (ของจริง)</h2>
                  <p className="text-xs text-slate-400">{accumulator.date}</p>
                  <p className="text-xs text-emerald-400 font-semibold mt-1">
                    สถานะ: {accumulator.isAutoPosted ? 'โพสต์ Facebook แล้ว' : 'พร้อมใช้งาน & รอเวลาโพสต์'}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-800/80">
                <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800">
                  <div className="flex items-center gap-1.5 text-xs text-slate-400">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>ความแม่นยำเฉลี่ย</span>
                  </div>
                  <div className="text-xl font-bold text-emerald-400 tabular-nums mt-1">
                    {accumulator.confidenceScore}% (&gt;97%)
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800">
                  <div className="flex items-center gap-1.5 text-xs text-slate-400">
                    <Zap className="w-3.5 h-3.5 text-amber-400" />
                    <span>ค่าน้ำรวมสเต็ป 3</span>
                  </div>
                  <div className="text-xl font-bold text-amber-400 tabular-nums mt-1">
                    @{accumulator.combinedOdds.toFixed(2)} (&gt;@3.5)
                  </div>
                </div>
              </div>

              <div className="text-xs text-slate-400 leading-relaxed bg-slate-950/40 p-2.5 rounded-lg border border-slate-800/50">
                <span className="text-slate-300 font-medium">เกณฑ์คัดกรอง:</span> ตรวจสอบโปรแกรมเตะจริงวันนี้ คัดเฉพาะ 3 คู่ที่ผ่านเกณฑ์ความมั่นใจ &gt;97% และทำค่าน้ำรวมทะลุเป้าหมาย &gt;@3.50 เท่า
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
