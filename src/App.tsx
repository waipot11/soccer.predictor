/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { HeroBanner } from './components/HeroBanner';
import { AccumulatorSlip } from './components/AccumulatorSlip';
import { MatchDetailModal } from './components/MatchDetailModal';
import { FacebookAutomationPanel } from './components/FacebookAutomationPanel';
import { PerformanceAudit } from './components/PerformanceAudit';
import { AccumulatorTicket, FacebookConfig, MatchFixture, PostLog } from './types';
import { CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'accumulator' | 'facebook' | 'performance'>('accumulator');
  const [accumulator, setAccumulator] = useState<AccumulatorTicket | null>(null);
  const [reserves, setReserves] = useState<MatchFixture[]>([]);
  const [fbConfig, setFbConfig] = useState<FacebookConfig | null>(null);
  const [logs, setLogs] = useState<PostLog[]>([]);
  const [selectedMatch, setSelectedMatch] = useState<MatchFixture | null>(null);

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [isSyncingReal, setIsSyncingReal] = useState<boolean>(false);
  const [isPosting, setIsPosting] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Initial fetch from backend
  const loadInitialData = async () => {
    try {
      setIsLoading(true);
      const [todayRes, fbRes] = await Promise.all([
        fetch('/api/football/today'),
        fetch('/api/facebook/config'),
      ]);

      const todayData = await todayRes.json();
      const fbData = await fbRes.json();

      if (todayData.accumulator) {
        setAccumulator(todayData.accumulator);
        setReserves(todayData.reserves || []);
      }
      if (fbData.config) {
        setFbConfig(fbData.config);
        setLogs(fbData.logs || []);
      }
    } catch (err) {
      console.error('Error fetching initial data:', err);
      showToast('ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ กรุณาลองใหม่อีกครั้ง', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadInitialData();
  }, []);

  // Poll for background scheduler updates every 15 seconds
  useEffect(() => {
    const timer = setInterval(async () => {
      try {
        const res = await fetch('/api/football/today');
        const data = await res.json();
        if (data.accumulator) {
          setAccumulator((prev) => {
            // Check if status changed to POSTED
            if (prev && !prev.isAutoPosted && data.accumulator.isAutoPosted) {
              showToast('🔥 ระบบบอทโพสต์ตั๋วสเต็ป 3 ดาวขึ้น Facebook โดยอัตโนมัติสำเร็จแล้ว!');
            }
            return data.accumulator;
          });
        }
      } catch (err) {
        // silent background poll fail
      }
    }, 15000);

    return () => clearInterval(timer);
  }, []);

  // Sync real-world match schedules with Gemini Grounding
  const handleSyncRealSchedule = async () => {
    try {
      setIsSyncingReal(true);
      const res = await fetch('/api/football/sync-real-schedule', {
        method: 'POST',
      });
      const data = await res.json();
      if (data.success && data.accumulator) {
        setAccumulator(data.accumulator);
        showToast('ดึงตารางแข่งขันจริงและวิเคราะห์ด้วย Google Search สำเร็จ!');
      }
    } catch (err) {
      console.error('Error syncing real schedule:', err);
      showToast('เกิดข้อผิดพลาดในการดึงข้อมูลตารางแข่งจริง', 'error');
    } finally {
      setIsSyncingReal(false);
    }
  };

  // Toggle back to demo simulation mode
  const handleToggleDemoMode = async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/football/toggle-demo-mode', { method: 'POST' });
      const data = await res.json();
      if (data.success && data.accumulator) {
        setAccumulator(data.accumulator);
        if (data.reserves) setReserves(data.reserves);
        showToast('สลับกลับสู่โหมดข้อมูลจำลองตัวอย่าง (Demo Simulation) เรียบร้อย');
      }
    } catch (err) {
      console.error(err);
      showToast('เกิดข้อผิดพลาดในการสลับโหมด', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // Add custom real-world match fixture
  const handleAddCustomMatch = async (customMatch: { homeTeam: string; awayTeam: string; league?: string; decimalOdds?: number }) => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/football/add-custom-match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(customMatch),
      });
      const data = await res.json();
      if (data.success && data.accumulator) {
        setAccumulator(data.accumulator);
        showToast(`เพิ่มคู่แข่งขันจริง ${customMatch.homeTeam} vs ${customMatch.awayTeam} เข้าตั๋วสเต็ป 3 สำเร็จ!`);
      } else {
        showToast(data.error || 'ไม่สามารถเพิ่มคู่แข่งขันได้', 'error');
      }
    } catch (err) {
      console.error(err);
      showToast('เกิดข้อผิดพลาดในการเพิ่มคู่แข่งขัน', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // Trigger Gemini AI statistical analysis
  const handleAnalyzeAI = async () => {
    try {
      setIsAnalyzing(true);
      const res = await fetch('/api/football/ai-analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      });

      const data = await res.json();
      if (data.success && data.accumulator) {
        setAccumulator(data.accumulator);
        showToast('การวิเคราะห์สเต็ป 3 ดาวด้วย Gemini 3.8 Flash สำเร็จสมบูรณ์!');
      } else {
        showToast('การวิเคราะห์ใช้ผลลัพธ์ที่บันทึกไว้ล่าสุด', 'success');
      }
    } catch (err) {
      console.error('AI Analysis failed:', err);
      showToast('เกิดข้อผิดพลาดในการเรียก Gemini AI', 'error');
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Swap leg
  const handleSwapLeg = async (currentId: string, reserveId: string) => {
    try {
      const res = await fetch('/api/football/swap-leg', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentMatchId: currentId, reserveMatchId: reserveId }),
      });

      const data = await res.json();
      if (data.success) {
        setAccumulator(data.accumulator);
        setReserves(data.reserves);
        showToast('สลับคู่แข่งขันจริงและคำนวณค่าน้ำสเต็ป 3 ใหม่สำเร็จ (>@3.5)');
      }
    } catch (err) {
      console.error('Swap failed:', err);
      showToast('ไม่สามารถสลับคู่แข่งขันได้', 'error');
    }
  };

  // Adjust kickoff hours (to test 6h rule)
  const handleAdjustKickoff = async (hours: number) => {
    try {
      const res = await fetch('/api/football/adjust-time', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ offsetHours: hours }),
      });

      const data = await res.json();
      if (data.success) {
        setAccumulator(data.accumulator);
        showToast(`ปรับเวลาเตะคู่แรกเป็นอีก ${hours} ชม. เพื่อทดสอบระบบบอท 6 ชม. แล้ว`);
      }
    } catch (err) {
      showToast('เกิดข้อผิดพลาดในการปรับเวลา', 'error');
    }
  };

  // Optimize to Ultra-Safe 100% Win criteria
  const [isOptimizingUltraSafe, setIsOptimizingUltraSafe] = useState<boolean>(false);
  const handleOptimizeUltraSafe = async () => {
    try {
      setIsOptimizingUltraSafe(true);
      const res = await fetch('/api/football/optimize-ultra-safe', {
        method: 'POST',
      });
      const data = await res.json();
      if (data.success && data.accumulator) {
        setAccumulator(data.accumulator);
        if (data.reserves) setReserves(data.reserves);
        showToast('🛡️ เปิดโหมด Ultra-Safe 100% Win สำเร็จ คัดกรอง 3 คู่ที่เสี่ยงน้อยที่สุดในตารางแข่งจริง!');
      }
    } catch (err) {
      console.error('Error optimizing ultra-safe:', err);
      showToast('เกิดข้อผิดพลาดในการปรับจูน Ultra-Safe', 'error');
    } finally {
      setIsOptimizingUltraSafe(false);
    }
  };

  // Facebook post now
  const handlePostNow = async () => {
    try {
      setIsPosting(true);
      const res = await fetch('/api/facebook/post-now', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      const data = await res.json();
      if (data.success) {
        setAccumulator(data.accumulator);
        if (data.log) {
          setLogs((prev) => [data.log, ...prev]);
        }
        showToast('เผยแพร่ตั๋วสเต็ป 3 ดาวลง Facebook Page สำเร็จเรียบร้อย!');
      }
    } catch (err) {
      console.error('Post now failed:', err);
      showToast('เกิดข้อผิดพลาดในการโพสต์', 'error');
    } finally {
      setIsPosting(false);
    }
  };

  // Reset post status
  const handleResetStatus = async () => {
    try {
      const res = await fetch('/api/football/reset-status', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        setAccumulator(data.accumulator);
        showToast('รีเซ็ตสถานะการโพสต์เป็นรอดำเนินการเรียบร้อย');
      }
    } catch (err) {
      showToast('เกิดข้อผิดพลาดในการรีเซ็ตสถานะ', 'error');
    }
  };

  // Auto-advance next day and schedule Facebook post 6 hours before kickoff
  const handleAutoAdvanceNextDay = async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/football/auto-advance-next-day', { method: 'POST' });
      const data = await res.json();
      if (data.success && data.accumulator) {
        setAccumulator(data.accumulator);
        showToast('ระบบทำนายผลวันถัดไปอัตโนมัติสำเร็จ! ตั้งเวลาโพสต์ Facebook ล่วงหน้า 6 ชม. เรียบร้อย');
      }
    } catch (err) {
      console.error(err);
      showToast('เกิดข้อผิดพลาดในการประมวลผลวันถัดไป', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // Update Facebook Config
  const handleSaveFbConfig = async (updated: Partial<FacebookConfig>) => {
    try {
      const res = await fetch('/api/facebook/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated),
      });

      const data = await res.json();
      if (data.success) {
        setFbConfig(data.config);
        if (data.accumulator) setAccumulator(data.accumulator);
        showToast('บันทึกการตั้งค่าบอท Facebook สำเร็จ');
      }
    } catch (err) {
      showToast('เกิดข้อผิดพลาดในการบันทึกการตั้งค่า', 'error');
    }
  };

  if (isLoading || !accumulator || !fbConfig) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white space-y-4">
        <RefreshCw className="w-8 h-8 text-emerald-400 animate-spin" />
        <div className="text-sm font-semibold tracking-wide text-slate-300">
          กำลังโหลดข้อมูลสถิติและการคำนวณ AI...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 flex flex-col antialiased selection:bg-emerald-500 selection:text-slate-950">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom duration-300">
          <div
            className={`flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-2xl text-xs font-semibold border backdrop-blur-md ${
              toastMessage.type === 'success'
                ? 'bg-emerald-950/90 text-emerald-300 border-emerald-500/40'
                : 'bg-rose-950/90 text-rose-300 border-rose-500/40'
            }`}
          >
            {toastMessage.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            )}
            <span>{toastMessage.text}</span>
          </div>
        </div>
      )}

      {/* Top Bar Contract Compliant Header */}
      <Header
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onAnalyzeAI={handleAnalyzeAI}
        isAnalyzing={isAnalyzing}
      />

      {/* Hero Presentation */}
      <HeroBanner
        accumulator={accumulator}
        onScrollToSlip={() => {
          setActiveTab('accumulator');
          const el = document.getElementById('accumulator-slip');
          el?.scrollIntoView({ behavior: 'smooth' });
        }}
        onOpenFacebook={() => {
          setActiveTab('facebook');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Tab Content Areas */}
      <main className="flex-1 pb-16">
        {activeTab === 'accumulator' && (
          <AccumulatorSlip
            accumulator={accumulator}
            reserves={reserves}
            onSelectMatchDetail={(m) => setSelectedMatch(m)}
            onSwapLeg={handleSwapLeg}
            onAnalyzeAI={handleAnalyzeAI}
            isAnalyzing={isAnalyzing}
            onNavigateToFacebook={() => {
              setActiveTab('facebook');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onAdjustKickoff={handleAdjustKickoff}
            onSyncRealSchedule={handleSyncRealSchedule}
            isSyncingReal={isSyncingReal}
            onOptimizeUltraSafe={handleOptimizeUltraSafe}
            isOptimizingUltraSafe={isOptimizingUltraSafe}
            onToggleDemoMode={handleToggleDemoMode}
            onAddCustomMatch={handleAddCustomMatch}
          />
        )}

        {activeTab === 'facebook' && (
          <FacebookAutomationPanel
            accumulator={accumulator}
            config={fbConfig}
            logs={logs}
            onSaveConfig={handleSaveFbConfig}
            onPostNow={handlePostNow}
            onResetStatus={handleResetStatus}
            onAdjustKickoff={handleAdjustKickoff}
            isPosting={isPosting}
          />
        )}

        {activeTab === 'performance' && (
          <PerformanceAudit
            onAdvanceNextDay={handleAutoAdvanceNextDay}
          />
        )}
      </main>

      {/* Tactical Dossier Modal */}
      <MatchDetailModal
        match={selectedMatch}
        onClose={() => setSelectedMatch(null)}
      />

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-8 px-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto space-y-2">
          <p className="font-medium text-slate-400">
            KickAI 3-Fold Accumulator &copy; {new Date().getFullYear()} · Multi-Source Statistical Engine (Real Mode)
          </p>
          <p className="max-w-xl mx-auto text-[11px] text-slate-600">
            ข้อมูลสถิติและการวิเคราะห์ทั้งหมดจัดทำขึ้นเพื่อการศึกษาทางสถิติวิทยาศาสตร์การกีฬาเท่านั้น ไม่มีเจตนาสนับสนุนการกระทำที่ผิดกฎหมายใดๆ ทั้งสิ้น
          </p>
        </div>
      </footer>
    </div>
  );
}
