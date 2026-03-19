"use client";

import { motion } from "framer-motion";
import { useGame, calculateProfile } from "@/lib/GameContext";

const fadeUp = {
  hidden: { opacity: 0, y: 14 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.2 + i * 0.1, duration: 0.5, ease: "easeOut" },
  }),
};

const SCORE_LABELS: Record<string, string> = {
  diversification: "Diversify",
  riskAlignment: "Risk",
  patience: "Patience",
  learning: "Learning",
  wealth: "Wealth",
};

function PersonalityMatrix({
  x,
  y,
}: {
  x: number; // -1 to 1 (reactive to rational)
  y: number; // -1 to 1 (conservative to aggressive)
}) {
  const size = 280;
  const pad = 32;
  const inner = size - pad * 2;
  const cx = pad + ((x + 1) / 2) * inner;
  const cy = pad + ((1 - (y + 1) / 2)) * inner; // flip Y

  return (
    <svg viewBox={`0 0 ${size} ${size}`} width="100%">
      {/* Background quadrants */}
      <rect x={pad} y={pad} width={inner / 2} height={inner / 2} fill="var(--coral-wash)" opacity="0.5" />
      <rect x={pad + inner / 2} y={pad} width={inner / 2} height={inner / 2} fill="var(--green-wash)" opacity="0.5" />
      <rect x={pad} y={pad + inner / 2} width={inner / 2} height={inner / 2} fill="var(--gold-wash)" opacity="0.4" />
      <rect x={pad + inner / 2} y={pad + inner / 2} width={inner / 2} height={inner / 2} fill="var(--surface-dim)" opacity="0.6" />

      {/* Grid lines */}
      <line x1={pad} y1={pad + inner / 2} x2={pad + inner} y2={pad + inner / 2} stroke="var(--rule)" strokeWidth="1" />
      <line x1={pad + inner / 2} y1={pad} x2={pad + inner / 2} y2={pad + inner} stroke="var(--rule)" strokeWidth="1" />

      {/* Border */}
      <rect x={pad} y={pad} width={inner} height={inner} fill="none" stroke="var(--rule)" strokeWidth="1" />

      {/* Quadrant labels */}
      <text x={pad + inner * 0.25} y={pad + inner * 0.25} textAnchor="middle" dominantBaseline="middle" style={{ fontSize: 8, fontFamily: "var(--font-mono)", fill: "var(--ink-4)", letterSpacing: "0.06em" }}>
        THRILL
      </text>
      <text x={pad + inner * 0.25} y={pad + inner * 0.25 + 11} textAnchor="middle" dominantBaseline="middle" style={{ fontSize: 8, fontFamily: "var(--font-mono)", fill: "var(--ink-4)", letterSpacing: "0.06em" }}>
        SEEKER
      </text>

      <text x={pad + inner * 0.75} y={pad + inner * 0.25} textAnchor="middle" dominantBaseline="middle" style={{ fontSize: 8, fontFamily: "var(--font-mono)", fill: "var(--ink-4)", letterSpacing: "0.06em" }}>
        CALCULATED
      </text>
      <text x={pad + inner * 0.75} y={pad + inner * 0.25 + 11} textAnchor="middle" dominantBaseline="middle" style={{ fontSize: 8, fontFamily: "var(--font-mono)", fill: "var(--ink-4)", letterSpacing: "0.06em" }}>
        RISK-TAKER
      </text>

      <text x={pad + inner * 0.25} y={pad + inner * 0.75} textAnchor="middle" dominantBaseline="middle" style={{ fontSize: 8, fontFamily: "var(--font-mono)", fill: "var(--ink-4)", letterSpacing: "0.06em" }}>
        CAUTIOUS
      </text>
      <text x={pad + inner * 0.25} y={pad + inner * 0.75 + 11} textAnchor="middle" dominantBaseline="middle" style={{ fontSize: 8, fontFamily: "var(--font-mono)", fill: "var(--ink-4)", letterSpacing: "0.06em" }}>
        OBSERVER
      </text>

      <text x={pad + inner * 0.75} y={pad + inner * 0.75} textAnchor="middle" dominantBaseline="middle" style={{ fontSize: 8, fontFamily: "var(--font-mono)", fill: "var(--ink-4)", letterSpacing: "0.06em" }}>
        STEADY
      </text>
      <text x={pad + inner * 0.75} y={pad + inner * 0.75 + 11} textAnchor="middle" dominantBaseline="middle" style={{ fontSize: 8, fontFamily: "var(--font-mono)", fill: "var(--ink-4)", letterSpacing: "0.06em" }}>
        HAND
      </text>

      {/* Axis labels */}
      <text x={pad - 2} y={pad + inner / 2} textAnchor="end" dominantBaseline="middle" style={{ fontSize: 7, fontFamily: "var(--font-mono)", fill: "var(--ink-5)", letterSpacing: "0.08em" }}>
        REACTIVE
      </text>
      <text x={pad + inner + 2} y={pad + inner / 2} textAnchor="start" dominantBaseline="middle" style={{ fontSize: 7, fontFamily: "var(--font-mono)", fill: "var(--ink-5)", letterSpacing: "0.08em" }}>
        RATIONAL
      </text>
      <text x={pad + inner / 2} y={pad - 6} textAnchor="middle" style={{ fontSize: 7, fontFamily: "var(--font-mono)", fill: "var(--ink-5)", letterSpacing: "0.08em" }}>
        AGGRESSIVE
      </text>
      <text x={pad + inner / 2} y={pad + inner + 12} textAnchor="middle" style={{ fontSize: 7, fontFamily: "var(--font-mono)", fill: "var(--ink-5)", letterSpacing: "0.08em" }}>
        CONSERVATIVE
      </text>

      {/* Player dot — with pulse ring */}
      <circle cx={cx} cy={cy} r="14" fill="var(--gold)" opacity="0.15">
        <animate attributeName="r" values="14;18;14" dur="2s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.15;0.05;0.15" dur="2s" repeatCount="indefinite" />
      </circle>
      <circle cx={cx} cy={cy} r="6" fill="var(--gold)" stroke="var(--bg)" strokeWidth="2" />
    </svg>
  );
}

export default function EndScreen() {
  const { state } = useGame();
  const profile = calculateProfile(state);
  const savingsFinal = state.savingsHistory[state.savingsHistory.length - 1] ?? state.totalDeposited;

  return (
    <div className="px-5 pb-10 pt-8">
      {/* Kicker */}
      <motion.div
        className="text-center"
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        custom={0}
      >
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 9,
            textTransform: "uppercase",
            letterSpacing: "0.16em",
            color: "var(--ink-4)",
          }}
        >
          Your Investor Profile
        </span>
      </motion.div>

      {/* Title */}
      <motion.h1
        className="text-center mt-3"
        style={{
          fontFamily: "var(--font-display)",
          fontSize: 28,
          fontWeight: 400,
          fontStyle: "italic",
          color: "var(--ink)",
          lineHeight: 1.15,
        }}
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        custom={1}
      >
        {profile.title}
      </motion.h1>

      {/* Subtitle */}
      <motion.p
        className="text-center mt-2 mx-auto"
        style={{
          fontSize: 14,
          fontWeight: 300,
          color: "var(--ink-3)",
          maxWidth: 300,
          lineHeight: 1.6,
        }}
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        custom={2}
      >
        {profile.subtitle}
      </motion.p>

      {/* Personality matrix */}
      <motion.div
        className="mt-6 mx-auto"
        style={{ maxWidth: 280 }}
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        custom={3}
      >
        <PersonalityMatrix
          x={profile.rationalScore}
          y={profile.aggressiveScore}
        />
      </motion.div>

      {/* Divider */}
      <motion.div
        className="mx-auto my-5"
        style={{ width: 24, height: 1, background: "var(--rule-heavy)" }}
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        custom={4}
      />

      {/* Wealth result */}
      <motion.div
        className="text-center"
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        custom={5}
      >
        <div
          style={{
            fontFamily: "var(--font-display)",
            fontSize: 30,
            color: "var(--ink)",
          }}
        >
          CHF {state.portfolioValue.toFixed(2)}
        </div>
        <div
          className="mt-1"
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 11,
            color:
              profile.totalReturnPct >= 0
                ? "var(--green-muted)"
                : "var(--coral)",
          }}
        >
          {profile.totalReturnPct >= 0 ? "+" : ""}
          {profile.totalReturnPct.toFixed(1)}% total return
        </div>
      </motion.div>

      {/* Comparison */}
      <motion.div
        className="mt-4 text-center"
        style={{
          padding: "12px 16px",
          background: "var(--surface-dim)",
          border: "1px solid var(--rule-light)",
          borderRadius: "var(--radius-sm)",
        }}
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        custom={6}
      >
        <div
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 10,
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            color: "var(--ink-4)",
            marginBottom: 6,
          }}
        >
          Same deposits, different outcomes
        </div>
        <div className="flex justify-center gap-6">
          <div>
            <div style={{ fontSize: 13, fontWeight: 500, color: "var(--green)" }}>
              CHF {state.portfolioValue.toFixed(0)}
            </div>
            <div style={{ fontSize: 10, color: "var(--ink-4)" }}>Your portfolio</div>
          </div>
          <div style={{ width: 1, background: "var(--rule)" }} />
          <div>
            <div style={{ fontSize: 13, fontWeight: 500, color: "var(--ink-4)" }}>
              CHF {savingsFinal.toFixed(0)}
            </div>
            <div style={{ fontSize: 10, color: "var(--ink-4)" }}>Savings only</div>
          </div>
        </div>
      </motion.div>

      {/* Score bars */}
      <motion.div
        className="mt-6"
        style={{
          borderTop: "1px solid var(--rule)",
          paddingTop: 16,
        }}
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        custom={7}
      >
        <div className="flex flex-col gap-3">
          {Object.entries(state.scores).map(([key, val], i) => (
            <div key={key} className="flex items-center gap-2.5">
              <span
                style={{
                  width: 72,
                  fontFamily: "var(--font-mono)",
                  fontSize: 9,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  color: "var(--ink-4)",
                }}
              >
                {SCORE_LABELS[key] || key}
              </span>
              <div
                className="flex-1"
                style={{
                  height: 3,
                  background: "var(--rule-light)",
                  overflow: "hidden",
                }}
              >
                <motion.div
                  style={{
                    height: "100%",
                    background:
                      i % 2 === 0 ? "var(--ink-3)" : "var(--gold)",
                    opacity: i % 2 === 0 ? 1 : 0.6,
                  }}
                  initial={{ width: 0 }}
                  animate={{ width: `${val}%` }}
                  transition={{
                    duration: 0.8,
                    delay: 0.6 + i * 0.1,
                    ease: "easeOut",
                  }}
                />
              </div>
              <span
                style={{
                  width: 24,
                  textAlign: "right",
                  fontFamily: "var(--font-mono)",
                  fontSize: 10,
                  color: "var(--ink-3)",
                }}
              >
                {val}
              </span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* CTA */}
      <motion.div
        className="mt-8 text-center"
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        custom={8}
      >
        <p
          style={{
            fontSize: 13,
            fontStyle: "italic",
            fontWeight: 300,
            color: "var(--ink-3)",
            marginBottom: 12,
            lineHeight: 1.6,
          }}
        >
          Ready to start for real?
          <br />
          Open a PostFinance investment account with as little as CHF 20.
        </p>
        <button
          className="w-full max-w-xs cursor-pointer"
          style={{
            background: "var(--gold)",
            color: "var(--ink)",
            border: "none",
            borderRadius: "var(--radius-sm)",
            padding: "15px 24px",
            fontSize: 15,
            fontWeight: 600,
            fontFamily: "var(--font-body)",
          }}
        >
          Open PostFinance Account
        </button>
        <div className="mt-3">
          <button
            className="cursor-pointer"
            style={{
              background: "none",
              border: "none",
              color: "var(--ink-3)",
              fontSize: 13,
              fontFamily: "var(--font-body)",
              textDecoration: "underline",
              textUnderlineOffset: 3,
              textDecorationColor: "var(--rule)",
              cursor: "pointer",
            }}
            onClick={() => window.location.reload()}
          >
            Play Again
          </button>
        </div>
      </motion.div>

      {/* Footer */}
      <motion.div
        className="text-center mt-8"
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: 8,
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          color: "var(--ink-5)",
        }}
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        custom={9}
      >
        Wealth Manager Arena · PostFinance × START Hackathon 2026
      </motion.div>
    </div>
  );
}