import type { ChaosCard, ChaosRound, RiskTarget, RetirementScore, PlayerOption } from "../types/index2";
import type { ExtendedState } from "./GameContext2";

export const STARTING_MONTHLY_INCOME = 5500;
export const INVESTABLE_PCT_DEFAULT = 0.15;

// ─── Risk glide path ───
export const RISK_TARGETS: Record<string, RiskTarget> = {
  aggressive:   { maxHighRiskPct: 80, maxMediumRiskPct: 95, label: "Aggressive",   rationale: "You're young — time is your biggest asset. High-risk, high-reward is appropriate now." },
  balanced:     { maxHighRiskPct: 60, maxMediumRiskPct: 85, label: "Balanced",     rationale: "A mix of growth and stability. Start thinking about protecting what you've built." },
  moderate:     { maxHighRiskPct: 40, maxMediumRiskPct: 70, label: "Moderate",     rationale: "Shift toward capital preservation. Volatility hurts more when retirement is near." },
  conservative: { maxHighRiskPct: 20, maxMediumRiskPct: 50, label: "Conservative", rationale: "Protect your nest egg. Sequence-of-returns risk is real — a crash now could be devastating." },
};

export function getRiskTarget(age: number): RiskTarget {
  if (age < 40) return RISK_TARGETS.aggressive;
  if (age < 50) return RISK_TARGETS.balanced;
  if (age < 58) return RISK_TARGETS.moderate;
  return RISK_TARGETS.conservative;
}

// ═══════════════════════════════════════════════════════════════
// CHAOS CARDS — new options: PlayerOption[] structure
// ═══════════════════════════════════════════════════════════════

export const CHAOS_CARDS: ChaosCard[] = [

  // ── MEMECOIN ──
  {
    id: "mc_dogecoin",
    category: "memecoin",
    headline: "Your coworker Marco won't shut up about DogeCoin.",
    description: "He's up 400% and keeps sending you memes. 'It's going to the moon, bro. Elon tweeted again.' His girlfriend is also texting you about it.",
    emoji: "🐕",
    tip: "Even when memecoins win, it's luck — not skill. The house always wins eventually.",
    options: [
      {
        id: "listen_marco",
        label: "Listen to Marco",
        description: "YOLO CHF 2,500 into DogeCoin. Marco says it's a sure thing.",
        outcomes: [
          { id: "moon", probability: 0.25, label: "Moon mission 🚀", financialDelta: 3000, quality: "neutral", feedback: "You got lucky — it pumped. But you made a gambling decision, not an investment one. Marco is insufferable now.", learning: "A 25% win rate is still a 75% loss rate. You got lucky. Marco will lose it all next month.", scoreImpact: { riskAlignment: -3, patience: -2 } },
          { id: "rug", probability: 0.75, label: "Rug pulled 💀", financialDelta: -2500, quality: "bad", feedback: "It crashed 80% overnight. Marco is suspiciously quiet. His girlfriend has moved on to a new coin.", learning: "Memecoins are driven by hype, not fundamentals. When the hype dies, so does the price — fast and without warning.", scoreImpact: { riskAlignment: -4, wealth: -3 } },
        ],
      },
      {
        id: "ignore_marco",
        label: "Ignore Marco",
        description: "Smile, nod, and keep your money in your ETF.",
        outcomes: [
          { id: "smart", probability: 0.85, label: "Dodged the bullet 🧠", financialDelta: 0, quality: "good", feedback: "DogeCoin crashed 80% two weeks later. Marco stopped talking about it. You kept your CHF 2,500.", learning: "The best investment decision is often the one you don't make. Ignoring noise is a skill.", scoreImpact: { patience: 3, riskAlignment: 2 } },
          { id: "fomo", probability: 0.15, label: "FOMO hit you anyway 😬", financialDelta: -500, quality: "bad", feedback: "You caved at the last minute and bought a tiny amount. It still crashed. Classic.", learning: "FOMO is the enemy of rational investing. Even 'just a little' in a bad investment is a bad investment.", scoreImpact: { patience: -2, riskAlignment: -2 } },
        ],
      },
    ],
  },
  {
    id: "mc_brainrot_coin",
    category: "memecoin",
    headline: "BrainrotCoin is trending. Tralalero Tralala launched it.",
    description: "Some Italian AI-generated character named Tralalero Tralala launched a coin. It's up 900% in 48 hours. Your entire feed is nothing but this shark in sneakers.",
    emoji: "🦈",
    tip: "A 20% win rate means you lose 4 out of 5 times. Even when you win, you're reinforcing bad habits.",
    options: [
      {
        id: "ape_in",
        label: "Ape in CHF 500",
        description: "Tralalero Tralala said 'tung tung tung' and you felt it in your soul.",
        outcomes: [
          { id: "pump", probability: 0.2, label: "Tralalero pumped 🎉", financialDelta: 1800, quality: "neutral", feedback: "You made money, but you got lucky. The coin has no utility, no team, no roadmap. Tralalero Tralala is not a real person.", learning: "A 20% win rate means you lose 4 out of 5 times. Even when you win, you're reinforcing bad habits.", scoreImpact: { riskAlignment: -3 } },
          { id: "dump", probability: 0.8, label: "Tung tung tung 💀", financialDelta: -500, quality: "bad", feedback: "The creator sold their entire bag. You lost CHF 500 in 6 hours. Tralalero Tralala has already launched a new coin.", learning: "This is a rug pull — the creator dumps their tokens once retail investors buy in. It's a feature, not a bug, of memecoins.", scoreImpact: { riskAlignment: -4, wealth: -2 } },
        ],
      },
      {
        id: "research_first",
        label: "Google it first",
        description: "Who even is Tralalero Tralala? Let me check.",
        outcomes: [
          { id: "avoided", probability: 0.9, label: "Avoided the trap 🧠", financialDelta: 0, quality: "good", feedback: "You Googled it. Tralalero Tralala is an AI-generated Italian brainrot character. The coin has no whitepaper. You kept your CHF 500.", learning: "Five minutes of research can save you hundreds. If you can't explain what a coin does, don't buy it.", scoreImpact: { learning: 3, patience: 2 } },
          { id: "bought_anyway", probability: 0.1, label: "Bought it anyway 🤦", financialDelta: -500, quality: "bad", feedback: "You researched it, saw it was nonsense, and bought it anyway. The heart wants what it wants.", learning: "Knowing something is a bad idea and doing it anyway is the most expensive kind of mistake.", scoreImpact: { riskAlignment: -3, learning: -1 } },
        ],
      },
    ],
  },
  {
    id: "mc_67_coin",
    category: "memecoin",
    headline: "Someone launched '67Coin' — a coin about retiring at 67.",
    description: "The irony is not lost on you. It's satirizing the Swiss pension system. It's also up 200%. Marco's girlfriend says it's 'different this time.'",
    emoji: "👴",
    tip: "The real 67Coin is the friends we made along the way. And also a diversified ETF portfolio.",
    options: [
      {
        id: "buy_irony",
        label: "Buy the irony",
        description: "CHF 300 on a pension joke. At least it's funny.",
        outcomes: [
          { id: "ironic_win", probability: 0.3, label: "Ironic gains 😂", financialDelta: 600, quality: "neutral", feedback: "You made money on a joke coin. The universe has a sense of humor. Your financial advisor does not.", learning: "Irony doesn't make it a good investment. You got lucky on a meme. Don't do it again.", scoreImpact: { riskAlignment: -2 } },
          { id: "ironic_loss", probability: 0.7, label: "The joke's on you", financialDelta: -300, quality: "bad", feedback: "The coin died as fast as it was born. You lost CHF 300 on a pension joke. The real joke is that you could have put it in an actual pension.", learning: "The best joke here is that CHF 300 in a 3A pension fund would have saved you CHF 300 in taxes.", scoreImpact: { riskAlignment: -3, learning: 2 } },
        ],
      },
      {
        id: "put_in_3a",
        label: "Put it in your 3A instead",
        description: "CHF 300 into your actual pension. Less funny, more effective.",
        outcomes: [
          { id: "smart_move", probability: 1.0, label: "Tax-optimized 💎", financialDelta: 0, quality: "good", feedback: "You contributed CHF 300 to your 3A. You saved roughly CHF 90 in taxes. 67Coin crashed 95% the next day.", learning: "The 3A pension gives you an immediate guaranteed return via tax savings. That's better than any memecoin.", scoreImpact: { riskAlignment: 3, learning: 2, wealth: 1 } },
        ],
      },
    ],
  },


  // ── BRAINROT ──
  {
    id: "br_sigma_grindset",
    category: "brainrot",
    headline: "A 'sigma grindset' influencer says to skip your 3A pension.",
    description: "'Real alphas don't need the government's permission to retire.' He's 22, lives with his parents, and sells a CHF 299 course called 'Escape the Matrix.'",
    emoji: "💪",
    options: [
      {
        id: "ignore_sigma",
        label: "Ignore the sigma",
        description: "Keep contributing to your 3A like a normal person.",
        outcomes: [
          { id: "smart", probability: 1.0, label: "Kept the tax break ✅", financialDelta: 0, quality: "good", feedback: "You kept contributing to your 3A. The tax deduction alone is worth it. The sigma influencer is now selling NFTs.", learning: "The Swiss 3A pension gives you a tax deduction of up to CHF 7,056/year. That's free money. Sigma grindset influencers don't pay your taxes.", scoreImpact: { learning: 3, riskAlignment: 2 } },
        ],
      },
      {
        id: "follow_sigma",
        label: "Skip 3A, invest in yourself",
        description: "Buy his CHF 299 course and skip your pension contribution.",
        outcomes: [
          { id: "wasted", probability: 0.9, label: "Lost the tax benefit 😬", financialDelta: -1100, quality: "bad", feedback: "You skipped your 3A and bought the course. The course was 4 hours of motivational quotes. You lost the tax deduction.", learning: "Missing one year of 3A contributions costs you the tax deduction AND the compounding. Over 30 years, that's a significant loss.", scoreImpact: { learning: -2, riskAlignment: -2 } },
          { id: "inspired", probability: 0.1, label: "Got motivated 🤷", financialDelta: -299, quality: "neutral", feedback: "The course was bad but you felt inspired for a week. You still lost the 3A tax benefit though.", learning: "Motivation is free. Tax deductions are not. Prioritize accordingly.", scoreImpact: { patience: 1, riskAlignment: -1 } },
        ],
      },
    ],
  },
  {
    id: "br_npc_trading",
    category: "brainrot",
    headline: "You discovered 'NPC trading' — copying trades from a TikTok account.",
    description: "The account has 2M followers and posts daily 'guaranteed' stock picks. Comments are full of rocket emojis. Marco's girlfriend follows it.",
    emoji: "🤖",
    options: [
      {
        id: "copy_trades",
        label: "Copy the trades",
        description: "10% of your portfolio into whatever they post today.",
        outcomes: [
          { id: "pump", probability: 0.25, label: "NPC pumped 📈", financialDelta: 1200, quality: "neutral", feedback: "The pick worked this time. But you're still outsourcing your financial decisions to a stranger on TikTok.", learning: "Even a broken clock is right twice a day. Following random TikTok picks is not a strategy — it's gambling with extra steps.", scoreImpact: { riskAlignment: -3, learning: -1 } },
          { id: "dump", probability: 0.75, label: "NPC dumped 📉", financialDelta: -1000, quality: "bad", feedback: "The account was a pump-and-dump scheme. You were the exit liquidity. The account has already been deleted.", learning: "Pump-and-dump schemes work by building hype, then selling to the people who bought the hype. You were the hype buyer.", scoreImpact: { riskAlignment: -4, learning: 2 } },
        ],
      },
      {
        id: "report_account",
        label: "Report the account",
        description: "This smells like a pump-and-dump. You've seen this before.",
        outcomes: [
          { id: "reported", probability: 1.0, label: "Civic duty done 🏅", financialDelta: 0, quality: "good", feedback: "You reported the account. It got taken down 3 days later. The followers lost money. You didn't.", learning: "Pump-and-dump schemes on social media are illegal. Reporting them protects other investors. And yourself.", scoreImpact: { learning: 3, patience: 2 } },
        ],
      },
    ],
  },
  {
    id: "br_fanum_tax",
    category: "brainrot",
    headline: "Your friend 'fanum taxed' your lunch money.",
    description: "You lost CHF 15 to a meme. You're considering suing. Your lawyer says no. Marco thinks it's hilarious.",
    emoji: "🍔",
    options: [
      {
        id: "laugh_it_off",
        label: "Laugh it off",
        description: "It's CHF 15. You'll survive.",
        outcomes: [
          { id: "fine", probability: 1.0, label: "Kept perspective 😂", financialDelta: 0, quality: "good", feedback: "You laughed it off. CHF 15 is not a financial event. Your portfolio is fine.", learning: "Not every money loss is a financial lesson. Sometimes it's just a meme. Keep perspective.", scoreImpact: { patience: 1 } },
        ],
      },
      {
        id: "spiral_into_fomo",
        label: "Spiral into FOMO",
        description: "This is a sign. You need to make money fast. Time to find a hot coin.",
        outcomes: [
          { id: "spiral", probability: 0.9, label: "Spiraled into FOMO 😱", financialDelta: -500, quality: "bad", feedback: "You went down a rabbit hole and bought a random coin to 'make it back.' You lost CHF 500.", learning: "Chasing losses is one of the most dangerous behaviors in finance. A CHF 15 loss that leads to a CHF 500 loss is a CHF 515 loss.", scoreImpact: { patience: -3, riskAlignment: -2 } },
          { id: "lucky_spiral", probability: 0.1, label: "Lucky spiral 🍀", financialDelta: 200, quality: "neutral", feedback: "You got lucky. But you made a terrible decision for the right outcome. Don't do it again.", learning: "Getting lucky on a bad decision is worse than losing — it reinforces the behavior.", scoreImpact: { patience: -2, riskAlignment: -2 } },
        ],
      },
    ],
  },


  // ── SCAM ──
  {
    id: "sc_crypto_recovery",
    category: "scam",
    headline: "An email promises to recover your lost crypto — for a small fee.",
    description: "'We specialize in blockchain forensics. Send us CHF 200 and we'll recover your lost funds.' You never lost any crypto. Marco's girlfriend forwarded it to you.",
    emoji: "🎣",
    options: [
      {
        id: "delete_it",
        label: "Delete it",
        description: "This is obviously a scam.",
        outcomes: [
          { id: "safe", probability: 1.0, label: "Deleted it 🗑️", financialDelta: 0, quality: "good", feedback: "You ignored the scam. Your CHF 200 stays in your pocket.", learning: "Crypto recovery scams are extremely common. No one can 'recover' blockchain transactions — they're immutable by design.", scoreImpact: { learning: 2 } },
        ],
      },
      {
        id: "pay_fee",
        label: "Pay the CHF 200 fee",
        description: "Maybe they can actually help? The email looks professional.",
        outcomes: [
          { id: "scammed", probability: 0.95, label: "Scammed 😬", financialDelta: -200, quality: "bad", feedback: "They took your CHF 200 and disappeared. There was no recovery service. There never is.", learning: "If you didn't lose crypto, you can't recover it. If you did lose it, no one can recover it either. This is always a scam.", scoreImpact: { learning: 3, wealth: -1 } },
          { id: "lucky_escape", probability: 0.05, label: "They ghosted before charging", financialDelta: 0, quality: "neutral", feedback: "They never followed up. You got lucky. But you were ready to send money to a scammer.", learning: "The fact that you were willing to pay is the problem. Always verify before sending money to anyone online.", scoreImpact: { learning: 2 } },
        ],
      },
    ],
  },
  {
    id: "sc_investment_guru",
    category: "scam",
    headline: "A 'certified investment guru' offers a 40% guaranteed return.",
    description: "He has a Lamborghini in his profile picture and a 'proprietary algorithm.' Minimum investment: CHF 5,000. Marco already invested.",
    emoji: "🚗",
    tip: "If someone guarantees returns, they're either lying or don't understand investing.",
    options: [
      {
        id: "avoid_guru",
        label: "Smell the scam",
        description: "No legitimate investment guarantees 40%. This is a Ponzi.",
        outcomes: [
          { id: "avoided", probability: 1.0, label: "Smelled the scam 👃", financialDelta: 0, quality: "good", feedback: "You didn't invest. The 'guru' was arrested 3 months later for running a Ponzi scheme. Marco lost CHF 5,000.", learning: "No legitimate investment guarantees 40% returns. The risk-free rate in Switzerland is around 1-2%. Anything promising 40% is either a scam or taking on enormous risk.", scoreImpact: { learning: 3, riskAlignment: 2 } },
        ],
      },
      {
        id: "invest_guru",
        label: "Invest CHF 5,000",
        description: "Marco says it's legit. The Lamborghini looks real.",
        outcomes: [
          { id: "ponzi", probability: 0.85, label: "Ponzi'd 💸", financialDelta: -5000, quality: "bad", feedback: "The returns were paid from new investors' money. When it collapsed, you lost everything. Marco also lost everything.", learning: "Ponzi schemes pay early investors with new investors' money. They always collapse. The only question is when.", scoreImpact: { wealth: -4, learning: 2 } },
          { id: "early_exit", probability: 0.15, label: "Got out early 🍀", financialDelta: 2000, quality: "neutral", feedback: "You got in early and pulled out before the collapse. You made money on a Ponzi scheme. This was luck, not skill.", learning: "Even if you profit from a Ponzi scheme, you're profiting from other people's losses. And next time you might not be so lucky.", scoreImpact: { riskAlignment: -2, learning: 1 } },
        ],
      },
    ],
  },


  // ── SOCIAL / FOMO ──
  {
    id: "so_fomo_ipo",
    category: "social",
    headline: "Everyone at work is buying into a hot IPO.",
    description: "The company makes AI-powered dog food. Valuation: CHF 4 billion. Revenue: CHF 2 million. Your colleagues are already planning their yachts.",
    emoji: "🐶",
    options: [
      {
        id: "buy_ipo",
        label: "Buy the IPO",
        description: "CHF 2,000 in. AI dog food is the future.",
        outcomes: [
          { id: "pop", probability: 0.3, label: "IPO popped 🎉", financialDelta: 2000, quality: "neutral", feedback: "You made money, but the valuation was absurd. You got lucky on a speculative bet. Your colleagues are insufferable.", learning: "IPO pops are common in the short term but most IPOs underperform the market over 3-5 years. You got lucky — don't mistake it for skill.", scoreImpact: { riskAlignment: -2, patience: -1 } },
          { id: "crash", probability: 0.7, label: "IPO crashed 📉", financialDelta: -1500, quality: "bad", feedback: "The AI dog food company had no moat. The stock dropped 80% in 3 months. Your colleagues are very quiet now.", learning: "A CHF 4B valuation on CHF 2M revenue is a 2000x price-to-sales ratio. That's not investing — that's hoping.", scoreImpact: { riskAlignment: -3, wealth: -2 } },
        ],
      },
      {
        id: "skip_ipo",
        label: "Skip it",
        description: "AI dog food sounds like a punchline, not a business.",
        outcomes: [
          { id: "smart", probability: 0.85, label: "Skipped wisely 🧠", financialDelta: 0, quality: "good", feedback: "The IPO dropped 60% in 6 months. Your colleagues are very quiet now. You kept your money.", learning: "Most IPOs are priced to benefit the company and early investors, not retail buyers. The 'hot IPO' narrative is usually hype.", scoreImpact: { learning: 2, patience: 2 } },
          { id: "missed_pop", probability: 0.15, label: "Missed the pop 😅", financialDelta: 0, quality: "neutral", feedback: "The IPO popped 50% on day one. You missed it. But it crashed 70% six months later, so you still came out ahead.", learning: "Missing a short-term pop is fine if the long-term thesis is wrong. Patience beats FOMO.", scoreImpact: { patience: 1 } },
        ],
      },
    ],
  },
  {
    id: "so_influencer_portfolio",
    category: "social",
    headline: "A finance influencer posts their 'transparent' portfolio.",
    description: "They're up 300% this year. They're sharing their exact positions. 'I just want to help people.' They also sell a CHF 299 course. Marco's girlfriend is a subscriber.",
    emoji: "📱",
    options: [
      {
        id: "copy_portfolio",
        label: "Copy their portfolio",
        description: "They're up 300%. How hard can it be?",
        outcomes: [
          { id: "exit_liquidity", probability: 0.75, label: "Copied and lost 📉", financialDelta: -800, quality: "bad", feedback: "You copied their portfolio. They sold their positions the day after posting. You were the exit liquidity.", learning: "Influencers often post positions they're already planning to exit. By the time you copy them, they've already sold.", scoreImpact: { riskAlignment: -3, learning: 2 } },
          { id: "lucky_copy", probability: 0.25, label: "Lucky copy 🍀", financialDelta: 500, quality: "neutral", feedback: "You copied them and it worked. But they sold a week later and you didn't notice. You got lucky.", learning: "Survivorship bias: influencers show their wins, not their losses. Their 300% return might be one lucky pick out of 20 bad ones.", scoreImpact: { riskAlignment: -1 } },
        ],
      },
      {
        id: "ignore_influencer",
        label: "Ignore the noise",
        description: "If they're so good at investing, why are they selling courses?",
        outcomes: [
          { id: "smart", probability: 1.0, label: "Ignored the noise 🎧", financialDelta: 0, quality: "good", feedback: "You didn't copy them. Their 'transparent' portfolio was missing the positions they'd already exited.", learning: "Survivorship bias: influencers show their wins, not their losses. Their 300% return might be one lucky pick out of 20 bad ones.", scoreImpact: { learning: 3, patience: 2 } },
        ],
      },
    ],
  },


  // ── LIFESTYLE ──
  {
    id: "ls_luxury_watch",
    category: "lifestyle",
    headline: "You're tempted by a CHF 8,000 Swiss watch.",
    description: "'It's an investment,' you tell yourself. 'Watches hold their value.' Your portfolio disagrees. Marco has the same watch.",
    emoji: "⌚",
    tip: "A watch tells you the time. An ETF tells you you're on time for retirement.",
    options: [
      {
        id: "buy_watch",
        label: "Buy the watch",
        description: "You deserve it. It's basically an investment.",
        outcomes: [
          { id: "bought", probability: 1.0, label: "Bought the watch ⌚", financialDelta: -8000, quality: "bad", feedback: "You bought the watch. It's beautiful. Your portfolio is CHF 8,000 lighter. Marco has the same one.", learning: "Most watches depreciate. Only a tiny fraction of luxury watches appreciate, and those require specific brands, references, and conditions. This was consumption, not investment.", scoreImpact: { wealth: -3, riskAlignment: -1 } },
        ],
      },
      {
        id: "skip_watch",
        label: "Skip it",
        description: "CHF 8,000 invested at 7% = CHF 30,000 in 20 years.",
        outcomes: [
          { id: "skipped", probability: 1.0, label: "Skipped it 💪", financialDelta: 0, quality: "good", feedback: "You didn't buy the watch. CHF 8,000 invested in an ETF at 7% annual return = CHF 30,000 in 20 years.", learning: "The opportunity cost of luxury spending is enormous over time. CHF 8,000 today is CHF 30,000+ at retirement.", scoreImpact: { wealth: 2, patience: 3 } },
        ],
      },
      {
        id: "buy_cheaper",
        label: "Buy a CHF 200 watch",
        description: "It tells the same time. You're not Marco.",
        outcomes: [
          { id: "sensible", probability: 1.0, label: "Sensible choice 🕐", financialDelta: -200, quality: "good", feedback: "You bought a decent watch for CHF 200 and invested the rest. It tells the same time.", learning: "Satisfying a desire at a fraction of the cost is a superpower. The CHF 7,800 difference will compound for decades.", scoreImpact: { wealth: 2, patience: 2 } },
        ],
      },
    ],
  },
  {
    id: "ls_lifestyle_creep",
    category: "lifestyle",
    headline: "You got a raise. Time to upgrade your lifestyle.",
    description: "New apartment, new car, new subscriptions. You deserve it. Your savings rate is about to drop from 20% to 5%.",
    emoji: "🏠",
    options: [
      {
        id: "full_upgrade",
        label: "Full lifestyle upgrade",
        description: "New apartment, new car, new everything. You earned it.",
        outcomes: [
          { id: "creep", probability: 1.0, label: "Lifestyle upgraded 🛋️", financialDelta: -3000, quality: "bad", feedback: "You upgraded everything. Your monthly expenses jumped CHF 1,200. Your savings rate collapsed.", learning: "Lifestyle creep is the silent killer of wealth. Every raise that goes to spending is a raise that doesn't compound.", scoreImpact: { wealth: -3, patience: -2 }, incomeChange: -500 },
        ],
      },
      {
        id: "modest_upgrade",
        label: "Modest upgrade only",
        description: "One nice thing. Keep the savings rate above 15%.",
        outcomes: [
          { id: "balanced", probability: 1.0, label: "Modest upgrade 🧘", financialDelta: 0, quality: "good", feedback: "You upgraded a little, but kept your savings rate above 15%. Smart balance.", learning: "The key is to let your savings rate grow with your income, not just your spending. Even a 1% increase in savings rate matters enormously over decades.", scoreImpact: { wealth: 2, patience: 2 } },
        ],
      },
      {
        id: "invest_raise",
        label: "Invest the entire raise",
        description: "You didn't have it before. You don't need it now.",
        outcomes: [
          { id: "invested", probability: 1.0, label: "Raise invested 💎", financialDelta: 0, quality: "good", feedback: "You invested the full raise. You didn't change your lifestyle — you changed your future.", learning: "Investing a raise before you get used to the money is the most powerful wealth-building habit. You can't miss what you never had.", scoreImpact: { wealth: 3, patience: 3 }, incomeChange: 400 },
        ],
      },
    ],
  },


  // ── MACRO ──
  {
    id: "ma_market_crash",
    category: "macro",
    headline: "Markets drop 30% in a week. Everyone is panicking.",
    description: "Your portfolio is down significantly. The news says 'worst crash since 2008.' Your stomach says sell everything. Marco already sold.",
    emoji: "📉",
    options: [
      {
        id: "hold_steady",
        label: "Hold steady",
        description: "This has happened before. It will recover.",
        outcomes: [
          { id: "held", probability: 0.7, label: "Held steady 💎", financialDelta: 0, quality: "good", feedback: "You held. Markets recovered fully within 18 months. Your patience was rewarded. Marco bought back in at the top.", learning: "Every major market crash in history has been followed by a recovery. Selling during a crash locks in losses and means you miss the recovery.", scoreImpact: { patience: 4, riskAlignment: 2 } },
          { id: "held_slow", probability: 0.3, label: "Held but it took longer", financialDelta: 0, quality: "neutral", feedback: "You held. Recovery took 3 years instead of 18 months. But you got there.", learning: "Recoveries take different amounts of time. The key is staying invested — not timing the recovery.", scoreImpact: { patience: 3 } },
        ],
      },
      {
        id: "panic_sell",
        label: "Panic sell",
        description: "This time it's different. Get out now.",
        outcomes: [
          { id: "sold_bottom", probability: 0.8, label: "Panic sold 😱", financialDelta: -8000, quality: "bad", feedback: "You sold at the bottom. Markets recovered 40% over the next year. You missed it. Marco also sold. You're both wrong.", learning: "Panic selling is the most expensive mistake in investing. You turn a paper loss into a real one, then miss the recovery.", scoreImpact: { patience: -4, wealth: -3 } },
          { id: "lucky_sell", probability: 0.2, label: "Sold before it got worse 🍀", financialDelta: -2000, quality: "neutral", feedback: "You sold and it kept dropping for another month. You avoided the worst. But you also missed the recovery.", learning: "Even when panic selling 'works,' you still have to decide when to buy back in. Most people buy back at the top.", scoreImpact: { patience: -2, riskAlignment: -2 } },
        ],
      },
      {
        id: "buy_dip",
        label: "Buy the dip",
        description: "Everything is on sale. This is the opportunity.",
        outcomes: [
          { id: "bought", probability: 0.75, label: "Bought the dip 🛒", financialDelta: 5000, quality: "good", feedback: "You bought more during the crash. When markets recovered, your gains were amplified.", learning: "Buying during crashes is psychologically hard but mathematically correct. You're buying the same assets at a 30% discount.", scoreImpact: { patience: 3, wealth: 3, riskAlignment: 1 } },
          { id: "bought_early", probability: 0.25, label: "Bought too early 😅", financialDelta: -1000, quality: "neutral", feedback: "You bought the dip but it kept dipping. You're still down, but less than if you'd panic sold.", learning: "Timing the exact bottom is impossible. Buying in tranches during a crash is better than trying to nail the bottom.", scoreImpact: { patience: 2 } },
        ],
      },
    ],
  },
  {
    id: "ma_inflation_spike",
    category: "macro",
    headline: "Inflation hits 6%. Your savings account earns 0.5%.",
    description: "In real terms, your cash is losing 5.5% per year. The news is full of doom. Marco moved everything to gold.",
    emoji: "📊",
    options: [
      {
        id: "rebalance_real",
        label: "Rebalance to real assets",
        description: "Shift toward equities and inflation hedges.",
        outcomes: [
          { id: "smart", probability: 0.7, label: "Rebalanced smartly 🏗️", financialDelta: 2000, quality: "good", feedback: "You shifted toward inflation hedges. Your real returns stayed positive.", learning: "During high inflation, cash and bonds lose real value. Equities, real estate, and commodities tend to keep pace with or beat inflation.", scoreImpact: { diversification: 3, learning: 2 } },
          { id: "timing", probability: 0.3, label: "Rebalanced a bit late", financialDelta: 500, quality: "neutral", feedback: "You rebalanced but a bit late. You still came out ahead of staying in cash.", learning: "Imperfect action beats perfect inaction. Even a delayed rebalance beats doing nothing during high inflation.", scoreImpact: { learning: 1 } },
        ],
      },
      {
        id: "stay_cash",
        label: "Stay in cash",
        description: "It feels safe. At least you know what you have.",
        outcomes: [
          { id: "lost_real", probability: 1.0, label: "Stayed in cash 💸", financialDelta: -2000, quality: "bad", feedback: "Your cash lost 5.5% in real purchasing power. You felt safe but got poorer.", learning: "Inflation is a hidden tax on cash. Feeling safe in a savings account during high inflation is an illusion.", scoreImpact: { learning: 2, wealth: -2 } },
        ],
      },
    ],
  },


  // ── WORKPLACE ──
  {
    id: "wp_bonus",
    category: "workplace",
    headline: "You received a CHF 5,000 year-end bonus.",
    description: "Your boss says you've earned it. Your bank account agrees. Marco already spent his on a watch.",
    emoji: "💰",
    options: [
      {
        id: "invest_all_bonus",
        label: "Invest it all",
        description: "Future you will thank present you.",
        outcomes: [
          { id: "invested", probability: 1.0, label: "Invested it all 📈", financialDelta: 5000, quality: "good", feedback: "You invested the full bonus. Future you is grateful.", learning: "Windfalls are the best time to invest — you won't miss money you never had in your spending budget.", scoreImpact: { wealth: 3, patience: 2 } },
        ],
      },
      {
        id: "split_bonus",
        label: "Split 50/50",
        description: "Invest half, enjoy half. Balance.",
        outcomes: [
          { id: "split", probability: 1.0, label: "Split 50/50 🤝", financialDelta: 2500, quality: "good", feedback: "You invested half and spent half. A reasonable balance.", learning: "The 'pay yourself first' principle: invest a portion of every windfall before spending. Even 50% is better than 0%.", scoreImpact: { wealth: 1, patience: 1 } },
        ],
      },
      {
        id: "splurge_bonus",
        label: "Splurge it all",
        description: "You earned it. Live a little.",
        outcomes: [
          { id: "splurged", probability: 1.0, label: "Splurged it all 🎉", financialDelta: 0, quality: "neutral", feedback: "You spent the bonus. You had fun. But the opportunity cost was real.", learning: "A CHF 5,000 bonus invested at 7% annual return becomes CHF 19,000 in 20 years. Spending it is a choice — just make it consciously.", scoreImpact: { patience: -1 } },
        ],
      },
    ],
  },
  {
    id: "wp_job_loss",
    category: "workplace",
    headline: "You were laid off. Your emergency fund is about to be tested.",
    description: "The company restructured. You have 3 months of salary as severance. Do you have an emergency fund?",
    emoji: "📋",
    options: [
      {
        id: "had_emergency_fund",
        label: "I have an emergency fund",
        description: "3-6 months of expenses in cash, ready to go.",
        outcomes: [
          { id: "covered", probability: 1.0, label: "Emergency fund saved you 🛡️", financialDelta: 0, quality: "good", feedback: "Your 3-6 month emergency fund covered the gap. You didn't have to sell investments at a bad time.", learning: "An emergency fund isn't just about peace of mind — it prevents you from being forced to sell investments at the worst possible time.", scoreImpact: { patience: 3, riskAlignment: 2 } },
        ],
      },
      {
        id: "no_emergency_fund",
        label: "I don't have one",
        description: "I've been investing everything. Cash felt wasteful.",
        outcomes: [
          { id: "sold_investments", probability: 0.8, label: "Had to sell investments 😬", financialDelta: -4000, quality: "bad", feedback: "You had no emergency fund. You sold investments at a loss to cover expenses.", learning: "Without an emergency fund, any financial shock forces you to liquidate investments — often at the worst time. Build 3-6 months of expenses in cash first.", scoreImpact: { wealth: -3, learning: 3 } },
          { id: "found_job_fast", probability: 0.2, label: "Found a job quickly 🍀", financialDelta: 0, quality: "neutral", feedback: "You found a new job in 3 weeks. Lucky. But you were one month away from selling investments at a loss.", learning: "Getting lucky doesn't mean the strategy was right. Build an emergency fund before investing.", scoreImpact: { learning: 2 } },
        ],
      },
    ],
  },
  {
    id: "wp_salary_raise",
    category: "workplace",
    headline: "You negotiated a CHF 800/month raise.",
    description: "You asked, they said yes. Now you have an extra CHF 800 every month. Marco got the same raise and immediately upgraded his car.",
    emoji: "📈",
    options: [
      {
        id: "invest_the_raise",
        label: "Invest the full raise",
        description: "You didn't have it before. You don't need it now.",
        outcomes: [
          { id: "invested", probability: 1.0, label: "Raise invested 💎", financialDelta: 0, quality: "good", feedback: "You invested the full raise. You didn't change your lifestyle — you changed your future.", learning: "Investing a raise before you get used to the money is the most powerful wealth-building habit. You can't miss what you never had.", scoreImpact: { wealth: 3, patience: 2 }, incomeChange: 800 },
        ],
      },
      {
        id: "spend_the_raise",
        label: "Upgrade your lifestyle",
        description: "You earned more, you should live better.",
        outcomes: [
          { id: "spent", probability: 1.0, label: "Spent the raise 🛍️", financialDelta: 0, quality: "neutral", feedback: "You spent the raise on lifestyle upgrades. Your quality of life improved. Your portfolio didn't.", learning: "Lifestyle inflation is natural but costly. Even investing half the raise would have made a significant difference over time.", scoreImpact: { patience: -1 } },
        ],
      },
    ],
  },


  // ── LUCKY ──
  {
    id: "lu_inheritance",
    category: "lucky",
    headline: "A distant relative left you CHF 20,000.",
    description: "You didn't know them well. But apparently they believed in you. Marco's girlfriend says you should put it in crypto.",
    emoji: "🎁",
    options: [
      {
        id: "invest_inheritance",
        label: "Invest it all",
        description: "Lump-sum into a diversified portfolio.",
        outcomes: [
          { id: "invested", probability: 1.0, label: "Invested it all 📊", financialDelta: 20000, quality: "good", feedback: "You invested the full inheritance. A meaningful boost to your long-term wealth.", learning: "Lump-sum investing outperforms dollar-cost averaging about 2/3 of the time. When you have a windfall, investing it promptly is usually the right call.", scoreImpact: { wealth: 4, patience: 2 } },
        ],
      },
      {
        id: "split_inheritance",
        label: "Invest most, keep some",
        description: "CHF 15,000 invested, CHF 5,000 for something meaningful.",
        outcomes: [
          { id: "split", probability: 1.0, label: "Invested most of it 🤝", financialDelta: 15000, quality: "good", feedback: "You invested CHF 15,000 and kept CHF 5,000 for something meaningful. Balanced.", learning: "Using a windfall to both invest and do something meaningful is a healthy approach. The key is not letting it all disappear into lifestyle spending.", scoreImpact: { wealth: 3, patience: 1 } },
        ],
      },
      {
        id: "crypto_inheritance",
        label: "Put it in crypto (Marco's GF's idea)",
        description: "She says it'll 10x. She said that about BrainrotCoin too.",
        outcomes: [
          { id: "lost", probability: 0.7, label: "Crypto crashed 💀", financialDelta: -14000, quality: "bad", feedback: "Crypto dropped 70%. You lost CHF 14,000 of your inheritance. Marco's girlfriend has moved on to a new coin.", learning: "Putting a windfall into a single volatile asset is gambling, not investing. Diversification exists for a reason.", scoreImpact: { riskAlignment: -4, wealth: -3 } },
          { id: "lucky_crypto", probability: 0.3, label: "Crypto pumped 🍀", financialDelta: 40000, quality: "neutral", feedback: "Crypto 2x'd. You made CHF 40,000. You got very lucky. This was not a good decision — it just worked out.", learning: "Even when risky bets pay off, they were still risky bets. You got lucky. Don't mistake luck for skill.", scoreImpact: { riskAlignment: -3, patience: -2 } },
        ],
      },
    ],
  },
  {
    id: "lu_tax_refund",
    category: "lucky",
    headline: "You got a CHF 2,400 tax refund.",
    description: "The Swiss tax system giveth. You have CHF 2,400 you weren't expecting. It's burning a hole in your pocket.",
    emoji: "🧾",
    options: [
      {
        id: "invest_refund",
        label: "Invest it",
        description: "You weren't counting on it. Put it to work.",
        outcomes: [
          { id: "invested", probability: 1.0, label: "Invested it 📈", financialDelta: 2400, quality: "good", feedback: "You invested the refund. It's already working for you.", learning: "Tax refunds are the perfect investment opportunity — you weren't counting on the money, so you won't miss it.", scoreImpact: { wealth: 2, patience: 2 } },
        ],
      },
      {
        id: "spend_refund",
        label: "Treat yourself",
        description: "It's basically free money. Enjoy it.",
        outcomes: [
          { id: "spent", probability: 1.0, label: "Spent it 🛍️", financialDelta: 0, quality: "neutral", feedback: "You spent the refund. It was nice while it lasted.", learning: "A tax refund is not a bonus — it's your own money returned to you. Treating it as 'found money' to invest is a powerful habit.", scoreImpact: { patience: -1 } },
        ],
      },
    ],
  },


  // ── LIFE EVENTS ──
  {
    id: "li_mortgage",
    category: "life",
    headline: "You're buying your first apartment. Down payment: CHF 120,000.",
    description: "Swiss banks require 20% down. You've been saving for years. This is the moment. But it means liquidating part of your portfolio.",
    emoji: "🏡",
    minAge: 30,
    maxAge: 50,
    options: [
      {
        id: "buy_smart",
        label: "Buy within your means",
        description: "Solid down payment, mortgage below 80% of property value.",
        outcomes: [
          { id: "smart", probability: 0.8, label: "Bought wisely 🏡", financialDelta: -120000, quality: "good", feedback: "You bought the apartment with a solid down payment. Your housing costs are now fixed. Smart long-term move.", learning: "Owning property in Switzerland is a long-term wealth strategy. The key is not over-leveraging — keeping the mortgage below 80% of property value is the rule.", scoreImpact: { riskAlignment: 2, patience: 2 } },
          { id: "market_dip", probability: 0.2, label: "Bought at a slight peak 😅", financialDelta: -125000, quality: "neutral", feedback: "You bought at a slight market peak. Property values dipped 5% the next year. But you're in it for the long term.", learning: "Timing the property market is as hard as timing the stock market. If you can afford it and plan to stay, buying is usually right.", scoreImpact: { patience: 1 } },
        ],
      },
      {
        id: "over_extend",
        label: "Stretch for a bigger place",
        description: "You'll grow into it. The mortgage is tight but manageable.",
        outcomes: [
          { id: "stretched", probability: 1.0, label: "Over-extended 😬", financialDelta: -150000, quality: "bad", feedback: "You stretched too far. The mortgage payments are straining your monthly budget.", learning: "The Swiss rule: housing costs should not exceed 33% of gross income. Over-extending on a mortgage leaves no room for market downturns or life events.", scoreImpact: { riskAlignment: -3, wealth: -2 } },
        ],
      },
    ],
  },
  {
    id: "li_health_emergency",
    category: "life",
    headline: "A health emergency costs CHF 8,000 out of pocket.",
    description: "Your insurance covered most of it, but the deductible and extras add up. Do you have the cash?",
    emoji: "🏥",
    options: [
      {
        id: "had_cash_health",
        label: "I have the cash",
        description: "Emergency fund covers it. Investments stay untouched.",
        outcomes: [
          { id: "covered", probability: 1.0, label: "Emergency fund covered it 🛡️", financialDelta: -8000, quality: "good", feedback: "Your emergency fund absorbed the shock. Your investments stayed untouched.", learning: "Health emergencies are unpredictable. An emergency fund means you never have to sell investments at the wrong time.", scoreImpact: { riskAlignment: 2, patience: 2 } },
        ],
      },
      {
        id: "sell_assets_health",
        label: "I have to sell investments",
        description: "No emergency fund. Have to liquidate.",
        outcomes: [
          { id: "sold", probability: 1.0, label: "Had to sell investments 😬", financialDelta: -10000, quality: "bad", feedback: "You had to sell investments to cover the emergency. You also paid capital gains tax on the sale.", learning: "Selling investments for emergencies has a double cost: you lose the investment AND potentially pay taxes on gains. Emergency funds prevent this.", scoreImpact: { wealth: -3, learning: 3 } },
        ],
      },
    ],
  },
  {
    id: "li_child",
    category: "life",
    headline: "You're having a child. Congratulations! Also: CHF 2,000/month in new expenses.",
    description: "Childcare in Switzerland is expensive. Your monthly budget just changed significantly.",
    emoji: "👶",
    minAge: 28,
    maxAge: 45,
    options: [
      {
        id: "had_plan",
        label: "I planned for this",
        description: "You built a 'life events' fund. You're ready.",
        outcomes: [
          { id: "planned", probability: 1.0, label: "Had a plan 📋", financialDelta: 0, quality: "good", feedback: "You had planned for this. Your savings rate dropped but didn't collapse.", learning: "Major life events are predictable in aggregate even if not in timing. Planning for them means they don't derail your financial strategy.", scoreImpact: { patience: 2, riskAlignment: 1 }, incomeChange: -500 },
        ],
      },
      {
        id: "scrambled",
        label: "I'm scrambling",
        description: "You didn't plan for this. Time to figure it out.",
        outcomes: [
          { id: "unplanned", probability: 1.0, label: "Scrambled to adjust 😅", financialDelta: -5000, quality: "neutral", feedback: "You scrambled to adjust. It worked out, but it was stressful.", learning: "Life events like children, weddings, and relocations are expensive. Building a 'life events' fund alongside your investment portfolio reduces stress.", scoreImpact: { patience: -1 }, incomeChange: -800 },
        ],
      },
    ],
  },


  // ── RETIREMENT / GLIDE PATH ──
  {
    id: "re_glide_path_check",
    category: "retirement",
    headline: "Your financial advisor says you're too aggressive for your age.",
    description: "You're 55. Your portfolio is 80% stocks. 'You need to de-risk,' she says. 'A crash now could delay your retirement by 5 years.'",
    emoji: "📐",
    minAge: 50,
    options: [
      {
        id: "de_risk",
        label: "De-risk the portfolio",
        description: "Shift toward bonds and stable assets. Follow the glide path.",
        outcomes: [
          { id: "smart", probability: 0.8, label: "De-risked the portfolio 🛡️", financialDelta: 0, quality: "good", feedback: "You shifted to a more conservative allocation. Two years later, markets dropped 25%. You barely felt it.", learning: "Sequence-of-returns risk is real: a major crash in the 5 years before retirement can permanently reduce your retirement income. De-risking as you approach retirement is not cowardice — it's math.", scoreImpact: { riskAlignment: 4, patience: 2 } },
          { id: "missed_gains", probability: 0.2, label: "Missed some gains 😅", financialDelta: -3000, quality: "neutral", feedback: "You de-risked and markets kept going up for another year. You missed some gains. But you also avoided the eventual crash.", learning: "De-risking means accepting lower upside in exchange for lower downside. Near retirement, that's the right trade.", scoreImpact: { riskAlignment: 3 } },
        ],
      },
      {
        id: "stay_aggressive",
        label: "Stay aggressive",
        description: "Markets are up. Why change now?",
        outcomes: [
          { id: "crash", probability: 0.6, label: "Stayed aggressive 🎲", financialDelta: -15000, quality: "bad", feedback: "Markets crashed 30% the year before your planned retirement. You had to delay by 3 years.", learning: "The glide path exists for a reason. When you're close to retirement, you can't afford to wait for a recovery. Time is no longer on your side.", scoreImpact: { riskAlignment: -4, patience: -3 } },
          { id: "lucky_bull", probability: 0.4, label: "Bull market continued 🍀", financialDelta: 8000, quality: "neutral", feedback: "Markets kept going up. You made more money. But you were one bad year away from delaying retirement.", learning: "Getting lucky with an aggressive allocation near retirement doesn't make it the right strategy. You were one crash away from a very different outcome.", scoreImpact: { riskAlignment: -2 } },
        ],
      },
    ],
  },
  {
    id: "re_3a_maxout",
    category: "retirement",
    headline: "Should you max out your 3A pension this year?",
    description: "The maximum contribution is CHF 7,056. It's tax-deductible. But it locks up the money until retirement.",
    emoji: "🔒",
    options: [
      {
        id: "max_3a",
        label: "Max it out",
        description: "CHF 7,056 in. The tax deduction alone is worth it.",
        outcomes: [
          { id: "maxed", probability: 1.0, label: "Maxed it out ✅", financialDelta: 0, quality: "good", feedback: "You maxed out your 3A. The tax deduction alone saves you CHF 1,500-2,500 depending on your tax bracket.", learning: "The 3A is one of the best tax optimization tools in Switzerland. The tax deduction is an immediate guaranteed return. Always max it out if you can.", scoreImpact: { riskAlignment: 3, learning: 2, wealth: 2 } },
        ],
      },
      {
        id: "skip_3a",
        label: "Skip it this year",
        description: "You need the liquidity right now.",
        outcomes: [
          { id: "skipped", probability: 1.0, label: "Skipped it this year", financialDelta: -1500, quality: "bad", feedback: "You skipped the 3A contribution. You lost the tax deduction — effectively a CHF 1,500+ gift you turned down.", learning: "Skipping 3A contributions is one of the most common and costly Swiss financial mistakes. The tax benefit is immediate and guaranteed.", scoreImpact: { learning: 3, wealth: -2 } },
        ],
      },
    ],
  },
  {
    id: "re_early_withdrawal",
    category: "retirement",
    headline: "You can withdraw your 2nd pillar early to buy property.",
    description: "Swiss law allows early withdrawal of your pension for a home purchase. It reduces your retirement savings but enables homeownership.",
    emoji: "🏠",
    minAge: 30,
    maxAge: 55,
    options: [
      {
        id: "withdraw_smart",
        label: "Withdraw for a solid property",
        description: "Good location, reasonable price, long-term plan.",
        outcomes: [
          { id: "smart", probability: 0.7, label: "Withdrew strategically 🏡", financialDelta: 0, quality: "good", feedback: "You used the withdrawal for a solid property purchase. The property appreciates and your housing costs are fixed.", learning: "Early 2nd pillar withdrawal for property is a legitimate strategy in Switzerland — but it reduces your retirement savings. Make sure the property is a good long-term investment.", scoreImpact: { riskAlignment: 1, learning: 2 } },
          { id: "market_flat", probability: 0.3, label: "Property stayed flat 😅", financialDelta: -5000, quality: "neutral", feedback: "The property didn't appreciate much. You reduced your pension for a flat investment.", learning: "Property is not guaranteed to appreciate. Location, timing, and market conditions all matter.", scoreImpact: { learning: 1 } },
        ],
      },
      {
        id: "withdraw_risky",
        label: "Withdraw for a risky property",
        description: "Trendy neighborhood, high price, hoping it appreciates.",
        outcomes: [
          { id: "risky", probability: 1.0, label: "Withdrew for a risky property", financialDelta: -20000, quality: "bad", feedback: "The property market softened. You reduced your pension AND bought at the peak.", learning: "Withdrawing pension funds for property is irreversible. If the property doesn't perform, you've permanently reduced your retirement security.", scoreImpact: { riskAlignment: -3, wealth: -2 } },
        ],
      },
    ],
  },


  // ── CLASSIC LESSONS ──
  {
    id: "cl_diversification",
    category: "classic",
    headline: "Your entire portfolio is in one stock. It drops 40%.",
    description: "You believed in the company. You put 100% in. Now you're down 40% and the news is getting worse.",
    emoji: "🥚",
    options: [
      {
        id: "hold_concentrated",
        label: "Hold. It'll recover.",
        description: "You believe in the company. Stay the course.",
        outcomes: [
          { id: "recovered", probability: 0.4, label: "Stock recovered 📈", financialDelta: 2000, quality: "neutral", feedback: "The stock recovered. You got lucky. But you were one bad earnings report away from disaster.", learning: "Getting lucky with concentration doesn't make it a good strategy. You were one bad quarter away from a very different outcome.", scoreImpact: { riskAlignment: -2, learning: 2 } },
          { id: "kept_falling", probability: 0.6, label: "Kept falling 📚", financialDelta: -8000, quality: "bad", feedback: "You lost 40% of your portfolio. But you learned the most important lesson in investing: diversify.", learning: "Concentration risk is the fastest way to lose wealth. A single stock can go to zero. A diversified portfolio of 20+ stocks has never gone to zero.", scoreImpact: { diversification: 4, learning: 4, wealth: -3 } },
        ],
      },
      {
        id: "diversify_now",
        label: "Sell and diversify",
        description: "Take the loss and spread the risk.",
        outcomes: [
          { id: "diversified", probability: 0.7, label: "Diversified wisely 🧺", financialDelta: -3000, quality: "good", feedback: "You took the loss and diversified. The stock kept falling another 30%. You avoided the worst.", learning: "Cutting a concentrated position at a loss is painful but often correct. The question is not 'where did it come from' but 'where is it going.'", scoreImpact: { diversification: 4, learning: 3 } },
          { id: "sold_bottom", probability: 0.3, label: "Sold at the bottom 😬", financialDelta: -5000, quality: "neutral", feedback: "You sold and diversified. The stock recovered 50% the next month. But your diversified portfolio also grew.", learning: "You can't time the bottom. Diversifying after a loss is still the right long-term move even if the original stock recovers.", scoreImpact: { diversification: 3, learning: 2 } },
        ],
      },
    ],
  },
  {
    id: "cl_cost_averaging",
    category: "classic",
    headline: "Markets have been volatile for 6 months. Should you pause your monthly investments?",
    description: "Your automatic monthly ETF purchase is coming up. Markets are down 15%. Your gut says wait. Marco paused his.",
    emoji: "📅",
    options: [
      {
        id: "keep_investing",
        label: "Keep investing monthly",
        description: "Stick to the plan. Volatility is normal.",
        outcomes: [
          { id: "smart", probability: 0.7, label: "Kept investing monthly 💪", financialDelta: 1500, quality: "good", feedback: "You kept your monthly investment going. You bought more units at lower prices. When markets recovered, you outperformed.", learning: "Dollar-cost averaging (regular fixed investments) removes the need to time the market. You automatically buy more when prices are low and less when they're high.", scoreImpact: { patience: 3, riskAlignment: 2, wealth: 2 } },
          { id: "slow_recovery", probability: 0.3, label: "Kept investing, slow recovery", financialDelta: 500, quality: "neutral", feedback: "You kept investing. Recovery was slow but you still came out ahead of pausing.", learning: "Even in slow recoveries, staying invested beats trying to time the market.", scoreImpact: { patience: 2 } },
        ],
      },
      {
        id: "pause_investing",
        label: "Pause until it stabilizes",
        description: "Wait for the dust to settle.",
        outcomes: [
          { id: "missed", probability: 0.7, label: "Paused investments 😬", financialDelta: -500, quality: "bad", feedback: "You paused. Markets recovered 20% in the next 3 months. You missed the best buying opportunity.", learning: "The best time to invest is when markets are down — but it feels the worst. Regular automatic investments remove emotion from the equation.", scoreImpact: { patience: -2, learning: 2 } },
          { id: "timed_well", probability: 0.3, label: "Timed it okay 🍀", financialDelta: 0, quality: "neutral", feedback: "You paused and markets kept falling for another month. You bought back in at a lower price. Lucky timing.", learning: "You got lucky. Timing the market consistently is impossible. Automatic investing removes this risk.", scoreImpact: { patience: -1 } },
        ],
      },
    ],
  },
];


// ═══════════════════════════════════════════════════════════════
// CHAOS ROUNDS — 9 rounds, ages 30 → 65
// ═══════════════════════════════════════════════════════════════

export const CHAOS_ROUNDS: ChaosRound[] = [
  {
    id: 1, age: 30,
    kicker: "Chapter 1",
    title: "The Starting Line",
    description: "You're 30, earning a decent salary, and finally taking investing seriously. The world is full of noise. Time to build good habits.",
    cardCount: 2,
    monthlyIncome: 5500,
    investableIncomePct: 0.15,
    riskTarget: { maxHighRiskPct: 80, maxMediumRiskPct: 95, label: "Aggressive", rationale: "You're young — time is your biggest asset. High-risk, high-reward is appropriate now." },
    marketReturns: { etf: 0.09, bonds: 0.025, stocks: 0.14, gold: 0.03, reits: 0.06, cash: 0.005 },
  },
  {
    id: 2, age: 35,
    kicker: "Chapter 2",
    title: "The FOMO Years",
    description: "Everyone around you seems to be getting rich. Crypto, IPOs, memecoins. The noise is deafening. Stay focused.",
    cardCount: 3,
    monthlyIncome: 6500,
    investableIncomePct: 0.15,
    riskTarget: { maxHighRiskPct: 75, maxMediumRiskPct: 90, label: "Aggressive", rationale: "Still plenty of time to recover from mistakes. But start building discipline now." },
    marketReturns: { etf: 0.12, bonds: 0.02, stocks: 0.18, gold: -0.02, reits: 0.08, cash: 0.005 },
  },
  {
    id: 3, age: 40,
    kicker: "Chapter 3",
    title: "The Midpoint",
    description: "You're 40. Life is getting more complex — mortgage, family, career pressure. Your portfolio needs to grow up too.",
    cardCount: 3,
    monthlyIncome: 7500,
    investableIncomePct: 0.15,
    riskTarget: { maxHighRiskPct: 60, maxMediumRiskPct: 85, label: "Balanced", rationale: "A mix of growth and stability. Start thinking about protecting what you've built." },
    marketReturns: { etf: 0.07, bonds: 0.03, stocks: -0.08, gold: 0.07, reits: 0.04, cash: 0.01 },
  },
  {
    id: 4, age: 45,
    kicker: "Chapter 4",
    title: "The Accumulation Peak",
    description: "Peak earning years. Your income is at its highest. So is the temptation to spend it. This is when wealth is made or lost.",
    cardCount: 3,
    monthlyIncome: 8500,
    investableIncomePct: 0.18,
    riskTarget: { maxHighRiskPct: 60, maxMediumRiskPct: 80, label: "Balanced", rationale: "You're in your peak earning years. Maximize savings while keeping a balanced risk profile." },
    marketReturns: { etf: 0.10, bonds: 0.025, stocks: 0.15, gold: 0.04, reits: 0.07, cash: 0.01 },
  },
  {
    id: 5, age: 50,
    kicker: "Chapter 5",
    title: "The Pivot",
    description: "Retirement is no longer abstract. It's 15 years away. Your allocation needs to start shifting. The glide path begins.",
    cardCount: 3,
    monthlyIncome: 9000,
    investableIncomePct: 0.20,
    riskTarget: { maxHighRiskPct: 40, maxMediumRiskPct: 70, label: "Moderate", rationale: "Shift toward capital preservation. Volatility hurts more when retirement is near." },
    marketReturns: { etf: 0.06, bonds: 0.035, stocks: -0.12, gold: 0.09, reits: 0.03, cash: 0.015 },
  },
  {
    id: 6, age: 55,
    kicker: "Chapter 6",
    title: "The Final Stretch",
    description: "10 years to retirement. Every decision matters more now. A crash at this stage can delay retirement by years.",
    cardCount: 3,
    monthlyIncome: 9500,
    investableIncomePct: 0.22,
    riskTarget: { maxHighRiskPct: 30, maxMediumRiskPct: 60, label: "Moderate", rationale: "Protect your accumulated wealth. Sequence-of-returns risk is your biggest enemy now." },
    marketReturns: { etf: 0.08, bonds: 0.04, stocks: 0.11, gold: 0.05, reits: 0.06, cash: 0.02 },
  },
  {
    id: 7, age: 60,
    kicker: "Chapter 7",
    title: "The Home Stretch",
    description: "5 years to retirement. Your portfolio should be mostly defensive. The goal now is preservation, not growth.",
    cardCount: 2,
    monthlyIncome: 9800,
    investableIncomePct: 0.20,
    riskTarget: { maxHighRiskPct: 20, maxMediumRiskPct: 50, label: "Conservative", rationale: "Protect your nest egg. A 20% crash now could mean working 3 more years." },
    marketReturns: { etf: 0.05, bonds: 0.04, stocks: -0.05, gold: 0.06, reits: 0.04, cash: 0.02 },
  },
  {
    id: 8, age: 63,
    kicker: "Chapter 8",
    title: "Almost There",
    description: "Two years from retirement. Time to finalize your strategy. What will your income look like in retirement?",
    cardCount: 2,
    monthlyIncome: 10000,
    investableIncomePct: 0.18,
    riskTarget: { maxHighRiskPct: 15, maxMediumRiskPct: 40, label: "Conservative", rationale: "Almost there. Don't take unnecessary risks. Protect what you've built over 30 years." },
    marketReturns: { etf: 0.07, bonds: 0.035, stocks: 0.09, gold: 0.04, reits: 0.05, cash: 0.025 },
  },
  {
    id: 9, age: 65,
    kicker: "Final Chapter",
    title: "Retirement Day",
    description: "You made it. 35 years of decisions, discipline, and the occasional chaos. Let's see how you did.",
    cardCount: 1,
    monthlyIncome: 10000,
    investableIncomePct: 0.10,
    riskTarget: { maxHighRiskPct: 10, maxMediumRiskPct: 30, label: "Conservative", rationale: "This is it. Preserve capital. Your portfolio needs to last 20+ years in retirement." },
    marketReturns: { etf: 0.06, bonds: 0.04, stocks: 0.08, gold: 0.03, reits: 0.05, cash: 0.025 },
  },
];


// ═══════════════════════════════════════════════════════════════
// ASSET TIPS
// ═══════════════════════════════════════════════════════════════

export const EXTENDED_ASSET_TIPS: Record<string, { name: string; risk: string; description: string }> = {
  etf:     { name: "Global ETF",    risk: "Medium",    description: "Diversified exposure to global equities. The backbone of most long-term portfolios." },
  bonds:   { name: "Bonds",         risk: "Low",       description: "Fixed-income securities. Stable returns, lower risk. Important for capital preservation." },
  stocks:  { name: "Stocks",        risk: "High",      description: "Individual equities. Higher potential returns, higher volatility. Best for long time horizons." },
  gold:    { name: "Gold",          risk: "Medium",    description: "Inflation hedge and safe haven. Doesn't produce income but preserves value in crises." },
  reits:   { name: "REITs",         risk: "Medium",    description: "Real estate investment trusts. Property exposure without buying property. Pays dividends." },
  cash:    { name: "Cash / 3A",     risk: "Very Low",  description: "Savings account or 3A pension. Safe but loses real value during inflation." },
};

// ═══════════════════════════════════════════════════════════════
// UTILITIES
// ═══════════════════════════════════════════════════════════════

export function resolveOutcome(option: PlayerOption, random: number) {
  let cumulative = 0;
  for (const outcome of option.outcomes) {
    cumulative += outcome.probability;
    if (random <= cumulative) return outcome;
  }
  return option.outcomes[option.outcomes.length - 1];
}

export function drawCards(round: ChaosRound): ChaosCard[] {
  const eligible = CHAOS_CARDS.filter((c) => {
    if (c.minAge !== undefined && round.age < c.minAge) return false;
    if (c.maxAge !== undefined && round.age > c.maxAge) return false;
    return true;
  });

  const forced: ChaosCard[] = [];
  if (round.forcedCardIds) {
    for (const id of round.forcedCardIds) {
      const card = CHAOS_CARDS.find((c) => c.id === id);
      if (card) forced.push(card);
    }
  }

  const remaining = eligible.filter((c) => !forced.find((f) => f.id === c.id));
  const shuffled = [...remaining].sort(() => Math.random() - 0.5);
  const extra = shuffled.slice(0, Math.max(0, round.cardCount - forced.length));

  return [...forced, ...extra];
}

export function getCard(id: string): ChaosCard | undefined {
  return CHAOS_CARDS.find((c) => c.id === id);
}

// ═══════════════════════════════════════════════════════════════
// RETIREMENT SCORE CALCULATOR
// ═══════════════════════════════════════════════════════════════

export function calculateRetirementScore(state: ExtendedState): RetirementScore {
  const finalPortfolioValue = state.portfolioValue;
  const totalInvested = state.totalInvested || 1;
  const totalReturn = finalPortfolioValue - totalInvested;
  const totalReturnPct = (totalReturn / totalInvested) * 100;

  const riskAlignmentScore = Math.round(Math.min(100, Math.max(0, state.scores.riskAlignment)));
  const diversificationScore = Math.round(Math.min(100, Math.max(0, state.scores.diversification)));
  const behaviorScore = Math.round(Math.min(100, Math.max(0, (state.scores.patience + state.scores.learning) / 2)));

  const composite = (riskAlignmentScore * 0.35 + diversificationScore * 0.25 + behaviorScore * 0.25 + Math.min(100, totalReturnPct) * 0.15);
  let overallGrade: RetirementScore["overallGrade"];
  if (composite >= 80) overallGrade = "S";
  else if (composite >= 65) overallGrade = "A";
  else if (composite >= 50) overallGrade = "B";
  else if (composite >= 35) overallGrade = "C";
  else overallGrade = "D";

  const narratives: Record<string, string> = {
    S: "Exceptional. You navigated 35 years of financial chaos with discipline, patience, and wisdom. Your retirement is secure and your portfolio is a testament to good decision-making.",
    A: "Great work. You made smart decisions most of the time, built a solid portfolio, and arrived at retirement in a strong position. A few more years of compounding and you'd be untouchable.",
    B: "Good. You got the fundamentals right — diversification, patience, avoiding the worst traps. There were some stumbles, but your retirement is on track.",
    C: "Okay. You made it to retirement, but some decisions along the way cost you. The lessons are clear: diversify, stay the course, and don't chase memecoins.",
    D: "Needs work. The chaos got to you. Memecoins, panic selling, lifestyle creep — they added up. The good news: you now know exactly what not to do.",
  };

  return {
    finalPortfolioValue,
    totalInvested,
    totalReturn,
    totalReturnPct,
    riskAlignmentScore,
    diversificationScore,
    behaviorScore,
    overallGrade,
    narrative: narratives[overallGrade],
  };
}
