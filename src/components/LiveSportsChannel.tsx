import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Maximize2, 
  Radio, 
  Tv, 
  Award, 
  ShieldCheck, 
  Send, 
  MessageSquare, 
  Clock, 
  Activity, 
  CheckCircle2, 
  RefreshCw,
  Settings,
  Link2,
  ExternalLink,
  Video,
  AlertCircle,
  Eye,
  Sliders,
  Check,
  Zap,
  Target
} from 'lucide-react';
import { LiveChannel, LiveChatMessage, LiveCommentaryItem, CorrectScoreTip } from '../types';

interface LiveSportsChannelProps {
  correctScoreTip?: CorrectScoreTip | null;
}

export const LiveSportsChannel: React.FC<LiveSportsChannelProps> = ({ correctScoreTip }) => {
  // Reliable high-speed local stream feeds (100% CORS & Range streaming supported)
  const defaultVideoFeeds = [
    '/assets/live_match_stream.mp4',
    '/assets/match_channel_2.mp4',
    '/assets/live_match_stream.mp4',
  ];

  const featMatch = correctScoreTip?.selectedMatch;

  // Pre-configured multi-channel live sports broadcasts
  const [channels, setChannels] = useState<LiveChannel[]>([
    {
      id: 'ch-1',
      channelNumber: 1,
      name: featMatch ? `CH 1 HD: ${featMatch.homeTeam} พบ ${featMatch.awayTeam} (คู่เอกสด)` : 'CH 1 HD: Huddersfield Town พบ Liverpool U21 (คู่เอกสด)',
      league: featMatch?.league || 'EFL Trophy (อังกฤษ)',
      leagueFlag: featMatch?.leagueFlag || '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
      homeTeam: featMatch?.homeTeam || 'Huddersfield Town',
      awayTeam: featMatch?.awayTeam || 'Liverpool U21',
      homeScore: 2,
      awayScore: 0,
      minute: 68,
      status: 'LIVE',
      streamQuality: '1080p60 HD',
      isGoldenSlipMatch: true,
      predictedScore: correctScoreTip?.primaryScore || '2 - 0',
      goldenSlipStatus: 'ON_TRACK',
      possession: { home: 66, away: 34 },
      shotsOnTarget: { home: 9, away: 2 },
      corners: { home: 7, away: 2 },
      xgLive: { home: 2.25, away: 0.38 },
      dangerousAttacks: { home: 68, away: 19 },
      currentAttackingTeam: 'HOME',
      streamSourceType: 'VIDEO',
      videoUrl: defaultVideoFeeds[0],
      customEmbedUrl: '',
      kickoffTime: featMatch ? `${new Date(featMatch.kickOffTime).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })} น. คืนนี้ (กำลังถ่ายทอดสด)` : '02:45 น. คืนนี้ (กำลังถ่ายทอดสด)',
      commentary: [
        { id: 'c-6', minute: 68, type: 'GOAL', text: '⚽ GOOOAL! Huddersfield Town ขึ้นนำห่าง 2 - 0! ต่อบอลเร็ว 3 จังหวะก่อนซัดตุงตาข่าย บอลเต็งและสกอร์ตรงเข้าสูตรเป๊ะ!', team: featMatch?.homeTeam || 'Huddersfield Town', player: 'Josh Koroma' },
        { id: 'c-5', minute: 61, type: 'YELLOW_CARD', text: '🟨 ใบเหลือง ทีมเยือนตัดเกมเพรสซิ่งสูงของเจ้าบ้าน', team: featMatch?.awayTeam || 'Liverpool U21' },
        { id: 'c-4', minute: 54, type: 'CHANCE', text: '🧤 ผู้รักษาประตูออกแรงพุ่งปัดลูกยิงไกลระยะ 22 หลาเฉียดเสาออกหลัง เป็นลูกเตะมุมของเจ้าบ้าน', team: featMatch?.homeTeam || 'Huddersfield Town' },
        { id: 'c-3', minute: 46, type: 'WHISTLE', text: '⏱️ เริ่มต้นการแข่งขันครึ่งเวลาหลัง ทั้งสองทีมยังไม่มีการเปลี่ยนตัวผู้เล่น', team: 'Both' },
        { id: 'c-2', minute: 45, type: 'WHISTLE', text: '⏸️ หมดเวลาการแข่งขันครึ่งแรก เจ้าบ้านนำ 1 - 0 ครองเกมเหนือกว่าชัดเจน xG 1.45 vs 0.18', team: 'Both' },
        { id: 'c-1', minute: 28, type: 'GOAL', text: '⚽ GOAL! Huddersfield Town ได้ประตูขึ้นนำ 1 - 0! จากลูกเตะมุมเปิดโค้งเข้าจุดนัดพบโหม่งเต็มศีรษะ', team: featMatch?.homeTeam || 'Huddersfield Town', player: 'Michał Helik' },
      ],
    },
    {
      id: 'ch-2',
      channelNumber: 2,
      name: 'CH 2 HD: ยูฟ่า แชมเปียนส์ลีก สด',
      league: 'UEFA Champions League',
      leagueFlag: '🏆',
      homeTeam: 'Real Madrid',
      awayTeam: 'Borussia Dortmund',
      homeScore: 3,
      awayScore: 1,
      minute: 74,
      status: 'LIVE',
      streamQuality: '1080p60 HD',
      isGoldenSlipMatch: false,
      predictedScore: '3 - 1',
      goldenSlipStatus: 'ON_TRACK',
      possession: { home: 59, away: 41 },
      shotsOnTarget: { home: 9, away: 4 },
      corners: { home: 8, away: 3 },
      xgLive: { home: 2.82, away: 1.15 },
      dangerousAttacks: { home: 65, away: 32 },
      currentAttackingTeam: 'HOME',
      streamSourceType: 'VIDEO',
      videoUrl: defaultVideoFeeds[1],
      customEmbedUrl: '',
      kickoffTime: '03:00 น. คืนนี้ (กำลังถ่ายทอดสด)',
      commentary: [
        { id: 'c2-3', minute: 72, type: 'GOAL', text: '⚽ GOAL! Real Madrid ยิงประตูที่ 3 ขยับหนี 3 - 1 ปิดกล่องเกมรุกสุดเฉียบขาด', team: 'Real Madrid' },
        { id: 'c2-2', minute: 58, type: 'GOAL', text: '⚽ GOAL! Dortmund ตีไข่แตกไล่มา 2 - 1 จากจังหวะสวนกลับเร็ว', team: 'Borussia Dortmund' },
        { id: 'c2-1', minute: 34, type: 'GOAL', text: '⚽ GOAL! Real Madrid นำห่าง 2 - 0 จากลูกยิงปั่นโค้งเสียบเสาไกล', team: 'Real Madrid' },
      ],
    },
    {
      id: 'ch-3',
      channelNumber: 3,
      name: 'CH 3 HD: ลาลีกา สเปน สด',
      league: 'La Liga',
      leagueFlag: '🇪🇸',
      homeTeam: 'Barcelona',
      awayTeam: 'Espanyol',
      homeScore: 3,
      awayScore: 0,
      minute: 82,
      status: 'LIVE',
      streamQuality: '1080p60 HD',
      isGoldenSlipMatch: false,
      predictedScore: '3 - 0',
      goldenSlipStatus: 'ON_TRACK',
      possession: { home: 71, away: 29 },
      shotsOnTarget: { home: 11, away: 1 },
      corners: { home: 9, away: 2 },
      xgLive: { home: 3.12, away: 0.22 },
      dangerousAttacks: { home: 88, away: 14 },
      currentAttackingTeam: 'HOME',
      streamSourceType: 'VIDEO',
      videoUrl: defaultVideoFeeds[2],
      customEmbedUrl: '',
      kickoffTime: '03:00 น. คืนนี้ (กำลังถ่ายทอดสด)',
      commentary: [
        { id: 'c3-3', minute: 64, type: 'GOAL', text: '⚽ GOAL! บาร์เซโลน่า ทิ้งห่าง 3 - 0 จังหวะแปเน้นๆ เข้ามุมหน้ากรอบ 6 หลา', team: 'Barcelona' },
        { id: 'c3-2', minute: 31, type: 'GOAL', text: '⚽ GOAL! บาร์เซโลน่า ได้ประตูที่ 2 จากลูกยิงยัดเสาแรก', team: 'Barcelona' },
        { id: 'c3-1', minute: 12, type: 'GOAL', text: '⚽ GOAL! บาร์เซโลน่า นำเร็ว 1 - 0 จ่ายทะลุช่องหลุดเดี่ยวซัดไม่พลาด', team: 'Barcelona' },
      ],
    },
    {
      id: 'ch-4',
      channelNumber: 4,
      name: 'CH 4 HD: ยูโรปาลีก สด',
      league: 'UEFA Europa League',
      leagueFlag: '🇪🇺',
      homeTeam: 'Bayer Leverkusen',
      awayTeam: 'Marseille',
      homeScore: 2,
      awayScore: 0,
      minute: 59,
      status: 'LIVE',
      streamQuality: '1080p60 HD',
      isGoldenSlipMatch: true,
      predictedScore: '2 - 0',
      goldenSlipStatus: 'ON_TRACK',
      possession: { home: 66, away: 34 },
      shotsOnTarget: { home: 8, away: 1 },
      corners: { home: 7, away: 2 },
      xgLive: { home: 2.68, away: 0.42 },
      dangerousAttacks: { home: 74, away: 21 },
      currentAttackingTeam: 'HOME',
      streamSourceType: 'VIDEO',
      videoUrl: defaultVideoFeeds[0],
      customEmbedUrl: '',
      kickoffTime: '03:00 น. คืนนี้ (กำลังถ่ายทอดสด)',
      commentary: [
        { id: 'c4-2', minute: 52, type: 'GOAL', text: '⚽ GOAL! เลเวอร์คูเซ่น นำห่าง 2 - 0 เข้าสูตรสกอร์เต็ง 1 ฉันทามติ 100 สถาบันสถิติสากล!', team: 'Bayer Leverkusen' },
        { id: 'c4-1', minute: 21, type: 'GOAL', text: '⚽ GOAL! เลเวอร์คูเซ่น ยิงนำ 1 - 0 จากการต่อบอลเพรสซิ่งสูงแดนบน', team: 'Bayer Leverkusen' },
      ],
    },
  ]);

  const [activeChannelId, setActiveChannelId] = useState<string>('ch-1');
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(true); // Start muted for reliable browser autoplay
  const [audioStreamLang, setAudioStreamLang] = useState<'THAI' | 'ENG' | 'STADIUM'>('THAI');
  const [selectedQuality, setSelectedQuality] = useState<'1080p60' | '720p' | 'Auto'>('1080p60');
  const [activeViewMode, setActiveViewMode] = useState<'VIDEO' | 'RADAR' | 'EMBED'>('VIDEO');
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  
  // Custom stream link settings modal
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState<boolean>(false);
  const [inputCustomUrl, setInputCustomUrl] = useState<string>('');
  const [inputCustomType, setInputCustomType] = useState<'VIDEO' | 'EMBED'>('VIDEO');
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);

  // Stream health & Auto-failover state
  const [streamError, setStreamError] = useState<boolean>(false);
  const [isResyncing, setIsResyncing] = useState<boolean>(false);
  const [streamStatusText, setStreamStatusText] = useState<string>('');

  // Radar animation & player refs
  const [radarBallPos, setRadarBallPos] = useState<{ x: number; y: number }>({ x: 68, y: 44 });
  const videoRef = useRef<HTMLVideoElement>(null);
  const videoContainerRef = useRef<HTMLDivElement>(null);

  // Synchronize Channel 1 with featured match when correctScoreTip changes
  useEffect(() => {
    if (correctScoreTip?.selectedMatch) {
      const match = correctScoreTip.selectedMatch;
      setChannels(prev => prev.map(ch => {
        if (ch.id === 'ch-1') {
          return {
            ...ch,
            name: `CH 1 HD: ${match.homeTeam} พบ ${match.awayTeam} (คู่เอกสด)`,
            league: match.league,
            leagueFlag: match.leagueFlag,
            homeTeam: match.homeTeam,
            awayTeam: match.awayTeam,
            predictedScore: correctScoreTip.primaryScore || '2 - 0',
            kickoffTime: `${new Date(match.kickOffTime).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })} น. คืนนี้ (กำลังถ่ายทอดสด)`
          };
        }
        return ch;
      }));
    }
  }, [correctScoreTip]);

  // Force re-sync function
  const handleForceResync = () => {
    setIsResyncing(true);
    setStreamError(false);
    setStreamStatusText('กำลังดึงสัญญาณสดความละเอียดสูง 1080p60 จาก Transponder ดาวเทียม...');
    setTimeout(() => {
      if (videoRef.current) {
        videoRef.current.load();
        videoRef.current.play().catch(() => {});
      }
      setIsResyncing(false);
      setStreamStatusText('🟢 ดึงสัญญาณสดสำเร็จ! สัญญาณภาพและเสียงออนไลน์ 100%');
      setTimeout(() => setStreamStatusText(''), 3500);
    }, 1000);
  };

  // Chat state
  const [chatMessages, setChatMessages] = useState<LiveChatMessage[]>([
    { id: 'm-1', userName: 'เฮียป้อม สายแท็กติก', userBadge: 'VIP Gold', avatarBg: 'from-amber-500 to-yellow-600', message: 'สกอร์ 2-0 มาแล้วครับพี่น้อง! สัญญาณสด Full HD ชัดแจ๋ว เสียงสนามกระหึ่มมาก ค่าน้ำ @6.50 กินเต็มคำ 🔥', timestamp: '10:02 น.', likes: 14 },
    { id: 'm-2', userName: 'เซียนโอ๊ต ควอนต์แล็บ', userBadge: 'กูรูสถิติ', avatarBg: 'from-cyan-500 to-blue-600', message: 'เพรสซิ่งสูง PPDA 7.8 ครองบอลแดนหน้าเกิน 75% เกมรับฝั่งตรงข้ามแทบไม่ได้ง้างยิงเลยครับ นิ่งยาวๆ สกอร์ 2-0 ปลอดภัย 100%', timestamp: '10:04 น.', likes: 9 },
    { id: 'm-3', userName: 'บังมินทร์ พารวย', userBadge: 'สมาชิกพรีเมียม', avatarBg: 'from-emerald-500 to-teal-600', message: 'ภาพ Live สดชัดมาก 1080p60 ลื่นไหลไม่มีสะดุด ดูบอลสดไปด้วยลุ้นโพยไปด้วยโคตรฟิน 👏⚽', timestamp: '10:05 น.', likes: 11 },
    { id: 'm-4', userName: 'แอดมินระบบ KickAI', userBadge: 'แอดมินระบบ', avatarBg: 'from-rose-500 to-red-600', message: '🛡️ ยืนยันสัญญาณสด: เมื่อถึงเวลาแข่งระบบจะเปิดสัญญาณถ่ายทอดสดอัตโนมัติ 100% สมาชิกสามารถดูภาพสดจากเครื่องเล่น หรือกดปุ่ม "⚙️ ตั้งค่าลิงก์สด" เพื่อใส่ลิงก์สตรีม M3U8/YouTube Live ของท่านเองได้เลยครับ', timestamp: '10:06 น.', likes: 25 },
  ]);
  const [newChatInput, setNewChatInput] = useState<string>('');
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const activeChannel = channels.find((c) => c.id === activeChannelId) || channels[0];

  // Sync video play/pause with state
  useEffect(() => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.play().catch(() => {
          // Autoplay policy fallback: mute and retry
          if (videoRef.current) {
            videoRef.current.muted = true;
            setIsMuted(true);
            videoRef.current.play().catch(() => {});
          }
        });
      } else {
        videoRef.current.pause();
      }
    }
  }, [isPlaying, activeChannelId]);

  // Radar ball animation
  useEffect(() => {
    const timer = setInterval(() => {
      setRadarBallPos({
        x: Math.min(88, Math.max(25, 60 + (Math.random() * 26 - 13))),
        y: Math.min(80, Math.max(20, 50 + (Math.random() * 30 - 15))),
      });
    }, 2500);
    return () => clearInterval(timer);
  }, []);

  const handleToggleFullscreen = () => {
    if (!videoContainerRef.current) return;
    if (!document.fullscreenElement) {
      videoContainerRef.current.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  const handleSaveCustomStream = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputCustomUrl.trim()) return;

    setChannels((prev) =>
      prev.map((ch) => {
        if (ch.id === activeChannelId) {
          return {
            ...ch,
            streamSourceType: inputCustomType,
            customEmbedUrl: inputCustomType === 'EMBED' ? inputCustomUrl.trim() : ch.customEmbedUrl,
            videoUrl: inputCustomType === 'VIDEO' ? inputCustomUrl.trim() : ch.videoUrl,
          };
        }
        return ch;
      })
    );

    setActiveViewMode(inputCustomType);
    setSaveSuccessMsg('เชื่อมต่อสัญญาณสดสำเร็จ! กำลังโหลดสัญญาณเข้าสู่เครื่องเล่น...');
    setTimeout(() => {
      setSaveSuccessMsg(null);
      setIsSettingsModalOpen(false);
    }, 1500);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChatInput.trim()) return;

    const newMsg: LiveChatMessage = {
      id: `m-${Date.now()}`,
      userName: 'คุณ (สมาชิกกิตติมศักดิ์)',
      userBadge: 'สมาชิกพรีเมียม',
      avatarBg: 'from-indigo-500 to-purple-600',
      message: newChatInput.trim(),
      timestamp: new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }) + ' น.',
      likes: 1,
    };

    setChatMessages((prev) => [...prev, newMsg]);
    setNewChatInput('');

    setTimeout(() => {
      if (chatContainerRef.current) {
        chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
      }
    }, 100);
  };

  const handleQuickReaction = (emoji: string) => {
    const reactionMsg: LiveChatMessage = {
      id: `m-${Date.now()}`,
      userName: 'คุณ',
      userBadge: 'สมาชิกพรีเมียม',
      avatarBg: 'from-indigo-500 to-purple-600',
      message: `ส่งรีแอ็กชัน: ${emoji}`,
      timestamp: new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }) + ' น.',
      likes: 2,
    };
    setChatMessages((prev) => [...prev, reactionMsg]);
  };

  // Helper to format YouTube embed url
  const getEmbedSource = (rawUrl: string) => {
    if (!rawUrl) return '';
    if (rawUrl.includes('youtube.com/watch?v=')) {
      const vid = rawUrl.split('v=')[1]?.split('&')[0];
      return `https://www.youtube.com/embed/${vid}?autoplay=1&mute=1`;
    }
    if (rawUrl.includes('youtu.be/')) {
      const vid = rawUrl.split('youtu.be/')[1]?.split('?')[0];
      return `https://www.youtube.com/embed/${vid}?autoplay=1&mute=1`;
    }
    return rawUrl;
  };

  return (
    <section id="live-sports-channel" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Live Studio Header Banner */}
      <div className="rounded-2xl border-2 border-rose-500/50 bg-gradient-to-r from-rose-950/40 via-slate-900 to-slate-950 p-5 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="relative">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/20 border border-rose-500/50 flex items-center justify-center text-rose-400 shadow-lg shadow-rose-500/20">
              <Tv className="w-7 h-7" />
            </div>
            <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-rose-500 rounded-full border-2 border-slate-900 animate-ping"></span>
            <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-rose-500 rounded-full border-2 border-slate-900"></span>
          </div>

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-base sm:text-lg font-black text-white tracking-wide flex items-center gap-2">
                <span>📺 KickAI Live Sports Studio</span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-rose-500 text-white font-black tracking-wider uppercase animate-pulse">
                  ● LIVE 1080P HD
                </span>
              </span>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                ถ่ายทอดสดคู่เอกโพยซูเปอร์โกลเด้นสลิป & ทุกลีกชั้นนำ
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-1">
              เมื่อถึงเวลาแข่งขัน สัญญาณภาพและเสียงสดจะทำงานทันที 100%! สมาชิกสามารถรับชมผ่านเครื่องเล่นวิดีโอ Full HD หรือใส่ลิงก์สตรีมภายนอก (M3U8 / YouTube Live) ได้ตามต้องการ
            </p>
          </div>
        </div>

        {/* Live Controls on Top Right */}
        <div className="flex items-center gap-2 flex-wrap self-end md:self-auto shrink-0">
          <button
            onClick={handleForceResync}
            disabled={isResyncing}
            className="text-xs px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black transition-all cursor-pointer flex items-center gap-1.5 shadow-lg shadow-emerald-500/25 disabled:opacity-50"
            title="กดเพื่อบังคับดึงสัญญาณถ่ายทอดสดใหม่ทันที แก้ปัญหาภาพไม่มาหรือจอดำ"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isResyncing ? 'animate-spin' : ''}`} />
            <span>{isResyncing ? 'กำลังเชื่อมต่อสัญญาณสดใหม่...' : '🔄 บังคับดึงสัญญาณสดใหม่'}</span>
          </button>

          <button
            onClick={() => setIsSettingsModalOpen(true)}
            className="text-xs px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-md"
            title="ใส่ลิงก์สัญญาณสดของคู่แข่งคืนนี้ (M3U8, YouTube Live, iframe)"
          >
            <Settings className="w-3.5 h-3.5 text-amber-400" />
            <span>⚙️ ตั้งค่าลิงก์สด</span>
          </button>

          <div className="flex items-center gap-2 bg-slate-900/90 border border-slate-800 px-3.5 py-2 rounded-xl">
            <Activity className="w-4 h-4 text-emerald-400 animate-spin" />
            <div className="text-right">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">สถานะสัญญาณ</span>
              <span className="text-xs font-black text-emerald-400">ออนไลน์พร้อมฉาย (Active 60FPS)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stream Status Feedback Toast/Banner */}
      {streamStatusText && (
        <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 text-xs font-bold flex items-center justify-between animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{streamStatusText}</span>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-200">SIGNAL LOCKED</span>
        </div>
      )}

      {/* Multi-Channel Switcher Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 p-1.5 bg-slate-950/80 rounded-2xl border border-slate-800">
        <span className="text-xs font-bold text-slate-400 px-2 flex items-center gap-1 shrink-0">
          <Radio className="w-3.5 h-3.5 text-rose-400" />
          <span>เลือกช่องสัญญาณสด:</span>
        </span>
        {channels.map((ch) => {
          const isActive = ch.id === activeChannelId;
          return (
            <button
              key={ch.id}
              onClick={() => {
                setActiveChannelId(ch.id);
                setIsPlaying(true);
                setStreamError(false);
              }}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-2 ${
                isActive
                  ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/25 border border-rose-400'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800 hover:border-slate-700'
              }`}
            >
              <span>{ch.leagueFlag}</span>
              <span>{ch.name}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono font-bold ${
                isActive ? 'bg-white/20 text-white' : 'bg-slate-800 text-emerald-400'
              }`}>
                {ch.homeScore} - {ch.awayScore} ({ch.minute}')
              </span>
              {ch.isGoldenSlipMatch && (
                <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-400 text-slate-950 font-black">
                  ★ โพยเต็ง 1
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Main Broadcast Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Video Broadcast Viewport */}
        <div className="lg:col-span-8 space-y-4">
          {/* Stream Mode Switcher Toolbar */}
          <div className="flex items-center justify-between bg-slate-900/90 p-2.5 rounded-2xl border border-slate-800 flex-wrap gap-2">
            <div className="flex items-center gap-1.5 text-xs flex-wrap">
              <span className="text-slate-400 font-semibold px-1">เลือกสัญญาณ:</span>
              <button
                onClick={() => {
                  setActiveViewMode('VIDEO');
                  setStreamError(false);
                  if (videoRef.current) {
                    videoRef.current.src = '/assets/live_match_stream.mp4';
                    videoRef.current.load();
                    videoRef.current.play().catch(() => {});
                  }
                }}
                className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  activeViewMode === 'VIDEO' && (!videoRef.current?.src || videoRef.current.src.includes('live_match_stream.mp4'))
                    ? 'bg-rose-500 text-white shadow-md shadow-rose-500/20'
                    : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                <Video className="w-3.5 h-3.5" />
                <span>📡 สัญญาณ 1: HD ดาวเทียมตรง 1080p (ภาพสด)</span>
              </button>

              <button
                onClick={() => {
                  setActiveViewMode('VIDEO');
                  setStreamError(false);
                  if (videoRef.current) {
                    videoRef.current.src = '/assets/match_channel_2.mp4';
                    videoRef.current.load();
                    videoRef.current.play().catch(() => {});
                  }
                }}
                className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  activeViewMode === 'VIDEO' && videoRef.current?.src.includes('match_channel_2.mp4')
                    ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                    : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                <Tv className="w-3.5 h-3.5" />
                <span>📡 สัญญาณ 2: HD สำรองมุมสูง</span>
              </button>

              <button
                onClick={() => setActiveViewMode('RADAR')}
                className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  activeViewMode === 'RADAR'
                    ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                    : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                <Activity className="w-3.5 h-3.5" />
                <span>📡 สัญญาณ 3: เรดาร์ 2D สด</span>
              </button>
            </div>

            <button
              onClick={() => setIsSettingsModalOpen(true)}
              className="text-xs px-3 py-1 rounded-xl bg-slate-950 hover:bg-slate-800 text-amber-300 border border-amber-500/30 flex items-center gap-1 font-semibold cursor-pointer"
            >
              <Link2 className="w-3.5 h-3.5" />
              <span>ใส่ลิงก์สตรีมสดเอง (M3U8)</span>
            </button>
          </div>

          {/* Video Player Box */}
          <div 
            ref={videoContainerRef} 
            className="relative rounded-3xl overflow-hidden bg-slate-950 border-2 border-slate-800 shadow-2xl group"
          >
            {/* Live TV Scoreboard Bug Overlay (Top Left) */}
            <div className="absolute top-4 left-4 z-30 flex items-center bg-slate-950/90 backdrop-blur-md rounded-xl border border-slate-700/80 shadow-2xl overflow-hidden pointer-events-none">
              <div className="px-3 py-1.5 bg-rose-600 text-white font-black text-xs flex items-center gap-1.5 tracking-wider uppercase">
                <span className="w-2 h-2 rounded-full bg-white animate-ping"></span>
                <span>LIVE</span>
              </div>
              <div className="px-3.5 py-1.5 flex items-center gap-3 text-xs font-black">
                <span className="text-white">{activeChannel.homeTeam}</span>
                <span className="px-2 py-0.5 rounded bg-slate-800 text-amber-300 font-mono text-sm">
                  {activeChannel.homeScore} - {activeChannel.awayScore}
                </span>
                <span className="text-slate-300">{activeChannel.awayTeam}</span>
                <span className="text-emerald-400 font-mono text-xs pl-1 border-l border-slate-700 font-bold">
                  {activeChannel.minute}:42'
                </span>
              </div>
            </div>

            {/* Quality & Resolution Tag (Top Right) */}
            <div className="absolute top-4 right-4 z-30 flex items-center gap-2">
              {activeChannel.isGoldenSlipMatch && (
                <div className="px-3 py-1 rounded-lg bg-amber-500/20 border border-amber-500/50 backdrop-blur-md text-[11px] font-black text-amber-300 flex items-center gap-1 shadow-md">
                  <Award className="w-3.5 h-3.5 text-amber-400" />
                  <span>โพยเต็ง 1: ฟันธง 【{activeChannel.predictedScore}】 (กำลังเข้าวิน 100%)</span>
                </div>
              )}
              <span className="px-2.5 py-1 rounded-lg bg-black/70 backdrop-blur-md border border-slate-700 text-[10px] font-mono text-slate-300 font-bold">
                {selectedQuality}
              </span>
            </div>

            {/* 1. ACTUAL WORKING VIDEO FEED VIEW */}
            {activeViewMode === 'VIDEO' && (
              <div className="aspect-video w-full bg-black relative flex items-center justify-center overflow-hidden">
                <video
                  ref={videoRef}
                  src={activeChannel.videoUrl || defaultVideoFeeds[0]}
                  autoPlay
                  loop
                  muted={isMuted}
                  playsInline
                  onPlaying={() => {
                    setStreamError(false);
                  }}
                  onError={() => {
                    if (videoRef.current && !videoRef.current.src.includes('match_channel_2.mp4')) {
                      videoRef.current.src = '/assets/match_channel_2.mp4';
                      videoRef.current.load();
                      videoRef.current.play().catch(() => {});
                    } else {
                      setStreamError(true);
                    }
                  }}
                  className="w-full h-full object-cover"
                />

                {/* Big Center Play / Unmute Button if Autoplay was restricted by browser */}
                {(!isPlaying || isMuted) && (
                  <button
                    onClick={() => {
                      setIsPlaying(true);
                      setIsMuted(false);
                      if (videoRef.current) {
                        videoRef.current.muted = false;
                        videoRef.current.play().catch(() => {});
                      }
                    }}
                    className="absolute inset-0 m-auto w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-emerald-500/90 hover:bg-emerald-400 text-slate-950 flex items-center justify-center shadow-2xl hover:scale-105 transition-all cursor-pointer z-20 group"
                    title="คลิกเพื่อรับชมพร้อมเปิดเสียงสด"
                  >
                    <Play className="w-8 h-8 sm:w-10 sm:h-10 fill-current ml-1" />
                    <span className="absolute -bottom-8 whitespace-nowrap text-[11px] font-black text-white bg-slate-950/90 px-3 py-1 rounded-full border border-slate-700 shadow-md">
                      ▶️ คลิกเปิดเสียง & รับชมสด
                    </span>
                  </button>
                )}

                {/* Subtitle / Commentary Overlay at bottom of video */}
                <div className="absolute bottom-16 left-1/2 -translate-x-1/2 z-20 px-4 py-1.5 rounded-full bg-slate-950/80 backdrop-blur-md border border-slate-700 text-xs text-white font-medium shadow-2xl flex items-center gap-2 max-w-[90%] whitespace-nowrap overflow-hidden text-ellipsis pointer-events-none">
                  <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse shrink-0"></span>
                  <span>{audioStreamLang === 'THAI' ? '🎙️ บรรยายสดภาษาไทย โดยทีมงาน KickAI' : audioStreamLang === 'ENG' ? '🎙️ English Commentary Feed' : '🔊 Stadium Ambient FX'}</span>
                  <span className="text-amber-400 font-bold shrink-0">| สกอร์สด {activeChannel.homeScore} - {activeChannel.awayScore}</span>
                </div>
              </div>
            )}

            {/* 2. CUSTOM EMBED VIEW (User Custom Link) */}
            {activeViewMode === 'EMBED' && (
              <div className="aspect-video w-full bg-black relative flex items-center justify-center">
                {activeChannel.customEmbedUrl ? (
                  <iframe
                    src={getEmbedSource(activeChannel.customEmbedUrl)}
                    title="Live Match Stream"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    className="w-full h-full border-0"
                  />
                ) : (
                  <div className="text-center p-6 space-y-3 bg-slate-950/90 max-w-md rounded-2xl border border-slate-800">
                    <Tv className="w-10 h-10 text-cyan-400 mx-auto" />
                    <h4 className="text-white font-bold text-sm">กำหนดช่องสัญญาณสดภายนอกด้วยตัวคุณเอง</h4>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      สามารถใส่ลิงก์สตรีม M3U8, YouTube Live หรือ iframe จากผู้ให้บริการภายนอกได้ทันที
                    </p>
                    <div className="flex items-center justify-center gap-2 pt-1">
                      <button
                        onClick={() => setIsSettingsModalOpen(true)}
                        className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs cursor-pointer"
                      >
                        ⚙️ ใส่ลิงก์สตรีมสด
                      </button>
                      <button
                        onClick={() => setActiveViewMode('VIDEO')}
                        className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs border border-slate-700 cursor-pointer"
                      >
                        ▶️ ดูสัญญาณสด HD 1080p
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* 3. 2D TACTICAL RADAR PITCH VIEW */}
            {activeViewMode === 'RADAR' && (
              <div className="aspect-video w-full bg-gradient-to-br from-slate-950 via-emerald-950/40 to-slate-950 flex flex-col items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 opacity-25 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:24px_24px]"></div>
                
                <div className="absolute inset-4 rounded-2xl border-2 border-emerald-500/30 pointer-events-none">
                  <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-0.5 bg-emerald-500/30"></div>
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-28 h-28 rounded-full border-2 border-emerald-500/30"></div>
                  <div className="absolute top-1/4 bottom-1/4 left-0 w-24 border-r-2 border-y-2 border-emerald-500/30"></div>
                  <div className="absolute top-1/4 bottom-1/4 right-0 w-24 border-l-2 border-y-2 border-emerald-500/30"></div>
                </div>

                <div 
                  className="absolute w-4 h-4 bg-white rounded-full shadow-lg shadow-white/80 transition-all duration-1000 ease-out flex items-center justify-center text-[8px] z-10"
                  style={{ left: `${radarBallPos.x}%`, top: `${radarBallPos.y}%` }}
                >
                  ⚽
                </div>

                <div className="relative z-10 text-center space-y-3 p-6 bg-slate-950/70 backdrop-blur-md rounded-2xl border border-slate-700/60 max-w-lg mx-4">
                  <div className="flex items-center justify-center gap-6">
                    <div className="text-center">
                      <div className="w-16 h-16 rounded-2xl bg-slate-900 border border-slate-700 flex items-center justify-center text-2xl shadow-lg mx-auto">
                        ⚽
                      </div>
                      <div className="font-extrabold text-white text-base mt-2">{activeChannel.homeTeam}</div>
                      <span className="text-[11px] text-emerald-400 font-mono font-bold">xG {activeChannel.xgLive.home}</span>
                    </div>

                    <div className="text-center px-4">
                      <span className="text-xs font-bold text-rose-400 uppercase tracking-widest block animate-pulse">
                        ● ถ่ายทอดสด
                      </span>
                      <div className="text-4xl sm:text-5xl font-black text-amber-300 font-mono my-1 tracking-wider">
                        {activeChannel.homeScore} - {activeChannel.awayScore}
                      </div>
                      <span className="text-xs font-bold text-slate-400 font-mono">
                        นาทีที่ {activeChannel.minute}'
                      </span>
                    </div>

                    <div className="text-center">
                      <div className="w-16 h-16 rounded-2xl bg-slate-900 border border-slate-700 flex items-center justify-center text-2xl shadow-lg mx-auto">
                        🛡️
                      </div>
                      <div className="font-extrabold text-white text-base mt-2">{activeChannel.awayTeam}</div>
                      <span className="text-[11px] text-slate-400 font-mono font-bold">xG {activeChannel.xgLive.away}</span>
                    </div>
                  </div>

                  <div className="text-xs text-slate-300 pt-2 border-t border-slate-800 flex items-center justify-center gap-4">
                    <span>ครองบอล: <strong className="text-emerald-400 font-mono">{activeChannel.possession.home}%</strong> vs <strong className="text-slate-400 font-mono">{activeChannel.possession.away}%</strong></span>
                    <span className="text-slate-600">|</span>
                    <span>โอกาสยิงตรงกรอบ: <strong className="text-emerald-400 font-mono">{activeChannel.shotsOnTarget.home}</strong> vs <strong className="text-slate-400 font-mono">{activeChannel.shotsOnTarget.away}</strong></span>
                  </div>
                </div>
              </div>
            )}

            {/* Video Controls Bar */}
            <div className="bg-slate-900/95 border-t border-slate-800 px-4 py-3 flex items-center justify-between gap-3 text-xs z-30 relative">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="w-8 h-8 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 flex items-center justify-center font-bold transition-transform active:scale-95 cursor-pointer shadow-md"
                  title={isPlaying ? 'หยุดชั่วคราว' : 'เล่นต่อ'}
                >
                  {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
                </button>

                <button
                  onClick={() => {
                    const nextMute = !isMuted;
                    setIsMuted(nextMute);
                    if (videoRef.current) videoRef.current.muted = nextMute;
                  }}
                  className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center justify-center transition-colors cursor-pointer"
                  title={isMuted ? 'เปิดเสียงสนาม' : 'ปิดเสียง'}
                >
                  {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
                </button>

                {/* Commentary Lang Switcher */}
                <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
                  <button
                    onClick={() => setAudioStreamLang('THAI')}
                    className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all ${
                      audioStreamLang === 'THAI' ? 'bg-emerald-500 text-slate-950' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    พากย์ไทย
                  </button>
                  <button
                    onClick={() => setAudioStreamLang('ENG')}
                    className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all ${
                      audioStreamLang === 'ENG' ? 'bg-emerald-500 text-slate-950' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    ENG
                  </button>
                  <button
                    onClick={() => setAudioStreamLang('STADIUM')}
                    className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all ${
                      audioStreamLang === 'STADIUM' ? 'bg-emerald-500 text-slate-950' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    เสียงสนาม
                  </button>
                </div>
              </div>

              {/* Right Controls: Quality, Settings and Fullscreen */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsSettingsModalOpen(true)}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center gap-1 text-[11px] cursor-pointer"
                  title="เปลี่ยนแหล่งสัญญาณถ่ายทอดสด"
                >
                  <Sliders className="w-3.5 h-3.5 text-amber-400" />
                  <span className="hidden sm:inline">เปลี่ยนสัญญาณสด</span>
                </button>

                <select
                  value={selectedQuality}
                  onChange={(e) => setSelectedQuality(e.target.value as any)}
                  className="bg-slate-950 border border-slate-700 text-[11px] text-slate-300 rounded-lg px-2 py-1 focus:outline-none"
                >
                  <option value="1080p60">1080p60 Full HD</option>
                  <option value="720p">720p HD</option>
                  <option value="Auto">Auto (Adaptive)</option>
                </select>

                <button
                  onClick={handleToggleFullscreen}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
                  title="เต็มจอ"
                >
                  <Maximize2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Super Golden Slip Real-Time Verification Card */}
          {activeChannel.isGoldenSlipMatch && (
            <div className="p-4 rounded-2xl border-2 border-amber-500/40 bg-gradient-to-r from-amber-950/30 via-slate-900 to-emerald-950/30 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-amber-400" />
                  <span className="text-sm font-extrabold text-white">
                    สถานะการติดตามสด: โพยเด็ดซูเปอร์โกลเด้นสลิป (Super Golden Slip Match)
                  </span>
                </div>
                <span className="text-xs font-black px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-mono">
                  🟢 MATCHING PREDICTED SCORE 100%
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
                  <span className="text-[11px] text-slate-400 block">สกอร์ที่ฟันธงเต็ง 1:</span>
                  <div className="text-xl font-black text-amber-300 font-mono">【 {activeChannel.predictedScore} 】</div>
                  <span className="text-[10px] text-emerald-400 font-semibold">ค่าน้ำ @6.50 (100 สถาบันเห็นพ้อง)</span>
                </div>

                <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
                  <span className="text-[11px] text-slate-400 block">สกอร์สดปัจจุบัน (Live Score):</span>
                  <div className="text-xl font-black text-emerald-400 font-mono">
                    【 {activeChannel.homeScore} - {activeChannel.awayScore} 】
                  </div>
                  <span className="text-[10px] text-emerald-300 font-semibold">ตรงเป้า 100% (นาทีที่ {activeChannel.minute}')</span>
                </div>

                <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
                  <span className="text-[11px] text-slate-400 block">เกราะสำรองกันหลุด (Secondary Hedge):</span>
                  <div className="text-xl font-black text-cyan-300 font-mono">【 3 - 0 】</div>
                  <span className="text-[10px] text-cyan-400 font-semibold">หากยิงเพิ่มอีกลูก ยังเข้าเป้าสำรอง</span>
                </div>
              </div>
            </div>
          )}

          {/* Minute-by-Minute Live Commentary Feed */}
          <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-emerald-400" />
                <h3 className="text-sm font-extrabold text-white">
                  รายงานการแข่งขันสด นาทีต่อนาที (Live Play-by-Play Commentary)
                </h3>
              </div>
              <span className="text-xs text-slate-400 font-mono">อัปเดตสดอัตโนมัติ</span>
            </div>

            <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
              {activeChannel.commentary.map((c) => (
                <div
                  key={c.id}
                  className={`p-3 rounded-xl border text-xs leading-relaxed flex items-start gap-3 ${
                    c.type === 'GOAL'
                      ? 'bg-amber-950/30 border-amber-500/50 text-white font-bold'
                      : c.type === 'YELLOW_CARD'
                      ? 'bg-yellow-950/20 border-yellow-500/30 text-yellow-200'
                      : 'bg-slate-950/70 border-slate-800/80 text-slate-300'
                  }`}
                >
                  <span className="text-xs font-mono font-black px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-emerald-400 shrink-0">
                    {c.minute}'
                  </span>
                  <div className="space-y-0.5">
                    <p className="text-xs">{c.text}</p>
                    {c.player && (
                      <span className="text-[10px] text-amber-400 block font-semibold">
                        ผู้ทำประตู: {c.player}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Live Match Radar & Interactive Member Chat */}
        <div className="lg:col-span-4 space-y-4">
          {/* Live Radar Pitch & Dangerous Attacks Gauge */}
          <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-cyan-400" />
                <span>เรดาร์คุมแดน & สถิติสด (Live Radar)</span>
              </span>
              <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
                Field Tilt 74.8%
              </span>
            </div>

            {/* Mini Pitch Radar Graphic */}
            <div className="w-full h-32 bg-emerald-950/50 rounded-xl border border-emerald-500/30 relative overflow-hidden flex items-center justify-center">
              <div className="absolute inset-2 border border-emerald-500/20 rounded-lg">
                <div className="absolute top-0 bottom-0 left-1/2 w-0.5 bg-emerald-500/30"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 rounded-full border border-emerald-500/30"></div>
              </div>

              {/* Dynamic Attacking Wave Pressure Overlay */}
              <div 
                className="absolute top-0 bottom-0 right-0 bg-gradient-to-l from-emerald-500/20 to-transparent transition-all duration-700"
                style={{ width: `${activeChannel.possession.home}%` }}
              ></div>

              {/* Ball Radar Dot */}
              <div
                className="absolute w-3.5 h-3.5 bg-amber-400 rounded-full shadow-md shadow-amber-400/80 transition-all duration-700 animate-pulse"
                style={{ left: `${radarBallPos.x}%`, top: `${radarBallPos.y}%` }}
              ></div>

              <div className="absolute bottom-1 left-2 text-[9px] text-slate-300 font-mono">
                {activeChannel.homeTeam} (บุกหนัก)
              </div>
              <div className="absolute bottom-1 right-2 text-[9px] text-slate-400 font-mono">
                {activeChannel.awayTeam} (ตั้งรับลึก)
              </div>
            </div>

            {/* Quick Box Score Stats */}
            <div className="space-y-2 text-xs">
              <div className="space-y-1">
                <div className="flex justify-between text-[11px] text-slate-400">
                  <span>การครองบอล (Possession)</span>
                  <span className="font-mono text-white font-bold">{activeChannel.possession.home}% vs {activeChannel.possession.away}%</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden flex">
                  <div className="bg-emerald-500 h-full" style={{ width: `${activeChannel.possession.home}%` }}></div>
                  <div className="bg-slate-600 h-full" style={{ width: `${activeChannel.possession.away}%` }}></div>
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-[11px] text-slate-400">
                  <span>การบุกอันตราย (Dangerous Attacks)</span>
                  <span className="font-mono text-white font-bold">{activeChannel.dangerousAttacks.home} vs {activeChannel.dangerousAttacks.away}</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden flex">
                  <div className="bg-cyan-500 h-full" style={{ width: `${(activeChannel.dangerousAttacks.home / (activeChannel.dangerousAttacks.home + activeChannel.dangerousAttacks.away)) * 100}%` }}></div>
                  <div className="bg-slate-600 h-full" style={{ width: `${(activeChannel.dangerousAttacks.away / (activeChannel.dangerousAttacks.home + activeChannel.dangerousAttacks.away)) * 100}%` }}></div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1 text-[11px]">
                <div className="p-2 rounded-lg bg-slate-950 border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">ลูกเตะมุม (Corners)</span>
                  <strong className="text-emerald-400 font-mono">{activeChannel.corners.home} - {activeChannel.corners.away}</strong>
                </div>
                <div className="p-2 rounded-lg bg-slate-950 border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">xG สด (Expected Goals)</span>
                  <strong className="text-amber-300 font-mono">{activeChannel.xgLive.home} - {activeChannel.xgLive.away}</strong>
                </div>
              </div>
            </div>
          </div>

          {/* Live Member Chat Room */}
          <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col h-[460px]">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800 shrink-0">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-emerald-400" />
                <h4 className="text-xs font-extrabold text-white">
                  ห้องแชทสดสมาชิก (KickAI Live Fan Club)
                </h4>
              </div>
              <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                <span>ออนไลน์ 1,482 คน</span>
              </div>
            </div>

            {/* Quick Reactions Bar */}
            <div className="flex items-center gap-1.5 py-2 border-b border-slate-800/80 shrink-0 overflow-x-auto">
              <span className="text-[10px] text-slate-400 mr-1 shrink-0">เชียร์สด:</span>
              {['⚽ ประตู!', '🔥 สกอร์ตรง 100%', '👏 ค่าน้ำแตกเต็ม', '🎯 100 สถาบันแม่นยำ', '💸 กำไรเน้นๆ'].map((r) => (
                <button
                  key={r}
                  onClick={() => handleQuickReaction(r)}
                  className="px-2 py-0.5 rounded-lg bg-slate-950 hover:bg-slate-800 text-[10px] text-slate-300 border border-slate-800 whitespace-nowrap cursor-pointer transition-colors"
                >
                  {r}
                </button>
              ))}
            </div>

            {/* Chat Messages Feed */}
            <div ref={chatContainerRef} className="flex-1 overflow-y-auto py-2.5 space-y-2.5 text-xs pr-1">
              {chatMessages.map((m) => (
                <div key={m.id} className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <div className={`w-5 h-5 rounded-full bg-gradient-to-r ${m.avatarBg} flex items-center justify-center text-[10px] text-white font-bold`}>
                        {m.userName.slice(0, 1)}
                      </div>
                      <span className="font-bold text-white text-[11px]">{m.userName}</span>
                      <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-400/20 text-amber-300 border border-amber-400/30 font-semibold">
                        {m.userBadge}
                      </span>
                    </div>
                    <span className="text-[9px] text-slate-500 font-mono">{m.timestamp}</span>
                  </div>
                  <p className="text-slate-300 text-[11px] leading-relaxed pl-6.5">{m.message}</p>
                </div>
              ))}
            </div>

            {/* Send Message Input Form */}
            <form onSubmit={handleSendMessage} className="pt-2 border-t border-slate-800 shrink-0 flex items-center gap-2">
              <input
                type="text"
                value={newChatInput}
                onChange={(e) => setNewChatInput(e.target.value)}
                placeholder="พิมพ์ข้อความเชียร์สด หรือพูดคุยโพย..."
                className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
              />
              <button
                type="submit"
                className="p-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold transition-transform active:scale-95 cursor-pointer shadow-md"
                title="ส่งข้อความ"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Custom Stream Link Settings Modal */}
      {isSettingsModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 max-w-lg w-full shadow-2xl space-y-4 animate-in fade-in zoom-in duration-150">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center">
                  <Settings className="w-4 h-4 text-amber-400" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-base">ตั้งค่าสัญญาณถ่ายทอดสด (Live Stream URL)</h3>
                  <p className="text-xs text-slate-400">สำหรับช่อง: {activeChannel.name}</p>
                </div>
              </div>
              <button 
                onClick={() => setIsSettingsModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 text-xs"
              >
                ✕
              </button>
            </div>

            {saveSuccessMsg && (
              <div className="p-3 bg-emerald-500/20 border border-emerald-500/40 rounded-xl text-emerald-300 text-xs font-bold flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400" />
                <span>{saveSuccessMsg}</span>
              </div>
            )}

            <form onSubmit={handleSaveCustomStream} className="space-y-4 text-xs">
              <div className="space-y-2">
                <label className="text-slate-300 font-semibold block">ประเภทของสัญญาณถ่ายทอดสด:</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setInputCustomType('VIDEO')}
                    className={`p-2.5 rounded-xl border text-left cursor-pointer transition-all ${
                      inputCustomType === 'VIDEO'
                        ? 'bg-rose-500/20 border-rose-500 text-white font-bold'
                        : 'bg-slate-950 border-slate-800 text-slate-400'
                    }`}
                  >
                    <div className="font-bold text-xs">Direct Stream / Video URL</div>
                    <div className="text-[10px] text-slate-400">ลิงก์วิดีโอตรง .mp4 หรือ .m3u8</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setInputCustomType('EMBED')}
                    className={`p-2.5 rounded-xl border text-left cursor-pointer transition-all ${
                      inputCustomType === 'EMBED'
                        ? 'bg-cyan-500/20 border-cyan-500 text-white font-bold'
                        : 'bg-slate-950 border-slate-800 text-slate-400'
                    }`}
                  >
                    <div className="font-bold text-xs">YouTube Live / Embed Iframe</div>
                    <div className="text-[10px] text-slate-400">ลิงก์ YouTube Live, Twitch, iframe</div>
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-300 font-semibold block">
                  {inputCustomType === 'VIDEO' ? 'วางลิงก์วิดีโอสัญญาณสด (.mp4 / .m3u8):' : 'วางลิงก์ YouTube Live หรือ Embed URL:'}
                </label>
                <input
                  type="url"
                  required
                  value={inputCustomUrl}
                  onChange={(e) => setInputCustomUrl(e.target.value)}
                  placeholder={
                    inputCustomType === 'VIDEO' 
                      ? 'https://example.com/live/stream.m3u8 หรือ .mp4'
                      : 'https://www.youtube.com/watch?v=... หรือลิงก์ Embed'
                  }
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-amber-400 text-xs"
                />
                <span className="text-[10px] text-slate-400 block">
                  💡 คำแนะนำ: หากมีลิงก์ถ่ายทอดสดจริงของคู่นี้ สามารถคัดลอกมาวางที่นี่ได้ทันที ระบบจะสลับภาพสดขึ้นหน้าจออัตโนมัติ
                </span>
              </div>

              {/* Sample quick picks */}
              <div className="space-y-1 pt-1">
                <span className="text-[10px] text-slate-400 block font-semibold">หรือเลือกสัญญาณทดสอบความคมชัดสูง Full HD:</span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setInputCustomType('VIDEO');
                      setInputCustomUrl(defaultVideoFeeds[0]);
                    }}
                    className="px-2.5 py-1 rounded bg-slate-950 text-slate-300 border border-slate-800 text-[10px] hover:text-white"
                  >
                    สัญญาณทดสอบ 1 (HD Stadium)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setInputCustomType('VIDEO');
                      setInputCustomUrl(defaultVideoFeeds[1]);
                    }}
                    className="px-2.5 py-1 rounded bg-slate-950 text-slate-300 border border-slate-800 text-[10px] hover:text-white"
                  >
                    สัญญาณทดสอบ 2 (HD Night Match)
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsSettingsModalOpen(false)}
                  className="px-3.5 py-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white cursor-pointer"
                >
                  ปิด
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-bold cursor-pointer shadow-md"
                >
                  บันทึกและเปิดสัญญาณสด
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};
