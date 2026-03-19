"use client";

import { motion } from "framer-motion";
import { useGame } from "@/lib/GameContext";
import { ROUNDS } from "@/lib/gameData";

const fadeUp = {
  hidden: { opacity: 0, y: 14 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.08 + i * 0.08, duration: 0.4, ease: "easeOut" },
  }),
};

const MARKERS = ["A", "B", "C", "D"];

export default function SnapDecision() {
  const { state, dispatch } = useGame();
  const round = ROUNDS[state.currentRound - 1];
  if (!round || round.quest.type !== "snap_decision") return null;

  const card = round.quest.cards[state.snapCardIndex];
  if (!card) return null;

  const totalCards = round.quest.cards.length;

  return (
    <div className="px-5 pb-8 pt-4">
      {/* Card counter */}
      <motion.div
        className="flex items-center justify-between mb-4"
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
            letterSpacing: "0.14em",
            color: "var(--ink-4)",
          }}
        >
          Card {state.snapCardIndex + 1} of {totalCards}
        </span>
        <div className="flex gap-1">
          {Array.from({ length: totalCards }).map((_, i) => (
            <div
              key={i}
              style={{
                width: 16,
                height: 2,
                borderRadius: 1,
                background:
                  i <= state.snapCardIndex ? "var(--ink-3)" : "var(--rule)",
              }}
            />
          ))}
        </div>
      </motion.div>

      {/* Card */}
      <motion.div
        className="relative overflow-hidden"
        style={{
          background: "var(--bg)",
          border: "1px solid var(--rule)",
          borderRadius: 18,
          padding: "36px 24px 32px",
          minHeight: 200,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
        }}
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        custom={1}
      >
        {/* Gold top accent */}
        <div
          className="absolute top-0 left-0 right-0"
          style={{
            height: 2,
            background:
              "linear-gradient(90deg, transparent, var(--gold), transparent)",
            opacity: 0.6,
          }}
        />

        <h3
          style={{
            fontFamily: "var(--font-display)",
            fontSize: 19,
            color: "var(--ink)",
            lineHeight: 1.3,
            maxWidth: 300,
            marginBottom: 8,
          }}
        >
          {card.headline}
        </h3>

        <p
          style={{
            fontSize: 14,
            color: "var(--ink-3)",
            lineHeight: 1.6,
            maxWidth: 280,
          }}
        >
          {card.description}
        </p>
      </motion.div>

      {/* Choices */}
      <div className="mt-4 flex flex-col gap-[1px]"
        style={{
          background: "var(--rule-light)",
          border: "1px solid var(--rule)",
          borderRadius: "var(--radius)",
          overflow: "hidden",
        }}
      >
        {card.options.map((opt, i) => (
          <motion.button
            key={opt.id}
            className="w-full text-left flex items-center gap-3.5 cursor-pointer"
            style={{
              background: "var(--bg)",
              border: "none",
              padding: "15px 16px",
              fontFamily: "var(--font-body)",
              fontSize: 14,
              color: "var(--ink-2)",
              transition: "background 0.15s",
            }}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={3 + i}
            whileTap={{ scale: 0.98 }}
            onClick={() =>
              dispatch({
                type: "SNAP_DECISION",
                choiceId: opt.id,
                quality: opt.quality,
                feedback: opt.feedback,
                learning: opt.learning,
                scoreImpact: opt.scoreImpact,
              })
            }
            onMouseEnter={(e) =>
              (e.currentTarget.style.background = "var(--surface)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.background = "var(--bg)")
            }
          >
            <span
              className="shrink-0 flex items-center justify-center"
              style={{
                width: 28,
                height: 28,
                borderRadius: "50%",
                border: "1px solid var(--rule)",
                fontFamily: "var(--font-mono)",
                fontSize: 11,
                fontWeight: 500,
                color: "var(--ink-3)",
              }}
            >
              {MARKERS[i]}
            </span>
            <div>
              <span style={{ fontWeight: 500, color: "var(--ink)" }}>
                {opt.label}
              </span>
              <br />
              <span style={{ fontSize: 13, color: "var(--ink-4)" }}>
                {opt.description}
              </span>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
}