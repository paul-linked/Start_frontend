"use client";

import { motion } from "framer-motion";
import { useGame, calculateProfile } from "@/lib/GameContext";
import SpiderChart from "@/components/game/SpiderChart";
import type { SpiderAxis } from "@/components/game/SpiderChart";

const fadeUp = {
  hidden: { opacity: 0, y: 14 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.2 + i * 0.12, duration: 0.5, ease: "easeOut" },
  }),
};

const SCORE_MAP: { key: string; label: string }[] = [
  { key: "patience", label: "Composure" },
  { key: "learning", label: "Due Diligence" },
  { key: "riskAlignment", label: "Discipline" },
  { key: "diversification", label: "Diversification" },
  { key: "wealth", label: "Returns" },
];

// ─── Personality Matrix ───
function PersonalityMatrix({ x, y }: { x: number; y: number }) {
  const size = 220;
  const pad = 28;
  const inner = size - pad * 2;
  const cx = pad + ((x + 1) / 2) * inner;
  const cy = pad + ((1 - (y + 1) / 2)) * inner;

  return (
    <svg viewBox={`0 0 ${size} ${size}`} width="100%">
      <rect x={pad} y={pad} width={inner / 2} height={inner / 2} fill="var(--coral-wash)" opacity="0.4" rx="2" />
      <rect x={pad + inner / 2} y={pad} width={inner / 2} height={inner / 2} fill="rgba(15,74,88,0.05)" rx="2" />
      <rect x={pad} y={pad + inner / 2} width={inner / 2} height={inner / 2} fill="rgba(254,203,3,0.08)" rx="2" />
      <rect x={pad + inner / 2} y={pad + inner / 2} width={inner / 2} height={inner / 2} fill="var(--green-wash)" opacity="0.4" rx="2" />

      <line x1={pad} y1={pad + inner / 2} x2={pad + inner} y2={pad + inner / 2} stroke="var(--rule)" strokeWidth="0.5" />
      <line x1={pad + inner / 2} y1={pad} x2={pad + inner / 2} y2={pad + inner} stroke="var(--rule)" strokeWidth="0.5" />
      <rect x={pad} y={pad} width={inner} height={inner} fill="none" stroke="var(--rule)" strokeWidth="0.5" />

      {[
        { label: "THRILL\nSEEKER", x: pad + inner * 0.25, y: pad + inner * 0.25 },
        { label: "CALCULATED\nRISK-TAKER", x: pad + inner * 0.75, y: pad + inner * 0.25 },
        { label: "CAUTIOUS\nOBSERVER", x: pad + inner * 0.25, y: pad + inner * 0.75 },
        { label: "STEADY\nHAND", x: pad + inner * 0.75, y: pad + inner * 0.75 },
      ].map((q, i) => (
        <text key={i} x={q.x} y={q.y} textAnchor="middle" dominantBaseline="middle"
          style={{ fontSize: 7, fontFamily: "var(--font-mono)", fill: "var(--ink-4)", letterSpacing: "0.06em" }}>
          {q.label.split("\n").map((line, j) => (
            <tspan key={j} x={q.x} dy={j === 0 ? 0 : 10}>{line}</tspan>
          ))}
        </text>
      ))}

      <text x={pad - 3} y={pad + inner / 2} textAnchor="end" dominantBaseline="middle"
        style={{ fontSize: 6, fontFamily: "var(--font-mono)", fill: "var(--ink-5)", letterSpacing: "0.08em" }}>REACTIVE</text>
      <text x={pad + inner + 3} y={pad + inner / 2} textAnchor="start" dominantBaseline="middle"
        style={{ fontSize: 6, fontFamily: "var(--font-mono)", fill: "var(--ink-5)", letterSpacing: "0.08em" }}>RATIONAL</text>
      <text x={pad + inner / 2} y={pad - 6} textAnchor="middle"
        style={{ fontSize: 6, fontFamily: "var(--font-mono)", fill: "var(--ink-5)", letterSpacing: "0.08em" }}>AGGRESSIVE</text>
      <text x={pad + inner / 2} y={pad + inner + 10} textAnchor="middle"
        style={{ fontSize: 6, fontFamily: "var(--font-mono)", fill: "var(--ink-5)", letterSpacing: "0.08em" }}>CONSERVATIVE</text>

      <circle cx={cx} cy={cy} r="12" fill="#fecb03" opacity="0.15">
        <animate attributeName="r" values="12;16;12" dur="2s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.15;0.06;0.15" dur="2s" repeatCount="indefinite" />
      </circle>
      <circle cx={cx} cy={cy} r="5" fill="#fecb03" stroke="#FFF9E5" strokeWidth="2" />
    </svg>
  );
}

// ─── Journey Chart ───
function JourneyChart({ player, savings }: { player: number[]; savings: number[] }) {
  const all = [...player, ...savings.slice(0, player.length)];
  const min = Math.min(...all) * 0.9;
  const max = Math.max(...all) * 1.05;
  const range = max - min || 1;
  const w = 300;
  const h = 80;
  const pad = 4;

  function toPoints(data: number[]): string {
    return data.map((val, i) => {
      const x = pad + (i / Math.max(data.length - 1, 1)) * (w - pad * 2);
      const y = pad + (1 - (val - min) / range) * (h - pad * 2);
      return `${x},${y}`;
    }).join(" ");
  }

  const pp = toPoints(player);
  const sp = toPoints(savings.slice(0, player.length));

  return (
    <svg viewBox={`0 0 ${w} ${h + 14}`} width="100%">
      <polygon points={`${pad},${h - pad} ${pp} ${pad + ((player.length - 1) / Math.max(player.length - 1, 1)) * (w - pad * 2)},${h - pad}`}
        fill="#0f4a58" opacity="0.05" />
      <polyline points={sp} fill="none" stroke="var(--ink-5)" strokeWidth="1" strokeDasharray="3 3" opacity="0.5" />
      <polyline points={pp} fill="none" stroke="#0f4a58" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      {player.map((val, i) => {
        const x = pad + (i / Math.max(player.length - 1, 1)) * (w - pad * 2);
        const y = pad + (1 - (val - min) / range) * (h - pad * 2);
        return <circle key={i} cx={x} cy={y} r={i === player.length - 1 ? 3.5 : 2}
          fill={i === player.length - 1 ? "#0f4a58" : "#FFF9E5"} stroke="#0f4a58" strokeWidth={1.5} />;
      })}
      {player.map((_, i) => {
        const x = pad + (i / Math.max(player.length - 1, 1)) * (w - pad * 2);
        return <text key={i} x={x} y={h + 10} textAnchor="middle"
          style={{ fontSize: 7, fontFamily: "var(--font-mono)", fill: "var(--ink-5)" }}>
          {i === 0 ? "Start" : `Y${i}`}
        </text>;
      })}
    </svg>
  );
}

// ─── Main ───
export default function EndScreen() {
  const { state } = useGame();
  const profile = calculateProfile(state);
  const savingsFinal = state.savingsHistory[Math.min(state.savingsHistory.length - 1, state.portfolioHistory.length - 1)] ?? state.totalDeposited;
  const isDemo = !state.freePlay;

  const spiderAxes: SpiderAxis[] = SCORE_MAP.map(({ key, label }) => ({
    label,
    value: Math.round(state.scores[key as keyof typeof state.scores] ?? 50),
  }));

  return (
    <div className="px-5 pb-10 pt-8">
      {/* Kicker */}
      <motion.div className="text-center" variants={fadeUp} initial="hidden" animate="visible" custom={0}>
        <span style={{
          fontFamily: "var(--font-mono)", fontSize: 9,
          textTransform: "uppercase", letterSpacing: "0.16em", color: "var(--ink-4)",
        }}>
          {isDemo ? "Your Investor Profile" : `Year ${state.currentRound} · Checkpoint`}
        </span>
      </motion.div>

      {/* Title */}
      <motion.h1 className="text-center mt-3" style={{
        fontFamily: "var(--font-display)", fontSize: 28, fontWeight: 400,
        fontStyle: "italic", color: "var(--ink)", lineHeight: 1.15,
      }} variants={fadeUp} initial="hidden" animate="visible" custom={1}>
        {profile.title}
      </motion.h1>

      {/* Subtitle */}
      <motion.p className="text-center mt-2 mx-auto" style={{
        fontSize: 14, fontWeight: 300, color: "var(--ink-3)",
        maxWidth: 300, lineHeight: 1.6,
      }} variants={fadeUp} initial="hidden" animate="visible" custom={2}>
        {profile.subtitle}
      </motion.p>

      {/* Spider Chart */}
      <motion.div className="flex justify-center mt-6" variants={fadeUp} initial="hidden" animate="visible" custom={3}>
        <SpiderChart axes={spiderAxes} size={270} animationDelay={0.6} />
      </motion.div>

      {/* Divider */}
      <motion.div className="mx-auto my-5" style={{ width: 24, height: 1, background: "var(--rule-heavy)" }}
        variants={fadeUp} initial="hidden" animate="visible" custom={4} />

      {/* Wealth */}
      <motion.div className="text-center" variants={fadeUp} initial="hidden" animate="visible" custom={5}>
        <div style={{ fontFamily: "var(--font-display)", fontSize: 28, color: "var(--ink)" }}>
          PPF {state.portfolioValue.toFixed(2)}
        </div>
        <div className="mt-1" style={{
          fontFamily: "var(--font-mono)", fontSize: 11,
          color: profile.totalReturnPct >= 0 ? "#0f4a58" : "var(--coral)",
        }}>
          {profile.totalReturnPct >= 0 ? "+" : ""}{profile.totalReturnPct.toFixed(1)}% total return
        </div>
      </motion.div>

      {/* Comparison */}
      <motion.div className="mt-4" style={{
        padding: "14px 16px", background: "var(--surface-dim)",
        border: "1px solid var(--rule-light)", borderRadius: "var(--radius-sm)",
      }} variants={fadeUp} initial="hidden" animate="visible" custom={6}>
        <div className="text-center mb-2" style={{
          fontFamily: "var(--font-mono)", fontSize: 9,
          textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--ink-4)",
        }}>
          Same deposits · different outcomes
        </div>
        <div className="flex justify-center gap-6">
          <div className="text-center">
            <div style={{ fontSize: 14, fontWeight: 500, color: "#0f4a58" }}>
              PPF {state.portfolioValue.toFixed(0)}
            </div>
            <div style={{ fontSize: 10, color: "var(--ink-4)" }}>Your portfolio</div>
          </div>
          <div style={{ width: 1, background: "var(--rule)" }} />
          <div className="text-center">
            <div style={{ fontSize: 14, fontWeight: 500, color: "var(--ink-4)" }}>
              PPF {savingsFinal.toFixed(0)}
            </div>
            <div style={{ fontSize: 10, color: "var(--ink-4)" }}>Savings only</div>
          </div>
        </div>
      </motion.div>

      {/* Journey Chart */}
      <motion.div className="mt-5" variants={fadeUp} initial="hidden" animate="visible" custom={7}>
        <div className="flex items-center justify-between mb-2 px-1">
          <span style={{
            fontFamily: "var(--font-mono)", fontSize: 9,
            textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--ink-4)",
          }}>Your PPF 50 Journey</span>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1" style={{ fontSize: 9, fontFamily: "var(--font-mono)", color: "var(--ink-5)" }}>
              <span style={{ width: 10, height: 2, background: "#0f4a58", display: "inline-block", borderRadius: 1 }} /> You
            </span>
            <span className="flex items-center gap-1" style={{ fontSize: 9, fontFamily: "var(--font-mono)", color: "var(--ink-5)" }}>
              <span style={{ width: 10, height: 1, background: "var(--ink-5)", display: "inline-block", borderRadius: 1, opacity: 0.5 }} /> Savings
            </span>
          </div>
        </div>
        <div style={{
          border: "1px solid var(--rule-light)", borderRadius: "var(--radius-sm)",
          padding: "14px 12px 8px", background: "var(--surface-dim)",
        }}>
          <JourneyChart player={state.portfolioHistory} savings={state.savingsHistory} />
        </div>
      </motion.div>

      {/* Personality Matrix */}
      <motion.div className="mt-6" variants={fadeUp} initial="hidden" animate="visible" custom={8}>
        <div className="text-center mb-2">
          <span style={{
            fontFamily: "var(--font-mono)", fontSize: 9,
            textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--ink-4)",
          }}>Investment Personality</span>
        </div>
        <div className="mx-auto" style={{ maxWidth: 220 }}>
          <PersonalityMatrix x={profile.rationalScore} y={profile.aggressiveScore} />
        </div>
      </motion.div>

      {/* ── Actions ── */}
      <motion.div className="mt-8" variants={fadeUp} initial="hidden" animate="visible" custom={9}>
        {/* Continue to The Long Game */}
        <button
          className="w-full cursor-pointer active:scale-[0.97] transition-transform"
          style={{
            background: "var(--ink)", color: "var(--bg)",
            border: "none", borderRadius: "var(--radius-sm)",
            padding: "14px 24px", fontSize: 14, fontWeight: 500,
            fontFamily: "var(--font-body)",
          }}
          onClick={() => {
            const cb = (window as unknown as Record<string, unknown>).__extendedGameContinue as ((p: number) => void) | undefined;
            if (cb) cb(state.portfolioValue);
          }}
        >
          The Long Game →
        </button>

        {/* PostFinance CTA */}
        <button
          className="w-full mt-2.5 cursor-pointer active:scale-[0.97] transition-transform"
          style={{
            background: "#fecb03", color: "var(--ink)",
            border: "none", borderRadius: "var(--radius-sm)",
            padding: "14px 24px", fontSize: 14, fontWeight: 500,
            fontFamily: "var(--font-body)",
          }}
          onClick={() => window.open("https://www.postfinance.ch/en/about-us/commitment/education/popcorn--finance--the-podcast-from-postfinance.html", "_blank")}
        >
          Popcorn & Finance by PostFinance
        </button>

        {/* Play Again */}
        <div className="text-center mt-3">
          <button className="cursor-pointer" style={{
            background: "none", border: "none", color: "var(--ink-3)",
            fontSize: 13, fontFamily: "var(--font-body)",
            textDecoration: "underline", textUnderlineOffset: 3,
            textDecorationColor: "var(--rule)", cursor: "pointer",
          }} onClick={() => window.location.reload()}>
            Start Over
          </button>
        </div>
      </motion.div>

      {/* Footer */}
      <motion.div className="text-center mt-8" style={{
        fontFamily: "var(--font-mono)", fontSize: 8,
        letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--ink-5)",
      }} variants={fadeUp} initial="hidden" animate="visible" custom={10}>
        Wealth Manager Arena · PostFinance × START Hackathon 2026
      </motion.div>
    </div>
  );
}