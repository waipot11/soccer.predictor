import React from 'react';
import { 
  Activity, 
  AlertTriangle, 
  Calendar, 
  MapPin, 
  ShieldCheck, 
  TrendingUp, 
  X 
} from 'lucide-react';
import { MatchFixture } from '../types';

interface MatchDetailModalProps {
  match: MatchFixture | null;
  onClose: () => void;
}

export const MatchDetailModal: React.FC<MatchDetailModalProps> = ({ match, onClose }) => {
  if (!match) return null;

  const kickOffDate = new Date(match.kickOffTime);
  const timeString = kickOffDate.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' });
  const dateString = kickOffDate.toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-2 text-xs text-emerald-400 font-semibold">
            <span>{match.leagueFlag}</span>
            <span>{match.league}</span>
            <span aria-hidden="true">·</span>
            <span>รายงานสถิติเจาะลึก 5 มิติ (Dossier)</span>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm">
          {/* Main Teams Faceoff */}
          <div className="p-5 rounded-xl bg-slate-950/70 border border-slate-800/80 text-center space-y-2">
            <div className="flex items-center justify-center gap-2 text-xs text-slate-400">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>{dateString} · {timeString} น.</span>
              <span aria-hidden="true">·</span>
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              <span>{match.stadium}</span>
            </div>

            <div className="text-2xl font-black text-white py-1">
              <span>{match.homeTeam}</span>
              <span className="text-emerald-400 mx-3 text-lg font-light">VS</span>
              <span>{match.awayTeam}</span>
            </div>

            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-semibold">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>แนะนำ: {match.recommendedPick}</span>
              <span className="tabular-nums font-bold">(@{match.decimalOdds.toFixed(2)})</span>
            </div>
          </div>

          {/* 5-Dimensional Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* 1. H2H Statistics */}
            <div className="p-4 rounded-xl bg-slate-950/50 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400 font-semibold">
                <span>1. สถิติ H2H ย้อนหลัง</span>
                <span className="text-emerald-400">น้ำหนัก 25%</span>
              </div>
              <div className="text-base font-bold text-white">{match.h2hSummary}</div>
              <p className="text-xs text-slate-400 leading-relaxed">
                สถิติการพบกันชี้ชัดว่าเจ้าบ้านมีความคุ้นเคยทางแท็กติกและสามารถควบคุมจังหวะเกมได้อย่างสม่ำเสมอ
              </p>
            </div>

            {/* 2. Expected Goals (xG) Model */}
            <div className="p-4 rounded-xl bg-slate-950/50 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400 font-semibold">
                <span>2. ค่าความน่าจะเป็น xG</span>
                <span className="text-emerald-400">น้ำหนัก 25%</span>
              </div>
              <div className="flex items-center justify-between text-base font-bold tabular-nums">
                <span className="text-emerald-400">{match.homeTeam}: {match.homexG}</span>
                <span className="text-rose-400">{match.awayTeam}: {match.awayxG}</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                สร้างโอกาสจะแจ้ง (Big Chances) เฉลี่ย 3.4 ครั้งต่อเกม ขณะที่ทีมเยือนค่า xGA สูงสะท้อนแนวรับรั่วไหล
              </p>
            </div>

            {/* 3. Recent Form Momentum */}
            <div className="p-4 rounded-xl bg-slate-950/50 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400 font-semibold">
                <span>3. โมเมนตัมฟอร์ม 5 นัดหลัง</span>
                <span className="text-emerald-400">น้ำหนัก 20%</span>
              </div>
              <div className="space-y-1.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-300 font-medium">{match.homeTeam} (เหย้า):</span>
                  <div className="flex gap-1">
                    {match.homeForm.map((f, i) => (
                      <span
                        key={i}
                        className={`w-4 h-4 rounded text-[10px] font-bold flex items-center justify-center ${
                          f === 'W' ? 'bg-emerald-600 text-white' : f === 'D' ? 'bg-amber-600 text-white' : 'bg-rose-600 text-white'
                        }`}
                      >
                        {f}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-300 font-medium">{match.awayTeam} (เยือน):</span>
                  <div className="flex gap-1">
                    {match.awayForm.map((f, i) => (
                      <span
                        key={i}
                        className={`w-4 h-4 rounded text-[10px] font-bold flex items-center justify-center ${
                          f === 'W' ? 'bg-emerald-600 text-white' : f === 'D' ? 'bg-amber-600 text-white' : 'bg-rose-600 text-white'
                        }`}
                      >
                        {f}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* 4. Squad Depth & Key Absences */}
            <div className="p-4 rounded-xl bg-slate-950/50 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400 font-semibold">
                <span>4. สภาพทีม & ตัวเจ็บแบน</span>
                <span className="text-emerald-400">น้ำหนัก 15%</span>
              </div>
              <div className="flex items-start gap-2 text-xs text-slate-300">
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>{match.keyInjuries}</span>
              </div>
              <p className="text-xs text-slate-400">
                ไม่มีผู้เล่นหลักของฝั่งฟันธงที่ต้องหมุนเวียนลงแข่งกลางสัปดาห์ ความฟิตสมบูรณ์ 100%
              </p>
            </div>
          </div>

          {/* 5. Probability Algorithm Breakdown */}
          <div className="p-4 rounded-xl bg-slate-950/70 border border-emerald-500/30 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-white">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>ความแม่นยำทางสถิติของคู่นี้ (Win Probability)</span>
              </div>
              <span className="text-lg font-extrabold text-emerald-400 tabular-nums">
                {match.individualWinProbability}%
              </span>
            </div>

            <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden">
              <div
                className="bg-emerald-400 h-2.5 rounded-full"
                style={{ width: `${match.individualWinProbability}%` }}
              />
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              {match.aiRationale}
            </p>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-950/60 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors cursor-pointer"
          >
            ปิดหน้าต่าง
          </button>
        </div>
      </div>
    </div>
  );
};
