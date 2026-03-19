"use client";

import { motion } from "framer-motion";
import { useGame } from "@/lib/GameContext";

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.15 + i * 0.12, duration: 0.5, ease: "easeOut" },
  }),
};

const PILLARS = [
  {
    num: "01",
    title: "Stay calm in a crisis",
    desc: "Make rational decisions when headlines scream panic",
  },
  {
    num: "02",
    title: "Think long-term",
    desc: "Discover why patience outperforms prediction",
  },
  {
    num: "03",
    title: "Know your options",
    desc: "From savings accounts to ETFs — build real knowledge",
  },
];

export default function LandingPage() {
  const { dispatch } = useGame();

  return (
    <div className="relative z-10 flex flex-col min-h-dvh" style={{ textShadow: "0 0 8px rgba(255,251,240,0.9), 0 0 4px rgba(255,251,240,0.9), 0 1px 3px rgba(255,251,240,0.8)" }}>
      {/* Top kicker */}
      <motion.div
        className="text-center pt-14 pb-2"
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        custom={0}
      >
        <span
          className="inline-block tracking-[0.18em] uppercase"
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 9,
            color: "var(--ink-4)",
          }}
        >
          PostFinance × Wealth Manager Arena
        </span>
      </motion.div>

      {/* Hero */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 -mt-8">
        {/* Decorative rule */}
        <motion.div
          className="w-8 mx-auto mb-6"
          style={{ height: 1, background: "var(--rule-heavy)" }}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={1}
        />

        {/* Title */}
        <motion.h1
          className="text-center"
          style={{
            fontFamily: "var(--font-display)",
            fontSize: 32,
            fontWeight: 400,
            fontStyle: "italic",
            color: "var(--ink)",
            lineHeight: 1.15,
            letterSpacing: "-0.01em",
            maxWidth: 320,
          }}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={2}
        >
          Learn to invest.
          <br />
          <span style={{ fontStyle: "normal" }}>Start with CHF 50.</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          className="text-center mt-4"
          style={{
            fontFamily: "var(--font-body)",
            fontSize: 14,
            color: "var(--ink-3)",
            maxWidth: 280,
            lineHeight: 1.6,
          }}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={3}
        >
          Six rounds. Six years of simulated investing.
          <br />
          See what your CHF 50 could become.
        </motion.p>

        {/* Divider */}
        <motion.div
          className="w-5 mx-auto my-7"
          style={{ height: 1, background: "var(--rule)" }}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={4}
        />

        {/* Three pillars */}
        <div className="w-full max-w-xs flex flex-col gap-4">
          {PILLARS.map((p, i) => (
            <motion.div
              key={p.num}
              className="flex items-start gap-3"
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={5 + i}
            >
              <span
                className="shrink-0 mt-0.5"
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 10,
                  color: "var(--ink-5)",
                  letterSpacing: "0.06em",
                }}
              >
                {p.num}
              </span>
              <div>
                <div
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: 15,
                    color: "var(--ink)",
                    lineHeight: 1.3,
                  }}
                >
                  {p.title}
                </div>
                <div
                  style={{
                    fontSize: 13,
                    color: "var(--ink-4)",
                    lineHeight: 1.5,
                    marginTop: 2,
                  }}
                >
                  {p.desc}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.button
          className="mt-9 w-full max-w-xs cursor-pointer"
          style={{
            background: "var(--gold)",
            color: "var(--ink)",
            border: "none",
            borderRadius: "var(--radius-sm)",
            padding: "15px 24px",
            fontSize: 15,
            fontWeight: 600,
            fontFamily: "var(--font-body)",
            letterSpacing: "0.01em",
          }}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={8}
          whileTap={{ scale: 0.97 }}
          onClick={() => dispatch({ type: "START_GAME" })}
        >
          Begin Your Journey
        </motion.button>

        {/* Secondary */}
        <motion.p
          className="text-center mt-3"
          style={{
            fontSize: 12,
            color: "var(--ink-5)",
          }}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={9}
        >
          ~12 minutes · no real money involved
        </motion.p>
      </div>

      {/* Footer */}
      <motion.div
        className="text-center pb-8 pt-4"
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: 8,
          letterSpacing: "0.14em",
          textTransform: "uppercase" as const,
          color: "var(--ink-5)",
        }}
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        custom={10}
      >
        Built at START Hackathon · St. Gallen 2026
      </motion.div>
    </div>
  );
}