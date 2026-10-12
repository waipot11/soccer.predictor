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
  ArrowRight
} from 'lucide-react';
import { AccumulatorTicket, FacebookConfig, PostLog } from '../types';

interface FacebookAutomationPanelProps {
  accumulator: AccumulatorTicket;
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
  const [selected247Tab, setSelected247Tab] = useState<'vercel' | 'cloudrun' | 'render' | 'uptimerobot'>('vercel');

  const pingUrl = typeof window !== 'undefined' ? `${window.location.origin}/api/health` : '/api/health';

  const checkHealth = async () => {
    try {
      setIsCheckingHealth(true);
      const res = await fetch('/api/health');
      const data = await res.json();
      setHealthInfo(data);
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

  // Generate Facebook post copy for preview
  const postPreviewText = `🔥【ทีเด็ด VIP สเต็ป 3 ดาว AI - Win 3-Fold Treble】🔥
📊 วิเคราะห์คัดกรองจากตารางแข่งขันจริงวันนี้ (ความแม่นยำเฉลี่ย ${accumulator.confidenceScore}% > 97% Target)
📅 ประจำวันที่ ${accumulator.date}
⏰ โพสต์ล่วงหน้าก่อนการแข่งขันเริ่ม ${config.autoPostLeadHours} ชั่วโมง

⭐ คัดสรร 3 คู่เน้นๆ สเต็ป 3 พารวย (Win 3-Fold Treble):
----------------------------------------
${accumulator.matches
  .map(
    (m, i) =>
      `${i + 1}. [${m.league}] ${m.homeTeam} VS ${m.awayTeam} (เตะ ${new Date(m.kickOffTime).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })} น.)\n   🎯 ฟันธง: ${m.recommendedPick} (อัตราความมั่นใจ ${m.individualWinProbability}% | ค่าน้ำ @${m.decimalOdds.toFixed(2)})\n   💡 สถิติสำคัญ: ${m.aiRationale}`
  )
  .join('\n\n')}
----------------------------------------
💰 ค่าน้ำรวมสเต็ป 3: @${accumulator.combinedOdds.toFixed(2)} เท่า (เกินเป้าหมาย @3.5+)
📈 Compound Probability: ${accumulator.compoundProbability}% (Strict Risk Filter)
✅ แหล่งข้อมูล: ตารางแข่งขันจริง (Verified Real Matchday Schedule)

📌 ติดตามบทวิเคราะห์เต็มและชาร์ตสถิติ H2H ได้ที่หน้าเพจของเรา
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

      {/* 24/7 Always-On & Keep-Alive Monitoring Setup Guide */}
      <div className="rounded-xl border border-sky-500/30 bg-gradient-to-br from-slate-900 via-slate-900 to-sky-950/20 p-5 shadow-lg space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-sky-500/20 border border-sky-500/40 flex items-center justify-center shrink-0">
              <Radio className="w-4 h-4 text-sky-400 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-sm sm:text-base font-bold text-white">
                  วิธีทำให้แอปและบอททำงานต่อเนื่อง 24 ชม. โดยไม่หลับ (24/7 Always-On Setup)
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/30">
                  KEEP-ALIVE ENGINE
                </span>
                {healthInfo && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    ● SERVER ACTIVE ({healthInfo.uptimeSeconds}s)
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                ป้องกันไม่ให้ Cloud Server เข้าสู่โหมด Cold Sleep เมื่อไม่มีคนเข้าเว็บ เพื่อให้บอทคำนวณและโพสต์ Facebook อัตโนมัติ 100%
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            <button
              onClick={checkHealth}
              disabled={isCheckingHealth}
              className="text-xs px-3 py-1.5 rounded-lg bg-sky-500/15 border border-sky-500/30 text-sky-300 hover:bg-sky-500/25 transition-colors cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
            >
              <Activity className={`w-3.5 h-3.5 text-sky-400 ${isCheckingHealth ? 'animate-spin' : ''}`} />
              <span>{isCheckingHealth ? 'กำลังเช็ค...' : 'ทดสอบสถานะ Server'}</span>
            </button>

            <button
              onClick={() => setShow247Guide(!show247Guide)}
              className="text-xs px-2.5 py-1.5 rounded-lg border border-slate-700 bg-slate-800 text-slate-300 hover:text-white transition-colors cursor-pointer"
            >
              <span>{show247Guide ? 'ย่อสรุป' : 'ดูวิธีตั้งค่าฟรี 100%'}</span>
            </button>
          </div>
        </div>

        {show247Guide && (
          <div className="space-y-4 pt-1 animate-in fade-in duration-200">
            {/* Ping URL box */}
            <div className="p-3.5 rounded-lg bg-slate-950/70 border border-slate-800 space-y-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                  <Server className="w-3.5 h-3.5 text-sky-400" />
                  <span>URL Keep-Alive / Cron Endpoint (นำไปใส่ใน UptimeRobot เพื่อสั่งปลุกและเช็คโพสต์อัตโนมัติ):</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={copyPingUrl}
                    className="self-start sm:self-auto text-xs px-2.5 py-1 rounded bg-sky-500/20 text-sky-300 border border-sky-500/30 hover:bg-sky-500/30 transition-colors cursor-pointer flex items-center gap-1 font-semibold"
                  >
                    {healthCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{healthCopied ? 'คัดลอกสำเร็จ!' : 'คัดลอก URL'}</span>
                  </button>
                </div>
              </div>

              <div className="p-2 rounded bg-slate-900 border border-slate-800/80 font-mono text-xs text-sky-300 break-all select-all flex items-center justify-between">
                <span>{pingUrl}</span>
                <span className="text-[10px] text-slate-400 font-sans ml-2 shrink-0">(หรือเติม ?source=uptimerobot)</span>
              </div>
            </div>

            {/* Platform Selection Tabs */}
            <div className="flex items-center gap-1 border-b border-slate-800 pb-2 overflow-x-auto text-xs">
              <button
                onClick={() => setSelected247Tab('vercel')}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                  selected247Tab === 'vercel'
                    ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                <span>1. Vercel + UptimeRobot (ฟรี 100%)</span>
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
                <span>2. Cloud Run ปรับให้ฟรี $0.00</span>
              </button>

              <button
                onClick={() => setSelected247Tab('render')}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                  selected247Tab === 'render'
                    ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <Activity className="w-3.5 h-3.5 text-purple-400" />
                <span>3. Render.com + Uptime (ฟรี 100%)</span>
              </button>

              <button
                onClick={() => setSelected247Tab('uptimerobot')}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                  selected247Tab === 'uptimerobot'
                    ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <HelpCircle className="w-3.5 h-3.5 text-blue-400" />
                <span>4. คู่มือตั้งค่า UptimeRobot (3 นาที)</span>
              </button>
            </div>

            {/* Tab 1: Vercel */}
            {selected247Tab === 'vercel' && (
              <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-3 animate-in fade-in duration-150">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-sky-300">ใช้ Vercel + UptimeRobot.com ได้ไหม?</span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/30">
                      ทำได้แน่นอน ฟรี 100%!
                    </span>
                  </div>
                  <span className="text-xs text-slate-400">ค่าใช้จ่าย: 0 บาท / เดือน</span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  <strong>คำตอบคือ ได้แน่นอนครับ!</strong> และเป็นวิธีที่คนนิยมใช้มากเพื่อประหยัดค่าใช้จ่าย แต่ต้องเข้าใจกลไกของ Vercel 1 เรื่อง:
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 space-y-1.5">
                    <div className="font-bold text-amber-400 flex items-center gap-1.5">
                      <span>⚠️ ข้อจำกัดเดิมของ Vercel (Serverless)</span>
                    </div>
                    <p className="text-slate-400 text-[11px] leading-relaxed">
                      Vercel เป็น Serverless Function ไม่ใช่เซิร์ฟเวอร์ที่รันค้างไว้ 24 ชม. คำสั่ง <code className="text-amber-300 bg-slate-950 px-1 rounded">setInterval()</code> ในโค้ดจะไม่ทำงานเมื่อไม่มีคนเข้าเว็บ
                    </p>
                  </div>

                  <div className="p-3 rounded-lg bg-emerald-950/30 border border-emerald-800/50 space-y-1.5">
                    <div className="font-bold text-emerald-300 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>💡 ทางแก้: ใช้ UptimeRobot เป็นตัวกระตุ้น (Trigger)</span>
                    </div>
                    <p className="text-slate-300 text-[11px] leading-relaxed">
                      เมื่อตั้ง UptimeRobot ให้ยิง Ping มาที่ <code className="text-emerald-300 bg-slate-950 px-1 rounded">/api/health</code> ทุก <strong>5 นาที</strong>: Vercel จะตื่นขึ้นมาเช็คเวลา 6 ชม. ก่อนเตะทันที หากถึงเวลาจะสั่ง AI โพสต์ Facebook ให้อัตโนมัติใน 0.5 วินาที!
                    </p>
                  </div>
                </div>

                <div className="p-2.5 rounded-lg bg-blue-950/20 border border-blue-800/40 text-[11px] text-blue-200 space-y-1">
                  <div className="font-semibold flex items-center gap-1 text-blue-300">
                    <Zap className="w-3.5 h-3.5" /> โควต้าการใช้งาน Vercel ฟรี (Hobby Plan):
                  </div>
                  <div>• Vercel ให้ฟรี <strong>100,000 ครั้ง/วัน</strong> (Serverless Function Invocations)</div>
                  <div>• UptimeRobot ยิงทุก 5 นาที = วันละเพียง <strong>288 ครั้งเท่านั้น</strong> (ใช้โควต้าไม่ถึง 0.3%) ไม่เสียค่าใช้จ่ายแน่นอน 100%!</div>
                </div>
              </div>
            )}

            {/* Tab 2: Cloud Run $0 */}
            {selected247Tab === 'cloudrun' && (
              <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-3 animate-in fade-in duration-150">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-sky-300">ความจริงเกี่ยวกับ Google Cloud Run: จริงๆ แล้วฟรี $0.00 บาท!</span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/30">
                      ฟรี 2 ล้านคำขอ/เดือน
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  หลายท่านเข้าใจว่า Cloud Run มีค่าใช้จ่ายสูง เพราะอาจจะเผลอไปเปิด <strong>&quot;Minimum instances = 1&quot;</strong> หรือเปิด <strong>&quot;CPU always allocated&quot;</strong> ทำให้เซิร์ฟเวอร์คิดเงินค่า CPU ตลอด 24 ชม. (~$5-$10/เดือน)
                </p>

                <div className="p-3 rounded-lg bg-emerald-950/30 border border-emerald-800/50 space-y-2 text-xs">
                  <div className="font-bold text-emerald-300 flex items-center gap-1.5">
                    <Coins className="w-4 h-4" />
                    <span>วิธีตั้งค่า Cloud Run ให้กลายเป็น ฟรี 0 บาท ($0.00 / เดือน):</span>
                  </div>
                  <ol className="list-decimal list-inside space-y-1 text-slate-300 text-[11px]">
                    <li>เข้าไปที่ Google Cloud Console &rarr; Cloud Run &rarr; เลือก Service ของคุณ &rarr; กด <strong>Edit &amp; Deploy New Revision</strong></li>
                    <li>หัวข้อ <strong>Autoscaling</strong>: ตั้งค่า <code className="text-emerald-300 bg-slate-900 px-1 rounded">Minimum number of instances = 0</code> (เปิดระบบ Scale to Zero เมื่อไม่มีคนเข้า)</li>
                    <li>หัวข้อ <strong>CPU allocation</strong>: ตรวจสอบให้เลือกเป็น <code className="text-emerald-300 bg-slate-900 px-1 rounded">CPU is only allocated during request processing</code></li>
                    <li>ใช้ <strong>UptimeRobot ยิง Ping ทุก 5 นาที</strong>: เดือนนึงจะใช้แค่ ~8,640 คำขอ ซึ่ง <strong>Google Cloud ให้โควต้าฟรีถึง 2,000,000 คำขอ/เดือน!</strong> บิลจึงออกมา <strong>$0.00 บาท</strong> 100%!</li>
                  </ol>
                </div>
              </div>
            )}

            {/* Tab 3: Render.com */}
            {selected247Tab === 'render' && (
              <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-3 animate-in fade-in duration-150">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-sky-300">ทางเลือกยอดนิยมอีกทาง: Render.com (Free Web Service) + UptimeRobot</span>
                    <span className="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-[10px] font-bold border border-purple-500/30">
                      ฟรี 750 ชม./เดือน (เต็ม 31 วัน)
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  Render.com รองรับ Node.js + Express แบบดั้งเดิม 100% (ไม่ต้องแปลงโค้ดเป็น Serverless เลย) โดยปกติแพ็กเกจฟรีจะเข้าสู่โหมด Sleep หากไม่มีผู้ใช้งานติดต่อกันเกิน 15 นาที
                </p>

                <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 space-y-2 text-xs">
                  <div className="font-bold text-sky-300 flex items-center gap-1.5">
                    <Activity className="w-4 h-4 text-purple-400" />
                    <span>เมื่อนำ UptimeRobot มาจับคู่กับ Render:</span>
                  </div>
                  <ul className="list-disc list-inside space-y-1 text-slate-300 text-[11px]">
                    <li>UptimeRobot ส่ง Ping ทุก 5 นาที จะทำให้เซิร์ฟเวอร์ Render ไม่เข้าสู่โหมดหลับเลย รันได้ตลอด 24 ชม. ต่อเนื่อง</li>
                    <li>แพ็กเกจ Free ของ Render ให้ 750 Compute Hours ต่อเดือน ซึ่งเทียบเท่ากับ <strong>31 วัน x 24 ชม. พอดีเป๊ะ</strong></li>
                    <li>คำสั่ง <code className="text-sky-300 bg-slate-950 px-1 rounded">setInterval()</code> ทำงานต่อเนื่องตลอด 24 ชม. ไม่สะดุด</li>
                  </ul>
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
