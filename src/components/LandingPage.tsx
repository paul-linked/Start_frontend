"use client";

import { motion } from "framer-motion";
import { useGame } from "@/lib/GameContext";
import Link from "next/link";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.1 + i * 0.1, duration: 0.5, ease: "easeOut" },
  }),
};

const PILLARS = [
  {
    title: "Stay calm in chaos",
    desc: "Make rational calls when everyone around you is panicking",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22C6.5 22 2 17.5 2 12S6.5 2 12 2s10 4.5 10 10-4.5 10-10 10z"/>
        <path d="M8 14s1.5 2 4 2 4-2 4-2"/>
        <line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/>
      </svg>
    ),
  },
  {
    title: "Think in years, not days",
    desc: "See why patience beats prediction — every single time",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/>
        <polyline points="16 7 22 7 22 13"/>
      </svg>
    ),
  },
  {
    title: "Know your instruments",
    desc: "ETFs, bonds, gold — understand what you're actually buying",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 3h-8l-2 4h12l-2-4z"/>
        <line x1="12" y1="11" x2="12" y2="17"/><line x1="9" y1="14" x2="15" y2="14"/>
      </svg>
    ),
  },
];

export default function LandingPage() {
  const { dispatch } = useGame();

  return (
    <div className="relative z-10 flex flex-col min-h-dvh">
      {/* ═══ HERO SECTION — dark teal ═══ */}
      <motion.div
        style={{
          background: "var(--primary)",
          padding: "48px 24px 40px",
          borderRadius: "0 0 28px 28px",
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        {/* Kicker */}
        <motion.div
          className="text-center mb-6"
          variants={fadeUp} initial="hidden" animate="visible" custom={0}
        >
          <span style={{
            fontFamily: "var(--font-mono)", fontSize: 9,
            textTransform: "uppercase", letterSpacing: "0.18em",
            color: "rgba(255,255,255,0.45)",
          }}>
            PostFinance × Wealth Manager Arena
          </span>
        </motion.div>

        {/* Title */}
        <motion.h1
          className="text-center"
          style={{
            fontFamily: "var(--font-display)", fontSize: 34,
            fontWeight: 400, fontStyle: "italic",
            color: "#fff", lineHeight: 1.12, letterSpacing: "-0.01em",
          }}
          variants={fadeUp} initial="hidden" animate="visible" custom={1}
        >
          Learn to invest.
        </motion.h1>

        <motion.div
          className="text-center mt-1"
          style={{
            fontFamily: "var(--font-display)", fontSize: 34,
            fontWeight: 400, color: "var(--accent)", lineHeight: 1.12,
          }}
          variants={fadeUp} initial="hidden" animate="visible" custom={2}
        >
          Start with CHF 50.
        </motion.div>

        {/* Subtitle */}
        <motion.p
          className="text-center mt-5 mx-auto"
          style={{
            fontSize: 14, color: "rgba(255,255,255,0.6)",
            maxWidth: 280, lineHeight: 1.6,
          }}
          variants={fadeUp} initial="hidden" animate="visible" custom={3}
        >
          Six rounds of simulated investing.
          See what smart decisions do to your money over time.
        </motion.p>

        {/* Start button */}
        <motion.button
          className="mt-7 w-full max-w-xs mx-auto block cursor-pointer"
          style={{
            background: "var(--accent)", color: "var(--primary)",
            border: "none", borderRadius: "var(--radius-sm)",
            padding: "15px 24px", fontSize: 15, fontWeight: 600,
            fontFamily: "var(--font-body)",
          }}
          variants={fadeUp} initial="hidden" animate="visible" custom={4}
          whileTap={{ scale: 0.97 }}
          onClick={() => dispatch({ type: "START_GAME" })}
        >
          Begin Your Journey
        </motion.button>

        <motion.p
          className="text-center mt-3"
          style={{ fontSize: 11, color: "rgba(255,255,255,0.35)" }}
          variants={fadeUp} initial="hidden" animate="visible" custom={5}
        >
          ~12 minutes · no real money involved
        </motion.p>
      </motion.div>

      {/* ═══ PILLARS ═══ */}
      <div className="flex-1 px-5 pt-7 pb-4">
        <motion.p
          className="text-center mb-5"
          style={{
            fontFamily: "var(--font-mono)", fontSize: 9,
            textTransform: "uppercase", letterSpacing: "0.14em",
            color: "var(--ink-4)",
          }}
          variants={fadeUp} initial="hidden" animate="visible" custom={6}
        >
          What you'll learn
        </motion.p>

        <div className="flex flex-col gap-3 max-w-xs mx-auto">
          {PILLARS.map((p, i) => (
            <motion.div
              key={i}
              className="flex items-start gap-3.5"
              style={{
                background: "var(--surface-card)",
                border: "1px solid var(--rule-light)",
                borderRadius: "var(--radius)",
                padding: "14px 16px",
              }}
              variants={fadeUp} initial="hidden" animate="visible" custom={7 + i}
            >
              <span className="shrink-0 flex items-center justify-center" style={{
                  width: 36, height: 36, borderRadius: 10,
                  background: "var(--primary-wash)", fontSize: 18,
                }}>
                  {p.icon}
                </span>
              <div>
                <div style={{
                  fontSize: 14, fontWeight: 500, color: "var(--ink)", lineHeight: 1.3,
                }}>
                  {p.title}
                </div>
                <div style={{
                  fontSize: 12, color: "var(--ink-4)", lineHeight: 1.5, marginTop: 2,
                }}>
                  {p.desc}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Challenge CTA */}
        <motion.div
          className="mt-6 max-w-xs mx-auto"
          variants={fadeUp} initial="hidden" animate="visible" custom={10}
        >
          <Link href="/challenge" className="flex items-center justify-between w-full cursor-pointer"
            style={{
              background: "var(--ink)", color: "#fff",
              border: "none", borderRadius: "var(--radius-sm)",
              padding: "14px 18px", fontSize: 14, fontWeight: 500,
              fontFamily: "var(--font-body)", textDecoration: "none",
            }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 500 }}>Challenge Mode</div>
              <div style={{ fontSize: 11, opacity: 0.5, marginTop: 1 }}>Compete on the leaderboard</div>
            </div>
            <span style={{ fontSize: 18, opacity: 0.4 }}>→</span>
          </Link>
        </motion.div>
      </div>

      {/* Footer */}
      <motion.div
        className="text-center pb-6 pt-2"
        style={{
          fontFamily: "var(--font-mono)", fontSize: 8,
          letterSpacing: "0.14em", textTransform: "uppercase",
          color: "var(--ink-5)",
        }}
        variants={fadeUp} initial="hidden" animate="visible" custom={11}
      >
        Built at START Hackathon · St. Gallen 2026
      </motion.div>
    </div>
  );
}