export interface ConvergenceFactor {
  id: string;
  name: string; // e.g. "โมเดลความน่าจะเป็นปัวซอง (Poisson xG Convergence)"
  englishName: string;
  score: number; // e.g. 98.8%
  threshold: number; // e.g. 98%
  isPassed: boolean;
  weight: string;
  detail: string;
}

export interface CorrectScoreMatrixItem {
  score: string; // e.g. "2 - 0"
  probability: number; // e.g. 38.6%
  odds: number; // e.g. 7.50
  isPrimary: boolean;
  isSecondaryHedge?: boolean;
}

export interface ConsensusInstitute {
  id: string;
  name: string; // e.g. "Opta Sports (Stats Perform)"
  shortName: string;
  country: string; // e.g. "สหราชอาณาจักร"
  flag: string; // e.g. "🇬🇧"
  coreMetric: string; // e.g. "AI Sequence Framework & Post-Shot xG"
  metricValue: string; // e.g. "PSxG +2.24 vs 0.32"
  analysisCategory: 'TACTICAL' | 'XG_MODEL' | 'MARKET_LIQUIDITY' | 'SQUAD_FITNESS' | 'AI_SIMULATION';
  predictedScore: string; // e.g. "2 - 0"
  agreementScore: number; // e.g. 99.4% (Must be > 98.0%)
  threshold: number; // 98.0%
  isPassed: boolean; // true
  keyInsight: string; // e.g. "Opta Supercomputer ชี้ชัดโอกาสจบ 2-0 สูงสุดด้วย xG Gap ขาดลอย"
  tier?: 'GLOBAL_TIER1' | 'SPECIALIST_QUANT' | 'SPORTS_ACADEMIA' | 'MARKET_INSIDERS';
}

export interface TacticalAnalysis {
  homeFormation: string; // e.g. "4-2-3-1 High Press"
  awayFormation: string; // e.g. "5-3-2 Low Block"
  homePpda: number; // Passes Allowed Per Defensive Action (e.g. 8.2)
  awayPpda: number; // e.g. 17.5 (Passive)
  homePPDA?: number;
  awayPPDA?: number;
  fieldTiltPercent: number; // e.g. 74.2%
  fieldTiltPercentage?: number;
  openPlayXg: { home: number; away: number };
  openPlayxG?: number;
  awayOpenPlayxG?: number;
  setPieceXg: { home: number; away: number };
  setPiecexG?: number;
  awaySetPiecexG?: number;
  refereeProfile: {
    name: string;
    avgYellows?: number;
    avgYellowsPerGame?: number;
    penaltyFreq?: string;
    penaltyProbabilityPerGame?: number;
    country?: string;
  };
  varianceRiskRating: 'ULTRA_LOW' | 'LOW' | 'MODERATE';
  varianceAuditNotes: string;
  tacticalClashSummary?: string;
  varianceRiskAnalysis?: string;
  timeLockVerification?: string;
}

export type MatchStatus = 'UPCOMING' | 'LIVE' | 'FINISHED' | 'POSTPONED';

export interface MatchFixture {
  id: string;
  league: string;
  leagueFlag: string;
  homeTeam: string;
  awayTeam: string;
  kickOffTime: string; // ISO string
  stadium: string;
  matchStatus: MatchStatus;
  actualScore?: string; // e.g. "2 - 3 (FT)"
  actualResult?: 'WIN' | 'LOSS' | 'VOID' | 'PENDING';
  h2hSummary: string;
  homeForm: string[];
  awayForm: string[];
  homexG: number;
  awayxG: number;
  keyInjuries: string;
  recommendedPick: string;
  marketType: string;
  individualWinProbability: number;
  decimalOdds: number;
  aiRationale: string;
  riskRating: 'Ultra-Low' | 'Low' | 'Moderate';
  isRealGrounding?: boolean;

  // Correct Score Tip specific attributes
  predictedExactScore: string; // e.g. "2 - 0"
  secondaryExactScore?: string; // e.g. "3 - 0"
  exactScoreOdds: number; // e.g. 7.50
  secondaryOdds?: number; // e.g. 9.20
  convergenceRate: number; // Target > 98% (e.g. 98.9%)
  poissonPrimaryProb: number; // e.g. 38.5%
  convergenceFactors: ConvergenceFactor[];
  scoreMatrix: CorrectScoreMatrixItem[];

  // Triple-Layer Failure Prevention Shield
  safeBankerPick?: {
    team: string;
    market: string;
    odds: number;
    winProbability: number;
    rationale: string;
    coverage: number;
  };
  dualScoreCoverage?: number; // e.g. 78.5%
  hedgingRatio?: {
    primaryStakePercent: number; // e.g. 55%
    secondaryStakePercent: number; // e.g. 45%
    primaryReturnOn1000: number;
    secondaryReturnOn1000: number;
  };

  // 100-Source Multi-Consensus Engine attributes
  consensusAgreementRate: number; // e.g. 99.2% (Must be > 98.0%)
  consensusInstitutes: ConsensusInstitute[];
  isConsensusPassed: boolean;
  superGoldenSealNumber: string;

  // Real Bookmaker & 1xBet Cross-Check Verification
  oneXBetVerified?: {
    isCrossChecked: boolean;
    kickOffDisplay1xBet: string; // e.g. "13.11.2026 (00:45)"
    marketName: string; // "คะแนนจริง (17 ทาง)"
    exactScoresOdds1xBet: { score: string; odds: number }[];
    verificationNote: string;
  };

  // Safe High-Accuracy X2 & 1xBet HDP Calibration
  x2Odds1xBet?: number; // Exact live 1xBet X2/1X price if verified (e.g. 1.137)
  x2EstimatedOdds?: number;
  x2EstimatedProb?: number;
  x2BreakEvenRate?: number;
  isValueX2Qualified?: boolean;
  hdpLine1xBet?: string; // e.g. "-0.75", "-1.5"
  hdpOdds1xBet?: number; // e.g. 1.82
  hdpEstimatedOdds?: number;
  hdpEstimatedProb?: number;
  hdpBreakEvenRate?: number;
  hdpEdgePercent?: number;
  isValueHdpQualified?: boolean;

  // Deep Tactical & Positional Breakdown
  tacticalAnalysis?: TacticalAnalysis;
}

export interface PastMatchAudit {
  id: string;
  matchId: string;
  matchDate: string;
  league: string;
  homeTeam: string;
  awayTeam: string;
  predictedScore: string;
  actualScore: string;
  resultStatus: 'WON' | 'LOST' | 'HEDGE_HIT';
  auditReason: string; // e.g. "คู่มิลานเสีย 2 ประตูจากลูกเซ็ตพีซช่วงท้ายเกม ทำให้ผลจบ 2-3 ระบบทำการอัปเดตโมเดลความแปรปรวนทันที"
}

export interface CorrectScoreTip {
  tipId: string;
  date: string;
  selectedMatch: MatchFixture;
  qualifiedPool: MatchFixture[];
  primaryScore: string;
  secondaryScore: string;
  primaryOdds: number;
  secondaryOdds: number;
  overallConvergenceRate: number; // Target > 98%
  confidenceScore: number;
  earliestKickOff: string;
  autoPostScheduledTime: string;
  isAutoPosted: boolean;
  postedAt?: string;
  fbPostId?: string;
  summaryThai: string;
  isRealMatchSchedule: boolean; // Always true, 100% real schedule
  dataSource: string;

  // Triple-Layer Failure Prevention Shield
  safeBankerPick?: {
    team?: string;
    selection?: string;
    market?: string;
    odds: number;
    winProbability?: number;
    winRateLast3Days?: string;
    safetyConfidence?: number;
    rationale?: string;
    analysis?: string;
    coverage?: number;
  };
  dualScoreCoverage?: number; // e.g. 78.5%
  hedgingRatio?: {
    primaryStakePercent: number;
    secondaryStakePercent: number;
    primaryReturnOn1000: number;
    secondaryReturnOn1000: number;
  };
  todayDayLabel?: string;

  // 100-Source Multi-Consensus attributes
  consensusAgreementRate: number; // Must be > 98.0%
  consensusInstitutes: ConsensusInstitute[];
  superGoldenSlipTitle: string; // "โพยเด็ดซูเปอร์โกลเด้นสลิป (Super Golden Consensus Slip)"
  superGoldenSlipSubtitle: string;
  certifiedStampDate: string;

  // Real-time Status Verification
  matchStatus: MatchStatus;
  isUpcomingLocked: boolean; // Must be true - prevents any match in past from being tipped
  minutesUntilKickoff: number;
  verificationSource?: 'VERIFIED_CATALOG' | 'GEMINI_GOOGLE_SEARCH' | 'MANUAL_VERIFIED' | 'NEEDS_LIVE_SYNC';
  verificationNote?: string;

  // Multi-Market Recommendations for the Selected Match
  marketRecommendations?: {
    x2Pick: string;
    x2Odds: number;
    x2OddsDisplay?: string;
    isVerified1xBetQuote?: boolean;
    x2Prob: number;
    x2BreakEvenWinRate: number;
    isValueX2Qualified: boolean;
    x2FilterNote: string;
    twoFoldX2Combo?: {
      leg1: string;
      leg1Odds: number;
      leg2: string;
      leg2Odds: number;
      combinedOdds: number;
      combinedProb: number;
      noteThai: string;
    };
    handicapPick: string;
    handicapOdds: number;
    handicapLine?: string;
    handicapProb: number;
    handicapBreakEvenWinRate?: number;
    handicapEdgePercent?: number;
    isVerified1xBetHdp?: boolean;
    isValueHdpQualified?: boolean;
    hdpFilterNote?: string;
    overScorePick: string;
    overScoreOdds: number;
    overScoreProb: number;
    over15Pick?: string;
    over15Odds?: number;
    over15Prob?: number;
  };

  // 3-Day Miss Strategy Surgery & Dual-Mode System
  strategyAuditInsight?: {
    missedConsecutiveDays: number;
    reasoning: string;
    bankerWinRatePast3Days: number;
    exactScoreWinRatePast3Days: number;
    actionTaken: string;
  };
  dutchedThreeScores?: {
    scores: Array<{
      score: string;
      odds: number;
      stakeRatio?: number;
      allocationPercent?: number;
      returnOn1000?: number;
      returnAmount?: number;
    }>;
    totalCoverage?: number;
    totalCoveragePercent?: number;
    combinedOddsEquivalent?: number;
    rationale?: string;
  };

  // Daily 06:00 AM Thai Time (ICT) Automation Engine
  dailyReleaseInfo?: {
    scheduledReleaseTimeThai: string;
    releasedAtThai: string;
    nextReleaseTimeThai: string;
    hoursUntilNextRelease: number;
    minutesUntilNextRelease: number;
    isFreshDailyRelease: boolean;
    autoRolloverRules: string;
  };
}

export interface AccumulatorTicket {
  ticketId: string;
  date: string;
  status: 'PENDING' | 'POSTED_TO_FACEBOOK' | 'WON' | 'IN_PROGRESS';
  matches: MatchFixture[];
  combinedOdds: number;
  compoundProbability: number;
  earliestKickOff: string;
  autoPostScheduledTime: string;
  isAutoPosted: boolean;
  postedAt?: string;
  fbPostId?: string;
  summaryThai: string;
  confidenceScore: number;
  isRealMatchSchedule?: boolean;
  dataSource?: string;
  isUltraSafeOptimized?: boolean;
  safetyScore?: number;
  correctScoreTip?: CorrectScoreTip;
}

export interface FacebookConfig {
  pageId: string;
  pageName: string;
  pageAccessToken: string;
  autoPostLeadHours: number;
  isEnabled: boolean;
  hashtags: string[];
  customFooter: string;
  notifyOnSuccess: boolean;
}

export interface PostLog {
  id: string;
  timestamp: string;
  triggerType: 'AUTOMATIC_SCHEDULER' | 'MANUAL_DISPATCH';
  ticketId: string;
  status: 'SUCCESS' | 'FAILED';
  pageId: string;
  fbPostId: string;
  leadTimeHours: number;
  postContent: string;
  apiResponseMsg: string;
}

// --- TELEGRAM BOT 06:30 AM THAI TIME DAILY NOTIFICATION TYPES ---

export interface TelegramDiagnostics {
  code: 'SENT_TODAY' | 'WAITING' | 'MISSING_CREDENTIALS' | 'NEEDS_LIVE_SYNC' | 'TELEGRAM_API_ERROR' | 'DISABLED';
  isSentTodayReal: boolean;
  hasBotToken: boolean;
  hasChatId: boolean;
  hasWebhook: boolean;
  credentialsSource: 'RENDER_ENV' | 'LOCAL_FILE_STATE' | 'NONE';
  isEphemeralDataDir: boolean;
  isPastScheduledTimeThai: boolean;
  currentTimeThai: string;
  scheduledTimeThai: string;
  lastSentAt?: string;
  lastSentDateKey?: string;
  lastErrorDetail?: string;
  reasonThai: string;
  actionStepsThai: string[];
}

export interface TelegramNotificationConfig {
  isEnabled: boolean;
  sendTimeThai: string; // "06:30"
  botToken: string;
  chatId: string; // Telegram User ID, Group ID (-...), or Channel (@... / -100...)
  customWebhookUrl?: string;
  includeMarketComparison: boolean;
  lastSentDateKey: string;
  lastSentAt?: string;
  lastRealSentDateKey?: string;
  lastSimulatedDateKey?: string;
  lastBlockedReason?: string;
  lastErrorDetail?: string;
}

export interface TelegramNotificationLog {
  id: string;
  timestamp: string;
  dateKey: string;
  triggerType: 'DAILY_0630_CRON' | 'MANUAL_TEST' | 'UPTIMEROBOT_CRON';
  status: 'SUCCESS' | 'SIMULATED' | 'FAILED';
  chatId: string;
  matchTitle: string;
  messagePreview: string;
  apiResponseMsg: string;
}

// --- 1-MONTH MARKET PROBABILITY & STRATEGY COMPARISON TYPES ---

export type MarketStrategyKey = 'X2_DC' | 'HANDICAP' | 'OVER_SCORE' | 'DUTCHING_3SCORE' | 'CORRECT_SCORE';

export interface MarketStrategyOutcome {
  pick: string;
  odds: number;
  result: 'WIN' | 'HALF_WIN' | 'PUSH' | 'HALF_LOSS' | 'LOSS';
  profitOn1000: number;
}

export interface MonthlyBacktestMatch {
  id: string;
  date: string; // Thai short e.g. "18 พ.ย."
  isoDate: string;
  league: string;
  leagueFlag: string;
  homeTeam: string;
  awayTeam: string;
  actualScore: string;
  x2Outcome: MarketStrategyOutcome;
  handicapOutcome: MarketStrategyOutcome;
  overScoreOutcome: MarketStrategyOutcome;
  dutchingOutcome: MarketStrategyOutcome;
  correctScoreOutcome: MarketStrategyOutcome;
}

export interface MarketStrategySummary {
  key: MarketStrategyKey;
  labelThai: string;
  shortLabel: string;
  descriptionThai: string;
  totalMatches: number;
  wins: number;
  pushes: number;
  losses: number;
  winRatePercent: number;
  avgOdds: number;
  netProfitOn1000PerMatch: number;
  roiPercent: number;
  maxLosingStreak: number;
  riskLevel: 'ULTRA_LOW' | 'LOW' | 'MODERATE' | 'HIGH' | 'EXTREME';
  riskLabelThai: string;
  efficiencyScore: number; // Risk-adjusted score (0-100)
  recommendedAllocationPercent: number;
  isTopWinRate?: boolean;
  isBestRiskReward?: boolean;
}

export interface MonthlyMarketTimelinePoint {
  dayIndex: number;
  date: string;
  matchLabel: string;
  x2Profit: number;
  handicapProfit: number;
  overScoreProfit: number;
  dutchingProfit: number;
  correctScoreProfit: number;
}

export interface MonthlyMarketComparisonData {
  periodLabelThai: string;
  totalMatchesEvaluated: number;
  summaries: MarketStrategySummary[];
  cumulativeProfitTimeline: MonthlyMarketTimelinePoint[];
  matches: MonthlyBacktestMatch[];
  optimalPortfolio: {
    title: string;
    rationaleThai: string;
    expectedMonthlyWinRate: number;
    expectedMonthlyRoi: number;
    allocations: Array<{
      marketKey: MarketStrategyKey;
      label: string;
      percent: number;
      roleThai: string;
    }>;
  };
}

export interface RealMatchRecord {
  id: string;
  date: string;
  ticketId: string;
  matchIndex: number;
  league: string;
  leagueFlag: string;
  homeTeam: string;
  awayTeam: string;
  pick: string;
  odds: number;
  predictedWinRate: number;
  actualScore: string;
  actualResult: 'WIN' | 'LOSS' | 'VOID' | 'PENDING';
  profitUnits: number;
}

export interface RollingTimelinePoint {
  matchIndex: number;
  label: string;
  shortName: string;
  date: string;
  league: string;
  actualResult: 'WIN' | 'LOSS' | 'VOID' | 'PENDING';
  odds: number;
  winRate: number;
  targetThreshold: number;
  resultText: string;
}

export interface LeagueBreakdownItem {
  league: string;
  flag: string;
  totalMatches: number;
  wonMatches: number;
  winRate: number;
}

export interface RealWinStats {
  totalMatches: number;
  wonMatches: number;
  lostMatches: number;
  realLegWinRate: number;
  currentStreak: number;
  maxStreak: number;
  trebleSweepRate: number;
  wonTickets: number;
  totalTickets: number;
  totalNetProfit: number;
  rollingTimeline: RollingTimelinePoint[];
  leagueBreakdown: LeagueBreakdownItem[];
}

// --- LIVE SPORTS BROADCAST & TRACKER TYPES ---

export interface LiveCommentaryItem {
  id: string;
  minute: number;
  type: 'GOAL' | 'CHANCE' | 'YELLOW_CARD' | 'RED_CARD' | 'SUB' | 'VAR' | 'WHISTLE';
  text: string;
  team?: string;
  player?: string;
}

export interface LiveChatMessage {
  id: string;
  userName: string;
  userBadge: 'VIP Gold' | 'สมาชิกพรีเมียม' | 'กูรูสถิติ' | 'แอดมินระบบ';
  avatarBg: string;
  message: string;
  timestamp: string;
  likes?: number;
}

export interface LiveChannel {
  id: string;
  channelNumber: number;
  name: string;
  league: string;
  leagueFlag: string;
  homeTeam: string;
  awayTeam: string;
  homeScore: number;
  awayScore: number;
  minute: number;
  status: 'LIVE' | 'HALFTIME' | 'UPCOMING' | 'FULLTIME';
  streamQuality: '1080p60 HD' | '720p HD' | '4K UHD';
  isGoldenSlipMatch: boolean;
  predictedScore: string;
  goldenSlipStatus: 'ON_TRACK' | 'HEDGE_ACTIVE' | 'PENDING';
  possession: { home: number; away: number };
  shotsOnTarget: { home: number; away: number };
  corners: { home: number; away: number };
  xgLive: { home: number; away: number };
  dangerousAttacks: { home: number; away: number };
  currentAttackingTeam: 'HOME' | 'AWAY' | 'MIDFIELD';
  commentary: LiveCommentaryItem[];
  videoUrl?: string;
  customEmbedUrl?: string;
  streamSourceType?: 'VIDEO' | 'EMBED' | 'RADAR';
  kickoffTime?: string;
}

export interface RandomPickOneXBetCriteria {
  requireQuarterLine: boolean;
  maxAbsHdpLine: number;
  minHdpOdds: number;
  maxHdpOdds: number;
  minEdgePercent: number;
  requireConsensus98: boolean;
}

export interface OneXBetFilterReport {
  criteriaUsed: RandomPickOneXBetCriteria;
  totalEvaluated: number;
  qualifiedCount: number;
  qualifiedIds: string[];
  excludedDetails: {
    matchId: string;
    matchLabel: string;
    hdpLine: string;
    hdpOdds: number;
    edgePercent: number;
    reasonThai: string;
  }[];
  fallbackUsed: boolean;
}

