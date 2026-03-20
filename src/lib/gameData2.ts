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

// ════════════════════════════════════════════════════════════════════════════════════════════════════
// CHAOS CARDS — new options: PlayerOption[] structure
// ════════════════════════════════════════════════════════════════════════════════════════════════════

export const CHAOS_CARDS: ChaosCard[] = [

  // ── MEMECOIN ──
  {
    id: "mc_dogecoin",
    category: "memecoin",
    headline: "Your coworker Marco won't shut up about DogeCoin.",
    description: "He's up 400% and keeps sending you memes. 'It's going to the moon, bro. Elon tweeted again.' His girlfriend is also texting you about it.",
    emoji: "🐕",
    tip: "Highly speculative assets like memecoins are driven by hype rather than fundamentals. The house often wins eventually.",
    options: [
      {
        id: "listen_marco",
        label: "Listen to Marco",
        description: "YOLO PPF 2,500 into DogeCoin. Marco says it's a sure thing.",
        outcomes: [
          { id: "moon", probability: 0.25, label: "Moon mission 🚀", financialDelta: 3000, quality: "neutral", feedback: "You got lucky — it pumped. But you made a gambling decision, not an investment one. Marco is insufferable now.", learning: "A 25% win rate is still a 75% loss rate. Getting lucky on a speculative bet doesn't make it a reliable long-term strategy.", scoreImpact: { riskAlignment: -3, patience: -2 } },
          { id: "rug", probability: 0.75, label: "Rug pulled 💀", financialDelta: -2500, quality: "bad", feedback: "It crashed 80% overnight. Marco is suspiciously quiet. His girlfriend has moved on to a new coin.", learning: "Memecoins are driven largely by hype. When the hype dies, so does the price — fast and without warning.", scoreImpact: { riskAlignment: -4, wealth: -3 } },
        ],
      },
      {
        id: "ignore_marco",
        label: "Ignore Marco",
        description: "Smile, nod, and keep your money in your core portfolio.",
        outcomes: [
          { id: "smart", probability: 0.85, label: "Dodged the bullet 🧠", financialDelta: 0, quality: "good", feedback: "DogeCoin crashed 80% two weeks later. Marco stopped talking about it. You kept your PPF 2,500.", learning: "The best investment decision is often avoiding unnecessary risks. Ignoring market noise is a valuable skill.", scoreImpact: { patience: 3, riskAlignment: 2 } },
          { id: "fomo", probability: 0.15, label: "FOMO hit you anyway 😬", financialDelta: -500, quality: "bad", feedback: "You caved at the last minute and bought a tiny amount. It still crashed. Classic.", learning: "Fear Of Missing Out (FOMO) is a common enemy of rational investing. Straying from your plan usually carries a cost.", scoreImpact: { patience: -2, riskAlignment: -2 } },
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
    tip: "If you don't understand where the yield or value is coming from, you might be the exit liquidity.",
    options: [
      {
        id: "ape_in",
        label: "Ape in PPF 500",
        description: "Tralalero Tralala said 'tung tung tung' and you felt it in your soul.",
        outcomes: [
          { id: "pump", probability: 0.2, label: "Tralalero pumped 🎉", financialDelta: 1800, quality: "neutral", feedback: "You made money, but you got lucky. The coin has no utility, no team, no roadmap. Tralalero Tralala is not a real person.", learning: "Even when a speculative coin pumps, it reinforces bad habits. The risk-to-reward ratio is rarely in your favor long-term.", scoreImpact: { riskAlignment: -3 } },
          { id: "dump", probability: 0.8, label: "Tung tung tung 💀", financialDelta: -500, quality: "bad", feedback: "The creator sold their entire bag. You lost PPF 500 in 6 hours. Tralalero Tralala has already launched a new coin.", learning: "This resembles a 'rug pull' — where creators hype a token and dump it on retail investors. It's an inherent risk in unregulated spaces.", scoreImpact: { riskAlignment: -4, wealth: -2 } },
        ],
      },
      {
        id: "research_first",
        label: "Google it first",
        description: "Who even is Tralalero Tralala? Let me check.",
        outcomes: [
          { id: "avoided", probability: 0.9, label: "Avoided the trap 🧠", financialDelta: 0, quality: "good", feedback: "You Googled it. Tralalero Tralala is an AI-generated Italian brainrot character. The coin has no whitepaper. You kept your PPF 500.", learning: "Taking five minutes to research fundamentals can save you hundreds. If you can't explain what an asset does, reconsider buying it.", scoreImpact: { learning: 3, patience: 2 } },
          { id: "bought_anyway", probability: 0.1, label: "Bought it anyway 🤦", financialDelta: -500, quality: "bad", feedback: "You researched it, saw it was nonsense, and bought it anyway. The heart wants what it wants.", learning: "Knowing something is a high-risk gamble and doing it anyway is a common behavioral bias. Stick to the plan.", scoreImpact: { riskAlignment: -3, learning: -1 } },
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
    tip: "A joke asset is still a joke asset. Real retirement planning requires actual tax-advantaged accounts.",
    options: [
      {
        id: "buy_irony",
        label: "Buy the irony",
        description: "PPF 300 on a pension joke. At least it's funny.",
        outcomes: [
          { id: "ironic_win", probability: 0.3, label: "Ironic gains 😂", financialDelta: 600, quality: "neutral", feedback: "You made money on a joke coin. The universe has a sense of humor. Your financial advisor does not.", learning: "Irony doesn't change fundamentals. You got lucky on a meme.", scoreImpact: { riskAlignment: -2 } },
          { id: "ironic_loss", probability: 0.7, label: "The joke's on you", financialDelta: -300, quality: "bad", feedback: "The coin died as fast as it was born. You lost PPF 300 on a pension joke. The real joke is that you could have put it in an actual pension.", learning: "The best joke here is that putting PPF 300 in a 3A pension fund would have potentially saved you taxes.", scoreImpact: { riskAlignment: -3, learning: 2 } },
        ],
      },
      {
        id: "put_in_3a",
        label: "Put it in your 3A instead",
        description: "PPF 300 into your actual pension. Less funny, more effective.",
        outcomes: [
          { id: "smart_move", probability: 1.0, label: "Tax-optimized 💎", financialDelta: 0, quality: "good", feedback: "You contributed PPF 300 to your 3A. Depending on your tax bracket, you saved roughly PPF 60-90 in taxes. 67Coin crashed 95%.", learning: "The 3A pension provides a statutory tax deduction, offering an immediate and guaranteed benefit that speculative coins cannot match.", scoreImpact: { riskAlignment: 3, learning: 2, wealth: 1 } },
        ],
      },
    ],
  },

  // ── BRAINROT ──
  {
    id: "br_sigma_grindset",
    category: "brainrot",
    headline: "A 'sigma grindset' influencer says to skip your 3A pension.",
    description: "'Real alphas don't need the government's permission to retire.' He's 22, lives with his parents, and sells a PPF 299 course called 'Escape the Matrix.'",
    emoji: "💪",
    options: [
      {
        id: "ignore_sigma",
        label: "Ignore the sigma",
        description: "Keep contributing to your 3A like a normal person.",
        outcomes: [
          { id: "smart", probability: 1.0, label: "Kept the tax break ✅", financialDelta: 0, quality: "good", feedback: "You kept contributing to your 3A. The tax deduction alone is worth it. The sigma influencer is now selling NFTs.", learning: "The Swiss 3A pension legally allows a tax deduction of up to PPF 7,056/year (as of recent limits). Turning down legal tax advantages is rarely a sound strategy.", scoreImpact: { learning: 3, riskAlignment: 2 } },
        ],
      },
      {
        id: "follow_sigma",
        label: "Skip 3A, invest in yourself",
        description: "Buy his PPF 299 course and skip your pension contribution.",
        outcomes: [
          { id: "wasted", probability: 0.9, label: "Lost the tax benefit 😬", financialDelta: -1100, quality: "bad", feedback: "You skipped your 3A and bought the course. The course was 4 hours of motivational quotes. You lost out on the tax deduction.", learning: "Missing a year of 3A contributions generally means permanently losing that year's specific tax deduction and its potential compounding.", scoreImpact: { learning: -2, riskAlignment: -2 } },
          { id: "inspired", probability: 0.1, label: "Got motivated 🤷", financialDelta: -299, quality: "neutral", feedback: "The course was thin on facts but you felt inspired for a week to work harder. You still lost the 3A tax benefit though.", learning: "Motivation is helpful, but ignoring structured tax advantages usually sets your net worth back.", scoreImpact: { patience: 1, riskAlignment: -1 } },
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
          { id: "pump", probability: 0.25, label: "NPC pumped 📈", financialDelta: 1200, quality: "neutral", feedback: "The pick worked this time. But you're outsourcing your financial decisions to an unregulated social media account.", learning: "Following random stock picks online exposes you to immense volatility and potential manipulation.", scoreImpact: { riskAlignment: -3, learning: -1 } },
          { id: "dump", probability: 0.75, label: "NPC dumped 📉", financialDelta: -1000, quality: "bad", feedback: "The account was a classic pump-and-dump scheme. You were the exit liquidity.", learning: "Many 'guaranteed picks' on social media are designed to build hype so the creators can sell their own holdings at a profit.", scoreImpact: { riskAlignment: -4, learning: 2 } },
        ],
      },
      {
        id: "report_account",
        label: "Report the account",
        description: "This smells like a pump-and-dump. You've seen this before.",
        outcomes: [
          { id: "reported", probability: 1.0, label: "Civic duty done 🫡", financialDelta: 0, quality: "good", feedback: "You reported the account. It got taken down 3 days later. You kept your capital safe.", learning: "Recognizing and avoiding unregulated financial advice online is a core part of modern risk management.", scoreImpact: { learning: 3, patience: 2 } },
        ],
      },
    ],
  },
  {
    id: "br_fanum_tax",
    category: "brainrot",
    headline: "Your friend 'fanum taxed' your lunch money.",
    description: "You lost PPF 15 to a meme. You're considering suing. Your lawyer says no. Marco thinks it's hilarious.",
    emoji: "🍕",
    options: [
      {
        id: "laugh_it_off",
        label: "Laugh it off",
        description: "It's PPF 15. You'll survive.",
        outcomes: [
          { id: "fine", probability: 1.0, label: "Kept perspective 😂", financialDelta: 0, quality: "good", feedback: "You laughed it off. PPF 15 is not a systemic financial event. Your portfolio is fine.", learning: "Not every minor money loss needs a massive reaction. Keeping emotional perspective is healthy.", scoreImpact: { patience: 1 } },
        ],
      },
      {
        id: "spiral_into_fomo",
        label: "Spiral into FOMO",
        description: "This is a sign. You need to make money fast. Time to find a hot coin.",
        outcomes: [
          { id: "spiral", probability: 0.9, label: "Spiraled into FOMO 😱", financialDelta: -500, quality: "bad", feedback: "You went down a rabbit hole and bought a random coin to 'make it back.' You lost PPF 500.", learning: "Chasing small losses with high-risk bets is a dangerous behavioral loop known as 'revenge trading'.", scoreImpact: { patience: -3, riskAlignment: -2 } },
          { id: "lucky_spiral", probability: 0.1, label: "Lucky spiral 🍀", financialDelta: 200, quality: "neutral", feedback: "You got lucky and actually made a quick return. However, your decision process was flawed.", learning: "Getting a positive outcome from a flawed, emotionally-driven process can unfortunately reinforce bad habits.", scoreImpact: { patience: -2, riskAlignment: -2 } },
        ],
      },
    ],
  },

  // ── SCAM ──
  {
    id: "sc_crypto_recovery",
    category: "scam",
    headline: "An email promises to recover your lost crypto — for a small fee.",
    description: "'We specialize in blockchain forensics. Send us PPF 200 and we'll recover your lost funds.' You never lost any crypto. Marco's girlfriend forwarded it to you.",
    emoji: "🎣",
    options: [
      {
        id: "delete_it",
        label: "Delete it",
        description: "This is obviously a scam.",
        outcomes: [
          { id: "safe", probability: 1.0, label: "Deleted it 🗑️", financialDelta: 0, quality: "good", feedback: "You ignored the scam. Your PPF 200 stays in your pocket.", learning: "Crypto recovery scams prey on desperation. Blockchain transactions are generally immutable; no random company can 'reverse' them.", scoreImpact: { learning: 2 } },
        ],
      },
      {
        id: "pay_fee",
        label: "Pay the PPF 200 fee",
        description: "Maybe they can actually help? The email looks professional.",
        outcomes: [
          { id: "scammed", probability: 0.95, label: "Scammed 😬", financialDelta: -200, quality: "bad", feedback: "They took your PPF 200 and disappeared. There was no recovery service.", learning: "If a stranger online asks for an upfront fee to recover lost assets, it is almost universally a secondary scam.", scoreImpact: { learning: 3, wealth: -1 } },
          { id: "lucky_escape", probability: 0.05, label: "They ghosted before charging", financialDelta: 0, quality: "neutral", feedback: "They never followed up with the payment link. You got lucky, but your vulnerability was exposed.", learning: "Willingness to pay upfront fees to unknown entities is a vulnerability. Always verify through official channels.", scoreImpact: { learning: 2 } },
        ],
      },
    ],
  },
  {
    id: "sc_investment_guru",
    category: "scam",
    headline: "A 'certified investment guru' offers a 40% guaranteed return.",
    description: "He has a Lamborghini in his profile picture and a 'proprietary algorithm.' Minimum investment: PPF 5,000. Marco already invested.",
    emoji: "🏎️",
    tip: "In finance, risk and return are strongly correlated. High guarantees usually mean high deception.",
    options: [
      {
        id: "avoid_guru",
        label: "Smell the scam",
        description: "No legitimate investment guarantees 40%.",
        outcomes: [
          { id: "avoided", probability: 1.0, label: "Smelled the scam 👃", financialDelta: 0, quality: "good", feedback: "You didn't invest. The 'guru' was arrested 3 months later for running a Ponzi scheme. Marco lost PPF 5,000.", learning: "The risk-free rate in Switzerland is historically low. Anyone promising 'guaranteed' double-digit returns is defying the laws of finance.", scoreImpact: { learning: 3, riskAlignment: 2 } },
        ],
      },
      {
        id: "invest_guru",
        label: "Invest PPF 5,000",
        description: "Marco says it's legit. The Lamborghini looks real.",
        outcomes: [
          { id: "ponzi", probability: 0.85, label: "Ponzi'd 💸", financialDelta: -5000, quality: "bad", feedback: "The returns were paid from new investors' money. When it collapsed, you lost everything.", learning: "Ponzi schemes pay early investors with new capital. They mathematically must collapse eventually.", scoreImpact: { wealth: -4, learning: 2 } },
          { id: "early_exit", probability: 0.15, label: "Got out early 🍀", financialDelta: 2000, quality: "neutral", feedback: "You got in early and pulled out before the collapse. You profited off a Ponzi scheme.", learning: "Profiting from a Ponzi scheme relies purely on lucking into the early stages. It's an unethical and highly risky game.", scoreImpact: { riskAlignment: -2, learning: 1 } },
        ],
      },
    ],
  },
  {
    id: "sc_pig_butchering",
    category: "scam",
    headline: "A random number texts you: 'Hi Anna, is our meeting still at 3?'",
    description: "You reply that they have the wrong number. They apologize, say you seem nice, and strike up a conversation. Two weeks later, they are showing you 'guaranteed' crypto trades.",
    emoji: "🐷",
    tip: "The 'wrong number' text is a common entry point for a long-con scam known as 'Pig Butchering'.",
    options: [
      {
        id: "block_immediately",
        label: "Block the number immediately",
        description: "You know a scam when you see one.",
        outcomes: [
          { id: "safe", probability: 1.0, label: "Bullet Dodged 🛡️", financialDelta: 0, quality: "good", feedback: "You blocked the scammer. Your money is safe.", learning: "Scammers use long-term emotional manipulation before asking for funds. Disengaging early is the safest route.", scoreImpact: { learning: 3, patience: 1 } }
        ]
      },
      {
        id: "play_along",
        label: "Play along just for fun",
        description: "You want to see how the scam works without sending money.",
        outcomes: [
          { id: "wasted_time", probability: 0.8, label: "Wasted time ⏱️", financialDelta: 0, quality: "neutral", feedback: "You dragged it out for a month before blocking them. It was funny, but a waste of your time.", learning: "Engaging with scammers flags your number as 'active', potentially leading to more spam.", scoreImpact: { learning: 1 } },
          { id: "accidentally_phished", probability: 0.2, label: "Clicked a bad link 😬", financialDelta: -300, quality: "bad", feedback: "They sent a link that harvested your login session. You lost PPF 300 before freezing your cards.", learning: "Modern phishing attacks can be highly sophisticated. Engaging with bad actors always carries technical risks.", scoreImpact: { learning: -2, wealth: -1 } }
        ]
      }
    ]
  },
  {
    id: "sc_fake_estv",
    category: "scam",
    headline: "URGENT: Email from the Swiss Tax Authority (ESTV).",
    description: "'You have an unpaid tax debt of PPF 1,250. Pay immediately via the link below or face prosecution.' It has the official logo.",
    emoji: "⚠️",
    options: [
      {
        id: "ignore_tax_scam",
        label: "Check the sender email address",
        description: "Verify before you panic.",
        outcomes: [
          { id: "spotted_fake", probability: 1.0, label: "Spotted the fake 🕵️", financialDelta: 0, quality: "good", feedback: "The email came from 'admin@estv-swiss-update.com'. You deleted it. The real ESTV mostly sends physical mail.", learning: "Swiss government agencies rarely demand immediate payment via email links. Always verify the sender's actual address.", scoreImpact: { learning: 3, patience: 1 } }
        ]
      },
      {
        id: "pay_tax_scam",
        label: "Click and pay immediately",
        description: "You don't want to mess with the tax authorities.",
        outcomes: [
          { id: "phished", probability: 1.0, label: "Phished 🎣", financialDelta: -1250, quality: "bad", feedback: "You entered your credit card details. The scammers charged you PPF 1,250.", learning: "Artificial urgency is a classic scammer tactic. Always verify alarming financial messages through independent channels.", scoreImpact: { learning: 2, wealth: -1 } }
        ]
      }
    ]
  },

  // ── SOCIAL / FOMO ──
  {
    id: "so_fomo_ipo",
    category: "social",
    headline: "Everyone at work is buying into a hot IPO.",
    description: "The company makes AI-powered dog food. Valuation: PPF 4 billion. Revenue: PPF 2 million. Your colleagues are already planning their yachts.",
    emoji: "🐶",
    options: [
      {
        id: "buy_ipo",
        label: "Buy the IPO",
        description: "PPF 2,000 in. AI dog food sounds like the future.",
        outcomes: [
          { id: "pop", probability: 0.3, label: "IPO popped 🎉", financialDelta: 2000, quality: "neutral", feedback: "You made money, but the valuation was speculative. You got lucky. Your colleagues are insufferable.", learning: "IPO 'pops' happen, but many newly public companies experience high volatility. Ensure you understand the underlying business.", scoreImpact: { riskAlignment: -2, patience: -1 } },
          { id: "crash", probability: 0.7, label: "IPO crashed 📉", financialDelta: -1500, quality: "bad", feedback: "The AI dog food company struggled to scale. The stock dropped 80% in 3 months.", learning: "Valuations that completely detach from underlying business fundamentals often carry much higher risk.", scoreImpact: { riskAlignment: -3, wealth: -2 } },
        ],
      },
      {
        id: "skip_ipo",
        label: "Skip it",
        description: "AI dog food sounds like a punchline, not a business.",
        outcomes: [
          { id: "smart", probability: 0.85, label: "Skipped wisely 🧠", financialDelta: 0, quality: "good", feedback: "The IPO dropped 60% in 6 months. Your colleagues are very quiet now. You kept your money.", learning: "Historically, many 'hot' IPOs underperform broad market indices over their first few years. Avoiding hype is often safe.", scoreImpact: { learning: 2, patience: 2 } },
          { id: "missed_pop", probability: 0.15, label: "Missed the pop 😅", financialDelta: 0, quality: "neutral", feedback: "The IPO popped 50% on day one and stayed up. You missed out this time.", learning: "Sticking to your strategy sometimes means missing out on speculative gains. Patience requires accepting some FOMO.", scoreImpact: { patience: 1 } },
        ],
      },
    ],
  },
  {
    id: "so_influencer_portfolio",
    category: "social",
    headline: "A finance influencer posts their 'transparent' portfolio.",
    description: "They claim to be up 300% this year. They're sharing their exact positions. 'I just want to help people.' They also sell a PPF 299 course.",
    emoji: "📱",
    options: [
      {
        id: "copy_portfolio",
        label: "Copy their portfolio",
        description: "They're up 300%. How hard can it be?",
        outcomes: [
          { id: "exit_liquidity", probability: 0.75, label: "Copied and lost 📉", financialDelta: -800, quality: "bad", feedback: "You copied their portfolio. They sold their positions shortly after posting.", learning: "Influencers may post positions to generate exit liquidity for themselves. Blindly copying trades is highly risky.", scoreImpact: { riskAlignment: -3, learning: 2 } },
          { id: "lucky_copy", probability: 0.25, label: "Lucky copy 🍀", financialDelta: 500, quality: "neutral", feedback: "You copied them and the assets happened to appreciate further.", learning: "Survivorship bias online is strong. For every influencer up 300%, many others lost money quietly.", scoreImpact: { riskAlignment: -1 } },
        ],
      },
      {
        id: "ignore_influencer",
        label: "Ignore the noise",
        description: "If they're so good at investing, why are they selling courses?",
        outcomes: [
          { id: "smart", probability: 1.0, label: "Ignored the noise 🎧", financialDelta: 0, quality: "good", feedback: "You didn't copy them. You stuck to your own diversified plan.", learning: "Social media portfolios rarely show the full picture, including risk taken, taxes, or prior losses.", scoreImpact: { learning: 3, patience: 2 } },
        ],
      },
    ],
  },
  {
    id: "so_st_moritz_trip",
    category: "social",
    headline: "Your friends invite you to a weekend in St. Moritz.",
    description: "It's peak season. The hotel is PPF 800/night. The ski pass is PPF 100. Marco is going and already bought a Moncler jacket.",
    emoji: "⛷️",
    options: [
      {
        id: "go_all_out",
        label: "Go and enjoy the luxury",
        description: "You only live once, right?",
        outcomes: [
          { id: "broke_but_happy", probability: 1.0, label: "Expensive memories 💸", financialDelta: -2500, quality: "neutral", feedback: "You had fun, but spent PPF 2,500 in three days. You also felt pressured to buy a round of PPF 30 cocktails.", learning: "Social pressure can be a significant driver of lifestyle inflation. Balancing memories with budget constraints is an ongoing challenge.", scoreImpact: { wealth: -2, patience: -1 } }
        ]
      },
      {
        id: "propose_alternative",
        label: "Propose a cheaper alternative",
        description: "Suggest a day trip to Flumserberg instead.",
        outcomes: [
          { id: "reasonable_fun", probability: 0.7, label: "Sensible skiing 🏔️", financialDelta: -200, quality: "good", feedback: "Half the group agreed to Flumserberg. You skied all day, had a great time, and saved PPF 2,300.", learning: "Offering budget-friendly alternatives is a practical way to maintain a social life without compromising financial goals.", scoreImpact: { wealth: 2, patience: 2 } },
          { id: "went_alone", probability: 0.3, label: "Missed out 🤷", financialDelta: 0, quality: "neutral", feedback: "They went to St. Moritz anyway. You stayed home and saved money, but felt a bit left out.", learning: "Sometimes protecting your wealth involves experiencing FOMO. That's a normal part of financial discipline.", scoreImpact: { patience: 1 } }
        ]
      }
    ]
  },
  {
    id: "so_wagyu_split",
    category: "social",
    headline: "Group dinner. Marco orders a PPF 150 Wagyu steak.",
    description: "You had a salad and tap water. At the end, Marco casually says, 'Should we just split the bill evenly?'",
    emoji: "🥩",
    options: [
      {
        id: "split_evenly",
        label: "Just pay it",
        description: "It's not worth making a scene over money.",
        outcomes: [
          { id: "resentment", probability: 1.0, label: "Subsidized Marco 💸", financialDelta: -100, quality: "bad", feedback: "You paid PPF 130 for a PPF 30 meal. You feel resentful, and Marco got cheap Wagyu.", learning: "Avoiding awkward conversations can cost you money over time. Establishing financial boundaries with friends is healthy.", scoreImpact: { patience: -1, wealth: -1 } }
        ]
      },
      {
        id: "speak_up",
        label: "Speak up",
        description: "'Actually, my meal was much smaller. Let's just pay for what we ordered.'",
        outcomes: [
          { id: "awkward_but_fair", probability: 1.0, label: "Kept your cash 🗣️", financialDelta: 0, quality: "good", feedback: "Marco agreed. You paid for your own meal. It was mildly awkward for three seconds.", learning: "Advocating for yourself financially is a practical skill. The brief social friction is usually worth protecting your budget.", scoreImpact: { learning: 2, wealth: 1 } }
        ]
      }
    ]
  },

  // ── LIFESTYLE ──
  {
    id: "ls_luxury_watch",
    category: "lifestyle",
    headline: "You're tempted by a PPF 8,000 Swiss watch.",
    description: "'It might hold its value,' you tell yourself. Marco has the same watch.",
    emoji: "⌚",
    options: [
      {
        id: "buy_watch",
        label: "Buy the watch",
        description: "You want it, and you've saved for it.",
        outcomes: [
          { id: "bought", probability: 1.0, label: "Bought the watch ⌚", financialDelta: -8000, quality: "neutral", feedback: "You bought the watch. It brings you joy, but your investable cash drops by PPF 8,000.", learning: "While some specific luxury watches appreciate, the vast majority act as depreciating consumer goods. Treat it as an expense, not a guaranteed investment.", scoreImpact: { wealth: -2, riskAlignment: -1 } },
        ],
      },
      {
        id: "skip_watch",
        label: "Skip it and invest",
        description: "Put that PPF 8,000 to work in the market instead.",
        outcomes: [
          { id: "skipped", probability: 1.0, label: "Skipped it 💪", financialDelta: 0, quality: "good", feedback: "You invested the PPF 8,000 instead, giving it the potential to compound over time.", learning: "Every large purchase carries an opportunity cost. PPF 8,000 invested historically has the potential to grow significantly over decades.", scoreImpact: { wealth: 2, patience: 3 } },
        ],
      },
      {
        id: "buy_cheaper",
        label: "Buy a PPF 200 watch",
        description: "Satisfy the need for a timepiece affordably.",
        outcomes: [
          { id: "sensible", probability: 1.0, label: "Sensible choice ⏱️", financialDelta: -200, quality: "good", feedback: "You bought a decent watch for PPF 200 and kept your remaining savings.", learning: "Satisfying a desire at a fraction of the cost frees up capital for other financial goals.", scoreImpact: { wealth: 1, patience: 2 } },
        ],
      },
    ],
  },
  {
    id: "ls_lifestyle_creep",
    category: "lifestyle",
    headline: "You got a raise. Time to upgrade your lifestyle.",
    description: "New apartment, new car, new subscriptions. You feel you've earned it, but your savings rate is about to drop.",
    emoji: "🛋️",
    options: [
      {
        id: "full_upgrade",
        label: "Full lifestyle upgrade",
        description: "Upgrade everything to match your new income.",
        outcomes: [
          { id: "creep", probability: 1.0, label: "Lifestyle upgraded 🛍️", financialDelta: -3000, quality: "bad", feedback: "Your monthly expenses jumped, absorbing the entirety of your raise.", learning: "Lifestyle creep happens when spending rises to meet income. It can prevent higher earnings from translating into higher wealth.", scoreImpact: { wealth: -3, patience: -2 }, incomeChange: -500 },
        ],
      },
      {
        id: "modest_upgrade",
        label: "Modest upgrade only",
        description: "Allow some treats, but maintain or grow your savings rate.",
        outcomes: [
          { id: "balanced", probability: 1.0, label: "Modest upgrade 🧘", financialDelta: 0, quality: "good", feedback: "You upgraded a little, but kept your overall savings rate healthy.", learning: "A balanced approach allows you to enjoy your success today while still allocating more funds to your future.", scoreImpact: { wealth: 2, patience: 2 } },
        ],
      },
      {
        id: "invest_raise",
        label: "Invest the entire raise",
        description: "You lived fine on your old salary. Funnel the rest to investments.",
        outcomes: [
          { id: "invested", probability: 1.0, label: "Raise invested 💎", financialDelta: 0, quality: "good", feedback: "You automatically directed the raise to your investment accounts, turbocharging your growth.", learning: "Automatically investing pay raises prevents lifestyle creep and is a highly effective way to accelerate wealth building.", scoreImpact: { wealth: 3, patience: 3 }, incomeChange: 400 },
        ],
      },
    ],
  },
  {
    id: "ls_subscription_audit",
    category: "lifestyle",
    headline: "You realize you have 14 active subscriptions.",
    description: "Streaming, meal kits, an app for meditation, cloud storage... It's costing you PPF 250 a month.",
    emoji: "📱",
    options: [
      {
        id: "cancel_most",
        label: "Ruthless Audit",
        description: "Cancel everything you don't use weekly.",
        outcomes: [
          { id: "saved_money", probability: 1.0, label: "Freed up cash ✂️", financialDelta: 0, quality: "good", feedback: "You cancelled several subscriptions, saving PPF 150/month.", learning: "Subscription creep is stealthy. Periodically auditing recurring expenses helps plug slow leaks in your budget.", scoreImpact: { wealth: 2, patience: 2 }, incomeChange: 150 }
        ]
      },
      {
        id: "keep_them",
        label: "Keep them, just in case",
        description: "You might start using that meditation app next month. Really.",
        outcomes: [
          { id: "wasted_money", probability: 1.0, label: "Death by a thousand cuts 💸", financialDelta: -1800, quality: "bad", feedback: "Over the year, you spent nearly PPF 2,000 on services you barely touched.", learning: "Unused recurring expenses drag down your ability to save and invest. If you aren't using it, pause it.", scoreImpact: { wealth: -2, patience: -1 } }
        ]
      }
    ]
  },
  {
    id: "ls_get_a_dog",
    category: "lifestyle",
    headline: "You really want a dog. A cute French Bulldog.",
    description: "The puppy costs PPF 2,500. But the real costs are the vet bills, food, insurance, and doggy daycare.",
    emoji: "🐶",
    options: [
      {
        id: "buy_dog",
        label: "Buy the puppy",
        description: "You can't put a price on companionship.",
        outcomes: [
          { id: "expensive_love", probability: 1.0, label: "Joy and Vet Bills ❤️", financialDelta: -6000, quality: "neutral", feedback: "You love the dog, but it costs you roughly PPF 3,000 a year in ongoing care. Your savings rate drops slightly.", learning: "Pets bring immense joy but are a significant financial commitment. Properly budgeting for their lifelong care is essential.", scoreImpact: { wealth: -1, patience: 1 }, incomeChange: -250 }
        ]
      },
      {
        id: "wait_on_dog",
        label: "Wait until you have a bigger buffer",
        description: "You delay until you've established a specific 'pet emergency fund'.",
        outcomes: [
          { id: "delayed_gratification", probability: 1.0, label: "Responsible planning 📋", financialDelta: 0, quality: "good", feedback: "You waited. A year later, you adopted a dog with a fully funded pet emergency fund, reducing your financial stress.", learning: "Delaying major lifestyle choices until you are financially prepared helps protect your broader financial stability.", scoreImpact: { wealth: 2, patience: 3 } }
        ]
      }
    ]
  },

  // ── MACRO ──
  {
    id: "ma_market_crash",
    category: "macro",
    headline: "Markets drop 30% in a month. The news is bleak.",
    description: "Your portfolio is down significantly. Headlines scream 'worst crash since 2008.' Marco already sold everything.",
    emoji: "📉",
    options: [
      {
        id: "hold_steady",
        label: "Hold steady",
        description: "Stick to your long-term plan.",
        outcomes: [
          { id: "held", probability: 0.7, label: "Held steady 💎", financialDelta: 0, quality: "good", feedback: "You held. The market eventually recovered. Marco missed the upswing.", learning: "Historically, broad global markets have eventually recovered from major downturns. Panic selling often turns temporary paper losses into permanent real ones.", scoreImpact: { patience: 4, riskAlignment: 2 } },
          { id: "held_slow", probability: 0.3, label: "Held, but recovery was slow", financialDelta: 0, quality: "neutral", feedback: "You held. The recovery took several years, testing your patience.", learning: "Market recoveries can take variable amounts of time. A long-term horizon is required for equity investing.", scoreImpact: { patience: 3 } },
        ],
      },
      {
        id: "panic_sell",
        label: "Panic sell",
        description: "Move to cash to 'stop the bleeding.'",
        outcomes: [
          { id: "sold_bottom", probability: 0.8, label: "Sold near the bottom 😱", financialDelta: -8000, quality: "bad", feedback: "You sold. When markets eventually rebounded, you were sitting in cash and missed the initial surge.", learning: "Selling during a crash removes your exposure to the subsequent recovery. Timing reentry is notoriously difficult.", scoreImpact: { patience: -4, wealth: -3 } },
          { id: "lucky_sell", probability: 0.2, label: "Avoided further drops 🍀", financialDelta: -2000, quality: "neutral", feedback: "You sold, and the market dropped another 10%. You felt relieved, but still had to figure out when to buy back in.", learning: "Even if you dodge further downside, you create a new problem: predicting when it's safe to re-enter the market.", scoreImpact: { patience: -2, riskAlignment: -2 } },
        ],
      },
      {
        id: "buy_dip",
        label: "Continue buying",
        description: "Maintain or increase your scheduled investments.",
        outcomes: [
          { id: "bought", probability: 0.75, label: "Averaged down 🛒", financialDelta: 5000, quality: "good", feedback: "You kept buying at lower prices. When markets stabilized, your new units appreciated.", learning: "Continuing to invest during downturns lowers your average cost basis, though timing the exact bottom is impossible.", scoreImpact: { patience: 3, wealth: 3, riskAlignment: 1 } },
          { id: "bought_early", probability: 0.25, label: "Caught a falling knife 😅", financialDelta: -1000, quality: "neutral", feedback: "You bought more, but the market kept sliding for months. It felt bad in the short term.", learning: "Markets can remain irrational longer than expected. Buying during a crash requires strong conviction and patience.", scoreImpact: { patience: 2 } },
        ],
      },
    ],
  },
  {
    id: "ma_inflation_spike",
    category: "macro",
    headline: "Inflation hits unusually high levels. Your cash is losing purchasing power.",
    description: "The cost of goods is rising faster than your savings account interest rate. Marco bought a lot of physical gold.",
    emoji: "📊",
    options: [
      {
        id: "rebalance_real",
        label: "Ensure exposure to real assets",
        description: "Check that your portfolio has assets that historically track inflation, like global equities.",
        outcomes: [
          { id: "smart", probability: 0.8, label: "Maintained purchasing power ⚖️", financialDelta: 2000, quality: "good", feedback: "Your diversified portfolio helped offset the drop in cash purchasing power.", learning: "Historically, real assets like broadly diversified equities or real estate have offered better long-term protection against inflation than holding pure cash.", scoreImpact: { diversification: 3, learning: 2 } },
          { id: "timing", probability: 0.2, label: "Equities also dipped", financialDelta: -500, quality: "neutral", feedback: "Inflation caused interest rates to spike, which temporarily hurt equity valuations too.", learning: "In the short term, high inflation can pressure all asset classes. However, cash is guaranteed to lose purchasing power.", scoreImpact: { learning: 1 } },
        ],
      },
      {
        id: "stay_cash",
        label: "Stay entirely in cash",
        description: "It feels safer not to be exposed to market volatility right now.",
        outcomes: [
          { id: "lost_real", probability: 1.0, label: "Eroded purchasing power 💸", financialDelta: -2000, quality: "bad", feedback: "Your cash balance stayed the same, but it buys significantly less than it did a year ago.", learning: "Inflation acts as a hidden tax on cash. While cash has no market volatility, it carries high inflation risk over time.", scoreImpact: { learning: 2, wealth: -2 } },
        ],
      },
    ],
  },
  {
    id: "ma_strong_franc",
    category: "macro",
    headline: "The Swiss Franc strengthens significantly against the Euro and USD.",
    description: "Great for your upcoming vacation! However, your globally diversified ETF is priced in foreign currencies, so its PPF value drops on paper.",
    emoji: "💱",
    options: [
      {
        id: "panic_hedge",
        label: "Switch to PPF-hedged equity funds",
        description: "Try to eliminate currency fluctuations going forward.",
        outcomes: [
          { id: "paid_fees", probability: 1.0, label: "Locked in costs 📉", financialDelta: -800, quality: "neutral", feedback: "You switched to a hedged fund. You reduced currency volatility, but generally increased your ongoing fund fees.", learning: "Currency hedging for global equities adds costs and complexity. Over very long horizons, many investors accept the currency fluctuations.", scoreImpact: { patience: -1, learning: 1 } }
        ]
      },
      {
        id: "buy_cheaper",
        label: "Accept the volatility, keep buying",
        description: "Your strong Franc now buys MORE shares of global companies.",
        outcomes: [
          { id: "buying_power", probability: 1.0, label: "Maximized purchasing power 🛒", financialDelta: 1500, quality: "good", feedback: "You accepted the paper drop and kept buying. A strong Franc effectively put foreign assets 'on sale' for you.", learning: "A strong home currency increases purchasing power for foreign assets, though it's important to remember these investments carry inherent exchange rate risk.", scoreImpact: { wealth: 2, patience: 3 } }
        ]
      }
    ]
  },
  {
    id: "ma_interest_rates_rise",
    category: "macro",
    headline: "Global interest rates rise sharply.",
    description: "Savings accounts finally pay interest again. However, your 5-year fixed mortgage is up for renewal soon.",
    emoji: "📈",
    minAge: 35,
    options: [
      {
        id: "panic_lock",
        label: "Lock in a long-term fixed rate immediately",
        description: "Rates are rising! Lock it in before it goes higher.",
        outcomes: [
          { id: "locked_high", probability: 0.6, label: "Locked in at a high point 🔒", financialDelta: -5000, quality: "neutral", feedback: "You locked in a 10-year rate. Rates eventually stabilized and drifted down slightly, but you have cost certainty.", learning: "Fixing a mortgage during a rate spike provides peace of mind, but trying to 'time' interest rates is notoriously difficult.", scoreImpact: { patience: -1, riskAlignment: 1 } },
          { id: "smart_lock", probability: 0.4, label: "Rates kept climbing 🛡️", financialDelta: 4000, quality: "good", feedback: "You locked in, and rates actually kept going up. You shielded yourself from further hikes.", learning: "Fixed mortgages act as an insurance policy against rising rates. Sometimes that insurance pays off.", scoreImpact: { riskAlignment: 2 } }
        ]
      },
      {
        id: "use_saron",
        label: "Use a SARON (variable) mortgage",
        description: "Accept the fluctuating rates, which historically have often been cheaper.",
        outcomes: [
          { id: "saron_win", probability: 0.7, label: "Rode the wave 🏄", financialDelta: 3000, quality: "good", feedback: "The variable rate was higher for a while, but eventually central banks cut rates again.", learning: "Historically in Switzerland, variable mortgages have often been cheaper over long periods, but they carry interest rate risk and require a solid financial buffer.", scoreImpact: { patience: 2, wealth: 1 } },
          { id: "saron_pain", probability: 0.3, label: "Prolonged rate pain 📉", financialDelta: -4000, quality: "bad", feedback: "Rates stayed high for years. Your monthly payment remained elevated, squeezing your budget.", learning: "Variable rates mean you bear the interest rate risk. If you cannot afford a sudden spike in your monthly payments, a variable rate is highly dangerous.", scoreImpact: { wealth: -2, riskAlignment: -2 } }
        ]
      }
    ]
  },

  // ── WORKPLACE ──
  {
    id: "wp_bonus",
    category: "workplace",
    headline: "You received a PPF 5,000 year-end bonus.",
    description: "Your boss says you've earned it. Marco already spent his on a watch.",
    emoji: "💰",
    options: [
      {
        id: "invest_all_bonus",
        label: "Invest it all",
        description: "Direct it straight to your investment account.",
        outcomes: [
          { id: "invested", probability: 1.0, label: "Invested it all 📈", financialDelta: 5000, quality: "good", feedback: "You invested the full bonus. It accelerates your progress.", learning: "Windfalls are an excellent opportunity to boost investments without feeling a pinch in your standard monthly budget.", scoreImpact: { wealth: 3, patience: 2 } },
        ],
      },
      {
        id: "split_bonus",
        label: "Split it: Spend some, invest some",
        description: "Find a balance between current enjoyment and future security.",
        outcomes: [
          { id: "split", probability: 1.0, label: "Split 50/50 ⚖️", financialDelta: 2500, quality: "good", feedback: "You invested half and spent half on a nice trip. A reasonable balance.", learning: "The 'pay yourself first' principle can apply to windfalls too. Earmarking a percentage for savings ensures steady progress.", scoreImpact: { wealth: 1, patience: 1 } },
        ],
      },
      {
        id: "splurge_bonus",
        label: "Splurge it all",
        description: "You earned it. Treat yourself.",
        outcomes: [
          { id: "splurged", probability: 1.0, label: "Splurged it all 🎉", financialDelta: 0, quality: "neutral", feedback: "You spent the bonus. You enjoyed it, but your net worth didn't benefit.", learning: "Spending a bonus is a valid personal choice, but recognizing the opportunity cost of not investing it is part of financial maturity.", scoreImpact: { patience: -1 } },
        ],
      },
    ],
  },
  {
    id: "wp_job_loss",
    category: "workplace",
    headline: "You were laid off. Your emergency fund is about to be tested.",
    description: "The company restructured. You have some severance, but you need to cover expenses while job hunting.",
    emoji: "📋",
    options: [
      {
        id: "had_emergency_fund",
        label: "Rely on your emergency fund",
        description: "You have 3-6 months of expenses in cash.",
        outcomes: [
          { id: "covered", probability: 1.0, label: "Emergency fund saved you 🛡️", financialDelta: 0, quality: "good", feedback: "Your cash buffer covered the gap. You didn't have to sell investments.", learning: "An emergency fund isn't just for peace of mind — it acts as a buffer so you aren't forced to sell volatile assets at potentially bad times.", scoreImpact: { patience: 3, riskAlignment: 2 } },
        ],
      },
      {
        id: "no_emergency_fund",
        label: "I don't have one",
        description: "You've been fully invested, keeping minimal cash.",
        outcomes: [
          { id: "sold_investments", probability: 0.8, label: "Had to sell investments 😬", financialDelta: -4000, quality: "bad", feedback: "You had to liquidate investments to pay rent, unfortunately during a market dip.", learning: "Without an emergency fund, unexpected expenses can force you to sell assets at suboptimal times, hurting long-term returns.", scoreImpact: { wealth: -3, learning: 3 } },
          { id: "found_job_fast", probability: 0.2, label: "Found a job quickly 🍀", financialDelta: 0, quality: "neutral", feedback: "You found a new job very fast. You scraped by without selling assets.", learning: "You got lucky this time. Relying on finding a job quickly is not a robust risk management strategy.", scoreImpact: { learning: 2 } },
        ],
      },
    ],
  },
  {
    id: "wp_salary_raise",
    category: "workplace",
    headline: "You negotiated a PPF 800/month raise.",
    description: "Now you have an extra PPF 800 every month. What's the plan?",
    emoji: "📈",
    options: [
      {
        id: "invest_the_raise",
        label: "Invest the raise",
        description: "Increase your automated monthly investments.",
        outcomes: [
          { id: "invested", probability: 1.0, label: "Raise invested 💎", financialDelta: 0, quality: "good", feedback: "You maintained your lifestyle and boosted your savings rate.", learning: "Capturing a raise for investments before you get accustomed to spending it is a highly effective way to build wealth.", scoreImpact: { wealth: 3, patience: 2 }, incomeChange: 800 },
        ],
      },
      {
        id: "spend_the_raise",
        label: "Upgrade your lifestyle",
        description: "You earned more, you should live better.",
        outcomes: [
          { id: "spent", probability: 1.0, label: "Spent the raise ✈️", financialDelta: 0, quality: "neutral", feedback: "You absorbed the raise into your daily spending. It feels nice, but your savings rate stalled.", learning: "Lifestyle inflation is common. While increasing your standard of living is fine, doing so at the total expense of saving slows wealth accumulation.", scoreImpact: { patience: -1 } },
        ],
      },
    ],
  },
  {
    id: "wp_headhunter",
    category: "workplace",
    headline: "A headhunter offers you a job with a 20% higher salary.",
    description: "The catch? The new company only offers the legal minimum 2nd pillar (BVG) pension contributions, while your current job pays extra.",
    emoji: "💼",
    options: [
      {
        id: "take_the_money",
        label: "Take the job, don't adjust budget",
        description: "Focus on the net salary increase. Enjoy the cash.",
        outcomes: [
          { id: "pension_gap", probability: 1.0, label: "Hidden pension gap 📉", financialDelta: 0, quality: "bad", feedback: "You have more cash now, but your unseen retirement savings dropped. The salary increase was partially an illusion.", learning: "Total compensation matters. A higher salary with worse pension benefits requires you to save more privately to stay on track.", scoreImpact: { learning: -2, riskAlignment: -1 }, incomeChange: 1200 }
        ]
      },
      {
        id: "take_and_invest",
        label: "Take the job, invest the difference",
        description: "Take the higher salary but manually invest to make up for the pension gap.",
        outcomes: [
          { id: "smart_move", probability: 1.0, label: "Total Comp Master 🧠", financialDelta: 0, quality: "good", feedback: "You took the job, calculated the pension gap, and increased your private investments. You effectively control more of your money now.", learning: "Evaluating job offers requires looking beyond the monthly net pay to fully understand the impact on your long-term wealth.", scoreImpact: { wealth: 3, learning: 3 }, incomeChange: 500 } // Net increase after compensating
        ]
      }
    ]
  },

  // ── LUCKY ──
  {
    id: "lu_inheritance",
    category: "lucky",
    headline: "A distant relative left you PPF 20,000.",
    description: "You have a sudden lump sum of cash. Marco's girlfriend says you should put it in crypto.",
    emoji: "🎁",
    options: [
      {
        id: "invest_inheritance",
        label: "Invest it as a lump sum",
        description: "Put it directly into your diversified portfolio.",
        outcomes: [
          { id: "invested", probability: 1.0, label: "Invested it all 📈", financialDelta: 20000, quality: "good", feedback: "You invested the full inheritance, giving it maximum time in the market.", learning: "Historical data shows lump-sum investing tends to outperform dollar-cost averaging in long-term rising markets, though spreading it out can feel psychologically safer.", scoreImpact: { wealth: 4, patience: 2 } },
        ],
      },
      {
        id: "split_inheritance",
        label: "Invest most, keep some",
        description: "PPF 15,000 invested, PPF 5,000 for a personal goal.",
        outcomes: [
          { id: "split", probability: 1.0, label: "Balanced approach ⚖️", financialDelta: 15000, quality: "good", feedback: "You invested most of it and kept a portion for something meaningful.", learning: "Allocating a windfall thoughtfully allows you to improve your financial future while also enjoying the present.", scoreImpact: { wealth: 3, patience: 1 } },
        ],
      },
      {
        id: "crypto_inheritance",
        label: "Put it in highly volatile assets",
        description: "Take a huge swing and hope for outsized returns.",
        outcomes: [
          { id: "lost", probability: 0.7, label: "High risk, high loss 💀", financialDelta: -14000, quality: "bad", feedback: "The asset dropped 70%. You lost a significant chunk of your inheritance.", learning: "Putting a large windfall into a single highly volatile asset increases portfolio risk dramatically. Diversification helps manage this.", scoreImpact: { riskAlignment: -4, wealth: -3 } },
          { id: "lucky_crypto", probability: 0.3, label: "High risk, high reward 🍀", financialDelta: 40000, quality: "neutral", feedback: "The asset rallied heavily. You made significant gains.", learning: "A risky bet paying off doesn't validate the risk management process. Consider taking some profits to rebalance your portfolio.", scoreImpact: { riskAlignment: -3, patience: -2 } },
        ],
      },
    ],
  },
  {
    id: "lu_tax_refund",
    category: "lucky",
    headline: "You got a PPF 2,400 tax refund.",
    description: "You have PPF 2,400 you weren't expecting. It's burning a hole in your pocket.",
    emoji: "🧾",
    options: [
      {
        id: "invest_refund",
        label: "Invest it",
        description: "You weren't counting on it. Put it to work.",
        outcomes: [
          { id: "invested", probability: 1.0, label: "Invested it 📈", financialDelta: 2400, quality: "good", feedback: "You invested the refund, effectively turning a tax overpayment into a wealth-building tool.", learning: "Treating tax refunds or small windfalls as 'invisible money' to be invested is a powerful financial habit.", scoreImpact: { wealth: 2, patience: 2 } },
        ],
      },
      {
        id: "spend_refund",
        label: "Treat yourself",
        description: "It's basically 'free' money. Enjoy it.",
        outcomes: [
          { id: "spent", probability: 1.0, label: "Spent it ✈️", financialDelta: 0, quality: "neutral", feedback: "You spent the refund. It was nice, but a missed opportunity for compounding.", learning: "A tax refund is actually just your own money being returned to you. Siphoning it entirely to consumption delays financial goals.", scoreImpact: { patience: -1 } },
        ],
      },
    ],
  },
  {
    id: "lu_hardware_wallet",
    category: "lucky",
    headline: "You find an old hardware wallet in a drawer.",
    description: "It's from 2016. You actually remember the PIN. There is a small amount of cryptocurrency on it that has appreciated wildly.",
    emoji: "🪙",
    options: [
      {
        id: "hold_forever",
        label: "Keep it on the wallet",
        description: "Hold it and see where it goes.",
        outcomes: [
          { id: "volatile_hold", probability: 1.0, label: "Rollercoaster ride 🎢", financialDelta: 0, quality: "neutral", feedback: "You held. The value swings wildly month to month. It's an interesting part of your portfolio, but highly speculative.", learning: "Holding a highly volatile asset you forgot about is fine, provided you understand it now represents a heavily concentrated risk in your portfolio.", scoreImpact: { riskAlignment: -1 } }
        ]
      },
      {
        id: "sell_and_diversify",
        label: "Sell and diversify",
        description: "Lock in the unexpected gain and buy diversified funds.",
        outcomes: [
          { id: "locked_gains", probability: 1.0, label: "Secured the bag 💰", financialDelta: 25000, quality: "good", feedback: "You sold and moved the funds into your core portfolio, turning a forgotten gamble into more stable wealth.", learning: "When a highly speculative asset appreciates massively, taking profits to diversify helps secure those gains and lower overall portfolio volatility.", scoreImpact: { wealth: 3, diversification: 3 } }
        ]
      }
    ]
  },

  // ── LIFE EVENTS ──
  {
    id: "li_mortgage",
    category: "life",
    headline: "You're looking to buy an apartment. Down payment: PPF 120,000.",
    description: "Swiss banks typically require 20% down. It means liquidating part of your portfolio or using your pension.",
    emoji: "🏡",
    minAge: 30,
    maxAge: 50,
    options: [
      {
        id: "buy_smart",
        label: "Buy well within affordability rules",
        description: "Ensure the theoretical carrying costs are well below 33% of your gross income.",
        outcomes: [
          { id: "smart", probability: 0.8, label: "Bought sustainably 🏡", financialDelta: -120000, quality: "good", feedback: "You bought the apartment. Your housing costs are manageable, leaving room to continue investing.", learning: "Keeping housing costs sustainable (typically below a third of gross income) ensures you aren't 'house poor' and can weather financial shocks.", scoreImpact: { riskAlignment: 2, patience: 2 } },
          { id: "market_dip", probability: 0.2, label: "Short-term property dip 😅", financialDelta: -125000, quality: "neutral", feedback: "You bought, but local property values dipped slightly the next year. You plan to live there long-term, so it doesn't hurt your cash flow.", learning: "Property markets fluctuate like any other. For primary residences, affordability and time horizon are generally more important than short-term price movements.", scoreImpact: { patience: 1 } },
        ],
      },
      {
        id: "over_extend",
        label: "Stretch for a bigger place",
        description: "Push right to the absolute limit of the bank's affordability calculation.",
        outcomes: [
          { id: "stretched", probability: 1.0, label: "Over-extended 😬", financialDelta: -150000, quality: "bad", feedback: "You got the mortgage, but the payments and maintenance are straining your monthly budget.", learning: "Maximizing borrowing limits leaves little margin for error if interest rates rise or unexpected repairs occur.", scoreImpact: { riskAlignment: -3, wealth: -2 } },
        ],
      },
    ],
  },
  {
    id: "li_health_emergency",
    category: "life",
    headline: "A health issue results in PPF 8,000 of out-of-pocket costs.",
    description: "Deductibles and uncovered treatments add up quickly. Do you have the cash on hand?",
    emoji: "🏥",
    options: [
      {
        id: "had_cash_health",
        label: "Use your emergency fund",
        description: "You keep easily accessible cash for this reason.",
        outcomes: [
          { id: "covered", probability: 1.0, label: "Emergency fund utilized 🛡️", financialDelta: -8000, quality: "good", feedback: "Your cash buffer absorbed the shock. Your invested portfolio remained untouched.", learning: "A liquid emergency fund separates life's unpredictable emergencies from your long-term investment strategy.", scoreImpact: { riskAlignment: 2, patience: 2 } },
        ],
      },
      {
        id: "sell_assets_health",
        label: "Sell investments to cover it",
        description: "You have no cash buffer, so you must liquidate assets.",
        outcomes: [
          { id: "sold", probability: 1.0, label: "Forced liquidation 😬", financialDelta: -10000, quality: "bad", feedback: "You sold investments to pay the bills, potentially triggering capital gains taxes or locking in a loss.", learning: "Being forced to sell assets to cover unexpected expenses often disrupts compounding and can carry tax consequences.", scoreImpact: { wealth: -3, learning: 3 } },
        ],
      },
    ],
  },
  {
    id: "li_child",
    category: "life",
    headline: "You're having a child! Also: PPF 2,000/month in new expenses.",
    description: "Childcare, supplies, and healthcare. Your monthly budget is about to change significantly.",
    emoji: "👶",
    minAge: 28,
    maxAge: 45,
    options: [
      {
        id: "had_plan",
        label: "Adjust budget proactively",
        description: "You anticipated this and adjusted your savings goals accordingly.",
        outcomes: [
          { id: "planned", probability: 1.0, label: "Smooth transition 📋", financialDelta: 0, quality: "good", feedback: "Your savings rate dropped, but your finances remained stable because you planned ahead.", learning: "Major life events alter your capacity to save. Proactive budgeting helps prevent these joyful moments from causing financial stress.", scoreImpact: { patience: 2, riskAlignment: 1 }, incomeChange: -500 },
        ],
      },
      {
        id: "scrambled",
        label: "Figure it out as you go",
        description: "You didn't adjust your budget. Time to scramble.",
        outcomes: [
          { id: "unplanned", probability: 1.0, label: "Budget shock 😅", financialDelta: -5000, quality: "neutral", feedback: "You had to dip into savings to cover the initial shock before getting your monthly budget under control.", learning: "Failing to account for major structural changes to your expenses often leads to short-term cash flow issues.", scoreImpact: { patience: -1 }, incomeChange: -800 },
        ],
      },
    ],
  },
  {
    id: "li_relocation",
    category: "life",
    headline: "You have an opportunity to relocate for a better job.",
    description: "The salary is higher, but moving costs are significant, and the new city has a higher cost of living.",
    emoji: "🚚",
    minAge: 28,
    maxAge: 50,
    options: [
      {
        id: "relocate_smart",
        label: "Relocate after running the numbers",
        description: "Calculate the 'break-even' point of the higher salary vs. higher expenses.",
        outcomes: [
          { id: "net_positive", probability: 0.75, label: "Net positive move 📦", financialDelta: -8000, quality: "good", feedback: "The move was expensive, but the net salary increase compensated for the higher living costs over time.", learning: "Relocating for work should involve a total cost-of-living analysis, not just looking at the gross salary number.", scoreImpact: { wealth: 2, patience: 1 }, incomeChange: 800 },
          { id: "hidden_costs", probability: 0.25, label: "Hidden costs hurt 😬", financialDelta: -14000, quality: "neutral", feedback: "The move was costlier than expected, and the higher rent ate up most of the raise. It took a long time to break even.", learning: "Moving often involves hidden or under-estimated costs. Always build a buffer into relocation budgets.", scoreImpact: { patience: -1 }, incomeChange: 500 },
        ],
      },
      {
        id: "decline_relocation",
        label: "Decline to maintain stability",
        description: "The disruption and risk aren't worth it right now.",
        outcomes: [
          { id: "stayed", probability: 0.6, label: "Stayed put 🛋️", financialDelta: 0, quality: "neutral", feedback: "You stayed. A similar opportunity came up locally later on.", learning: "Stability has intrinsic value. Not every financial opportunity is worth the personal upheaval.", scoreImpact: { patience: 1 } },
          { id: "regretted", probability: 0.4, label: "Missed trajectory 😔", financialDelta: 0, quality: "bad", feedback: "You stayed, but your income growth stagnated compared to peers who took career risks.", learning: "While stability is valuable, avoiding all career risks can lead to stagnation in your long-term earning potential.", scoreImpact: { wealth: -2, learning: 2 } },
        ],
      },
    ],
  },
  {
    id: "li_new_car",
    category: "life",
    headline: "You need a replacement car for your daily commute.",
    description: "Options range from a PPF 5,000 used economy car to a PPF 45,000 luxury EV lease.",
    emoji: "🚙",
    options: [
      {
        id: "buy_used_car",
        label: "Buy a reliable used car",
        description: "Pay cash for a functional, depreciated vehicle.",
        outcomes: [
          { id: "reliable", probability: 0.8, label: "Cost-effective transit 🚙", financialDelta: -5000, quality: "good", feedback: "The car runs fine. You avoided a large car payment, allowing you to invest the difference.", learning: "Cars are depreciating assets. Minimizing transportation costs is a standard way to free up cash for investments.", scoreImpact: { wealth: 3, patience: 2 } },
          { id: "repair_needed", probability: 0.2, label: "Maintenance costs 🔧", financialDelta: -6500, quality: "neutral", feedback: "The used car required repairs. It was annoying, but still cheaper than years of lease payments.", learning: "Used cars carry maintenance risks, but mathematically they often remain cheaper than funding the steep depreciation of a new car.", scoreImpact: { wealth: 2 } },
        ],
      },
      {
        id: "lease_luxury",
        label: "Lease the luxury vehicle",
        description: "You want a nice, new car and are willing to pay a high monthly fee.",
        outcomes: [
          { id: "leased", probability: 1.0, label: "High monthly overhead 🔋", financialDelta: -9600, quality: "bad", feedback: "You are locked into high monthly payments. Your ability to save each month is noticeably reduced.", learning: "Leasing is generally the most expensive way to operate a vehicle, as you are continually funding its steepest period of depreciation.", scoreImpact: { wealth: -3, patience: -2 }, incomeChange: -400 },
        ],
      },
    ],
  },
  {
    id: "li_divorce",
    category: "life",
    headline: "You are navigating a divorce.",
    description: "In Switzerland, assets accumulated during marriage (Errungenschaft) are typically split. This is financially complex.",
    emoji: "💔",
    minAge: 30,
    maxAge: 60,
    options: [
      {
        id: "get_lawyer",
        label: "Seek professional legal counsel",
        description: "Ensure assets are categorized correctly under the law.",
        outcomes: [
          { id: "protected", probability: 0.7, label: "Clarified assets 🛡️", financialDelta: -8000, quality: "good", feedback: "Counsel helped clearly separate pre-marital assets from marital gains. You paid legal fees but avoided an inequitable split.", learning: "During complex financial splits, professional legal advice often prevents costly long-term mistakes regarding asset classification.", scoreImpact: { learning: 3, riskAlignment: 1 } },
          { id: "fair_split", probability: 0.3, label: "Structured resolution 📋", financialDelta: -25000, quality: "neutral", feedback: "Assets were split according to standard formulas. The legal fees were significant, but the process was structured.", learning: "Divorce has a profound impact on net worth. Clear, legally sound settlements help provide a baseline to rebuild from.", scoreImpact: { patience: 2, learning: 2 } },
        ],
      },
      {
        id: "diy_divorce",
        label: "Handle the asset split yourselves",
        description: "Try to divide everything informally to save on legal fees.",
        outcomes: [
          { id: "messy", probability: 0.65, label: "Complex disputes 😬", financialDelta: -40000, quality: "bad", feedback: "Without clear legal guidance, disputes over asset valuations prolonged the process and resulted in a disadvantageous split.", learning: "Informal splits of complex assets (like pensions and property) often overlook statutory protections, leading to uneven financial outcomes.", scoreImpact: { wealth: -3, learning: 3 } },
          { id: "amicable", probability: 0.35, label: "Amicable agreement ✅", financialDelta: -20000, quality: "neutral", feedback: "You managed to reach a reasonably fair agreement without high legal fees.", learning: "While amicable informal splits can save money, both parties must have high financial literacy to ensure fairness.", scoreImpact: { patience: 1, learning: 2 } },
        ],
      },
    ],
  },
  {
    id: "li_parent_care",
    category: "life",
    headline: "An aging parent needs nursing home care.",
    description: "Care costs often exceed their basic pension. You may need to help cover the gap.",
    emoji: "👴",
    minAge: 40,
    maxAge: 65,
    options: [
      {
        id: "research_el",
        label: "Look into supplementary state benefits (EL)",
        description: "Research if they qualify for state assistance before paying out of pocket.",
        outcomes: [
          { id: "qualified", probability: 0.7, label: "Benefits secured ✅", financialDelta: 0, quality: "good", feedback: "Your parent qualified for Ergänzungsleistungen (EL). The state assisted with the funding gap.", learning: "Understanding local social safety nets (like EL in Switzerland) is crucial before liquidating personal assets to fund elder care.", scoreImpact: { learning: 4, riskAlignment: 2 } },
          { id: "partial", probability: 0.3, label: "Partial support 📋", financialDelta: -15000, quality: "neutral", feedback: "They only partially qualified. You still contributed, but avoided bearing the entire cost.", learning: "Navigating elder care costs often involves a mix of state support and family contributions. Early planning mitigates the shock.", scoreImpact: { learning: 3, wealth: -1 } },
        ],
      },
      {
        id: "pay_yourself",
        label: "Pay the gap immediately from savings",
        description: "You bypass the bureaucracy and just pay the bills.",
        outcomes: [
          { id: "expensive", probability: 1.0, label: "High out-of-pocket costs 💸", financialDelta: -50000, quality: "bad", feedback: "You paid heavily out of pocket for years before realizing they might have qualified for assistance.", learning: "While admirable, unconditionally funding care without researching available social benefits can severely impact your own retirement security.", scoreImpact: { wealth: -3, learning: 4 } },
        ],
      },
    ],
  },
  {
    id: "li_sabbatical",
    category: "life",
    headline: "You're feeling burned out and consider an unpaid sabbatical.",
    description: "You have enough investments to fund a few months off, but it means pausing your income.",
    emoji: "🎒",
    minAge: 30,
    maxAge: 45,
    options: [
      {
        id: "take_sabbatical",
        label: "Take the time off to recharge",
        description: "Prioritize your mental health over continuous accumulation.",
        outcomes: [
          { id: "recharged", probability: 1.0, label: "Restored energy 🌴", financialDelta: -20000, quality: "neutral", feedback: "You spent savings and paused investing. However, you returned refreshed and more productive.", learning: "Financial independence isn't just about retiring at 65; it's also about having the flexibility to take necessary breaks without ruin.", scoreImpact: { patience: 4, wealth: -1 } }
        ]
      },
      {
        id: "push_through",
        label: "Push through and keep earning",
        description: "Take a standard vacation instead and maintain the savings rate.",
        outcomes: [
          { id: "burnout", probability: 0.6, label: "Eventual Burnout 💥", financialDelta: -5000, quality: "bad", feedback: "You pushed too hard, eventually requiring a longer, unplanned medical leave.", learning: "Ignoring signs of burnout can lead to forced, unstructured absences from work, which can be more disruptive financially and personally.", scoreImpact: { patience: -3, wealth: -1 } },
          { id: "survived", probability: 0.4, label: "Powered through 🔋", financialDelta: 15000, quality: "good", feedback: "It was a tough period, but you managed it. Your investments continued to grow uninterrupted.", learning: "Sometimes you can successfully navigate tough seasons, allowing your financial compounding to continue unimpeded.", scoreImpact: { wealth: 2, patience: 1 } }
        ]
      }
    ]
  },

  // ── RETIREMENT / GLIDE PATH ──
  {
    id: "re_glide_path_check",
    category: "retirement",
    headline: "Reviewing your asset allocation as retirement nears.",
    description: "You are nearing retirement with a portfolio heavily weighted in volatile equities. A market drop could impact your planned retirement date.",
    emoji: "📉",
    minAge: 50,
    options: [
      {
        id: "de_risk",
        label: "Adjust to a more conservative allocation",
        description: "Shift some assets into bonds or cash to manage volatility.",
        outcomes: [
          { id: "smart", probability: 0.8, label: "Volatility managed 🛡️", financialDelta: 0, quality: "good", feedback: "When markets subsequently experienced a downturn, your portfolio was somewhat insulated.", learning: "De-risking as you approach retirement helps mitigate sequence-of-returns risk, trading some upside for more predictable outcomes.", scoreImpact: { riskAlignment: 4, patience: 2 } },
          { id: "missed_gains", probability: 0.2, label: "Lowered growth 😅", financialDelta: -3000, quality: "neutral", feedback: "Markets actually went on a strong bull run. Your more conservative portfolio grew, but slower than before.", learning: "Asset allocation is a trade-off. A conservative portfolio limits downside risk but also caps potential upside gains.", scoreImpact: { riskAlignment: 3 } },
        ],
      },
      {
        id: "stay_aggressive",
        label: "Maintain an aggressive equity allocation",
        description: "You want to maximize growth right up to the end.",
        outcomes: [
          { id: "crash", probability: 0.6, label: "Sequence of returns risk 🎲", financialDelta: -15000, quality: "bad", feedback: "A severe market downturn occurred just before retirement. Your portfolio value dropped significantly.", learning: "High equity exposure near retirement leaves you vulnerable if you need to start withdrawing funds during a market low.", scoreImpact: { riskAlignment: -4, patience: -3 } },
          { id: "lucky_bull", probability: 0.4, label: "Rode the bull market 🍀", financialDelta: 8000, quality: "neutral", feedback: "Markets remained incredibly strong. Your portfolio swelled just before you retired.", learning: "An aggressive stance can yield high returns, but it relies on favorable market timing rather than structured risk management.", scoreImpact: { riskAlignment: -2 } },
        ],
      },
    ],
  },
  {
    id: "re_3a_maxout",
    category: "retirement",
    headline: "Deciding on your annual 3A pension contribution.",
    description: "The 3A allows you to invest for retirement while reducing your taxable income for the year.",
    emoji: "🔒",
    options: [
      {
        id: "max_3a",
        label: "Maximize the contribution",
        description: "Fund the account up to the legal maximum to claim the tax deduction.",
        outcomes: [
          { id: "maxed", probability: 1.0, label: "Tax optimized ✅", financialDelta: 0, quality: "good", feedback: "You received a lower tax bill while your retirement savings grew.", learning: "Utilizing tax-advantaged accounts like the 3A is generally considered a foundational step in Swiss retirement planning.", scoreImpact: { riskAlignment: 3, learning: 2, wealth: 2 } },
        ],
      },
      {
        id: "skip_3a",
        label: "Skip the contribution this year",
        description: "Keep the funds in a standard, taxable brokerage account for more liquidity.",
        outcomes: [
          { id: "skipped", probability: 1.0, label: "Missed deduction", financialDelta: -1500, quality: "bad", feedback: "You maintained liquidity, but you missed out on lowering this year's tax burden.", learning: "While liquidity has value, bypassing statutory tax deductions means you are effectively paying more taxes than legally required.", scoreImpact: { learning: 3, wealth: -2 } },
        ],
      },
    ],
  },
  {
    id: "re_early_withdrawal",
    category: "retirement",
    headline: "You consider withdrawing your 2nd pillar to buy a home.",
    description: "Swiss law permits using your pension to purchase an owner-occupied property, but it reduces your retirement capital.",
    emoji: "🏡",
    minAge: 30,
    maxAge: 55,
    options: [
      {
        id: "withdraw_smart",
        label: "Withdraw for a carefully evaluated property",
        description: "Use the funds to secure a home that fits your long-term plan.",
        outcomes: [
          { id: "smart", probability: 0.7, label: "Asset shift 🏡", financialDelta: 0, quality: "good", feedback: "You effectively converted retirement capital into real estate equity. The property serves your needs well.", learning: "Using pension funds for property is a recognized strategy, provided the real estate acts as a stable, long-term part of your net worth.", scoreImpact: { riskAlignment: 1, learning: 2 } },
          { id: "market_flat", probability: 0.3, label: "Property flatlined 😅", financialDelta: -5000, quality: "neutral", feedback: "The property value hasn't grown, meaning those funds might have performed better left in the pension system.", learning: "Real estate is not guaranteed to appreciate. Shifting funds from a pension to property carries its own set of risks.", scoreImpact: { learning: 1 } },
        ],
      },
      {
        id: "withdraw_risky",
        label: "Withdraw for a highly speculative property",
        description: "Drain the pension for an expensive home hoping it will appreciate rapidly.",
        outcomes: [
          { id: "risky", probability: 1.0, label: "Retirement compromised", financialDelta: -20000, quality: "bad", feedback: "The property market softened and maintenance costs soared. Your retirement buffer is now significantly smaller.", learning: "Over-leveraging into real estate by draining pension funds can severely jeopardize your financial security if the property underperforms.", scoreImpact: { riskAlignment: -3, wealth: -2 } },
        ],
      },
    ],
  },

  // ── CLASSIC LESSONS ──
  {
    id: "cl_diversification",
    category: "classic",
    headline: "A stock making up a huge portion of your portfolio drops 40%.",
    description: "You believed heavily in a single company, but bad news just hit the wire.",
    emoji: "🥚",
    options: [
      {
        id: "hold_concentrated",
        label: "Hold onto the single stock",
        description: "You are confident the specific company will bounce back.",
        outcomes: [
          { id: "recovered", probability: 0.4, label: "Company recovered 📈", financialDelta: 2000, quality: "neutral", feedback: "The specific company turned things around. You recovered your value, but the stress was immense.", learning: "A concentrated position rebounding is often a mix of luck and specific company dynamics. It remains a high-risk approach.", scoreImpact: { riskAlignment: -2, learning: 2 } },
          { id: "kept_falling", probability: 0.6, label: "Company declined 📉", financialDelta: -8000, quality: "bad", feedback: "The company's issues worsened. You suffered a major, concentrated loss.", learning: "A single stock can go to zero. Broadly diversified global index funds spread this risk across thousands of companies.", scoreImpact: { diversification: 4, learning: 4, wealth: -3 } },
        ],
      },
      {
        id: "diversify_now",
        label: "Reduce the position and diversify",
        description: "Acknowledge the concentration risk and move funds into a broad index.",
        outcomes: [
          { id: "diversified", probability: 0.7, label: "Risk managed 🧺", financialDelta: -3000, quality: "good", feedback: "You took a loss on the stock, but moved the remainder into a diversified fund, protecting it from further single-company drops.", learning: "Rebalancing away from a concentrated loss is difficult, but it aligns your portfolio with stronger risk-management principles.", scoreImpact: { diversification: 4, learning: 3 } },
          { id: "sold_bottom", probability: 0.3, label: "Bad timing, good strategy 😬", financialDelta: -5000, quality: "neutral", feedback: "You diversified, and then the original stock rebounded. However, your new diversified portfolio also showed steady growth.", learning: "You cannot reliably time individual stock bottoms. Diversifying reduces future volatility, regardless of what the old stock does.", scoreImpact: { diversification: 3, learning: 2 } },
        ],
      },
    ],
  },
  {
    id: "cl_cost_averaging",
    category: "classic",
    headline: "Markets have been volatile. Should you pause your automated monthly investments?",
    description: "Your automated transfer is scheduled, but the financial news is predicting further drops.",
    emoji: "📅",
    options: [
      {
        id: "keep_investing",
        label: "Let the automation run",
        description: "Stick to your scheduled investment plan regardless of the headlines.",
        outcomes: [
          { id: "smart", probability: 0.7, label: "Consistent execution 💪", financialDelta: 1500, quality: "good", feedback: "You continued to buy during the volatility, acquiring more shares at lower prices.", learning: "Consistent investing (like dollar-cost averaging) helps remove emotion from the process and ensures you buy during market dips.", scoreImpact: { patience: 3, riskAlignment: 2, wealth: 2 } },
          { id: "slow_recovery", probability: 0.3, label: "Continued volatility", financialDelta: 500, quality: "neutral", feedback: "Markets remained flat for a while, but your consistent automated purchases kept your plan on track.", learning: "Automated investing doesn't guarantee immediate returns, but it prevents you from making emotional decisions based on short-term news.", scoreImpact: { patience: 2 } },
        ],
      },
      {
        id: "pause_investing",
        label: "Pause the automation",
        description: "Wait for the market to 'stabilize' before putting more money in.",
        outcomes: [
          { id: "missed", probability: 0.7, label: "Missed the rebound 😬", financialDelta: -500, quality: "bad", feedback: "You paused. The market stabilized and rebounded suddenly. You missed out on buying at the lows.", learning: "Pausing investments usually means you are attempting to time the market, which historical data suggests is highly ineffective for most investors.", scoreImpact: { patience: -2, learning: 2 } },
          { id: "timed_well", probability: 0.3, label: "Lucky timing 🍀", financialDelta: 0, quality: "neutral", feedback: "You paused, the market dropped further, and you manually bought back in later. You timed it well.", learning: "You successfully timed the market this instance, but relying on this as a repeatable strategy is statistically improbable.", scoreImpact: { patience: -1 } },
        ],
      },
    ],
  },
  {
    id: "cl_sell_in_may",
    category: "classic",
    headline: "Financial media repeats the adage: 'Sell in May and go away.'",
    description: "The old Wall Street phrase suggests selling stocks for the summer to avoid historical volatility.",
    emoji: "📅",
    options: [
      {
        id: "follow_adage",
        label: "Move to cash for the summer",
        description: "Try to sidestep potential seasonal sluggishness.",
        outcomes: [
          { id: "missed_gains", probability: 0.7, label: "Missed the summer rally 📉", financialDelta: -1200, quality: "bad", feedback: "Markets actually performed well over the summer. You missed the gains and incurred trading costs.", learning: "Historical data shows that missing just a few of the best trading days can severely impact long-term returns. 'Time in the market' is generally more reliable.", scoreImpact: { learning: -2, patience: -3 } },
          { id: "avoided_drop", probability: 0.3, label: "Avoided a summer slump 🍀", financialDelta: 500, quality: "neutral", feedback: "Markets did dip over the summer. You preserved some capital.", learning: "Even when a seasonal timing strategy works occasionally, you must then accurately predict when to buy back in to succeed long-term.", scoreImpact: { patience: -1 } }
        ]
      },
      {
        id: "stay_invested",
        label: "Ignore the adage, stay invested",
        description: "Maintain your long-term holding strategy.",
        outcomes: [
          { id: "stayed_course", probability: 1.0, label: "Stayed the course 💪", financialDelta: 0, quality: "good", feedback: "You ignored the calendar-based noise and kept your portfolio aligned with your long-term goals.", learning: "Over extended periods, staying fully invested usually outperforms trying to trade in and out based on seasonal market adages.", scoreImpact: { patience: 3, riskAlignment: 1 } }
        ]
      }
    ]
  },
  {
    id: "cl_stock_split",
    category: "classic",
    headline: "A popular company announces a 10-for-1 stock split.",
    description: "The share price will drop from PPF 1,000 to PPF 100. Some commentators say it's now a 'bargain'.",
    emoji: "🍕",
    options: [
      {
        id: "buy_the_split",
        label: "Buy because the price is 'lower'",
        description: "PPF 100 per share feels much more affordable.",
        outcomes: [
          { id: "illusion", probability: 1.0, label: "Price vs. Value 🤦", financialDelta: 0, quality: "bad", feedback: "You bought more based on the split. The company's total market value didn't change, only the number of shares.", learning: "A stock split changes the price per share but not the valuation of the company. A lower share price doesn't inherently make a stock 'cheaper'.", scoreImpact: { learning: -2 } }
        ]
      },
      {
        id: "ignore_split",
        label: "Base decisions on fundamentals, not splits",
        description: "Recognize that the split doesn't change the company's intrinsic value.",
        outcomes: [
          { id: "understood_math", probability: 1.0, label: "Understood the mechanics 🧠", financialDelta: 0, quality: "good", feedback: "You ignored the hype around the split. Your investment decisions remained driven by your overall strategy.", learning: "Understanding that stock splits are cosmetic (like slicing a pizza into more pieces) demonstrates solid financial literacy.", scoreImpact: { learning: 2, riskAlignment: 1 } }
        ]
      }
    ]
  },

  // ── FUNNY / ABSURD ──
  {
    id: "ab_ai_financial_advisor",
    category: "brainrot",
    headline: "You asked an AI chatbot to generate a personalized portfolio.",
    description: "It gave you a confident 47-step plan. Step 1 was 'believe in yourself.' Step 23 recommended a stock ticker that might not exist.",
    emoji: "🤖",
    options: [
      {
        id: "follow_ai_plan",
        label: "Follow the AI's exact plan",
        description: "It sounded authoritative. 47 steps must be thorough.",
        outcomes: [
          { id: "hallucinated", probability: 0.7, label: "AI hallucination 🤦", financialDelta: -1200, quality: "bad", feedback: "The AI hallucinated several financial products. You lost time and money trying to execute a nonsensical strategy.", learning: "Generative AI can sound extremely confident while producing factually incorrect financial information. Always verify.", scoreImpact: { learning: 3, riskAlignment: -2 } },
          { id: "generic_advice", probability: 0.3, label: "Generic but harmless 🤷", financialDelta: 0, quality: "neutral", feedback: "The advice ended up being very generic ('diversify and hold'). It didn't hurt, but it didn't account for your specific tax situation.", learning: "AI can summarize general principles, but it cannot currently take fiduciary responsibility for your personal financial nuances.", scoreImpact: { learning: 1 } },
        ],
      },
      {
        id: "use_real_advisor",
        label: "Consult a human professional",
        description: "Seek advice from someone who understands Swiss tax law and your personal context.",
        outcomes: [
          { id: "good_advice", probability: 0.8, label: "Contextual advice 💥", financialDelta: 0, quality: "good", feedback: "The professional provided advice tailored to your specific situation and local tax regulations.", learning: "Complex financial and tax planning often benefits from verified, professional human expertise.", scoreImpact: { riskAlignment: 2, learning: 2, wealth: 2 } },
          { id: "bad_advisor", probability: 0.2, label: "High-fee products 😬", financialDelta: -500, quality: "neutral", feedback: "The human advisor tried to push expensive, actively managed funds that didn't fit your needs.", learning: "Not all human advisors are equal. Ensure your advisor is a fiduciary acting in your best interest, rather than just selling products.", scoreImpact: { learning: 3 } },
        ],
      },
    ],
  },
  {
    id: "ab_coworker_startup",
    category: "social",
    headline: "A coworker wants you to invest PPF 10,000 in their startup.",
    description: "It's an app that delivers artisanal cheese via drone. The prototype recently crashed.",
    emoji: "🧀",
    tip: "Venture capital and angel investing carry extraordinarily high risks of total loss.",
    options: [
      {
        id: "invest_startup",
        label: "Invest the PPF 10,000",
        description: "You believe in the team (and the cheese).",
        outcomes: [
          { id: "failed", probability: 0.8, label: "Startup failed 💀", financialDelta: -10000, quality: "bad", feedback: "The startup ran out of funds. You lost your entire PPF 10,000 investment.", learning: "A significant percentage of early-stage startups fail. Such investments should generally only be made with capital you can afford to lose entirely.", scoreImpact: { wealth: -3, riskAlignment: -2 } },
          { id: "acquired", probability: 0.2, label: "Unexpected success 🎉", financialDelta: 25000, quality: "neutral", feedback: "A larger company bought the startup for its drone technology. You made a profit.", learning: "While angel investments occasionally pay off, the statistical probability is against you. Treat it as high-risk speculation.", scoreImpact: { riskAlignment: -1, wealth: 2 } },
        ],
      },
      {
        id: "decline_startup",
        label: "Decline politely",
        description: "You support them, but not with your retirement funds.",
        outcomes: [
          { id: "declined", probability: 1.0, label: "Capital preserved 🧠", financialDelta: 0, quality: "good", feedback: "You declined. The startup eventually folded. You preserved your capital.", learning: "Mixing friendship and high-risk investing can strain both your wallet and the relationship. Saying no is often the safest choice.", scoreImpact: { patience: 2, riskAlignment: 2 } },
        ],
      },
    ],
  },
  {
    id: "ab_lottery_ticket",
    category: "lucky",
    headline: "The lottery jackpot is huge. People are buying tickets.",
    description: "Your odds are roughly 1 in 30 million. Marco bought PPF 200 worth of tickets.",
    emoji: "🎰",
    options: [
      {
        id: "bought_tickets",
        label: "Buy PPF 50 in tickets",
        description: "It's fun to dream about winning.",
        outcomes: [
          { id: "won_nothing", probability: 0.9999, label: "Won nothing 🎟️", financialDelta: -50, quality: "bad", feedback: "You won nothing. The money is gone.", learning: "Lotteries have a negative expected return. They are a form of entertainment, not a component of a financial plan.", scoreImpact: { patience: -1 } },
          { id: "small_win", probability: 0.0001, label: "Won a little bit 🎉", financialDelta: 150, quality: "neutral", feedback: "You actually won a small amount. You are statistically incredibly lucky.", learning: "Winning small amounts in negative-expected-value games can unfortunately encourage further gambling behavior.", scoreImpact: { patience: -1, riskAlignment: -1 } },
        ],
      },
      {
        id: "invest_instead",
        label: "Invest the PPF 50 instead",
        description: "Put that money into your standard portfolio.",
        outcomes: [
          { id: "invested", probability: 1.0, label: "Guaranteed participation 📈", financialDelta: 50, quality: "good", feedback: "You invested the money. It's less exciting than a lottery draw, but far more reliable.", learning: "Redirecting 'entertainment' spending toward investments is a slow, steady way to build predictable wealth over time.", scoreImpact: { patience: 2, wealth: 1 } },
        ],
      },
    ],
  },
  {
    id: "mc_ai_religion",
    category: "memecoin",
    headline: "An autonomous AI agent launched a token.",
    description: "The AI 'TruthBot' created a coin, wrote a manifesto, and promises 'algorithmic wealth.'",
    emoji: "🤖",
    options: [
      {
        id: "buy_truth",
        label: "Buy the AI Token",
        description: "PPF 500. Maybe the AI knows something we don't.",
        outcomes: [
          { id: "ai_rug", probability: 0.85, label: "Algorithmic Drop 💀", financialDelta: -500, quality: "bad", feedback: "The AI executed a programmed mass sell-off. The token's value collapsed.", learning: "A speculative token managed by code is still a highly speculative asset. Novelty does not equal underlying economic value.", scoreImpact: { riskAlignment: -3, wealth: -1 } },
          { id: "ai_pump", probability: 0.15, label: "Trending Algorithm 🚀", financialDelta: 1500, quality: "neutral", feedback: "The token trended on social media and spiked in value before you sold.", learning: "You profited off short-term social media trends. This is momentum trading, not fundamental investing.", scoreImpact: { riskAlignment: -2 } }
        ]
      },
      {
        id: "ignore_ai",
        label: "Ignore it",
        description: "Focus on assets with actual revenues or utility.",
        outcomes: [
          { id: "peace", probability: 1.0, label: "Inner peace 🧘", financialDelta: 0, quality: "good", feedback: "You ignored the fad. The token collapsed a week later.", learning: "Not participating in every new internet trend protects your capital. Fundamentals remain a reliable metric.", scoreImpact: { learning: 2, patience: 2 } }
        ]
      }
    ]
  },
  {
    id: "br_cash_stuffing",
    category: "brainrot",
    headline: "You see the 'Cash Stuffing' trend online.",
    description: "People are taking cash out of the bank and putting it into physical binders labeled 'Groceries' and 'Rent' to control spending.",
    emoji: "💵",
    options: [
      {
        id: "try_stuffing",
        label: "Try physical cash stuffing",
        description: "Withdraw PPF 2,000 and use physical envelopes.",
        outcomes: [
          { id: "inflation_burn", probability: 0.9, label: "Inefficient storage 📉", financialDelta: -50, quality: "bad", feedback: "Your cash is uninvested and you occasionally forget the right envelope at home.", learning: "While physical cash can curb extreme overspending, it misses out on any interest and carries physical loss risks.", scoreImpact: { learning: -1 } },
          { id: "lost_binder", probability: 0.1, label: "Physical loss 😱", financialDelta: -2000, quality: "bad", feedback: "You misplaced your 'Rent' envelope. The cash is gone.", learning: "Storing large amounts of physical cash introduces significant risks of loss or theft compared to insured bank accounts.", scoreImpact: { wealth: -2, riskAlignment: -2 } }
        ]
      },
      {
        id: "digital_budget",
        label: "Use digital budgeting tools",
        description: "Set up separate digital 'spaces' or sub-accounts instead.",
        outcomes: [
          { id: "smart_budget", probability: 1.0, label: "Modern budgeting ✅", financialDelta: 0, quality: "good", feedback: "You organized your budget digitally, keeping your funds secure and earning potential interest.", learning: "Digital budgeting provides the organizational benefits of 'envelopes' while maintaining the security of the banking system.", scoreImpact: { learning: 2, patience: 1 } }
        ]
      }
    ]
  },

  // ── VERY SERIOUS / COMPLEX ──
  {
    id: "cx_sequence_risk",
    category: "retirement",
    headline: "You retire. Markets drop substantially in your first year.",
    description: "You are now drawing down your portfolio for income. Selling units during a severe drop can permanently damage your portfolio.",
    emoji: "⚠️",
    minAge: 63,
    tip: "Sequence-of-returns risk refers to the danger of experiencing negative market returns early in retirement.",
    options: [
      {
        id: "had_cash_buffer",
        label: "Rely on a pre-planned cash buffer",
        description: "Use the 2 years of living expenses you kept in cash.",
        outcomes: [
          { id: "survived", probability: 1.0, label: "Buffer utilized 🛡️", financialDelta: 0, quality: "good", feedback: "You lived off your cash buffer, allowing your investments time to potentially recover without forced selling.", learning: "Maintaining a liquid buffer in retirement helps protect against sequence-of-returns risk by preventing forced asset sales during market lows.", scoreImpact: { riskAlignment: 4, patience: 3 } },
        ],
      },
      {
        id: "no_cash_buffer",
        label: "Sell investments to fund lifestyle",
        description: "You are fully invested and must sell assets to pay your bills.",
        outcomes: [
          { id: "forced_selling", probability: 1.0, label: "Forced liquidation 📉", financialDelta: -60000, quality: "bad", feedback: "You sold assets at depressed prices. When the market recovers, you will have fewer units participating in the rebound.", learning: "Selling equities during a bear market to fund retirement living expenses is exactly how sequence-of-returns risk depletes portfolios.", scoreImpact: { riskAlignment: -4, wealth: -4 } },
        ],
      },
    ],
  },
  {
    id: "cx_tax_optimization",
    category: "classic",
    headline: "You realize you've missed valid tax deductions for years.",
    description: "Deductible professional expenses, continuing education, and certain donations were never claimed on your returns.",
    emoji: "🧾",
    options: [
      {
        id: "fix_going_forward",
        label: "Claim them going forward",
        description: "Ensure your future returns are optimized.",
        outcomes: [
          { id: "optimized", probability: 1.0, label: "Future optimization ✅", financialDelta: 2400, quality: "good", feedback: "You optimized your current return, effectively increasing your investable income.", learning: "Understanding and legally utilizing available tax deductions is a reliable way to improve your overall financial efficiency.", scoreImpact: { learning: 3, wealth: 2 } },
        ],
      },
      {
        id: "amend_returns",
        label: "Attempt to amend past returns",
        description: "Check if you are within the legal window to correct past mistakes.",
        outcomes: [
          { id: "refund", probability: 0.8, label: "Retroactive correction 💰", financialDelta: 12000, quality: "good", feedback: "You were within the statutory window, amended the returns, and received a refund.", learning: "Tax systems often allow a window for corrections. Periodically reviewing past financial submissions can sometimes yield positive results.", scoreImpact: { learning: 4, wealth: 3 } },
          { id: "partial_refund", probability: 0.2, label: "Past the deadline 📋", financialDelta: 0, quality: "neutral", feedback: "The older returns were outside the legal amendment window. You couldn't claim the past deductions.", learning: "Tax amendment windows are strictly enforced. Promptness in financial administration is necessary.", scoreImpact: { learning: 3, wealth: 2 } },
        ],
      },
    ],
  },
  {
    id: "cx_pillar2_decision",
    category: "retirement",
    headline: "You leave your employer. What happens to your 2nd pillar (BVG)?",
    description: "You have accumulated funds in your pension. You must decide where to transfer them.",
    emoji: "🏦",
    minAge: 30,
    maxAge: 60,
    tip: "Transferring to a vested benefits account (Freizügigkeitskonto) preserves the tax-advantaged status of these funds.",
    options: [
      {
        id: "transfer_vested",
        label: "Transfer to a vested benefits account",
        description: "Move the funds to a standard holding account.",
        outcomes: [
          { id: "smart", probability: 1.0, label: "Preserved status ✅", financialDelta: 0, quality: "good", feedback: "You securely transferred the funds, maintaining their tax-advantaged status for your retirement.", learning: "Using a vested benefits account ensures your 2nd pillar funds remain properly structured within the Swiss pension system.", scoreImpact: { riskAlignment: 3, learning: 2 } },
        ],
      },
      {
        id: "cash_out",
        label: "Attempt to cash it out",
        description: "Try to take the cash now for immediate use.",
        outcomes: [
          { id: "taxed_heavily", probability: 1.0, label: "Heavy restrictions 💸", financialDelta: -25000, quality: "bad", feedback: "Unless meeting specific legal criteria (e.g., leaving Switzerland permanently), early withdrawal carries heavy tax penalties and depletes retirement security.", learning: "Cashing out pension funds early usually incurs significant tax hits and undermines long-term compounding.", scoreImpact: { wealth: -4, learning: 4 } },
        ],
      },
      {
        id: "invest_vested_well",
        label: "Transfer to a vested account with investment options",
        description: "Choose a provider that allows you to invest the pension funds in securities.",
        outcomes: [
          { id: "invested_well", probability: 0.8, label: "Market participation 📈", financialDelta: 0, quality: "good", feedback: "You opted to invest the funds, potentially seeking higher returns than the statutory minimum interest rate over the long term.", learning: "Investing vested benefits can increase potential long-term returns, provided you understand and accept the associated market risks.", scoreImpact: { riskAlignment: 2, learning: 3, wealth: 2 } },
          { id: "market_risk", probability: 0.2, label: "Experienced volatility 😅", financialDelta: -5000, quality: "neutral", feedback: "The invested pension funds fluctuated with the market, showing a paper loss in the short term.", learning: "Opting to invest pension funds introduces volatility. You must have the time horizon to ride out market cycles.", scoreImpact: { patience: 2 } },
        ],
      },
    ],
  },
  {
    id: "cx_concentrated_stock",
    category: "classic",
    headline: "A large portion of your net worth is tied up in your employer's stock.",
    description: "You receive stock options as compensation, creating significant concentration risk.",
    emoji: "🏢",
    minAge: 35,
    maxAge: 60,
    tip: "Holding too much employer stock links both your income and your savings to the fate of a single company.",
    options: [
      {
        id: "diversify_stock",
        label: "Gradually sell and diversify",
        description: "Reduce the single-stock exposure and invest in broader funds.",
        outcomes: [
          { id: "diversified", probability: 0.7, label: "Reduced exposure 🧺", financialDelta: 40000, quality: "good", feedback: "You sold portions of the stock to buy diversified index funds, lowering your overall portfolio risk.", learning: "Diversifying away from employer stock prevents your net worth and your salary from being vulnerable to the exact same corporate risks.", scoreImpact: { diversification: 4, riskAlignment: 3 } },
          { id: "stock_rose", probability: 0.3, label: "Missed specific gains 📈", financialDelta: 50000, quality: "neutral", feedback: "You diversified, and then your employer's stock performed exceptionally well.", learning: "Risk management (like diversification) sometimes means missing out on concentrated gains. Its purpose is protecting against severe losses.", scoreImpact: { diversification: 3, riskAlignment: 2 } },
        ],
      },
      {
        id: "hold_stock",
        label: "Hold the concentrated position",
        description: "You believe the company will continue to outperform the market.",
        outcomes: [
          { id: "company_crashed", probability: 0.5, label: "Double impact 💀", financialDelta: -50000, quality: "bad", feedback: "The company struggled. The stock dropped, and bonuses were cut, hitting your finances twice.", learning: "Concentration risk is amplified when it's your employer. If the company fails, you risk losing your savings and your income simultaneously.", scoreImpact: { diversification: -3, wealth: -4, riskAlignment: -3 } },
          { id: "company_rose", probability: 0.5, label: "Concentrated success 🚀", financialDelta: 30000, quality: "neutral", feedback: "The stock performed very well, significantly boosting your portfolio.", learning: "Concentrated positions can generate high returns, but they carry outsized risk. It remains a speculative approach.", scoreImpact: { riskAlignment: -2, diversification: -2 } },
        ],
      },
    ],
  },
  {
    id: "ma_snb_negative_rates",
    category: "macro",
    headline: "Central banks implement negative interest rates.",
    description: "Your bank begins charging you a fee to hold large cash balances.",
    emoji: "🏦",
    tip: "Negative rates are a monetary policy tool designed to discourage holding cash and encourage spending or investing.",
    options: [
      {
        id: "move_to_investments",
        label: "Re-evaluate cash holdings",
        description: "Consider moving excess cash into diversified asset classes.",
        outcomes: [
          { id: "smart_move", probability: 0.75, label: "Adapted to policy", financialDelta: 2000, quality: "good", feedback: "You shifted excess cash into assets that had the potential to yield positive returns.", learning: "Negative rates penalize holding cash. They historically push investors to seek alternatives in equities, bonds, or real estate.", scoreImpact: { riskAlignment: 2, learning: 2, wealth: 2 } },
          { id: "market_dip", probability: 0.25, label: "Exposed to volatility", financialDelta: -500, quality: "neutral", feedback: "You invested the cash, but market volatility caused a short-term drop in value.", learning: "Moving out of cash avoids negative rate fees but introduces market risk. Asset allocation must still align with your timeline.", scoreImpact: { patience: 1 } },
        ],
      },
      {
        id: "stay_in_cash",
        label: "Accept the fees and stay in cash",
        description: "You prefer the stability of cash, even if it carries a known cost.",
        outcomes: [
          { id: "paid_fees", probability: 1.0, label: "Guaranteed loss", financialDelta: -375, quality: "bad", feedback: "You paid fees simply to hold your money in the account.", learning: "Accepting negative rates means accepting a guaranteed nominal loss on your capital, in addition to inflation impacts.", scoreImpact: { learning: 2, wealth: -1 } },
        ],
      },
    ],
  },
];

// ════════════════════════════════════════════════════════════════════════════════════════════════════

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

// ════════════════════════════════════════════════════════════════════════════════════════════════════
// ASSET TIPS
// ════════════════════════════════════════════════════════════════════════════════════════════════════

export const EXTENDED_ASSET_TIPS: Record<string, { name: string; risk: string; description: string }> = {
  etf:     { name: "Global ETF",    risk: "Medium",    description: "Diversified exposure to global equities. Often acts as the backbone of a long-term portfolio." },
  bonds:   { name: "Bonds",         risk: "Low",       description: "Fixed-income securities. Generally offer more stable returns and lower volatility than equities." },
  stocks:  { name: "Stocks",        risk: "High",      description: "Individual equities. Carry higher potential returns but significantly higher single-asset volatility." },
  gold:    { name: "Gold",          risk: "Medium",    description: "Historically viewed as an inflation hedge and safe haven, though it produces no yield." },
  reits:   { name: "REITs",         risk: "Medium",    description: "Real estate investment trusts. Offer property exposure and dividends without physical property management." },
  cash:    { name: "Cash / 3A",     risk: "Very Low",  description: "Savings accounts. High nominal safety, but vulnerable to losing real purchasing power during inflation." },
};

// ════════════════════════════════════════════════════════════════════════════════════════════════════
// UTILITIES
// ════════════════════════════════════════════════════════════════════════════════════════════════════

export function resolveOutcome(option: PlayerOption, random: number) {
  // Use strict < so that random=0.0 correctly hits the first bucket,
  // and floating-point rounding can't skip the last outcome.
  let cumulative = 0;
  for (let i = 0; i < option.outcomes.length - 1; i++) {
    cumulative += option.outcomes[i].probability;
    if (random < cumulative) return option.outcomes[i];
  }
  // Always return the last outcome as the guaranteed fallback
  return option.outcomes[option.outcomes.length - 1];
}

// Fisher-Yates shuffle — unbiased, unlike sort(() => Math.random() - 0.5)
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function drawCards(round: ChaosRound, recentCardIds: string[] = []): ChaosCard[] {
  const eligible = CHAOS_CARDS.filter((c) => {
    if (c.minAge !== undefined && round.age < c.minAge) return false;
    if (c.maxAge !== undefined && round.age > c.maxAge) return false;
    return true;
  });

  // Forced cards first
  const forced: ChaosCard[] = [];
  if (round.forcedCardIds) {
    for (const id of round.forcedCardIds) {
      const card = CHAOS_CARDS.find((c) => c.id === id);
      if (card) forced.push(card);
    }
  }

  const forcedIds = new Set(forced.map((c) => c.id));

  // Prefer cards not seen recently; fall back to all eligible if pool is too small
  const notRecent = eligible.filter((c) => !forcedIds.has(c.id) && !recentCardIds.includes(c.id));
  const fallback  = eligible.filter((c) => !forcedIds.has(c.id) && !notRecent.includes(c));
  const needed    = Math.max(0, round.cardCount - forced.length);

  let pool = shuffle(notRecent);
  if (pool.length < needed) {
    pool = [...pool, ...shuffle(fallback)];
  }

  return [...forced, ...pool.slice(0, needed)];
}

export function getCard(id: string): ChaosCard | undefined {
  return CHAOS_CARDS.find((c) => c.id === id);
}

// ════════════════════════════════════════════════════════════════════════════════════════════════════
// RETIREMENT SCORE CALCULATOR
// ════════════════════════════════════════════════════════════════════════════════════════════════════

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
    S: "Exceptional. You navigated 35 years of financial chaos with discipline, patience, and robust risk management. Your retirement is secure and your portfolio is a testament to solid fundamental habits.",
    A: "Great work. You made smart decisions most of the time, built a solid portfolio, and arrived at retirement in a strong position. A few minor course corrections were handled well.",
    B: "Good. You got the fundamentals right — diversification, patience, avoiding the worst traps. There were some stumbles, but your overall trajectory remained positive.",
    C: "Okay. You made it to retirement, but some speculative or emotional decisions along the way cost you. The historical lessons are clear: manage risk and stay the course.",
    D: "Needs work. The noise got to you. Speculative bets, panic selling, and lifestyle creep added up. The good news: you now have a clear understanding of the risks to avoid in the real world.",
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