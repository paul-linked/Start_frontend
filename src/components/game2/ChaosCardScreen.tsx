"use client";

import { motion } from "framer-motion";
import { useExtendedGame } from "@/lib/GameContext2";

const fadeUp = {
  hidden: { opacity: 0, y: 14 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: 0.08 + i * 0.1, duration: 0.4, ease: "easeOut" },
  }),
};

const CATEGORY_LABELS: Record<string, string> = {
  memecoin: "Memecoin Madness",
  brainrot: "Internet Chaos",
  scam: "Scam Alert",
  social: "FOMO Warning",
  lifestyle: "Lifestyle Choice",
  macro: "Market Event",
  workplace: "Career Event",
  lucky: "Lucky Break",
  life: "Life Event",
  retirement: "Retirement Planning",
  classic: "Classic Lesson",
};

const CATEGORY_COLORS: Record<string, string> = {
  memecoin: "#B87060",
  brainrot: "#8B6EA4",
  scam: "#B87060",
  social: "#D4915A",
  lifestyle: "#5C8A4E",
  macro: "#0f4a58",
  workplace: "#0f4a58",
  lucky: "#5C8A4E",
  life: "#0f4a58",
  retirement: "#5C8A4E",
  classic: "#0f4a58",
};

export default function ChaosCardScreen() {
  const { state, dispatch } = useExtendedGame();
  const { activeCard, cardQueueIndex, cardQueue } = state;

  if (!activeCard) return null;

  const color = CATEGORY_COLORS[activeCard.category] ?? "#0f4a58";
  const label = CATEGORY_LABELS[activeCard.category] ?? activeCard.category;
  const cardNum = cardQueueIndex + 1;
  const totalCards = cardQueue.length;

  return (
    <div className="px-5 pb-8 pt-4">
      {/* Progress */}
      <motion.div
        className="flex items-center justify-between mb-4"
        variants={fadeUp} initial="hidden" animate="visible" custom={0}
      >
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 9, textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--ink-4)" }}>
          Event {cardNum} of {totalCards}
        </span>
        <div className="flex gap-1">
          {Array.from({ length: totalCards }).map((_, i) => (
            <div key={i} style={{
              width: 20, height: 3, borderRadius: 2,
              background: i < cardNum ? color : "var(--rule-light)",
              transition: "background 0.3s",
            }} />
          ))}
        </div>
      </motion.div>

      {/* Category badge */}
      <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={1}>
        <span style={{
          fontFamily: "var(--font-mono)", fontSize: 9, textTransform: "uppercase",
          letterSpacing: "0.12em", padding: "3px 10px", borderRadius: 20,
          background: `${color}14`, color, border: `1px solid ${color}30`,
        }}>
          {label}
        </span>
      </motion.div>

      {/* Emoji + Headline */}
      <motion.div className="mt-4" variants={fadeUp} initial="hidden" animate="visible" custom={2}>
        <div style={{ fontSize: 40, lineHeight: 1, marginBottom: 10 }}>{activeCard.emoji}</div>
        <h2 style={{
          fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 400,
          fontStyle: "italic", color: "var(--ink)", lineHeight: 1.25,
        }}>
          {activeCard.headline}
        </h2>
      </motion.div>

      {/* Description */}
      <motion.p
        className="mt-3"
        style={{ fontSize: 14, color: "var(--ink-3)", lineHeight: 1.7 }}
        variants={fadeUp} initial="hidden" animate="visible" custom={3}
      >
        {activeCard.description}
      </motion.p>

      {/* Tip */}
      {activeCard.tip && (
        <motion.div
          className="mt-4"
          style={{
            padding: "10px 14px", borderRadius: "var(--radius-sm)",
            background: "rgba(254,203,3,0.08)", border: "1px solid rgba(254,203,3,0.3)",
          }}
          variants={fadeUp} initial="hidden" animate="visible" custom={4}
        >
          <span style={{ fontSize: 11, color: "#6B5010", lineHeight: 1.6 }}>
            💡 {activeCard.tip}
          </span>
        </motion.div>
      )}

      {/* Options */}
      <motion.div className="mt-6 flex flex-col gap-3" variants={fadeUp} initial="hidden" animate="visible" custom={5}>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: 9, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--ink-4)", marginBottom: 2 }}>
          What do you do?
        </div>
        {activeCard.options.map((option, i) => (
          <motion.button
            key={option.id}
            variants={fadeUp} initial="hidden" animate="visible" custom={6 + i}
            whileTap={{ scale: 0.97 }}
            onClick={() => dispatch({ type: "SELECT_OPTION", optionId: option.id })}
            style={{
              width: "100%", textAlign: "left", cursor: "pointer",
              background: "#FFF9E5", border: "1px solid var(--rule)",
              borderRadius: "var(--radius-sm)", padding: "14px 16px",
              transition: "border-color 0.15s, background 0.15s",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.borderColor = color;
              (e.currentTarget as HTMLButtonElement).style.background = `${color}06`;
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--rule)";
              (e.currentTarget as HTMLButtonElement).style.background = "#FFF9E5";
            }}
          >
            <div style={{ fontSize: 14, fontWeight: 500, color: "var(--ink)", marginBottom: 3 }}>
              {option.label}
            </div>
            <div style={{ fontSize: 12, color: "var(--ink-4)", lineHeight: 1.5 }}>
              {option.description}
            </div>
          </motion.button>
        ))}
      </motion.div>
    </div>
  );
}
