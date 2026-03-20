"use client";

import { motion } from "framer-motion";
import { useGame, getRound } from "@/lib/GameContext";

const fadeUp = {
  hidden: { opacity: 0, y: 14 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.1 + i * 0.1, duration: 0.45, ease: "easeOut" },
  }),
};

const STYLES: { [key: string]: { bg: string; border: string; icon: string; iconBg: string; iconColor: string; label: string } } = {
  good: {
    bg: "var(--green-wash)",
    border: "var(--green-soft)",
    icon: "✓",
    iconBg: "var(--green-wash)",
    iconColor: "var(--green)",
    label: "Good decision",
  },
  neutral: {
    bg: "var(--gold-wash)",
    border: "#F0E4A8",
    icon: "—",
    iconBg: "var(--gold-wash)",
    iconColor: "var(--gold)",
    label: "Not bad",
  },
  bad: {
    bg: "var(--coral-wash)",
    border: "var(--coral-soft)",
    icon: "✗",
    iconBg: "var(--coral-wash)",
    iconColor: "var(--coral)",
    label: "Lesson learned",
  },
};

export default function Feedback() {
  const { state, dispatch } = useGame();
  const feedback = state.currentFeedback;
  if (!feedback) return null;

  const style = STYLES[feedback.quality] || STYLES.neutral;

  // Figure out if there are more snap cards
  const round = getRound(state.currentRound);
  let isSnapQuest = false;
  let hasMoreCards = false;

  if (round && round.quest && round.quest.type === "snap_decision") {
    isSnapQuest = true;
    // Access cards safely via any cast to avoid all type issues
    const cards = (round.quest as any).cards;
    if (Array.isArray(cards)) {
      hasMoreCards = state.snapCardIndex < cards.length - 1;
    }
  }

  function handleContinue() {
    if (isSnapQuest) {
      dispatch({ type: "NEXT_SNAP_CARD" });
    } else {
      dispatch({ type: "CONTINUE_TO_PORTFOLIO" });
    }
  }

  return (
    <div className="px-5 pb-8 pt-6">
      {/* Quality label */}
      <motion.span
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: 9,
          textTransform: "uppercase",
          letterSpacing: "0.14em",
          color: "var(--ink-4)",
        }}
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        custom={0}
      >
        {style.label}
      </motion.span>

      {/* Verdict card */}
      <motion.div
        className="mt-3 flex items-start gap-3"
        style={{
          background: style.bg,
          border: `1px solid ${style.border}`,
          borderRadius: "var(--radius)",
          padding: "16px 18px",
        }}
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        custom={1}
      >
        <span
          className="shrink-0 flex items-center justify-center mt-0.5"
          style={{
            width: 24,
            height: 24,
            borderRadius: "50%",
            background: style.iconBg,
            color: style.iconColor,
            fontSize: 13,
            fontWeight: 600,
          }}
        >
          {style.icon}
        </span>
        <p
          style={{
            fontSize: 14,
            color: "var(--ink-2)",
            lineHeight: 1.6,
            fontWeight: 400,
          }}
        >
          {feedback.feedback}
        </p>
      </motion.div>

      {/* Learning section */}
      <motion.div
        className="mt-5"
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        custom={2}
      >
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 9,
            textTransform: "uppercase",
            letterSpacing: "0.14em",
            color: "var(--ink-4)",
            display: "block",
            marginBottom: 8,
          }}
        >
          Why this matters
        </span>
        <p
          style={{
            fontSize: 14,
            color: "var(--ink-3)",
            lineHeight: 1.7,
            fontStyle: "italic",
            fontWeight: 300,
          }}
        >
          {feedback.learning}
        </p>
      </motion.div>

      {/* Score deltas */}
      {feedback.scoreDeltas && Object.keys(feedback.scoreDeltas).length > 0 && (
        <motion.div
          className="mt-5 flex flex-wrap gap-2"
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={3}
        >
          {Object.entries(feedback.scoreDeltas).map(([key, val]) => {
            const v = Number(val) || 0;
            if (v === 0) return null;
            const isPos = v > 0;
            return (
              <span
                key={key}
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 10,
                  letterSpacing: "0.04em",
                  padding: "3px 10px",
                  borderRadius: "var(--radius-pill)",
                  background: isPos ? "var(--green-wash)" : "var(--coral-wash)",
                  color: isPos ? "var(--green)" : "var(--coral)",
                }}
              >
                {key} {isPos ? "+" : ""}{v}
              </span>
            );
          })}
        </motion.div>
      )}

      {/* Continue */}
      <motion.button
        className="mt-8 w-full cursor-pointer"
        style={{
          background: "var(--ink)",
          color: "var(--bg)",
          border: "1px solid var(--ink)",
          borderRadius: "var(--radius-sm)",
          padding: "13px 24px",
          fontSize: 14,
          fontWeight: 500,
          fontFamily: "var(--font-body)",
        }}
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        custom={4}
        whileTap={{ scale: 0.97 }}
        onClick={handleContinue}
      >
        {hasMoreCards ? "Next Card" : "See Results"}
      </motion.button>
    </div>
  );
}