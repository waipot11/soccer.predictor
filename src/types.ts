export interface MatchFixture {
  id: string;
  league: string;
  leagueFlag: string;
  homeTeam: string;
  awayTeam: string;
  kickOffTime: string; // ISO string
  stadium: string;
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
