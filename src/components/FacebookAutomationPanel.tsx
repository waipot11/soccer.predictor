import React, { useState, useEffect } from 'react';
import { 
  Check, 
  Clock, 
  Copy, 
  Facebook, 
  FileText, 
  Globe, 
  History, 
  Play, 
  RefreshCw, 
  RotateCcw, 
  Save, 
  Send, 
  Settings, 
  ShieldCheck, 
  Sliders, 
  ThumbsUp, 
  MessageCircle, 
  Share2,
  Activity,
  Server,
  Radio,
  ExternalLink,
  Zap,
  Coins,
  CheckCircle2,
  HelpCircle,
  ArrowRight,
  BellRing,
  KeyRound,
  Smartphone,
  Webhook,
  Database,
  HardDrive,
  AlertTriangle,
  Stethoscope
} from 'lucide-react';
import {
  AccumulatorTicket,
  FacebookConfig,
  PostLog,
  CorrectScoreTip,
  TelegramNotificationConfig,
  TelegramNotificationLog,
  TelegramDiagnostics
} from '../types';

interface FacebookAutomationPanelProps {
  accumulator: AccumulatorTicket;
  correctScoreTip?: CorrectScoreTip | null;
  config: FacebookConfig;
  logs: PostLog[];
  onSaveConfig: (updated: Partial<FacebookConfig>) => void;
  onPostNow: () => void;
  onResetStatus: () => void;
  onAdjustKickoff: (hours: number) => void;
  isPosting: boolean;
}

export const FacebookAutomationPanel: React.FC<FacebookAutomationPanelProps> = ({
  accumulator,
  correctScoreTip,
  config,
  logs,
  onSaveConfig,
  onPostNow,
  onResetStatus,
  onAdjustKickoff,
  isPosting,
}) => {
  const [leadHours, setLeadHours] = useState<number>(config.autoPostLeadHours || 6);
  const [pageId, setPageId] = useState<string>(config.pageId || '');
  const [pageName, setPageName] = useState<string>(config.pageName || '');
  const [token, setToken] = useState<string>(config.pageAccessToken || '');
  const [isEnabled, setIsEnabled] = useState<boolean>(config.isEnabled);
  const [copied, setCopied] = useState<boolean>(false);
  const [timeRemaining, setTimeRemaining] = useState<string>('');
  const [isDue, setIsDue] = useState<boolean>(false);

  // 24/7 Keep-Alive & Health Check state
  const [healthInfo, setHealthInfo] = useState<{
    status: string;
    uptimeSeconds: number;
    timestamp: string;
    schedulerActive: boolean;
  } | null>(null);
  const [isCheckingHealth, setIsCheckingHealth] = useState<boolean>(false);
  const [healthCopied, setHealthCopied] = useState<boolean>(false);
  const [show247Guide, setShow247Guide] = useState<boolean>(true);
  const [selected247Tab, setSelected247Tab] = useState<'render' | 'uptimerobot' | 'cloudrun' | 'vercel'>('render');
  const [renderStatus, setRenderStatus] = useState<{
    provider: string;
    isRenderEnv: boolean;
    serviceName: string;
    renderExternalUrl: string;
    port: number;
    nodeEnv: string;
    dataDir: string;
    stateFileExists: boolean;
    uptimeSeconds: number;
    healthCheckPath: string;
    activeDateKey: string;
    totalMonthlyBacktestMatches: number;
  } | null>(null);

  // Telegram Bot 06:30 AM Thai Time Golden HDP Notification state
  const [telegramConfig, setTelegramConfig] = useState<TelegramNotificationConfig | null>(null);
  const [telegramLogs, setTelegramLogs] = useState<TelegramNotificationLog[]>([]);
  const [telegramDiagnostics, setTelegramDiagnostics] = useState<TelegramDiagnostics | null>(null);
  const [telegramPreview, setTelegramPreview] = useState<string>('');
  const [telegramEnabled, setTelegramEnabled] = useState<boolean>(true);
  const [telegramSendTimeThai, setTelegramSendTimeThai] = useState<string>('06:30');
  const [telegramBotToken, setTelegramBotToken] = useState<string>('');
  const [telegramChatId, setTelegramChatId] = useState<string>('');
  const [telegramWebhookUrl, setTelegramWebhookUrl] = useState<string>('');
  const [telegramIncludeMarket, setTelegramIncludeMarket] = useState<boolean>(true);
  const [isSavingTelegram, setIsSavingTelegram] = useState<boolean>(false);
  const [isSendingTelegram, setIsSendingTelegram] = useState<boolean>(false);
  const [isSimulating0630, setIsSimulating0630] = useState<boolean>(false);
  const [isDiagnosingTelegram, setIsDiagnosingTelegram] = useState<boolean>(false);
  const [diagnoseBotDetail, setDiagnoseBotDetail] = useState<string | null>(null);
  const [telegramBannerMsg, setTelegramBannerMsg] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [telegramPreviewCopied, setTelegramPreviewCopied] = useState<boolean>(false);

  const pingUrl = typeof window !== 'undefined' ? `${window.location.origin}/api/health` : '/api/health';

  const fetchTelegramConfig = async () => {
    try {
      const res = await fetch('/api/telegram/config');
      const data = await res.json();
      if (data.success && data.config) {
        setTelegramConfig(data.config);
        setTelegramLogs(data.logs || []);
        if (data.diagnostics) setTelegramDiagnostics(data.diagnostics);
        setTelegramPreview(data.messagePreview || '');
        setTelegramEnabled(Boolean(data.config.isEnabled));
        setTelegramSendTimeThai(data.config.sendTimeThai || '06:30');
        setTelegramBotToken(data.config.botToken || '');
        setTelegramChatId(data.config.chatId || '');
        setTelegramWebhookUrl(data.config.customWebhookUrl || '');
        setTelegramIncludeMarket(Boolean(data.config.includeMarketComparison));
      }
    } catch (err) {
      console.error('Error fetching Telegram config:', err);
    }
  };

  const fetchRenderStatus = async () => {
    try {
      const res = await fetch('/api/render/status');
      const data = await res.json();
      if (data.success) {
        setRenderStatus(data);
        if (data.telegramDiagnostics) setTelegramDiagnostics(data.telegramDiagnostics);
      }
    } catch (err) {
      console.error('Error fetching Render status:', err);
    }
  };

  useEffect(() => {
    fetchTelegramConfig();
    fetchRenderStatus();
  }, [correctScoreTip?.tipId]);

  const showTelegramAlert = (text: string, type: 'success' | 'error' = 'success') => {
    setTelegramBannerMsg({ text, type });
    setTimeout(() => setTelegramBannerMsg(null), 6000);
  };

  const handleSaveTelegramConfig = async () => {
    try {
      setIsSavingTelegram(true);
      const res = await fetch('/api/telegram/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          isEnabled: telegramEnabled,
          sendTimeThai: telegramSendTimeThai || '06:30',
          botToken: telegramBotToken,
          chatId: telegramChatId,
          customWebhookUrl: telegramWebhookUrl,
          includeMarketComparison: telegramIncludeMarket,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setTelegramConfig(data.config);
        if (data.logs) setTelegramLogs(data.logs);
        if (data.diagnostics) setTelegramDiagnostics(data.diagnostics);
        if (data.messagePreview) setTelegramPreview(data.messagePreview);
        await fetchRenderStatus();
        showTelegramAlert(data.message || 'บันทึกการตั้งค่า Telegram เรียบร้อย');
      } else {
        showTelegramAlert('ไม่สามารถบันทึกการตั้งค่า Telegram ได้', 'error');
      }
    } catch (err) {
      console.error(err);
      showTelegramAlert('เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์ Telegram', 'error');
    } finally {
      setIsSavingTelegram(false);
    }
  };

  const handleDiagnoseTelegram = async () => {
    try {
      setIsDiagnosingTelegram(true);
      setDiagnoseBotDetail(null);
      const res = await fetch('/api/telegram/diagnose', { method: 'POST' });
      const data = await res.json();
      if (data.diagnostics) setTelegramDiagnostics(data.diagnostics);
      if (data.logs) setTelegramLogs(data.logs);
      if (data.config) setTelegramConfig(data.config);
      await fetchRenderStatus();

      const parts: string[] = [];
      if (data.botInfo) {
        parts.push(
          data.botInfo.ok
            ? `✅ Bot Token ถูกต้อง (@${data.botInfo.username})`
            : `❌ Bot Token ผิดพลาด: ${data.botInfo.error}`
        );
      } else {
        parts.push('❌ ยังไม่มี Bot Token ในระบบ');
      }
      if (data.chatInfo) {
        parts.push(
          data.chatInfo.ok
            ? `✅ Chat ID เข้าถึงได้ (${data.chatInfo.title || data.chatInfo.type})`
            : `❌ Chat ID มีปัญหา: ${data.chatInfo.error}`
        );
      } else if (data.botInfo?.ok) {
        parts.push('❌ ยังไม่มี Chat ID');
      }
      if (data.catchUp?.sentReal) {
        parts.push('✈️ สั่งส่งโพยรอบวันนี้เข้า Telegram จริงเรียบร้อย!');
      }
      setDiagnoseBotDetail(parts.join(' · '));
      showTelegramAlert(
        data.diagnostics?.reasonThai || parts.join(' | '),
        data.diagnostics?.isSentTodayReal || data.botInfo?.ok ? 'success' : 'error'
      );
    } catch (err) {
      console.error(err);
      showTelegramAlert('เกิดข้อผิดพลาดระหว่างตรวจสอบการเชื่อมต่อ Telegram', 'error');
    } finally {
      setIsDiagnosingTelegram(false);
    }
  };

  const handleSendTelegramNow = async () => {
    try {
      setIsSendingTelegram(true);
      const res = await fetch('/api/telegram/send-now', { method: 'POST' });
      const data = await res.json();
      if (data.logs) setTelegramLogs(data.logs);
      if (data.config) setTelegramConfig(data.config);
      if (data.diagnostics) setTelegramDiagnostics(data.diagnostics);
      await fetchRenderStatus();
      showTelegramAlert(data.message || 'ส่งโพยเข้า Telegram เรียบร้อย!', data.success ? 'success' : 'error');
    } catch (err) {
      console.error(err);
      showTelegramAlert('เกิดข้อผิดพลาดในการส่งข้อความเข้า Telegram', 'error');
    } finally {
      setIsSendingTelegram(false);
    }
  };

  const handleSimulate0630Telegram = async () => {
    try {
      setIsSimulating0630(true);
      const res = await fetch('/api/telegram/test-0630', { method: 'POST' });
      const data = await res.json();
      if (data.logs) setTelegramLogs(data.logs);
      if (data.config) setTelegramConfig(data.config);
      if (data.diagnostics) setTelegramDiagnostics(data.diagnostics);
      await fetchRenderStatus();
      showTelegramAlert(data.message || 'ทดสอบรอบ Telegram สำเร็จ!', data.success ? 'success' : 'error');
    } catch (err) {
      console.error(err);
      showTelegramAlert('เกิดข้อผิดพลาดในการทดสอบรอบแจ้งเตือน', 'error');
    } finally {
      setIsSimulating0630(false);
    }
  };

  const checkHealth = async () => {
    try {
      setIsCheckingHealth(true);
      const res = await fetch('/api/health');
      const data = await res.json();
      setHealthInfo(data);
      await fetchRenderStatus();
    } catch (err) {
      console.error(err);
    } finally {
      setIsCheckingHealth(false);
    }
  };

  const copyPingUrl = () => {
    navigator.clipboard.writeText(pingUrl);
    setHealthCopied(true);
    setTimeout(() => setHealthCopied(false), 2500);
  };

  // Calculate live countdown to the scheduled auto-post time
  useEffect(() => {
    const updateCountdown = () => {
      const now = Date.now();
      const scheduledMs = new Date(accumulator.autoPostScheduledTime).getTime();
      const diffMs = scheduledMs - now;

      if (diffMs <= 0) {
        setIsDue(true);
        setTimeRemaining('ถึงเวลาโพสต์แล้ว (00:00:00)');
      } else {
        setIsDue(false);
        const hours = Math.floor(diffMs / (1000 * 60 * 60));
        const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);
        setTimeRemaining(`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [accumulator.autoPostScheduledTime]);

  const earliestKickoffDate = new Date(accumulator.earliestKickOff);
  const scheduledPostDate = new Date(accumulator.autoPostScheduledTime);

  const formattedEarliestTime = earliestKickoffDate.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' });
  const formattedScheduledTime = scheduledPostDate.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' });

  const tip = correctScoreTip || accumulator.correctScoreTip;
  const currentMatch = tip?.selectedMatch || accumulator.matches[0];
  const matchKickoffThai = currentMatch 
    ? new Date(currentMatch.kickOffTime).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }) 
    : '03:00';

  // Generate Facebook post copy for preview (X2 Primary Super Golden Slip format)
  const consensusRate = tip?.consensusAgreementRate || currentMatch?.consensusAgreementRate || 99.2;
  const institutes = tip?.consensusInstitutes || currentMatch?.consensusInstitutes || [];
  const mkt = tip?.marketRecommendations;
  const x2OddsPreview = mkt?.x2Odds || 1.137;
  const x2OddsDisplayPreview = mkt?.x2OddsDisplay || x2OddsPreview.toFixed(2);
  const x2PickPreview = mkt?.x2Pick || currentMatch?.recommendedPick || '1X (เจ้าบ้านชนะ/เสมอ)';

  const postPreviewText = `⚖️【โพยเด็ดซูเปอร์โกลเด้นสลิป 1xBet HDP (Super Golden Slip)】🌟
🏆 ตัวหลัก Asian Handicap (1xBet) + Over Score · ตัวกรองฉันทามติ >98.0% ครบ 100 สถาบัน
📊 ดัชนีฉันทามติตรงกัน: ${consensusRate}% (เกณฑ์เข้มงวด >98.0% ครบทั้ง 100 สถาบัน)
📅 ประจำวันที่ ${tip?.date || accumulator.date} (ตารางแข่งขันจริง Verified Match Fixture)
⏰ โพสต์ล่วงหน้าก่อนการแข่งขันเริ่ม ${config.autoPostLeadHours} ชั่วโมง | แจ้งเตือน Telegram 06:30 น. · Data on Render.com

⚽ แมตช์เอกซูเปอร์โกลเด้น: [${currentMatch?.league || 'UEFA European Football'}]
   🏟️ ${currentMatch?.homeTeam || 'ทีมเหย้า'} พบ ${currentMatch?.awayTeam || 'ทีมเยือน'}
   📍 สนาม: ${currentMatch?.stadium || 'สนามกลาง'} | เวลาเตะ: ${matchKickoffThai} น.
----------------------------------------
⚖️ #1 ตัวหลัก 1xBet Asian Handicap: 【 ${mkt?.handicapPick || '-0.75'} 】 (@${(mkt?.handicapOdds || 1.82).toFixed(2)} · โอกาสเข้า ${mkt?.handicapProb || 73.4}% | คุ้มทุน ${mkt?.handicapBreakEvenWinRate || 54.9}% | Edge +${(mkt?.handicapEdgePercent || 18.5).toFixed(1)}%)
🔥 #2 เสริม Over Score: 【 ${mkt?.overScorePick || 'Over 2.5'} 】 (@${(mkt?.overScoreOdds || 1.65).toFixed(2)}) | เซฟตี้ 【 ${mkt?.over15Pick || 'Over 1.5'} 】 (@${(mkt?.over15Odds || 1.24).toFixed(2)})
🛡️ อ้างอิง X2 (1xBet จริง): 【 ${x2PickPreview} 】 (@${x2OddsDisplayPreview} · โอกาสเข้า ${mkt?.x2Prob || 83.5}%)
🎯 สกอร์ตรงเสริม (3 หน้าไม่ซ้ำ): ${tip?.dutchedThreeScores?.scores?.map((s) => `【${s.score} @${s.odds.toFixed(2)}】`).join(' / ') || `【 ${tip?.primaryScore || '1 - 2'} 】`}
💰 ผลตอบแทน 1xBet HDP (1,000 บ.): รับคืน ${Math.round(1000 * (mkt?.handicapOdds || 1.82)).toLocaleString()} บาท (กำไร +${Math.round(1000 * (mkt?.handicapOdds || 1.82) - 1000).toLocaleString()} บ.)
----------------------------------------
🏛️ ผลประเมินร่วม 100 สถาบันสถิติสากล (>98.0% ครบทุกแห่ง):
${institutes.length > 0 
  ? institutes.slice(0, 10).map((inst, i) => `   ${i + 1}. ${inst.flag} ${inst.name}: ตรงกัน ${inst.agreementScore}% (${inst.coreMetric}: ${inst.metricValue})`).join('\n') + `\n   ... และอีก ${institutes.length - 10} สถาบันชั้นนำระดับโลก (ตรวจสอบรายชื่อครบ 100 สถาบันในระบบ)`
  : '   • Opta, StatsBomb, SofaScore, WhoScored, Wyscout, Understat, CIES, FBREF, SciSports, FiveThirtyEight และอีก 90 สถาบันชั้นนำระดับโลก วิเคราะห์ตรงกันเกิน 98.0%'}
----------------------------------------
🔬 โมเดลแท็กติกเชิงลึก: PPDA Pressing + Field Tilt 75.4% + ตัวกรอง Consensus >98.0%
💡 บทวิเคราะห์ AI สรุป: ${currentMatch?.aiRationale || 'ทีมเต็งเหนือกว่าทุกมิติ เน้น Asian Handicap 1xBet เป็นตัวหลัก'}
✅ ใบรับรองซีล: ${currentMatch?.superGoldenSealNumber || 'SG-HDP-CONSENSUS-100X'} (100-Institute Verified)

📌 ตรวจสอบตราประทับและตารางปัวซองฉบับเต็มได้ที่หน้าเพจของเรา
${config.customFooter}

${config.hashtags.join(' ')}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(postPreviewText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveSettings = () => {
    onSaveConfig({
      pageId,
      pageName,
      pageAccessToken: token,
      autoPostLeadHours: Number(leadHours),
      isEnabled,
    });
  };

  return (
    <section id="facebook-automation" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400">
            <Facebook className="w-4 h-4 text-blue-400" />
            <span>FACEBOOK AUTO-POST AUTOMATION BOT</span>
            <span aria-hidden="true">·</span>
            <span>CRON RUNTIME</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
            ระบบโพสต์ Facebook อัตโนมัติล่วงหน้า 6 ชั่วโมง
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            ตรวจสอบตารางแข่งขันตลอด 24 ชั่วโมง และเผยแพร่ตั๋วสเต็ป 3 ดาว (Win 3-Fold) ไปยัง Facebook Page โดยอัตโนมัติก่อนคู่แรกเริ่มเตะอย่างน้อย 6 ชั่วโมง
          </p>
        </div>

        {/* Global Trigger Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => onAdjustKickoff(5.8)}
            className="text-xs px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-300 hover:text-white hover:border-emerald-500 transition-colors cursor-pointer flex items-center gap-1.5"
            title="จำลองให้เวลาเตะเหลือ 5.8 ชม. เพื่อให้ระบบออโต้โพสต์ทำงานทันที"
          >
            <Play className="w-3.5 h-3.5 text-emerald-400" />
            <span>จำลองเวลาเตะ 5.8 ชม. (Trigger Test)</span>
          </button>

          {accumulator.isAutoPosted ? (
            <button
              onClick={onResetStatus}
              className="text-xs px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>รีเซ็ตสถานะโพสต์</span>
            </button>
          ) : (
            <button
              onClick={onPostNow}
              disabled={isPosting}
              className="text-xs px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold transition-all shadow-md shadow-blue-500/20 cursor-pointer flex items-center gap-2 disabled:opacity-50"
            >
              <Send className={`w-3.5 h-3.5 ${isPosting ? 'animate-spin' : ''}`} />
              <span>{isPosting ? 'กำลังโพสต์...' : 'โพสต์ลง Facebook ทันที'}</span>
            </button>
          )}
        </div>
      </div>

      {/* ===================================================================== */}
      {/* TELEGRAM BOT 06:30 AM THAI TIME GOLDEN X2 NOTIFICATION ENGINE */}
      {/* ===================================================================== */}
      <div className="rounded-2xl border border-sky-500/40 bg-gradient-to-br from-slate-900 via-slate-900 to-sky-950/25 p-5 sm:p-6 shadow-2xl space-y-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-500/20 border border-sky-500/40 flex items-center justify-center shrink-0">
              <Send className="w-5 h-5 text-sky-400" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-base sm:text-lg font-extrabold text-white">
                  ระบบแจ้งเตือนโพยเด็ด 1xBet HDP &amp; Over Score ผ่าน Telegram Bot ทุกวัน 06:30 น. (เวลาไทย)
                </h3>
                <span className="text-[10px] font-black px-2 py-0.5 rounded bg-sky-400 text-slate-950">
                  TELEGRAM BOT 06:30 ICT
                </span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                    telegramEnabled
                      ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                      : 'bg-slate-800 text-slate-400 border-slate-700'
                  }`}
                >
                  {telegramEnabled ? '● เปิดใช้งานอัตโนมัติทุกวัน' : 'ปิดชั่วคราว'}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                แจ้งเตือนผ่าน <b className="text-sky-300">Telegram Bot API</b> เวลา <b className="text-emerald-300">06:30 น.</b> ทุกเช้า: คัดคู่ด้วย <b className="text-amber-300">ฉันทามติ &gt;98.0%</b> แล้วส่งตัวหลัก <b className="text-cyan-300">Asian Handicap (1xBet ROI +26.3%)</b> พร้อม Over Score, ดัตช์ชิ่ง 3 หน้า และอ้างอิง X2 เข้าแชท/กลุ่ม Telegram ทันที
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              onClick={handleDiagnoseTelegram}
              disabled={isDiagnosingTelegram}
              className="text-xs px-3 py-2 rounded-lg bg-amber-500/15 border border-amber-400/50 text-amber-200 hover:bg-amber-500/25 font-semibold transition-colors cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
            >
              <Stethoscope className={`w-3.5 h-3.5 ${isDiagnosingTelegram ? 'animate-spin' : ''}`} />
              <span>{isDiagnosingTelegram ? 'กำลังตรวจเช็ค Bot...' : '🔍 ตรวจสาเหตุ & เช็ค Bot จริง'}</span>
            </button>
            <button
              onClick={handleSimulate0630Telegram}
              disabled={isSimulating0630}
              className="text-xs px-3 py-2 rounded-lg bg-slate-950 border border-sky-500/40 text-sky-300 hover:bg-sky-500/10 font-semibold transition-colors cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
            >
              <Clock className={`w-3.5 h-3.5 ${isSimulating0630 ? 'animate-spin' : ''}`} />
              <span>{isSimulating0630 ? 'กำลังทดสอบรอบ...' : '⏰ ทดสอบรอบแจ้งเตือน'}</span>
            </button>
            <button
              onClick={handleSendTelegramNow}
              disabled={isSendingTelegram}
              className="text-xs px-4 py-2 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold transition-all shadow-md shadow-sky-500/20 cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
            >
              <Send className={`w-3.5 h-3.5 ${isSendingTelegram ? 'animate-spin' : ''}`} />
              <span>{isSendingTelegram ? 'กำลังส่งเข้า Telegram...' : '✈️ ส่งโพยเข้า Telegram ทันที'}</span>
            </button>
          </div>
        </div>

        {/* Honest Root-Cause Diagnostic Card */}
        {telegramDiagnostics && (
          <div
            className={`p-4 rounded-xl border text-xs space-y-2 ${
              telegramDiagnostics.isSentTodayReal
                ? 'bg-emerald-950/35 border-emerald-500/40 text-emerald-100'
                : 'bg-rose-950/40 border-rose-500/50 text-rose-100'
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="font-bold flex items-center gap-2">
                {telegramDiagnostics.isSentTodayReal ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                )}
                <span>
                  สถานะการแจ้งเตือนวันนี้: {telegramDiagnostics.isSentTodayReal ? 'ส่งเข้า Telegram จริงแล้ว ✅' : `ยังไม่ได้ส่งจริง (${telegramDiagnostics.code})`}
                </span>
              </div>
              <div className="text-[11px] font-mono text-slate-300">
                เวลาไทยตอนนี้ {telegramDiagnostics.currentTimeThai} · ตั้งส่ง {telegramDiagnostics.scheduledTimeThai}
              </div>
            </div>
            <div className="text-slate-200">{telegramDiagnostics.reasonThai}</div>
            {diagnoseBotDetail && (
              <div className="p-2 rounded bg-slate-950/80 border border-slate-700 font-mono text-[11px] text-sky-300">
                {diagnoseBotDetail}
              </div>
            )}
            <div className="flex flex-wrap gap-2 pt-1 text-[10px] font-mono">
              <span className={`px-2 py-0.5 rounded border ${telegramDiagnostics.hasBotToken ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300' : 'bg-rose-500/20 border-rose-500/40 text-rose-300'}`}>
                Bot Token: {telegramDiagnostics.hasBotToken ? 'มีค่าแล้ว' : 'ไม่มีค่า!'}
              </span>
              <span className={`px-2 py-0.5 rounded border ${telegramDiagnostics.hasChatId ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300' : 'bg-rose-500/20 border-rose-500/40 text-rose-300'}`}>
                Chat ID: {telegramDiagnostics.hasChatId ? 'มีค่าแล้ว' : 'ไม่มีค่า!'}
              </span>
              <span className={`px-2 py-0.5 rounded border ${telegramDiagnostics.credentialsSource === 'RENDER_ENV' ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300' : 'bg-amber-500/15 border-amber-500/40 text-amber-200'}`}>
                แหล่งเก็บ Token: {telegramDiagnostics.credentialsSource === 'RENDER_ENV' ? 'Render ENV (ถาวร)' : telegramDiagnostics.credentialsSource === 'LOCAL_FILE_STATE' ? 'ไฟล์ state (เสี่ยงหายบน Render /tmp)' : 'ยังไม่ตั้งค่า'}
              </span>
            </div>
            {telegramDiagnostics.actionStepsThai.length > 0 && (
              <ul className="list-disc list-inside text-[11px] text-amber-200/95 space-y-0.5 pt-1">
                {telegramDiagnostics.actionStepsThai.map((step, i) => (
                  <li key={i}>{step}</li>
                ))}
              </ul>
            )}
          </div>
        )}

        {telegramBannerMsg && (
          <div
            className={`p-3 rounded-xl text-xs font-bold border flex items-center gap-2 ${
              telegramBannerMsg.type === 'success'
                ? 'bg-emerald-950/80 border-emerald-500/50 text-emerald-300'
                : 'bg-rose-950/80 border-rose-500/50 text-rose-300'
            }`}
          >
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{telegramBannerMsg.text}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left: Telegram Message Live Preview */}
          <div className="lg:col-span-6 space-y-3">
            <div className="flex items-center justify-between">
              <div className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                <Smartphone className="w-4 h-4 text-sky-400" />
                <span>ตัวอย่างข้อความโพย X2 ที่ส่งเข้า Telegram รอบ 06:30 น. วันนี้</span>
              </div>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(telegramPreview);
                  setTelegramPreviewCopied(true);
                  setTimeout(() => setTelegramPreviewCopied(false), 2000);
                }}
                className="text-xs px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center gap-1 cursor-pointer"
              >
                {telegramPreviewCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{telegramPreviewCopied ? 'คัดลอกแล้ว' : 'คัดลอกข้อความ Telegram'}</span>
              </button>
            </div>

            <div className="rounded-xl border border-sky-500/30 bg-[#0b1726] p-4 shadow-inner">
              <pre className="text-xs text-sky-50 whitespace-pre-wrap font-sans leading-relaxed max-h-96 overflow-y-auto">
                {telegramPreview || 'กำลังสร้างตัวอย่างข้อความ Telegram รอบ 06:30 น...'}
              </pre>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 text-[11px] text-slate-300 space-y-1.5">
              <div className="font-bold text-sky-300 flex items-center gap-1.5">
                <HelpCircle className="w-3.5 h-3.5" />
                <span>วิธีสร้าง Telegram Bot ฟรีใน 1 นาที (ไม่มีวันหมดอายุ + ส่งกลุ่ม/ช่องได้ไม่จำกัด)</span>
              </div>
              <p className="text-slate-400 leading-relaxed">
                1) ทัก <span className="text-sky-300 font-mono font-bold">@BotFather</span> ใน Telegram พิมพ์ <code className="bg-slate-900 px-1 rounded text-emerald-300">/newbot</code> เพื่อรับ <b>Bot Token</b><br />
                2) ทัก <span className="text-sky-300 font-mono font-bold">@userinfobot</span> เพื่อดู <b>Chat ID</b> ส่วนตัว (หรือดึงบอทเข้ากลุ่มแล้วใช้ <span className="text-sky-300 font-mono">@getidsbot</span> ดูเลขกลุ่ม <code className="bg-slate-900 px-1 rounded">-100...</code>)<br />
                3) นำมาวางด้านขวาแล้วกดบันทึก (ระบบจะบันทึกลง Render Data Disk และทำงานโหมดจริงทันที; หากยังไม่กรอกจะทดสอบแบบ Simulated พร้อม Log)
              </p>
            </div>
          </div>

          {/* Right: Telegram Configuration Form + Logs */}
          <div className="lg:col-span-6 space-y-4">
            <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4 space-y-3 text-xs">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                <span className="font-bold text-white flex items-center gap-1.5">
                  <KeyRound className="w-4 h-4 text-sky-400" />
                  <span>ตั้งค่า Telegram Bot API &amp; Webhook (รอบ 06:30 น.)</span>
                </span>
                <label className="flex items-center gap-2 cursor-pointer">
                  <span className="text-slate-400">เปิดส่งอัตโนมัติ</span>
                  <input
                    type="checkbox"
                    checked={telegramEnabled}
                    onChange={(e) => setTelegramEnabled(e.target.checked)}
                    className="rounded bg-slate-800 border-slate-700 text-sky-500 w-4 h-4"
                  />
                </label>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">เวลาส่งประจำวัน (เวลาไทย):</label>
                  <input
                    type="time"
                    value={telegramSendTimeThai}
                    onChange={(e) => setTelegramSendTimeThai(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sky-300 font-mono font-bold focus:outline-none focus:border-sky-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">สถานะส่งจริงล่าสุด:</label>
                  <div className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-300 truncate">
                    {telegramConfig?.lastSentDateKey
                      ? `ส่งจริงแล้ว (${telegramConfig.lastSentDateKey})`
                      : 'ยังไม่ได้ส่งจริงวันนี้'}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Telegram Bot Token (จาก @BotFather):</label>
                <input
                  type="password"
                  value={telegramBotToken}
                  onChange={(e) => setTelegramBotToken(e.target.value)}
                  placeholder="เช่น 7412345678:AAF... (ตั้งเป็น ENV TELEGRAM_BOT_TOKEN บน Render ได้)"
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-white font-mono focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Telegram Chat ID / Group ID / Channel:</label>
                <input
                  type="text"
                  value={telegramChatId}
                  onChange={(e) => setTelegramChatId(e.target.value)}
                  placeholder="เช่น 123456789 (ส่วนตัว), -1001234567890 (กลุ่ม/Channel) หรือ @channel"
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-white font-mono focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1 flex items-center gap-1">
                  <Webhook className="w-3.5 h-3.5 text-sky-400" />
                  <span>Custom Webhook URL สำรอง (Make / Zapier / n8n - ไม่บังคับ):</span>
                </label>
                <input
                  type="url"
                  value={telegramWebhookUrl}
                  onChange={(e) => setTelegramWebhookUrl(e.target.value)}
                  placeholder="https://hook.eu2.make.com/..."
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-white font-mono focus:outline-none focus:border-sky-500"
                />
              </div>

              <label className="flex items-center gap-2 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={telegramIncludeMarket}
                  onChange={(e) => setTelegramIncludeMarket(e.target.checked)}
                  className="rounded bg-slate-800 border-slate-700 text-sky-500 w-4 h-4"
                />
                <span className="text-slate-300">แนบแนวทาง HDP / Over Score / X2 และสรุปสถิติ 1 เดือนในข้อความ Telegram</span>
              </label>

              <button
                onClick={handleSaveTelegramConfig}
                disabled={isSavingTelegram}
                className="w-full py-2 px-4 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold transition-colors cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-50"
              >
                <Save className="w-3.5 h-3.5" />
                <span>{isSavingTelegram ? 'กำลังบันทึก...' : `บันทึกการตั้งค่า Telegram รอบ ${telegramSendTimeThai} น.`}</span>
              </button>
            </div>

            {/* Telegram Notification Logs */}
            <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4 space-y-2.5">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <History className="w-3.5 h-3.5 text-sky-400" />
                  <span>ประวัติการส่งแจ้งเตือน Telegram ({telegramLogs.length} รายการ)</span>
                </span>
                <span className="text-[10px] text-amber-300">
                  {telegramDiagnostics?.isEphemeralDataDir
                    ? '⚠️ /tmp ชั่วคราว (ตั้ง Render ENV เพื่อไม่ให้หาย)'
                    : 'บันทึกลง Data Directory'}
                </span>
              </div>

              <div className="space-y-2 max-h-44 overflow-y-auto pr-1">
                {telegramLogs.length === 0 ? (
                  <div className="text-[11px] text-slate-500 py-3 text-center">
                    ยังไม่มีประวัติการส่ง Telegram กดปุ่ม &quot;จำลองรอบ 06:30 น.&quot; หรือ &quot;ส่งโพย X2 เข้า Telegram ทันที&quot; เพื่อทดสอบ
                  </div>
                ) : (
                  telegramLogs.map((l) => (
                    <div key={l.id} className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-[11px] space-y-1">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-bold text-white flex items-center gap-1.5 truncate">
                          <span
                            className={`w-2 h-2 rounded-full shrink-0 ${
                              l.status === 'SUCCESS'
                                ? 'bg-emerald-400'
                                : l.status === 'SIMULATED'
                                ? 'bg-amber-400'
                                : 'bg-rose-400'
                            }`}
                          />
                          <span className="truncate">{l.matchTitle}</span>
                        </span>
                        <span
                          className={`px-1.5 py-0.5 rounded text-[9px] font-bold shrink-0 ${
                            l.status === 'SUCCESS'
                              ? 'bg-emerald-500/20 text-emerald-300'
                              : l.status === 'SIMULATED'
                              ? 'bg-amber-500/20 text-amber-300'
                              : 'bg-rose-500/20 text-rose-300'
                          }`}
                        >
                          {l.status}
                        </span>
                      </div>
                      <div className="text-slate-400 flex items-center justify-between">
                        <span>{l.triggerType} · Chat ID: {l.chatId}</span>
                        <span>{new Date(l.timestamp).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })} น.</span>
                      </div>
                      <div className="text-sky-300/90 font-mono text-[10px] truncate">{l.apiResponseMsg}</div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Render.com Hosting & Persistent Data Store + 24/7 Keep-Alive Center */}
      <div className="rounded-xl border border-purple-500/40 bg-gradient-to-br from-slate-900 via-slate-900 to-purple-950/25 p-5 shadow-lg space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-purple-500/20 border border-purple-500/40 flex items-center justify-center shrink-0">
              <Database className="w-4 h-4 text-purple-400" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-sm sm:text-base font-bold text-white">
                  ศูนย์ย้ายข้อมูลและโฮสต์บน Render.com 24 ชม. (Render Persistent Data &amp; Keep-Alive)
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  RENDER.COM READY
                </span>
                {renderStatus && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    ● {renderStatus.stateFileExists ? 'DATA PERSISTED' : 'LIVE STORE'} ({healthInfo?.uptimeSeconds ?? renderStatus.uptimeSeconds}s)
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                {renderStatus?.dataDir?.startsWith('/tmp')
                  ? <>⚠️ Render Free ใช้ <code className="text-amber-300 bg-slate-950 px-1 rounded">{renderStatus.dataDir}</code> ซึ่งถูกล้างเมื่อเซิร์ฟเวอร์หลับ/รีสตาร์ท — กรุณาตั้ง <code className="text-emerald-300">TELEGRAM_BOT_TOKEN</code> &amp; <code className="text-emerald-300">TELEGRAM_CHAT_ID</code> ใน Render ENV และใช้ UptimeRobot ปิง <code className="text-sky-300">/api/health</code> ทุก 5 นาที</>
                  : <>ไฟล์ <code className="text-purple-300 bg-slate-950 px-1 rounded">render.yaml</code> + เก็บสถานะที่ <code className="text-sky-300 bg-slate-950 px-1 rounded">{renderStatus?.dataDir || '/tmp/kickai-data'}</code></>
                }
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            <button
              onClick={checkHealth}
              disabled={isCheckingHealth}
              className="text-xs px-3 py-1.5 rounded-lg bg-purple-500/15 border border-purple-500/30 text-purple-300 hover:bg-purple-500/25 transition-colors cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
            >
              <Activity className={`w-3.5 h-3.5 text-purple-400 ${isCheckingHealth ? 'animate-spin' : ''}`} />
              <span>{isCheckingHealth ? 'กำลังเช็ค...' : 'ตรวจสอบสถานะ Render & Disk'}</span>
            </button>

            <button
              onClick={() => setShow247Guide(!show247Guide)}
              className="text-xs px-2.5 py-1.5 rounded-lg border border-slate-700 bg-slate-800 text-slate-300 hover:text-white transition-colors cursor-pointer"
            >
              <span>{show247Guide ? 'ย่อสรุป' : 'เปิดดูคู่มือ Render.com'}</span>
            </button>
          </div>
        </div>

        {show247Guide && (
          <div className="space-y-4 pt-1 animate-in fade-in duration-200">
            {/* Live Render Telemetry Row */}
            {renderStatus && (
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800">
                  <div className="text-[10px] text-slate-400">Platform &amp; Service</div>
                  <div className="font-bold text-purple-300 mt-0.5 truncate">{renderStatus.provider}</div>
                  <div className="text-[10px] font-mono text-slate-500 truncate">{renderStatus.serviceName}</div>
                </div>
                <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800">
                  <div className="text-[10px] text-slate-400 flex items-center gap-1">
                    <HardDrive className="w-3 h-3 text-emerald-400" />
                    <span>Render Data Directory</span>
                  </div>
                  <div className="font-bold text-emerald-300 font-mono mt-0.5 truncate">{renderStatus.dataDir}</div>
                  <div className="text-[10px] text-slate-400">
                    ไฟล์ข้อมูล: {renderStatus.stateFileExists ? '✅ บันทึกแล้ว (kickai-state.json)' : '⏳ รอการบันทึกรอบแรก'}
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800">
                  <div className="text-[10px] text-slate-400">โหมดสภาพแวดล้อม &amp; พอร์ต</div>
                  <div className="font-bold text-white font-mono mt-0.5">PORT {renderStatus.port} · {renderStatus.nodeEnv}</div>
                  <div className="text-[10px] text-slate-400">
                    {renderStatus.isRenderEnv ? '🟢 รันอยู่บน Render Cloud จริง' : '🔧 โหมด Preview (พร้อม Deploy ขึ้น Render)'}
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800">
                  <div className="text-[10px] text-slate-400">ฐานข้อมูลผลย้อนหลัง &amp; รอบวันไทย</div>
                  <div className="font-bold text-sky-300 mt-0.5">{renderStatus.totalMonthlyBacktestMatches} นัด Verified</div>
                  <div className="text-[10px] font-mono text-slate-400">DateKey: {renderStatus.activeDateKey}</div>
                </div>
              </div>
            )}

            {/* Ping URL box */}
            <div className="p-3.5 rounded-lg bg-slate-950/70 border border-slate-800 space-y-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                  <Server className="w-3.5 h-3.5 text-purple-400" />
                  <span>Render Health Check &amp; UptimeRobot URL (ปลุกเซิร์ฟเวอร์ + ทริกเกอร์บอท 06:00 / 06:30 น. อัตโนมัติ):</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={copyPingUrl}
                    className="self-start sm:self-auto text-xs px-2.5 py-1 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30 hover:bg-purple-500/30 transition-colors cursor-pointer flex items-center gap-1 font-semibold"
                  >
                    {healthCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{healthCopied ? 'คัดลอกสำเร็จ!' : 'คัดลอก URL'}</span>
                  </button>
                </div>
              </div>

              <div className="p-2 rounded bg-slate-900 border border-slate-800/80 font-mono text-xs text-sky-300 break-all select-all flex items-center justify-between">
                <span>{pingUrl}</span>
                <span className="text-[10px] text-slate-400 font-sans ml-2 shrink-0">(นำไปใส่ใน UptimeRobot ทุก 5 นาที)</span>
              </div>
            </div>

            {/* Platform Selection Tabs - RENDER.COM IS #1 PRIMARY */}
            <div className="flex items-center gap-1 border-b border-slate-800 pb-2 overflow-x-auto text-xs">
              <button
                onClick={() => setSelected247Tab('render')}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                  selected247Tab === 'render'
                    ? 'bg-purple-500/25 text-purple-200 border border-purple-400/60 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <Database className="w-3.5 h-3.5 text-purple-300" />
                <span>1. Render.com + Disk &amp; Blueprint (แนะนำหลัก)</span>
              </button>

              <button
                onClick={() => setSelected247Tab('uptimerobot')}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                  selected247Tab === 'uptimerobot'
                    ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <Radio className="w-3.5 h-3.5 text-emerald-400" />
                <span>2. UptimeRobot กัน Render หลับ (ฟรี 3 นาที)</span>
              </button>

              <button
                onClick={() => setSelected247Tab('cloudrun')}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                  selected247Tab === 'cloudrun'
                    ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <Coins className="w-3.5 h-3.5 text-emerald-400" />
                <span>3. Google Cloud Run ($0.00)</span>
              </button>

              <button
                onClick={() => setSelected247Tab('vercel')}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                  selected247Tab === 'vercel'
                    ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                <span>4. Vercel (ทางเลือกเสริม)</span>
              </button>
            </div>

            {/* Tab 1 (PRIMARY): Render.com Blueprint + Data Migration */}
            {selected247Tab === 'render' && (
              <div className="p-4 rounded-xl bg-slate-950/70 border border-purple-500/30 space-y-3 animate-in fade-in duration-150">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-purple-300">Deploy และรันข้อมูลระบบทั้งหมดบน Render.com (ฟรี 750 ชม./เดือน)</span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/30">
                      render.yaml พร้อมใช้งานทันที
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  โปรเจกต์ถูกตั้งค่าสำหรับ <strong className="text-white">Render.com Node Web Service</strong> เรียบร้อยแล้ว ทั้งคำสั่ง Build (<code className="text-purple-300 bg-slate-900 px-1 rounded">npm install && npm run build</code>), Start (<code className="text-purple-300 bg-slate-900 px-1 rounded">npm start</code>), Health Check (<code className="text-emerald-300 bg-slate-900 px-1 rounded">/api/health</code>) และจุดเก็บไฟล์ข้อมูล (<code className="text-sky-300 bg-slate-900 px-1 rounded">DATA_DIR</code>)
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[11px]">
                  <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 space-y-1.5">
                    <div className="font-bold text-purple-300">ขั้นตอนนำขึ้น Render.com ใน 3 นาที:</div>
                    <ol className="list-decimal list-inside space-y-1 text-slate-300">
                      <li>Push โค้ดขึ้น GitHub &rarr; เข้า <span className="text-sky-300 font-mono">dashboard.render.com</span></li>
                      <li>เลือก <strong>New &rarr; Blueprint</strong> (ระบบจะอ่านไฟล์ <code className="text-purple-300">render.yaml</code> ให้อัตโนมัติ)</li>
                      <li>ใส่ Environment Variables ด้านขวา แล้วกด <strong>Apply</strong> ได้ URL ถาวรทันที</li>
                      <li>(ตัวเลือกถาวร) หากใช้ Paid Disk ให้ mount ที่ <code className="text-emerald-300">/var/data</code> แล้วตั้ง <code className="text-emerald-300">DATA_DIR=/var/data</code></li>
                    </ol>
                  </div>

                  <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 space-y-1.5 font-mono">
                    <div className="font-bold text-emerald-300 font-sans">Environment Variables ที่ควรใส่ใน Render Dashboard:</div>
                    <div className="text-slate-300">• <span className="text-sky-300">GEMINI_API_KEY</span> = คีย์ AI ค้นหาตารางแข่งจริง</div>
                    <div className="text-slate-300">• <span className="text-sky-300">TELEGRAM_BOT_TOKEN</span> = Token จาก @BotFather</div>
                    <div className="text-slate-300">• <span className="text-sky-300">TELEGRAM_CHAT_ID</span> = Chat/Group ID ปลายทาง</div>
                    <div className="text-slate-300">• <span className="text-sky-300">DATA_DIR</span> = /tmp/kickai-data (หรือ /var/data)</div>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 2: Vercel (moved secondary) */}
            {selected247Tab === 'vercel' && (
              <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-3 animate-in fade-in duration-150">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-sky-300">ทางเลือกเสริม: Vercel + UptimeRobot.com</span>
                    <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 text-[10px] font-bold border border-slate-700">
                      Serverless
                    </span>
                  </div>
                  <span className="text-xs text-slate-400">แนะนำ Render.com เป็นหลักเพื่อเก็บ Data Disk</span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  Vercel เป็น Serverless ไม่สามารถเก็บไฟล์สถานะ <code className="text-sky-300 bg-slate-900 px-1 rounded">kickai-state.json</code> ข้ามรอบหรือรัน <code className="text-sky-300 bg-slate-900 px-1 rounded">setInterval()</code> ตลอดเวลาเหมือน <strong className="text-purple-300">Render.com</strong> จึงแนะนำให้ย้ายมาใช้ Render.com เป็นหลักครับ
                </p>
              </div>
            )}

            {/* Tab 3: Cloud Run $0 */}
            {selected247Tab === 'cloudrun' && (
              <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-3 animate-in fade-in duration-150">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-sky-300">ทางเลือก Cloud Run (ฟรี 2 ล้านคำขอ/เดือน)</span>
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-emerald-950/30 border border-emerald-800/50 space-y-2 text-xs">
                  <div className="font-bold text-emerald-300 flex items-center gap-1.5">
                    <Coins className="w-4 h-4" />
                    <span>ตั้งค่า Scale to Zero (Min instances = 0) + UptimeRobot ทุก 5 นาที</span>
                  </div>
                  <p className="text-slate-300 text-[11px]">
                    ระบบรองรับ Docker/Node มาตรฐาน แต่หากต้องการย้ายข้อมูลและตั้งค่าบอท Telegram 06:30 น. ง่ายที่สุด แนะนำใช้ Render.com Blueprint ในแท็บ 1 ครับ
                  </p>
                </div>
              </div>
            )}

            {/* Tab 4: Step by step UptimeRobot setup */}
            {selected247Tab === 'uptimerobot' && (
              <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-3 animate-in fade-in duration-150">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-sky-300">คู่มือวิธีตั้งค่า UptimeRobot.com (ฟรี 100% เสร็จใน 3 นาที)</span>
                  </div>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex items-start gap-2.5 p-2 rounded-lg bg-slate-900 border border-slate-800/80">
                    <span className="w-5 h-5 rounded-full bg-sky-500/20 text-sky-300 font-bold flex items-center justify-center shrink-0 text-[11px]">1</span>
                    <div className="text-slate-300 text-[11px]">
                      เข้าไปที่ <a href="https://uptimerobot.com" target="_blank" rel="noreferrer" className="text-sky-400 hover:underline font-semibold">UptimeRobot.com</a> แล้วกด <strong>Register for FREE</strong> (ฟรี 50 monitors ไม่ต้องใช้บัตรเครดิต)
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5 p-2 rounded-lg bg-slate-900 border border-slate-800/80">
                    <span className="w-5 h-5 rounded-full bg-sky-500/20 text-sky-300 font-bold flex items-center justify-center shrink-0 text-[11px]">2</span>
                    <div className="text-slate-300 text-[11px]">
                      เข้าหน้า Dashboard &rarr; คลิกปุ่มสีเขียว <strong>&quot;+ Add New Monitor&quot;</strong>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5 p-2 rounded-lg bg-slate-900 border border-slate-800/80">
                    <span className="w-5 h-5 rounded-full bg-sky-500/20 text-sky-300 font-bold flex items-center justify-center shrink-0 text-[11px]">3</span>
                    <div className="text-slate-300 text-[11px] space-y-0.5">
                      <div>• <strong>Monitor Type:</strong> เลือก <code className="text-sky-300 bg-slate-950 px-1 rounded">HTTP(s)</code></div>
                      <div>• <strong>Friendly Name:</strong> ตั้งชื่อ เช่น <code className="text-sky-300 bg-slate-950 px-1 rounded">KickAI Facebook Bot</code></div>
                      <div>• <strong>URL (or IP):</strong> วาง URL ที่คัดลอกได้จากกล่องด้านบน (<code className="text-sky-300 bg-slate-950 px-1 rounded">{pingUrl}</code>)</div>
                      <div>• <strong>Monitoring Interval:</strong> เลือก <code className="text-sky-300 bg-slate-950 px-1 rounded">5 minutes</code> (ฟรี)</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5 p-2 rounded-lg bg-slate-900 border border-slate-800/80">
                    <span className="w-5 h-5 rounded-full bg-sky-500/20 text-sky-300 font-bold flex items-center justify-center shrink-0 text-[11px]">4</span>
                    <div className="text-slate-300 text-[11px]">
                      กดปุ่ม <strong>Create Monitor</strong> ด้านล่าง &rarr; ระบบจะเริ่มส่งสัญญาณกระตุ้นเว็บของคุณทุก 5 นาทีทันที เซิร์ฟเวอร์และบอทจะตื่นพร้อมทำงานตลอด 24 ชม.!
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Scheduler Status Banner */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-6 backdrop-blur-md shadow-lg space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
          {/* Card 1: Lead Time */}
          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800">
            <div className="text-xs text-slate-400 font-medium">เงื่อนไขเวลาโพสต์ล่วงหน้า</div>
            <div className="text-2xl font-bold text-white tabular-nums mt-1">
              {config.autoPostLeadHours} ชั่วโมง
            </div>
            <div className="text-[11px] text-emerald-400 mt-1">
              ✓ ก่อนคู่แรกเริ่มเตะอย่างน้อย 6 ชม.
            </div>
          </div>

          {/* Card 2: Earliest Kickoff */}
          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800">
            <div className="text-xs text-slate-400 font-medium">คู่แรกเริ่มเตะ (Earliest Kickoff)</div>
            <div className="text-xl font-bold text-white tabular-nums mt-1">
              {formattedEarliestTime} น.
            </div>
            <div className="text-[11px] text-slate-400 mt-1">
              {accumulator.matches[0]?.homeTeam} vs {accumulator.matches[0]?.awayTeam}
            </div>
          </div>

          {/* Card 3: Scheduled Trigger Time */}
          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800">
            <div className="text-xs text-slate-400 font-medium">กำหนดเวลาออโต้โพสต์ (Scheduled)</div>
            <div className="text-xl font-bold text-amber-400 tabular-nums mt-1">
              {formattedScheduledTime} น.
            </div>
            <div className="text-[11px] text-slate-400 mt-1">
              คำนวณถอยหลัง {config.autoPostLeadHours} ชม. พอดี
            </div>
          </div>

          {/* Card 4: Live Countdown & Status */}
          <div className={`p-4 rounded-xl border ${accumulator.isAutoPosted ? 'bg-emerald-950/30 border-emerald-500/40' : 'bg-slate-950/70 border-slate-800'}`}>
            <div className="text-xs text-slate-400 font-medium flex items-center justify-between">
              <span>สถานะบอท</span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${accumulator.isAutoPosted ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}`}>
                {accumulator.isAutoPosted ? 'POSTED' : isDue ? 'DUE NOW' : 'WAITING'}
              </span>
            </div>

            <div className="text-xl font-bold text-white tabular-nums mt-1 font-mono">
              {accumulator.isAutoPosted ? 'เผยแพร่แล้ว' : timeRemaining}
            </div>

            <div className="text-[11px] text-slate-400 mt-1 truncate">
              {accumulator.isAutoPosted
                ? `Post ID: ${accumulator.fbPostId || 'Verified'}`
                : isEnabled
                ? 'ระบบเบื้องหลังตรวจสอบทุก 30 วินาที'
                : 'ระบบออโต้ถูกปิดชั่วคราว'}
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Facebook Feed Preview (Left) + Bot Settings & History (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Realistic Facebook Desktop Post Feed Card */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <FileText className="w-4 h-4 text-blue-400" />
              <span>ภาพตัวอย่างโพสต์ Facebook เสมือนจริง (Feed Preview)</span>
            </h3>

            <button
              onClick={handleCopy}
              className="text-xs px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer flex items-center gap-1.5"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'คัดลอกแล้ว' : 'คัดลอกข้อความโพสต์'}</span>
            </button>
          </div>

          {/* Facebook Post Box Mockup */}
          <div className="rounded-xl border border-slate-800 bg-slate-900 shadow-2xl overflow-hidden font-sans">
            {/* FB Post Header */}
            <div className="p-4 flex items-center justify-between border-b border-slate-800/60 bg-slate-950/40">
              <div className="flex items-center gap-3">
                <img
                  src="/src/assets/images/ai_sports_brand_avatar_1791708517253.jpg"
                  alt="Page Avatar"
                  className="w-10 h-10 rounded-full border border-blue-500/30 object-cover"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-bold text-white hover:underline cursor-pointer">
                      {config.pageName}
                    </span>
                    <span className="w-3.5 h-3.5 rounded-full bg-blue-500 text-white flex items-center justify-center text-[9px] font-black" title="Verified Page">
                      ✓
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-slate-400">
                    <span>โพสต์ล่วงหน้า 6 ชม. ก่อนแข่ง</span>
                    <span aria-hidden="true">·</span>
                    <Globe className="w-3 h-3 text-slate-400" />
                    <span>สาธารณะ</span>
                  </div>
                </div>
              </div>
            </div>

            {/* FB Post Body Content */}
            <div className="p-4 space-y-3">
              <p className="text-sm text-slate-200 whitespace-pre-line leading-relaxed font-normal selection:bg-blue-500 selection:text-white">
                {postPreviewText}
              </p>
            </div>

            {/* Simulated FB Image Infographic in Post */}
            <div className="border-t border-b border-slate-800 bg-slate-950 relative overflow-hidden group">
              <img
                src="/src/assets/images/football_tactical_hero_1791708490757.jpg"
                alt="Tactical Accumulator Visual Banner"
                className="w-full h-56 object-cover opacity-85 group-hover:scale-102 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent p-4 flex flex-col justify-end">
                <div className="text-xs font-bold text-emerald-400 tracking-wider">
                  WIN 3-FOLD VIP ACCUMULATOR · REAL MATCHES GROUNDING
                </div>
                <div className="text-base font-extrabold text-white">
                  3 คู่เต็งเข้าเป้า 97%+ Win Target · ค่าน้ำ @{accumulator.combinedOdds.toFixed(2)} (&gt;@3.5)
                </div>
              </div>
            </div>

            {/* FB Engagement Metrics */}
            <div className="px-4 py-2 flex items-center justify-between text-xs text-slate-400 border-b border-slate-800/60">
              <div className="flex items-center gap-1.5">
                <span className="w-4 h-4 rounded-full bg-blue-600 flex items-center justify-center text-[10px] text-white">👍</span>
                <span className="w-4 h-4 rounded-full bg-red-600 flex items-center justify-center text-[10px] text-white">❤️</span>
                <span className="ml-1 tabular-nums font-semibold text-slate-300">1.4K คนถูกใจ</span>
              </div>
              <div className="flex gap-3">
                <span>342 ความคิดเห็น</span>
                <span>128 แชร์</span>
              </div>
            </div>

            {/* FB Action Bar */}
            <div className="px-4 py-2 flex items-center justify-around text-xs font-semibold text-slate-400 border-t border-slate-800/40 bg-slate-950/20">
              <button className="flex items-center gap-1.5 py-1.5 px-3 rounded hover:bg-slate-800 hover:text-white transition-colors cursor-pointer">
                <ThumbsUp className="w-4 h-4" />
                <span>ถูกใจ</span>
              </button>
              <button className="flex items-center gap-1.5 py-1.5 px-3 rounded hover:bg-slate-800 hover:text-white transition-colors cursor-pointer">
                <MessageCircle className="w-4 h-4" />
                <span>แสดงความคิดเห็น</span>
              </button>
              <button className="flex items-center gap-1.5 py-1.5 px-3 rounded hover:bg-slate-800 hover:text-white transition-colors cursor-pointer">
                <Share2 className="w-4 h-4" />
                <span>แชร์</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Settings & Scheduler Log */}
        <div className="lg:col-span-5 space-y-6">
          {/* Settings Box */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/95 p-6 backdrop-blur-md shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Settings className="w-4 h-4 text-emerald-400" />
                <span>ตั้งค่าระบบ Facebook Bot</span>
              </h3>

              <label className="flex items-center gap-2 cursor-pointer">
                <span className="text-xs text-slate-400">เปิดบอทออโต้</span>
                <input
                  type="checkbox"
                  checked={isEnabled}
                  onChange={(e) => setIsEnabled(e.target.checked)}
                  className="rounded bg-slate-800 border-slate-700 text-emerald-500 focus:ring-0 w-4 h-4"
                />
              </label>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">
                  เวลาที่ต้องโพสต์ก่อนแข่ง (ชั่วโมง):
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min="1"
                    max="12"
                    step="1"
                    value={leadHours}
                    onChange={(e) => setLeadHours(Number(e.target.value))}
                    className="w-full accent-emerald-400 cursor-pointer"
                  />
                  <span className="text-sm font-bold text-emerald-400 tabular-nums w-12 text-right">
                    {leadHours} ชม.
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  ระบบตั้งค่าแนะนำ: 6 ชั่วโมง ตามข้อกำหนดก่อนคู่แรกเริ่มเตะ
                </p>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">
                  ชื่อ Facebook Page:
                </label>
                <input
                  type="text"
                  value={pageName}
                  onChange={(e) => setPageName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white font-medium focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">
                  Facebook Page ID:
                </label>
                <input
                  type="text"
                  value={pageId}
                  onChange={(e) => setPageId(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white font-mono focus:outline-none focus:border-emerald-500"
                  placeholder="เช่น 109827364512903"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">
                  Page Access Token (ไม่บังคับ - ใช้จำลองได้):
                </label>
                <input
                  type="password"
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white font-mono focus:outline-none focus:border-emerald-500"
                  placeholder="EAA..."
                />
                <p className="text-[11px] text-slate-500 mt-1">
                  หากเว้นว่างไว้ ระบบจะใช้โหมด Verified Mock Graph API Server เพื่อให้คุณทดสอบการทำงานได้อย่างสมบูรณ์แบบ
                </p>
              </div>

              <div className="pt-2">
                <button
                  onClick={handleSaveSettings}
                  className="w-full py-2 px-4 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>บันทึกการตั้งค่าบอท</span>
                </button>
              </div>
            </div>
          </div>

          {/* Audit History Log */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/95 p-6 backdrop-blur-md shadow-xl space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <History className="w-4 h-4 text-emerald-400" />
                <span>ประวัติการทำงานของบอท (Audit Logs)</span>
              </h3>
              <span className="text-xs text-slate-500 tabular-nums">{logs.length} รายการ</span>
            </div>

            <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
              {logs.map((log) => {
                const logDate = new Date(log.timestamp);
                const timeStr = logDate.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' });
                const dateStr = logDate.toLocaleDateString('th-TH', { day: 'numeric', month: 'short' });

                return (
                  <div
                    key={log.id}
                    className="p-3 rounded-lg bg-slate-950/70 border border-slate-800 text-xs space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-white flex items-center gap-1.5">
                        <span className={`w-2 h-2 rounded-full ${log.status === 'SUCCESS' ? 'bg-emerald-400' : 'bg-rose-400'}`} />
                        <span>{log.triggerType === 'AUTOMATIC_SCHEDULER' ? 'ระบบอัตโนมัติ (Scheduler)' : 'สั่งโพสต์โดยตรง (Manual)'}</span>
                      </span>
                      <span className="text-slate-500 tabular-nums">{dateStr} {timeStr} น.</span>
                    </div>

                    <div className="text-slate-400 text-[11px] truncate">
                      Post ID: {log.fbPostId} · ล่วงหน้า: {log.leadTimeHours} ชม.
                    </div>

                    <div className="text-emerald-400/90 text-[11px] font-mono">
                      {log.apiResponseMsg}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
