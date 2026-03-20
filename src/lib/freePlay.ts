import type { Round, Quest, SnapCard, BriefingArticle, Product } from "../types";
import { ALL_PRODUCTS } from "./gameData";

// ═══════════════════════════════════════════
// FREE PLAY SYSTEM
// Generates rounds beyond the 6-round demo
// Content pools + difficulty scaling + product unlocks
// ═══════════════════════════════════════════

// ─── Product unlock schedule (by round number) ───
// Demo rounds 1-6 already unlock savings, bonds, etf, stocks, gold, reits
// Free play continues unlocking from round 7+
const PRODUCT_UNLOCKS: Record<number, Product[]> = {
  8: [{
    id: "crypto",
    name: "Crypto Index",
    description: "High volatility digital assets",
    returnPct: 0, // Set dynamically
    returnDisplay: "-40% to +80%",
    risk: "high",
    unlockRound: 8,
  }],
  10: [{
    id: "emerging",
    name: "Emerging Markets",
    description: "High-growth developing economies",
    returnPct: 0,
    returnDisplay: "-20% to +30%",
    risk: "high",
    unlockRound: 10,
  }],
  12: [{
    id: "private_equity",
    name: "Private Equity",
    description: "Long-term illiquid investments",
    returnPct: 0,
    returnDisplay: "-10% to +35%",
    risk: "high",
    unlockRound: 12,
  }],
};

// ─── Snap Decision Card Pool ───
// Difficulty tiers: easy (rounds 7-9), medium (10-14), hard (15+)
const SNAP_POOL: { tier: "easy" | "medium" | "hard"; card: SnapCard }[] = [
  // ── Easy ──
  {
    tier: "easy",
    card: {
      id: "fp_e1",
      headline: "A colleague recommends a \"sure thing\" penny stock.",
      description: "They say it's about to be acquired. \"Easy 3x return.\"",
      options: [
        {
          id: "ignore", label: "Ignore it", description: "Insider tips are illegal anyway",
          quality: "good",
          feedback: "If it sounds like insider trading, it probably is. Or it's just wrong.",
          learning: "Acting on non-public information is illegal in most jurisdictions. And most \"sure things\" from colleagues are neither sure nor things.",
          scoreImpact: { riskAlignment: 2, learning: 2 },
        },
        {
          id: "small_bet", label: "Put a tiny amount in", description: "Just to see",
          quality: "neutral",
          feedback: "A small position limits your downside, but you're still acting on unverified information.",
          learning: "The size of the bet doesn't change the quality of the thesis. A bad idea with PPF 10 is still a bad idea.",
          scoreImpact: { riskAlignment: -1, learning: 1 },
        },
        {
          id: "all_in", label: "Go big — this is the one", description: "You trust them",
          quality: "bad",
          feedback: "The acquisition never happened. The stock dropped 70%.",
          learning: "Trust is earned through track records, not enthusiasm. Professional investors are wrong roughly 40% of the time — your colleague's odds are worse.",
          scoreImpact: { riskAlignment: -2, patience: -2, wealth: -2 },
        },
      ],
    },
  },
  {
    tier: "easy",
    card: {
      id: "fp_e2",
      headline: "Your portfolio hit an all-time high today.",
      description: "You're up 22% this year. Everything is green. What do you do?",
      options: [
        {
          id: "hold", label: "Stay the course", description: "The plan hasn't changed",
          quality: "good",
          feedback: "All-time highs are normal for growing markets. Most of the market's best days follow previous highs.",
          learning: "Historically, selling at all-time highs has been a losing strategy. Markets spend most of their time near highs — that's what growth looks like.",
          scoreImpact: { patience: 2, riskAlignment: 1 },
        },
        {
          id: "take_profit", label: "Sell some and lock in gains", description: "Protect what you've earned",
          quality: "neutral",
          feedback: "Taking some profit is reasonable, but make sure it's strategic rebalancing, not fear in disguise.",
          learning: "Rebalancing means selling what's grown to buy what's lagged — restoring your target allocation. 'Taking profit' without a plan is just market timing.",
          scoreImpact: { patience: 0, learning: 1 },
        },
        {
          id: "sell_all", label: "Sell everything — it can't go higher", description: "Lock in the win",
          quality: "bad",
          feedback: "Markets continued to climb for another 14 months after you sold.",
          learning: "\"It can't go higher\" has been said at every market peak — and every non-peak. Time in the market beats timing the market, every study confirms it.",
          scoreImpact: { patience: -3, wealth: -1 },
        },
      ],
    },
  },
  {
    tier: "easy",
    card: {
      id: "fp_e3",
      headline: "A robo-advisor app is offering free portfolio management.",
      description: "It uses AI to rebalance your portfolio automatically. No fees for the first year.",
      options: [
        {
          id: "try_it", label: "Try it with a portion", description: "Diversify your approach",
          quality: "good",
          feedback: "Robo-advisors can be great tools, especially for automation. Just understand what it's doing with your money.",
          learning: "Robo-advisors typically use passive index strategies with automatic rebalancing — solid for most investors. The key is understanding the fee structure after the free period.",
          scoreImpact: { learning: 2, diversification: 1 },
        },
        {
          id: "research", label: "Research it first", description: "Read the fine print",
          quality: "good",
          feedback: "Smart approach. The free year often leads to fees of 0.5-1% annually, which adds up.",
          learning: "Always understand the business model. If the product is free, you might be the product — or the fees kick in later. Due diligence applies to tools, not just investments.",
          scoreImpact: { learning: 3 },
        },
        {
          id: "dismiss", label: "No — I manage my own", description: "I don't trust algorithms",
          quality: "neutral",
          feedback: "Self-management is fine, but don't dismiss tools out of principle. The best investors use every advantage available.",
          learning: "Rejecting automation entirely can mean missing out on disciplined rebalancing — something humans are notoriously bad at doing consistently.",
          scoreImpact: { learning: 0, riskAlignment: 1 },
        },
      ],
    },
  },

  // ── Medium ──
  {
    tier: "medium",
    card: {
      id: "fp_m1",
      headline: "Inflation just hit 5.2% — a 15-year high.",
      description: "Your savings account earns 1.2%. Your bonds return 2.8%. Your purchasing power is shrinking.",
      options: [
        {
          id: "reallocate", label: "Shift toward inflation hedges", description: "Gold, commodities, REITs",
          quality: "good",
          feedback: "Inflation erodes cash and bond returns. Real assets tend to keep pace with or outperform inflation.",
          learning: "During high inflation, 'safe' assets like savings and bonds can actually lose you money in real terms. Diversifying into commodities, real estate, and equities provides inflation protection.",
          scoreImpact: { diversification: 2, learning: 2, riskAlignment: 1 },
        },
        {
          id: "hold_steady", label: "Stay the course", description: "Inflation is temporary",
          quality: "neutral",
          feedback: "Historically, inflation spikes do pass. But sitting in cash during one is costly.",
          learning: "Patience is usually a virtue in investing, but there's a difference between being patient and being passive. When conditions change materially, adaptation isn't panic — it's prudence.",
          scoreImpact: { patience: 1, wealth: -1 },
        },
        {
          id: "all_cash", label: "Move to cash until it passes", description: "Wait for stability",
          quality: "bad",
          feedback: "Cash is the worst place to be during high inflation — it loses value every day.",
          learning: "At 5.2% inflation, PPF 100 in cash is worth PPF 94.80 in real terms after one year. Cash feels safe but is actively losing purchasing power.",
          scoreImpact: { learning: -1, wealth: -2, riskAlignment: -2 },
        },
      ],
    },
  },
  {
    tier: "medium",
    card: {
      id: "fp_m2",
      headline: "Two of your holdings are in the same sector.",
      description: "Your ETF and your individual stock both track tech. Your portfolio is 60% exposed to one industry.",
      options: [
        {
          id: "rebalance", label: "Sell some tech, diversify", description: "Reduce concentration risk",
          quality: "good",
          feedback: "Recognizing hidden concentration is a real skill. Two different products in the same sector isn't diversification.",
          learning: "True diversification means exposure to different sectors, geographies, and asset classes — not just different product names. An ETF and a stock in the same industry move together.",
          scoreImpact: { diversification: 3, learning: 2 },
        },
        {
          id: "keep", label: "Tech is the future — lean in", description: "Conviction over diversification",
          quality: "bad",
          feedback: "High conviction can work, but 60% in one sector means a single bad quarter could devastate your portfolio.",
          learning: "Every sector has its day. Tech dominated the 2010s but underperformed in 2022. The sectors that lead one decade rarely lead the next.",
          scoreImpact: { diversification: -2, riskAlignment: -1 },
        },
        {
          id: "add_more", label: "Add another sector too", description: "Keep tech but broaden",
          quality: "good",
          feedback: "Adding exposure without selling works, but only if you have capital to deploy. Good instinct though.",
          learning: "Adding new positions to reduce concentration is valid — but check that your overall allocation still makes sense. Don't just pile on; rebalance intentionally.",
          scoreImpact: { diversification: 2, learning: 1 },
        },
      ],
    },
  },

  // ── Hard ──
  {
    tier: "hard",
    card: {
      id: "fp_h1",
      headline: "A government bond auction just failed.",
      description: "For the first time in decades, a major economy couldn't sell its debt. Markets are confused — nobody knows what this means yet.",
      options: [
        {
          id: "reduce_bonds", label: "Reduce bond exposure", description: "This could ripple across fixed income",
          quality: "good",
          feedback: "A failed auction signals potential credit stress. Reducing bond exposure preemptively is prudent risk management.",
          learning: "Bond markets are usually boring — when they make headlines, it matters. A failed auction can signal loss of confidence in a government's fiscal position, affecting all fixed-income assets.",
          scoreImpact: { learning: 3, riskAlignment: 2 },
        },
        {
          id: "wait", label: "Wait for more information", description: "One data point isn't a trend",
          quality: "neutral",
          feedback: "Reasonable caution. But in bond markets, waiting can mean missing the window — prices move fast when confidence shifts.",
          learning: "In equity markets, patience is usually rewarded. In credit markets, early action is often critical. The distinction between patience and complacency is context-dependent.",
          scoreImpact: { patience: 1, learning: 1 },
        },
        {
          id: "buy_bonds", label: "Buy the dip in bonds", description: "Higher yields mean better returns",
          quality: "bad",
          feedback: "Higher yields from a failed auction aren't a buying opportunity — they reflect increased risk of default.",
          learning: "\"Buy the dip\" doesn't apply universally. When yields rise because of genuine credit deterioration, you're not getting a discount — you're getting compensated for real risk.",
          scoreImpact: { learning: -1, riskAlignment: -2, wealth: -1 },
        },
      ],
    },
  },
];

// ─── Briefing Room Content Pool ───
const BRIEFING_POOL: {
  tier: "easy" | "medium" | "hard";
  articles: BriefingArticle[];
  chartData: number[];
  chartLabel: string;
  chartDelta: string;
  correctAnswer: "buy" | "hold" | "sell";
  outcomes: Record<"buy" | "hold" | "sell", {
    quality: "good" | "neutral" | "bad";
    feedback: string;
    learning: string;
    scoreImpact: Partial<Record<string, number>>;
  }>;
}[] = [
  {
    tier: "easy",
    articles: [{
      source: "Global Markets Today",
      sourceType: "Breaking",
      headline: "Tech Giant Announces Mass Layoffs — Stock Drops 15%",
      standfirst: "The company is cutting 12,000 jobs in a 'strategic restructuring' that analysts say was overdue.",
      paragraphs: [
        "Markets reacted sharply today as the tech giant announced its largest round of layoffs in company history, affecting roughly 8% of its global workforce.",
        "Social media erupted with predictions of further decline, with several retail investor forums advising immediate selling.",
        "<mark>However, the restructuring is expected to save PPF 2.1B annually, and the company's core revenue segments grew 14% last quarter. Three major analysts upgraded the stock to 'buy' following the announcement, calling the layoffs 'a painful but necessary efficiency move.'</mark>",
      ],
    }],
    chartData: [30, 32, 35, 38, 42, 44, 40, 36, 28, 26],
    chartLabel: "Stock Price · 3 months",
    chartDelta: "−15.2%",
    correctAnswer: "buy",
    outcomes: {
      buy: {
        quality: "good",
        feedback: "The layoffs were a cost-cutting measure, not a sign of failure. The stock recovered within 3 months.",
        learning: "Layoffs often signal a company prioritizing profitability over growth — which the market typically rewards. The key signal was the analyst upgrades and strong underlying revenue.",
        scoreImpact: { learning: 3, patience: 1, wealth: 2 },
      },
      hold: {
        quality: "neutral",
        feedback: "Holding was reasonable — the situation was ambiguous. But the analyst consensus pointed toward opportunity.",
        learning: "When professional analysts upgrade a stock after bad news, it's worth paying attention. They're looking at the same layoffs you are — and seeing an efficiency play, not a collapse.",
        scoreImpact: { patience: 2, learning: 1 },
      },
      sell: {
        quality: "bad",
        feedback: "The headline was scary, but the article told you the fundamentals were improving. The stock recovered fully within 3 months.",
        learning: "Layoff headlines trigger emotional selling, but the financial impact is often positive. Companies that cut costs in time tend to outperform those that don't.",
        scoreImpact: { patience: -2, learning: -1, wealth: -1 },
      },
    },
  },
  {
    tier: "medium",
    articles: [
      {
        source: "Swiss Market Watch",
        sourceType: "Analysis",
        headline: "Interest Rate Hike: What It Means for Your Portfolio",
        standfirst: "The SNB raised rates by 50 basis points — the largest increase in a decade.",
        paragraphs: [
          "The Swiss National Bank surprised markets today with an aggressive rate hike, pushing the benchmark rate to its highest level since 2010.",
          "<mark>Bond prices fell sharply, but bank stocks rallied as higher rates improve their lending margins. Real estate investment trusts declined as borrowing costs rise. Historically, equity markets have performed well in the 12 months following rate hikes, with an average return of 8.3%.</mark>",
        ],
      },
      {
        source: "Financial Opinion Weekly",
        sourceType: "Opinion",
        headline: "Rate Hike Signals the End of Easy Money — Brace for Impact",
        standfirst: "A prominent fund manager warns of cascading effects across all asset classes.",
        paragraphs: [
          "\"This is the beginning of the end for the everything bubble,\" says Marcus Weber of Alpine Capital. \"Every asset class that benefited from low rates — equities, real estate, crypto — is now at risk.\"",
          "Weber has moved 60% of his fund to cash and short-duration bonds, calling it \"the most defensive positioning in 15 years.\"",
        ],
      },
    ],
    chartData: [26, 27, 28, 27, 28, 29, 28, 27, 25, 24, 26],
    chartLabel: "SMI · 1 month",
    chartDelta: "−1.8%",
    correctAnswer: "hold",
    outcomes: {
      buy: {
        quality: "neutral",
        feedback: "Leaning into equities after a rate hike can work — historically markets do well. But the short-term is uncertain.",
        learning: "Rate hikes create volatility in the short term but don't end bull markets. The analysis article gave you the 8.3% average return statistic — that's the signal.",
        scoreImpact: { learning: 1, riskAlignment: -1 },
      },
      hold: {
        quality: "good",
        feedback: "The data was mixed and the two sources disagreed. Holding steady was the rational choice.",
        learning: "When a data-driven analysis and an opinion piece disagree, the data should carry more weight. But acknowledging uncertainty by holding is always defensible.",
        scoreImpact: { patience: 3, learning: 2 },
      },
      sell: {
        quality: "bad",
        feedback: "You followed the opinion piece over the data. The market recovered within 6 weeks.",
        learning: "Notice the pattern: the bearish source was one fund manager's opinion. The bullish source cited historical data and broad market analysis. Learn to weigh source quality, not just conviction.",
        scoreImpact: { patience: -2, learning: -1 },
      },
    },
  },
];

// ─── Allocation Context Pool ───
const ALLOCATION_CONTEXTS: string[] = [
  "Markets are stable. A good time to review your strategy and rebalance.",
  "Inflation ticking up to 2.8%. Consider your exposure to real assets.",
  "Strong corporate earnings across most sectors. Growth outlook positive.",
  "Geopolitical tensions rising. Safe-haven assets seeing inflows.",
  "Central bank signaling potential rate cuts in the next quarter.",
  "Housing market cooling. REITs under pressure but may present value.",
  "Tech sector rallying on AI hype. Is it sustainable?",
  "Emerging markets outperforming developed markets this quarter.",
];

// ─── Market return generator (semi-random, realistic ranges) ───
function generateMarketReturns(roundNum: number): Record<string, number> {
  // Adds slight randomness but keeps within realistic bounds
  const seed = roundNum * 7.3;
  const noise = (offset: number) => Math.sin(seed + offset) * 0.5 + 0.5; // 0-1

  return {
    savings: 0.3 + noise(1) * 0.8,     // 0.3% - 1.1%
    bonds: 1.0 + noise(2) * 3.0,        // 1.0% - 4.0%
    etf: -4 + noise(3) * 16,            // -4% - 12%
    stocks: -10 + noise(4) * 28,         // -10% - 18%
    gold: -2 + noise(5) * 10,           // -2% - 8%
    reits: -5 + noise(6) * 14,          // -5% - 9%
    crypto: -25 + noise(7) * 60,         // -25% - 35%
    emerging: -8 + noise(8) * 22,        // -8% - 14%
    private_equity: -5 + noise(9) * 20,  // -5% - 15%
  };
}

// ─── Cash injection schedule ───
function getInjection(roundNum: number): { amount: number; reason: string } | undefined {
  // Every 3 rounds, money comes in
  if (roundNum % 3 === 0) {
    const reasons = [
      "Monthly savings — PPF 75 added.",
      "Tax refund! PPF 120 added to your portfolio.",
      "Birthday money from family — PPF 100.",
      "Freelance gig payout — PPF 200 added.",
      "End-of-year bonus — PPF 150.",
      "You cut a subscription — PPF 50 saved and invested.",
    ];
    const amounts = [75, 120, 100, 200, 150, 50];
    const idx = Math.floor((roundNum / 3) - 1) % reasons.length;
    return { amount: amounts[idx], reason: reasons[idx] };
  }
  return undefined;
}

// ─── Difficulty tier for round number ───
function getTier(roundNum: number): "easy" | "medium" | "hard" {
  if (roundNum <= 9) return "easy";
  if (roundNum <= 14) return "medium";
  return "hard";
}

// ─── Quest type cycle ───
const QUEST_CYCLE: ("snap_decision" | "briefing_room" | "allocation")[] = [
  "snap_decision", "allocation", "briefing_room",
  "snap_decision", "briefing_room", "allocation",
];

// ═══════════════════════════════════════════
// MAIN GENERATOR
// ═══════════════════════════════════════════

export function generateFreePlayRound(roundNum: number): Round {
  const tier = getTier(roundNum);
  const year = roundNum;
  const questType = QUEST_CYCLE[(roundNum - 7) % QUEST_CYCLE.length];
  const marketReturns = generateMarketReturns(roundNum);

  // Get available products for this round
  const unlockedProducts = [...ALL_PRODUCTS];
  for (const [unlockRound, products] of Object.entries(PRODUCT_UNLOCKS)) {
    if (roundNum >= parseInt(unlockRound)) {
      unlockedProducts.push(...products);
    }
  }

  // Check for newly unlocked products
  const newUnlocks = PRODUCT_UNLOCKS[roundNum];

  let quest: Quest;

  switch (questType) {
    case "snap_decision": {
      const pool = SNAP_POOL.filter((s) => s.tier === tier || s.tier === "easy");
      // Pick 3 cards, cycling through pool
      const cards: SnapCard[] = [];
      for (let i = 0; i < 3; i++) {
        const idx = ((roundNum - 7) * 3 + i) % pool.length;
        cards.push(pool[idx].card);
      }
      quest = { type: "snap_decision", cards };
      break;
    }

    case "briefing_room": {
      const pool = BRIEFING_POOL.filter((b) => b.tier === tier || b.tier === "easy");
      const idx = ((roundNum - 7) >> 1) % pool.length;
      const b = pool[idx];
      quest = {
        type: "briefing_room",
        articles: b.articles,
        chartData: b.chartData,
        chartLabel: b.chartLabel,
        chartDelta: b.chartDelta,
        outcomes: b.outcomes,
      };
      break;
    }

    case "allocation": {
      const ctxIdx = (roundNum - 7) % ALLOCATION_CONTEXTS.length;
      // Set return display for variable-return products
      const products = unlockedProducts.map((p) => ({
        ...p,
        returnPct: Math.round((marketReturns[p.id] ?? 0) * 10) / 10,
      }));
      quest = {
        type: "allocation",
        products,
        marketContext: ALLOCATION_CONTEXTS[ctxIdx],
      };
      break;
    }
  }

  // Round title generation
  const titles = [
    "New Horizons", "Shifting Winds", "Testing Conviction",
    "The Long View", "Uncertain Waters", "Building Momentum",
    "Against the Grain", "Staying Sharp", "The Next Chapter",
    "Compounding Patience", "Market Cycles", "Growing Wiser",
  ];

  const descriptions = [
    "The market never stops. Neither should your learning.",
    "New challenges. Same principles. How will you respond?",
    "Your experience is growing. The decisions don't get easier — but you get better.",
    "Another year, another set of choices. Trust your process.",
    "Markets shift. Your strategy should evolve, not react.",
    "The fundamentals haven't changed. Has your approach?",
  ];

  return {
    id: roundNum,
    year,
    kicker: `Year ${year}`,
    title: titles[(roundNum - 7) % titles.length],
    description: descriptions[(roundNum - 7) % descriptions.length],
    quest,
    marketReturns,
    injection: getInjection(roundNum),
  };
}

// Get newly unlocked products for a round (for UI notification)
export function getNewUnlocks(roundNum: number): Product[] {
  return PRODUCT_UNLOCKS[roundNum] || [];
}