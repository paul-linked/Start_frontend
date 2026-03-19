"use client";

import { useState, useCallback } from "react";
import {
  motion,
  useMotionValue,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import type { ReignsScenario, ReignsCard as ReignsCardType } from "@/types";
import { FeedbackFlash } from "./FeedbackFlash";

interface ReignsViewProps {
  scenario: ReignsScenario;
  onComplete: (totalXp: number) => void;
}

export function ReignsView({ scenario, onComplete }: ReignsViewProps) {
  const [cardIndex, setCardIndex] = useState(0);
  const [totalXp, setTotalXp] = useState(0);
  const [feedback, setFeedback] = useState<{
    type: "good" | "neutral" | "bad";
    message: string;
    xp: number;
    lesson: string;
  } | null>(null);

  const card = scenario.cards[cardIndex];
  const isLast = cardIndex >= scenario.cards.length - 1;

  const handleDecision = useCallback(
    (direction: "left" | "right" | "tap") => {
      if (!card) return;
      const option = card[direction];
      const xp = option.impact.xp;
      const type = xp >= 20 ? "good" : xp >= 10 ? "neutral" : "bad";

      setTotalXp((prev) => prev + xp);
      setFeedback({ type, message: option.label, xp, lesson: card.lesson });
    },
    [card]
  );

  const handleFeedbackDone = useCallback(() => {
    setFeedback(null);
    if (isLast) {
      onComplete(totalXp);
    } else {
      setCardIndex((i) => i + 1);
    }
  }, [isLast, onComplete, totalXp]);

  if (!card) return null;

  return (
    <div className="game-container flex h-full flex-col items-center justify-center py-8">
      {/* Card count */}
      <p className="mb-2 text-sm text-dim">
        Card {cardIndex + 1} of {scenario.cards.length}
      </p>

      {/* Progress dots */}
      <div className="mb-8 flex gap-2">
        {scenario.cards.map((_, i) => (
          <div
            key={i}
            className="h-2 rounded-full transition-all duration-500"
            style={{
              width: i === cardIndex ? 28 : 8,
              background:
                i < cardIndex
                  ? "var(--game-primary)"
                  : i === cardIndex
                  ? "var(--game-secondary)"
                  : "var(--game-border)",
            }}
          />
        ))}
      </div>

      {/* Swipeable card */}
      <AnimatePresence mode="wait">
        <SwipeCard key={cardIndex} card={card} onDecision={handleDecision} />
      </AnimatePresence>

      {/* Button fallback — 3 distinct styled buttons */}
      <div className="mt-8 flex w-full gap-3">
        <button
          className="btn-danger flex-1 rounded-2xl py-4 text-sm"
          onClick={() => handleDecision("left")}
        >
          {card.left.label}
        </button>
        <button
          className="btn-secondary flex-1 rounded-2xl py-4 text-sm"
          onClick={() => handleDecision("tap")}
        >
          {card.tap.label}
        </button>
        <button
          className="btn-primary flex-1 rounded-2xl py-4 text-sm"
          onClick={() => handleDecision("right")}
        >
          {card.right.label}
        </button>
      </div>

      {feedback && (
        <FeedbackFlash
          type={feedback.type}
          message={feedback.message}
          xp={feedback.xp}
          lesson={feedback.lesson}
          onDone={handleFeedbackDone}
        />
      )}
    </div>
  );
}

/* ─── Swipeable Card ─── */
function SwipeCard({
  card,
  onDecision,
}: {
  card: ReignsCardType;
  onDecision: (dir: "left" | "right" | "tap") => void;
}) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-12, 12]);
  const leftOpacity = useTransform(x, [-120, -30], [1, 0]);
  const rightOpacity = useTransform(x, [30, 120], [0, 1]);
  // Tint the card border on swipe
  const borderColor = useTransform(
    x,
    [-120, -30, 30, 120],
    ["#C25B4A", "#E8E2D4", "#E8E2D4", "#7BA86A"]
  );
  const [swiped, setSwiped] = useState(false);

  const handleDragEnd = (_: unknown, info: { offset: { x: number } }) => {
    if (swiped) return;
    if (info.offset.x < -80) {
      setSwiped(true);
      onDecision("left");
    } else if (info.offset.x > 80) {
      setSwiped(true);
      onDecision("right");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      className="w-full"
    >
      <motion.div
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.6}
        onDragEnd={handleDragEnd}
        style={{ x, rotate, borderColor }}
        className="card-swipe cursor-grab active:cursor-grabbing"
      >
        {/* Left swipe hint overlay */}
        <motion.div
          className="pointer-events-none absolute left-0 top-0 flex h-full w-1/3 items-center justify-center rounded-l-3xl"
          style={{
            opacity: leftOpacity,
            background: "rgba(194,91,74,0.08)",
          }}
        >
          <span
            className="rounded-xl px-4 py-2 text-sm font-semibold"
            style={{ background: "var(--feedback-bad-bg)", color: "var(--feedback-bad-text)" }}
          >
            ← {card.left.label}
          </span>
        </motion.div>

        {/* Right swipe hint overlay */}
        <motion.div
          className="pointer-events-none absolute right-0 top-0 flex h-full w-1/3 items-center justify-center rounded-r-3xl"
          style={{
            opacity: rightOpacity,
            background: "rgba(123,168,106,0.08)",
          }}
        >
          <span
            className="rounded-xl px-4 py-2 text-sm font-semibold"
            style={{ background: "var(--feedback-good-bg)", color: "var(--feedback-good-text)" }}
          >
            {card.right.label} →
          </span>
        </motion.div>

        {/* Icon */}
        <div className="icon-circle icon-circle-amber mb-5">💰</div>

        {/* Prompt */}
        <p
          className="mb-4 text-lg leading-relaxed"
          style={{ fontFamily: "var(--font-display)", color: "var(--game-secondary)" }}
        >
          {card.prompt}
        </p>

        {/* Hint */}
        <p className="text-xs text-dim">
          ← swipe or tap buttons below →
        </p>
      </motion.div>
    </motion.div>
  );
}