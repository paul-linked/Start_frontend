// ═══════════════════════════════════════════
// CHALLENGE MODE — "The Gauntlet"
// 5-phase cascade crisis, same for all players
// ═══════════════════════════════════════════

export const CHALLENGE_STARTING_VALUE = 500;
export const CHALLENGE_STARTING_ALLOCATION = {
  savings: 20,
  bonds: 30,
  etf: 40,
  gold: 10,
};

export interface ChallengeNotification {
  source: string;
  headline: string;
  body: string;
  icon: string;
  iconColor: string;
  time: string;
}

export interface ChallengePhase {
  phaseNum: number;
  title: string;
  subtitle: string;
  notifications: ChallengeNotification[];
  chartData: number[];
  chartLabel: string;
  chartDelta: string;
  marketReturns: Record<string, number>;
}

export const CHALLENGE_PHASES: ChallengePhase[] = [
  // ─── PHASE 1: The First Crack ───
  {
    phaseNum: 1,
    title: "The First Crack",
    subtitle: "A tremor runs through the market. How do you position?",
    notifications: [
      {
        source: "Market Alert",
        headline: "SMI drops 8% in early trading on surprise rate hike",
        body: "The Swiss National Bank unexpectedly raised rates by 75 basis points, catching markets off guard. Banking stocks led the decline as traders scrambled to reprice risk across all sectors.",
        icon: "📰",
        iconColor: "#C0392B",
        time: "just now",
      },
      {
        source: "Social Media",
        headline: "\"This is 2008 all over again\" — panic spreads online",
        body: "Retail investor forums are flooding with sell recommendations. The hashtag #CrashComing is trending. Several popular finance influencers have posted videos urging followers to move to cash immediately.",
        icon: "💬",
        iconColor: "#3498DB",
        time: "3m ago",
      },
      {
        source: "Market Analysis",
        headline: "Rate hike was expected by institutions — retail caught off guard",
        body: '<mark>Institutional positioning data shows large funds had already hedged for a rate hike. The sell-off is predominantly retail-driven. Corporate earnings remain solid, and the rate hike signals economic strength, not weakness.</mark>',
        icon: "📊",
        iconColor: "#0f4a58",
        time: "8m ago",
      },
    ],
    chartData: [42, 44, 45, 46, 44, 43, 40, 38, 35, 33],
    chartLabel: "SMI · 2 weeks",
    chartDelta: "−8.2%",
    marketReturns: { savings: 0.1, bonds: -1.5, etf: -8.2, gold: 3.1 },
  },

  // ─── PHASE 2: The Deepening ───
  {
    phaseNum: 2,
    title: "The Deepening",
    subtitle: "The drop continues. Now down 18% from the peak. Nerves are fraying.",
    notifications: [
      {
        source: "Breaking News",
        headline: "Major European bank reports unexpected losses — contagion fears rise",
        body: "Schweizerische Kreditanstalt reported a PPF 2.1B loss tied to derivatives exposure. Credit default swaps on European banks spiked to 2020 levels. Regulators issued a statement calling the banking system 'well-capitalized.'",
        icon: "🚨",
        iconColor: "#C0392B",
        time: "just now",
      },
      {
        source: "Social Media",
        headline: "Bank run rumors circulate — lines reported at some branches",
        body: "Unverified photos of queues at bank branches are circulating widely. Most appear to be from normal business hours, but the narrative has taken hold. Several crypto influencers are promoting Bitcoin as a 'safe haven.'",
        icon: "💬",
        iconColor: "#3498DB",
        time: "5m ago",
      },
      {
        source: "Expert Commentary",
        headline: "\"Isolated incident\" — central bank economists push back on panic",
        body: '<mark>The SNB released stress test results showing all major Swiss banks exceed capital requirements by a wide margin. The losses at SK are tied to a single trading desk, not systemic exposure. Interbank lending rates remain normal — a key indicator that contagion is not spreading.</mark>',
        icon: "🎙️",
        iconColor: "#8E44AD",
        time: "12m ago",
      },
      {
        source: "Market Data",
        headline: "Gold surges 6% as investors seek safety",
        body: "Gold hit a 6-month high as traditional safe-haven flows accelerated. Government bond yields fell sharply, indicating a flight to quality. The VIX fear index reached its highest level since March 2020.",
        icon: "📊",
        iconColor: "#0f4a58",
        time: "15m ago",
      },
    ],
    chartData: [33, 31, 28, 25, 22, 20, 18, 19, 17, 16],
    chartLabel: "SMI · continued",
    chartDelta: "−18.4%",
    marketReturns: { savings: 0.05, bonds: -3.2, etf: -12.1, gold: 6.4 },
  },

  // ─── PHASE 3: The Cascade ───
  {
    phaseNum: 3,
    title: "The Cascade",
    subtitle: "Your sector gets hit. The question: is this spreading or contained?",
    notifications: [
      {
        source: "Breaking News",
        headline: "Tech sector collapses — AI bubble fears trigger mass sell-off",
        body: "Technology stocks plunged an additional 15% today as investors questioned sky-high valuations. The selloff spread to semiconductor, cloud, and fintech names. \"The AI trade is unwinding,\" said one trader.",
        icon: "🚨",
        iconColor: "#C0392B",
        time: "just now",
      },
      {
        source: "Market Analysis",
        headline: "Sector rotation underway — not a systemic collapse",
        body: '<mark>Data shows money flowing out of tech is rotating into defensive sectors (utilities, healthcare, consumer staples) rather than exiting equities entirely. Total market volume is elevated but orderly. This pattern matches historical sector corrections, not market-wide crashes. Healthcare ETFs are up 3% today.</mark>',
        icon: "📊",
        iconColor: "#0f4a58",
        time: "10m ago",
      },
      {
        source: "Social Media",
        headline: "\"I just lost 40% of my portfolio\" — panic posts flood forums",
        body: "Retail investors who were heavily concentrated in tech are sharing devastating loss screenshots. The emotional temperature online is at its highest point. \"Sell everything and buy gold\" is the prevailing sentiment across multiple platforms.",
        icon: "💬",
        iconColor: "#3498DB",
        time: "7m ago",
      },
    ],
    chartData: [16, 15, 13, 11, 10, 9, 8, 10, 9, 8],
    chartLabel: "SMI · continued",
    chartDelta: "−24.1%",
    marketReturns: { savings: 0.05, bonds: 0.8, etf: -6.5, gold: 4.2 },
  },

  // ─── PHASE 4: The Fake Recovery ───
  {
    phaseNum: 4,
    title: "The Dead Cat Bounce?",
    subtitle: "Markets surge 8%. Is the crisis over — or is this a trap?",
    notifications: [
      {
        source: "Breaking News",
        headline: "Markets rally 8% — \"the worst is over\" say optimists",
        body: "A sharp rebound caught short-sellers off guard today as dip buyers poured back in. The rally was broad-based, with every sector posting gains. Trading volumes hit a record high. Several analysts declared the bottom is in.",
        icon: "📰",
        iconColor: "#27AE60",
        time: "just now",
      },
      {
        source: "Social Media",
        headline: "\"Told you to buy the dip!\" — victory laps on social media",
        body: "The same accounts that were screaming sell three days ago are now claiming they called the bottom. FOMO is building rapidly as screenshots of single-day gains go viral.",
        icon: "💬",
        iconColor: "#3498DB",
        time: "4m ago",
      },
      {
        source: "Market Analysis",
        headline: "Caution: rally is low-conviction — smart money still hedged",
        body: '<mark>Despite the headline rally, institutional fund flows remain negative — large funds are still net sellers. The bounce occurred on declining volume after the first hour, a pattern typically associated with bear market rallies rather than genuine recoveries. Options data shows heavy put-buying (downside protection) at current levels.</mark>',
        icon: "📊",
        iconColor: "#0f4a58",
        time: "11m ago",
      },
      {
        source: "Expert Commentary",
        headline: "\"Dead cat bounce\" — veteran strategist urges patience",
        body: "\"I've seen this pattern six times in my career,\" says Claudia Meier of Zurich Asset Management. \"The first bounce is almost never the real recovery. Wait for the retest. The real bottom comes when nobody believes it's the bottom.\"",
        icon: "🎙️",
        iconColor: "#8E44AD",
        time: "16m ago",
      },
    ],
    chartData: [8, 9, 11, 14, 16, 18, 20, 19, 18, 17],
    chartLabel: "SMI · continued",
    chartDelta: "+8.2%",
    marketReturns: { savings: 0.05, bonds: 1.2, etf: 8.2, gold: -2.1 },
  },

  // ─── PHASE 5: The Resolution ───
  {
    phaseNum: 5,
    title: "The Resolution",
    subtitle: "Six months later. The dust has settled. How did your strategy hold up?",
    notifications: [
      {
        source: "Market Review",
        headline: "Six months on: the crisis that wasn't",
        body: '<mark>The SMI has recovered to within 3% of its pre-crisis high. The bank losses were contained, the tech correction was healthy, and the rate hike ultimately supported stronger economic growth. Investors who held through the volatility or bought during the dip are now ahead. Those who sold at the bottom locked in losses of 20-25%.</mark>',
        icon: "📰",
        iconColor: "#0f4a58",
        time: "6 months later",
      },
      {
        source: "Investor Psychology",
        headline: "What this crisis taught us about our own behavior",
        body: "Research published today shows that retail investors who checked their portfolio daily during the crisis were 5× more likely to panic sell than those who checked weekly. The median panic seller locked in a 19% loss that fully recovered within 4 months.",
        icon: "🎙️",
        iconColor: "#8E44AD",
        time: "analysis",
      },
    ],
    chartData: [17, 16, 18, 22, 26, 30, 34, 37, 40, 42],
    chartLabel: "SMI · 6 months",
    chartDelta: "+147% from low",
    marketReturns: { savings: 0.3, bonds: 3.5, etf: 18.4, gold: 1.2 },
  },
];

// ─── Score weights for investor score calculation ───
export const SCORE_WEIGHTS = {
  returns: 0.4,
  composure: 0.2,
  dueDiligence: 0.2,
  diversification: 0.1,
  discipline: 0.1,
};