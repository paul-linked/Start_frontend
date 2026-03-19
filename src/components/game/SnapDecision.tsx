"use client";

import { motion, useMotionValue, useTransform } from "framer-motion";
import { useState } from "react";
import { useGame } from "@/lib/GameContext";
import { ROUNDS } from "@/lib/gameData";
import type { SnapOption } from "../../types";

export default function SnapDecision() {
  const { state, dispatch } = useGame();
  const round = ROUNDS[state.currentRound - 1];
  if (!round || round.quest.type !== "snap_decision") return null;

  const card = round.quest.cards[state.snapCardIndex];
  if (!card) return null;

  const totalCards = round.quest.cards.length;
  const options = card.options;
  const rightOption = options[0];
  const leftOption = options[options.length - 1];

  // Prevent double-tap
  const [chosen, setChosen] = useState(false);

  // Swipe motion values
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 0, 200], [-8, 0, 8]);
  const cardOpacity = useTransform(x, [-250, -120, 0, 120, 250], [0.7, 1, 1, 1, 0.7]);
  const leftLabelOpacity = useTransform(x, [-120, -30, 0], [1, 0.3, 0]);
  const rightLabelOpacity = useTransform(x, [0, 30, 120], [0, 0.3, 1]);

  function commitChoice(option: SnapOption) {
    if (chosen) return;
    setChosen(true);

    dispatch({
      type: "SNAP_DECISION",
      choiceId: option.id,
      quality: option.quality,
      feedback: option.feedback,
      learning: option.learning,
      scoreImpact: option.scoreImpact,
    });
  }

  function handleDragEnd(_: any, info: { offset: { x: number }; velocity: { x: number } }) {
    if (chosen) return;
    const swipe = info.offset.x;
    const vel = Math.abs(info.velocity.x);

    if (swipe < -80 || (swipe < -40 && vel > 300)) {
      commitChoice(leftOption);
    } else if (swipe > 80 || (swipe > 40 && vel > 300)) {
      commitChoice(rightOption);
    }
  }

  return (
    <div className="min-h-[calc(100dvh-80px)] px-5 pb-6 pt-4">
      {/* Card counter */}
      <motion.div
        className="flex items-center justify-between mb-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <span style={{
          fontFamily: "var(--font-mono)", fontSize: 9,
          textTransform: "uppercase", letterSpacing: "0.14em", color: "var(--ink-4)",
        }}>
          Card {state.snapCardIndex + 1} of {totalCards}
        </span>
        <div className="flex gap-1.5">
          {Array.from({ length: totalCards }).map((_, i) => (
            <div key={i} style={{
              width: i <= state.snapCardIndex ? 18 : 10,
              height: 3, borderRadius: 2,
              background: i <= state.snapCardIndex ? "#0f4a58" : "var(--rule)",
              transition: "all 0.3s",
            }} />
          ))}
        </div>
      </motion.div>

      {/* Ghost swipe labels */}
      <div className="flex items-center justify-between px-1 mb-2 h-5">
        <motion.span style={{
          fontFamily: "var(--font-mono)", fontSize: 9,
          color: "var(--coral)", opacity: leftLabelOpacity, letterSpacing: "0.04em",
        }}>
          ← {leftOption.label}
        </motion.span>
        <motion.span style={{
          fontFamily: "var(--font-mono)", fontSize: 9,
          color: "#0f4a58", opacity: rightLabelOpacity, letterSpacing: "0.04em",
        }}>
          {rightOption.label} →
        </motion.span>
      </div>

      {/* Swipeable card */}
      <motion.div
        className="relative overflow-hidden cursor-grab active:cursor-grabbing"
        style={{
          x,
          rotate,
          opacity: cardOpacity,
          background: "#FFF9E5",
          border: "1px solid var(--rule)",
          borderRadius: 20,
          padding: "36px 24px 32px",
          minHeight: 260,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          touchAction: "pan-y",
        }}
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.6}
        onDragEnd={handleDragEnd}
        key={card.id}
        initial={{ scale: 0.92, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 22 }}
      >
        {/* Top accent line */}
        <div className="absolute top-0 left-0 right-0" style={{
          height: 2,
          background: "linear-gradient(90deg, transparent, #fecb03, transparent)",
          opacity: 0.7,
        }} />

        {/* Headline */}
        <h3 style={{
          fontFamily: "var(--font-display)", fontSize: 19,
          color: "#0f4a58", lineHeight: 1.3, maxWidth: 300, marginBottom: 8,
        }}>
          {card.headline}
        </h3>

        {/* Description */}
        <p style={{
          fontSize: 14, color: "var(--ink-3)", lineHeight: 1.6, maxWidth: 280,
        }}>
          {card.description}
        </p>

        {/* Swipe hint */}
        <div className="mt-5" style={{
          fontFamily: "var(--font-mono)", fontSize: 8,
          textTransform: "uppercase", letterSpacing: "0.14em", color: "var(--ink-5)",
        }}>
          ← swipe or tap below →
        </div>
      </motion.div>

      {/* Button choices */}
      <div
        className="mt-4 flex flex-col gap-[1px]"
        style={{
          background: "var(--rule-light)",
          border: "1px solid var(--rule)",
          borderRadius: "var(--radius)",
          overflow: "hidden",
        }}
      >
        {options.map((opt, i) => {
          const isFirst = i === 0;
          const isLast = i === options.length - 1;
          return (
            <button
              key={opt.id}
              className="w-full text-left flex items-center gap-3.5 cursor-pointer"
              style={{
                background: "#FFF9E5",
                border: "none",
                padding: "14px 16px",
                fontFamily: "var(--font-body)",
                fontSize: 14,
                color: "var(--ink-2)",
                transition: "background 0.15s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "var(--surface-dim)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "#FFF9E5")}
              onClick={() => commitChoice(opt)}
            >
              <span className="shrink-0 flex items-center justify-center" style={{
                width: 28, height: 28, borderRadius: "50%",
                border: "1.5px solid",
                borderColor: isFirst ? "#0f4a58" : isLast ? "var(--coral)" : "#fecb03",
                fontFamily: "var(--font-mono)", fontSize: 11, fontWeight: 500,
                color: isFirst ? "#0f4a58" : isLast ? "var(--coral)" : "#0f4a58",
              }}>
                {String.fromCharCode(65 + i)}
              </span>
              <div>
                <span style={{ fontWeight: 500, color: "var(--ink)" }}>{opt.label}</span>
                <br />
                <span style={{ fontSize: 13, color: "var(--ink-4)" }}>{opt.description}</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}