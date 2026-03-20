import { Round, Scores, Product } from "../types";

// ─── Constants ───
export const STARTING_CASH = 50;
export const TOTAL_ROUNDS = 6;

// ─── Products (unlock progressively) ───
export const ALL_PRODUCTS: Product[] = [
  {
    id: "savings",
    name: "Savings Account",
    description: "Guaranteed, but barely beats inflation",
    returnPct: 0.5,
    risk: "low",
    unlockRound: 2,
  },
  {
    id: "bonds",
    name: "Gov. Bonds",
    description: "Low risk, steady income",
    returnPct: 2.1,
    risk: "low",
    unlockRound: 2,
  },
  {
    id: "etf",
    name: "Broad Market ETF",
    description: "Tracks the whole market — up and down",
    returnPct: 8.4,
    risk: "medium",
    unlockRound: 2,
  },
  {
    id: "stocks",
    name: "Individual Stocks",
    description: "Higher potential, higher risk",
    returnPct: 12.0,
    returnDisplay: "-15% to +25%",
    risk: "high",
    unlockRound: 6,
  },
  {
    id: "gold",
    name: "Gold",
    description: "Hedge against uncertainty",
    returnPct: 4.2,
    risk: "medium",
    unlockRound: 6,
  },
  {
    id: "reits",
    name: "REITs",
    description: "Property income without buying property",
    returnPct: 5.5,
    risk: "medium",
    unlockRound: 6,
  },
];

// ─── Score helpers ───
const s = (
  d = 0,
  r = 0,
  p = 0,
  l = 0,
  w = 0
): Partial<Scores> => ({
  ...(d && { diversification: d }),
  ...(r && { riskAlignment: r }),
  ...(p && { patience: p }),
  ...(l && { learning: l }),
  ...(w && { wealth: w }),
});

// ─── Round Definitions ───
export const ROUNDS: Round[] = [
  // ═══════════════════════════════════════
  // ROUND 1 — The First Step
  // ═══════════════════════════════════════
  {
    id: 1,
    year: 1,
    kicker: "Year One",
    title: "The First Step",
    description:
      "You have PPF 50 left over this month. It's not much — but it's yours. What will you do with it?",
    quest: {
      type: "snap_decision",
      cards: [
        {
          id: "1a",
          headline: "Your flatmate says PPF 50 is too little to invest.",
          description: "\"Bro, just buy a nice dinner,\" he says, already Googling restaurants. What do you do?",
          options: [
            {
              id: "start",
              label: "Invest it anyway",
              description: "Dinner is temporary. Compound interest is forever.",
              quality: "good",
              feedback: "Smart. Your flatmate will have a great evening. You'll have a better decade.",
              learning:
                "Compound interest doesn't care about starting size. PPF 50 growing at 7% annually doubles to PPF 100 in about 10 years — and that's before you add anything else.",
              scoreImpact: s(0, 1, 0, 2, 1),
            },
            {
              id: "wait",
              label: "Wait until you have more",
              description: "Maybe he has a point",
              quality: "neutral",
              feedback: "The instinct to wait is common — but the best time to start was yesterday.",
              learning:
                "Waiting costs more than you think. Each year you delay, you lose a full year of potential compounding.",
              scoreImpact: s(0, 0, -1, 1, 0),
            },
            {
              id: "spend",
              label: "Fine, dinner it is 🍝",
              description: "YOLO, you only live once",
              quality: "bad",
              feedback: "Delicious. But that pasta could have been PPF 85 in 8 years. Hope it was worth it.",
              learning:
                "Small amounts feel insignificant today, but money has a time value. PPF 50 now is worth more than PPF 50 in the future because of what it could earn in between.",
              scoreImpact: s(0, 0, -1, 0, -1),
            },
          ],
        },
        {
          id: "1b",
          headline: "Your bank offers a free investment account.",
          description: "It sits alongside your regular savings account. No fees to open, no minimum balance.",
          options: [
            {
              id: "open",
              label: "Open it",
              description: "Nothing to lose",
              quality: "good",
              feedback: "Done. Opening an account isn't the same as risking money — it's just having the option.",
              learning:
                "The biggest barrier to investing isn't money or knowledge — it's inertia. Opening an account takes 5 minutes and costs nothing.",
              scoreImpact: s(0, 0, 0, 2, 1),
            },
            {
              id: "skip",
              label: "No thanks, sounds risky",
              description: "You'd rather keep things simple",
              quality: "bad",
              feedback: "Opening an account doesn't mean risking anything — you decide later what goes in.",
              learning:
                "Many people confuse 'investing' with 'gambling.' An investment account is a tool, like a kitchen. Having one doesn't mean you're a chef — but you can't cook without it.",
              scoreImpact: s(0, -1, 0, 0, 0),
            },
          ],
        },
        {
          id: "1c",
          headline: "Where do you put your first PPF 50?",
          description: "Account open. Three options stare back at you. Choose wisely — or at least better than your uncle did in 2001.",
          options: [
            {
              id: "savings",
              label: "Savings account",
              description: "0.5% interest — safe and simple",
              quality: "neutral",
              feedback: "Safe — but at 0.5%, inflation might actually eat your returns.",
              learning:
                "Savings accounts are for emergency funds, not long-term growth. After inflation, your money often loses purchasing power sitting in savings.",
              scoreImpact: s(0, 1, 0, 1, 0),
            },
            {
              id: "etf",
              label: "A broad market ETF",
              description: "Tracks hundreds of companies at once",
              quality: "good",
              feedback: "Strong choice. An ETF spreads your money across hundreds of companies automatically.",
              learning:
                "An ETF (Exchange-Traded Fund) is a basket of stocks you buy as one unit. It's the simplest way to invest in 'the whole market' without picking individual companies.",
              scoreImpact: s(1, 1, 0, 2, 2),
            },
            {
              id: "crypto",
              label: "Your friend's crypto tip",
              description: "They say it's about to moon 🚀",
              quality: "bad",
              feedback: "Speculating on tips with your only PPF 50 isn't investing — it's gambling.",
              learning:
                "Investing means putting money into assets with a reasonable expectation of growth over time. A friend's 'hot tip' has no research behind it. This is speculation, not strategy.",
              scoreImpact: s(-1, -2, -1, 0, -1),
            },
          ],
        },
      ],
    },
    marketReturns: { savings: 0.5, bonds: 2.1, etf: 8.4 },
  },

  // ═══════════════════════════════════════
  // ROUND 2 — Building the Foundation
  // ═══════════════════════════════════════
  {
    id: 2,
    year: 2,
    kicker: "Year Two",
    title: "Building the Foundation",
    description:
      "Your money has been working while you slept. Now it's time to decide how to spread it across different investments.",
    quest: {
      type: "allocation",
      products: ALL_PRODUCTS.filter((p) => p.unlockRound <= 2),
      marketContext:
        "Economy is stable. Inflation is low at 1.2%. Interest rates are unchanged.",
    },
    marketReturns: { savings: 0.5, bonds: 2.1, etf: 8.4 },
    injection: {
      amount: 100,
      reason: "Happy birthday! Your family gave you PPF 100.",
    },
  },

  // ═══════════════════════════════════════
  // ROUND 3 — The Panic
  // ═══════════════════════════════════════
  {
    id: 3,
    year: 3,
    kicker: "Year Three",
    title: "The Panic",
    description:
      "You wake up to red numbers everywhere. The news is screaming. Your portfolio is bleeding. What do you do?",
    quest: {
      type: "briefing_room",
      articles: [
        {
          source: "Swiss Market Journal",
          sourceType: "Breaking",
          headline:
            "Market Bloodbath: SMI Crashes 12% as Recession Fears Grip Europe",
          standfirst:
            "Investors flee to cash as the worst single-day drop since 2008 erases billions in value. Analysts warn of further pain ahead.",
          paragraphs: [
            "Global markets plunged sharply today amid rising fears of a full-blown recession. The Swiss Market Index fell 12% in early trading, its steepest single-day drop in over a decade. Retail investors across Europe rushed to sell, with trading platforms reporting record activity.",
            "The sell-off was led by technology and financial stocks, with some individual names down over 20%. Social media feeds filled with panic: \"Sell everything,\" trended across multiple platforms. Amateur investor forums saw a surge in posts about converting portfolios entirely to cash.",
            '<mark>However, UBS chief strategist Martin Keller noted that the sell-off follows an 18-month rally of 44%, and that corporate earnings across the SMI remain 12% above consensus expectations. "This is a textbook correction, not a structural crisis," Keller said. "The fundamentals haven\'t changed — the sentiment has."</mark>',
            "Whether this marks the beginning of a deeper downturn or a temporary correction remains to be seen. Central banks have signaled readiness to act if conditions deteriorate further.",
          ],
        },
      ],
      chartData: [44, 42, 38, 35, 28, 22, 14, 10, 8, 7, 6],
      chartLabel: "SMI · 6 months",
      chartDelta: "−12.0%",
      outcomes: {
        buy: {
          quality: "good",
          feedback:
            "The article told you everything you needed — a 12% drop after a 44% rally is a discount, not a disaster.",
          learning:
            "Historically, the SMI has recovered from every correction of this magnitude within 6–24 months. Buying when others panic is how long-term wealth is built. The phrase to remember: 'Be greedy when others are fearful.'",
          scoreImpact: s(0, 1, 2, 3, 2),
        },
        hold: {
          quality: "neutral",
          feedback:
            "You resisted the panic — that's the hardest part. But you also left a buying opportunity on the table.",
          learning:
            "Holding during a downturn is psychologically difficult but statistically sound. Markets have recovered from 90% of corrections within 12 months. You didn't lose money — you just didn't gain as much as you could have.",
          scoreImpact: s(0, 1, 2, 1, 1),
        },
        sell: {
          quality: "bad",
          feedback:
            "The headline got you. The article itself contained the clue: earnings were strong, the rally was enormous, and this was a correction.",
          learning:
            "Panic selling is the single most wealth-destroying behaviour for retail investors. You 'locked in' a 12% loss that the market recovered from within 5 months. The lesson: headlines are written to get clicks, not to give you investment advice.",
          scoreImpact: s(0, -1, -3, -1, -2),
        },
      },
    },
    marketReturns: { savings: 0.5, bonds: 3.8, etf: -12.0 },
  },

  // ═══════════════════════════════════════
  // ROUND 4 — The Noise
  // ═══════════════════════════════════════
  {
    id: 4,
    year: 4,
    kicker: "Year Four",
    title: "The Noise",
    description:
      "The world is full of opinions, tips, and offers. Not all of them have your best interests at heart.",
    quest: {
      type: "snap_decision",
      cards: [
        {
          id: "4a",
          headline: "A coworker doubled their money on a meme stock. They will not stop talking about it.",
          description:
            "\"I'm basically a genius,\" they say, showing you a screenshot for the fourth time today. \"Get in now before it moons.\"",
          options: [
            {
              id: "pass",
              label: "Pass — that's speculation",
              description: "One person's luck isn't a strategy",
              quality: "good",
              feedback:
                "For every person who doubled, ten others lost half. You just can't see them on social media.",
              learning:
                "This is called survivorship bias — you only hear from the winners. The coworker who lost 60% on the same stock isn't showing their phone around.",
              scoreImpact: s(0, 2, 1, 2, 1),
            },
            {
              id: "small",
              label: "Put 10% in — just to shut them up",
              description: "A small bet, and maybe some peace and quiet",
              quality: "neutral",
              feedback:
                "A small speculative allocation is a real strategy — but only when the rest of your portfolio is solid.",
              learning:
                "Some investors use a '90/10 rule': 90% in steady long-term holdings, 10% in higher-risk plays. The key is that the 10% is money you can afford to lose entirely.",
              scoreImpact: s(-1, 0, 0, 1, 0),
            },
            {
              id: "allin",
              label: "Go all in — don't miss out",
              description: "This could be your big break",
              quality: "bad",
              feedback:
                "The stock dropped 60% the following month. Your coworker went very quiet. You did not.",
              learning:
                "FOMO (Fear Of Missing Out) is one of the most expensive emotions in investing. If your entire strategy depends on getting lucky, it's not a strategy.",
              scoreImpact: s(-2, -2, -2, 0, -2),
            },
          ],
        },
        {
          id: "4b",
          headline: "You check your portfolio and it's down 8% from its peak.",
          description:
            "It recovered since the crash in year three, but it's pulled back again. You've been checking it every morning.",
          options: [
            {
              id: "stop_checking",
              label: "Check monthly, not daily",
              description: "Step back from the noise",
              quality: "good",
              feedback:
                "Legendary investors check their portfolios quarterly or even less. Noise is the enemy of patience.",
              learning:
                "Studies show that investors who check their portfolio daily are 4× more likely to panic-sell than those who check monthly. The market moves every day — your strategy shouldn't.",
              scoreImpact: s(0, 1, 3, 2, 1),
            },
            {
              id: "sell_losers",
              label: "Sell what's down, keep what's up",
              description: "Cut the dead weight",
              quality: "bad",
              feedback:
                "This feels logical, but it's a classic mistake called 'loss aversion.' Often the losers are just temporarily down.",
              learning:
                "Selling your losers and keeping your winners is called 'disposition effect.' Research shows it consistently hurts returns — you sell low and hold things that may be overvalued.",
              scoreImpact: s(-1, -1, -2, 0, -1),
            },
            {
              id: "rebalance",
              label: "Rebalance to your target split",
              description: "Bring everything back in line",
              quality: "neutral",
              feedback:
                "Rebalancing is smart — but doing it reactively out of anxiety can lead to over-trading.",
              learning:
                "Rebalancing means restoring your allocation to its target percentages. It's a good practice, but best done on a schedule (e.g. every 6 months), not as an emotional response.",
              scoreImpact: s(1, 1, 0, 1, 0),
            },
          ],
        },
        {
          id: "4c",
          headline: "An email promises 'guaranteed 15% annual returns.' It has a lot of exclamation marks.",
          description:
            "\"EXCLUSIVE FUND!! LIMITED SPOTS!! ACT NOW!!\" The logo is a golden eagle. The sender is definitely not a prince.",
          options: [
            {
              id: "delete",
              label: "Delete it immediately",
              description: "If it sounds too good, it is",
              quality: "good",
              feedback:
                "Correct. Any 'guaranteed' return above the risk-free rate is either a lie or a Ponzi scheme.",
              learning:
                "The average long-term stock market return in Switzerland is around 5–6% annually. Anyone promising double that with 'no risk' is promising something that doesn't exist. This is how most investment scams operate — professional appearance, impossible returns.",
              scoreImpact: s(0, 2, 0, 3, 1),
            },
            {
              id: "research",
              label: "Research it first",
              description: "Maybe it's legitimate",
              quality: "neutral",
              feedback:
                "Healthy skepticism is good, but even engaging gives these schemes more attention than they deserve.",
              learning:
                "A useful heuristic: legitimate investments never need to pressure you with 'limited spots' or 'act now.' Time pressure is a manipulation tactic, not a feature of real financial products.",
              scoreImpact: s(0, 0, 0, 1, 0),
            },
            {
              id: "invest",
              label: "Invest a small amount to test",
              description: "Low risk way to check if it's real",
              quality: "bad",
              feedback:
                "This is exactly how scam funds build credibility. Your 'small test' becomes their social proof.",
              learning:
                "Ponzi schemes often pay early investors with later investors' money — so your 'test' might actually return 15%. That's the trap. When you invest more, the scheme collapses.",
              scoreImpact: s(0, -2, -1, -1, -2),
            },
          ],
        },
        {
          id: "4d",
          headline: "Your phone sent 12 market notifications before breakfast.",
          description:
            "Markets up 2%. Down 1%. Up 0.5%. \"BREAKING.\" Another alert. Your coffee is getting cold.",
          options: [
            {
              id: "turn_off",
              label: "Turn off notifications",
              description: "Information isn't always useful",
              quality: "good",
              feedback:
                "Information is only useful if it changes your decision. Hourly updates change nothing about a long-term strategy.",
              learning:
                "This is called 'information overload.' More data doesn't mean better decisions. Professional fund managers who trade on daily news consistently underperform those with a buy-and-hold strategy.",
              scoreImpact: s(0, 1, 2, 2, 0),
            },
            {
              id: "read_ignore",
              label: "Read them but don't act",
              description: "Stay informed without reacting",
              quality: "neutral",
              feedback:
                "Sounds disciplined, but the constant exposure wears down your resolve over time.",
              learning:
                "Behavioural research shows that merely being exposed to market movements — even without acting — increases anxiety and reduces long-term conviction. Ignorance, in this case, really can be bliss.",
              scoreImpact: s(0, 0, 1, 1, 0),
            },
            {
              id: "follow_trend",
              label: "Follow the trends — buy when up",
              description: "Ride the momentum",
              quality: "bad",
              feedback:
                "This is called 'momentum chasing' and it consistently underperforms a simple buy-and-hold approach.",
              learning:
                "By the time a trend shows up in your notifications, professional traders have already acted on it. Retail investors who chase intraday trends lose an average of 4–7% annually compared to those who simply hold.",
              scoreImpact: s(0, -1, -2, 0, -1),
            },
          ],
        },
      ],
    },
    marketReturns: { savings: 0.5, bonds: 1.5, etf: 11.4 },
    injection: {
      amount: 150,
      reason: "End-of-year bonus! PPF 150 added to your portfolio.",
    },
  },

  // ═══════════════════════════════════════
  // ROUND 5 — The Grey Zone
  // ═══════════════════════════════════════
  {
    id: 5,
    year: 5,
    kicker: "Year Five",
    title: "The Grey Zone",
    description:
      "Two credible sources. Two opposite conclusions. The chart gives you nothing. Welcome to how real investing feels.",
    quest: {
      type: "briefing_room",
      articles: [
        {
          source: "European Markets Daily",
          sourceType: "Opinion",
          headline:
            "The Rally Is Over: Why Smart Money Is Moving to Cash",
          standfirst:
            "Veteran hedge fund manager warns of overheated markets and imminent rate hike.",
          paragraphs: [
            "After 18 months of near-continuous gains, cracks are forming beneath the surface. Price-to-earnings ratios across the SMI sit 22% above historical averages — a level last seen before the 2007 peak.",
            "\"We've moved 40% of our portfolio to cash,\" says Henrik Zeller of Alpina Capital. \"When the music stops, you want to be near the exit.\" Zeller points to a looming rate decision from the SNB as a potential catalyst for correction.",
            "Retail investor optimism, measured by the Swiss Sentiment Index, has hit its highest reading in a decade. Historically, extreme optimism has preceded 70% of significant market drawdowns.",
          ],
        },
        {
          source: "Swiss Economics Review",
          sourceType: "Analysis",
          headline:
            "Fundamentals Strong: Corporate Europe Posts Record Earnings",
          standfirst:
            "Hard data paints a more optimistic picture than the bears suggest.",
          paragraphs: [
            "Beneath the hand-wringing, the numbers tell a different story. Corporate earnings across the SMI rose 14% year-over-year, beating consensus estimates for the fifth consecutive quarter.",
            "Unemployment sits at 3.1%, consumer spending is growing at 2.8%, and export orders have surged. \"The economy isn't overheating — it's performing,\" says Dr. Lena Hofstetter of ETH Zürich's Center for Economic Research.",
            '<mark>"The anticipated rate hike is already priced into current valuations," Hofstetter adds. "Markets are forward-looking. The bears are fighting the last war."</mark>',
          ],
        },
      ],
      chartData: [24, 22, 25, 23, 26, 24, 25, 27, 25, 24, 26],
      chartLabel: "SMI · 3 months",
      chartDelta: "+0.8%",
      outcomes: {
        buy: {
          quality: "neutral",
          feedback:
            "Bullish conviction is fine if you've read both sides — but buying into ambiguity adds risk without clear reward.",
          learning:
            "When the signal is unclear, increasing your position is essentially a bet on one interpretation over another. It's not wrong, but it's not well-supported either.",
          scoreImpact: s(0, -1, 0, 1, 0),
        },
        hold: {
          quality: "good",
          feedback:
            "When two credible sources disagree and the data is flat, the smartest move is often no move at all.",
          learning:
            "Over-trading in uncertain markets is one of the biggest destroyers of retail investor returns. Sometimes the most profitable thing you can do is nothing. The pros call this 'sitting on your hands' — and it's a skill, not laziness.",
          scoreImpact: s(0, 2, 3, 2, 1),
        },
        sell: {
          quality: "bad",
          feedback:
            "The bearish article was compelling, but it was an opinion from one hedge fund manager. One person's view isn't a market signal.",
          learning:
            "Notice the difference: Article A was an opinion piece quoting one fund manager's positioning. Article B cited broad economic data and academic analysis. Learning to weigh source quality — not just arguments — is a critical investing skill.",
          scoreImpact: s(0, -1, -2, -1, -1),
        },
      },
    },
    marketReturns: { savings: 0.5, bonds: 1.2, etf: 4.8 },
  },

  // ═══════════════════════════════════════
  // ROUND 6 — The Long Game
  // ═══════════════════════════════════════
  {
    id: 6,
    year: 6,
    kicker: "Year Six",
    title: "The Long Game",
    description:
      "Your portfolio has grown. New products have unlocked. The market is shifting. Time to adapt your strategy.",
    quest: {
      type: "allocation",
      products: ALL_PRODUCTS,
      marketContext:
        "Interest rates rising. Inflation at 3.2%. Housing market cooling. Tech stocks on a tear — individual picks are swinging wildly.",
    },
    marketReturns: {
      savings: 0.5,
      bonds: 1.0,
      etf: 9.2,
      stocks: 23.5,
      gold: 6.8,
      reits: -4.5,
    },
  },
];

// ─── Ghost line data (pre-calculated) ───
// Savings-only: deposits earn 0.5% annually
export const SAVINGS_GHOST = [50, 50.25, 150.75, 151.50, 302.26, 303.77, 305.29];
// Perfect play: best possible decisions every round
export const PERFECT_GHOST = [50, 54.20, 158.74, 170.12, 352.44, 379.23, 416.87];

// ─── Investor Profile Labels ───
export const PROFILE_LABELS = {
  steady_hand: {
    title: "The Steady Hand",
    subtitle:
      "Calm under pressure, diversified by instinct. You read past the headlines and let time do the work.",
  },
  calculated_risk: {
    title: "The Calculated Risk-Taker",
    subtitle:
      "You do your homework, then lean in. Higher risk doesn't scare you — ignorance does.",
  },
  cautious_observer: {
    title: "The Cautious Observer",
    subtitle:
      "You prefer safety over speed. Nothing wrong with that — but make sure caution doesn't become inaction.",
  },
  thrill_seeker: {
    title: "The Thrill Seeker",
    subtitle:
      "You chase momentum and trust your gut. Exciting — but the market rewards patience more than instinct.",
  },
};

// ─── Post-round insights (keyed by round id) ───
export const ROUND_INSIGHTS: Record<number, string> = {
  1: "Your PPF 50 has entered the market. It's not much yet — but it's already doing more than sitting in your wallet.",
  2: "Your money is now spread across real assets. Notice how different products grow at different speeds.",
  3: "The crash tested your nerves. Watch your line versus the savings line — the gap tells the real story.",
  4: "Year four. Small, consistent decisions are compounding. See how the gap between your line and savings is widening?",
  5: "You held steady through uncertainty. Time is doing the heavy lifting now.",
  6: "Six years. Same deposits, very different outcomes. Here's your investor profile.",
};