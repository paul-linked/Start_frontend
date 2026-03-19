"use client";

import { motion } from "framer-motion";
import { useState } from "react";
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

function MiniChart({
  data,
  label,
  delta,
}: {
  data: number[];
  label: string;
  delta: string;
}) {
  const min = Math.min(...data) * 0.9;
  const max = Math.max(...data) * 1.1;
  const range = max - min || 1;
  const w = 300;
  const h = 48;

  const isNeg = delta.startsWith("−") || delta.startsWith("-");

  const points = data
    .map((val, i) => {
      const x = (i / (data.length - 1)) * w;
      const y = h - ((val - min) / range) * h;
      return `${x},${y}`;
    })
    .join(" ");

  const color = isNeg ? "var(--coral)" : "var(--green)";

  return (
    <div
      className="mt-4"
      style={{
        borderTop: "1px solid var(--rule)",
        borderBottom: "1px solid var(--rule)",
        padding: "14px 0",
      }}
    >
      <div className="flex items-baseline justify-between mb-2">
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 9,
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            color: "var(--ink-4)",
          }}
        >
          {label}
        </span>
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 11,
            color: color,
          }}
        >
          {delta}
        </span>
      </div>
      <svg width="100%" height={h} viewBox={`0 0 ${w} ${h}`}>
        <defs>
          <linearGradient id="briefGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.06" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
        <polyline
          points={points}
          fill="none"
          stroke={color}
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.7"
        />
      </svg>
    </div>
  );
}

export default function BriefingRoom() {
  const { state, dispatch } = useGame();
  const round = ROUNDS[state.currentRound - 1];
  if (!round || round.quest.type !== "briefing_room") return null;

  const quest = round.quest;
  const hasMultipleArticles = quest.articles.length > 1;
  const [activeArticle, setActiveArticle] = useState(0);
  const article = quest.articles[activeArticle];

  return (
    <div className="px-5 pb-8 pt-4">
      {/* Multi-article tabs */}
      {hasMultipleArticles && (
        <motion.div
          className="flex gap-0 mb-4"
          style={{
            border: "1px solid var(--rule)",
            borderRadius: "var(--radius-sm)",
            overflow: "hidden",
          }}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={0}
        >
          {quest.articles.map((a, i) => (
            <button
              key={i}
              className="flex-1 text-center py-2.5 cursor-pointer"
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 9,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                background:
                  i === activeArticle ? "var(--surface)" : "var(--bg)",
                color:
                  i === activeArticle ? "var(--ink-2)" : "var(--ink-4)",
                border: "none",
                borderRight:
                  i < quest.articles.length - 1
                    ? "1px solid var(--rule)"
                    : "none",
                fontWeight: i === activeArticle ? 500 : 400,
              }}
              onClick={() => setActiveArticle(i)}
            >
              {a.sourceType}: {a.source}
            </button>
          ))}
        </motion.div>
      )}

      {/* Article */}
      <motion.div
        key={activeArticle}
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        custom={1}
      >
        {/* Source */}
        <div
          className="flex items-center gap-2 mb-2"
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 9,
            textTransform: "uppercase",
            letterSpacing: "0.12em",
            color: "var(--ink-4)",
          }}
        >
          <span>{article.source} · {article.sourceType}</span>
          <span
            className="flex-1"
            style={{ height: 1, background: "var(--rule-light)" }}
          />
        </div>

        {/* Headline */}
        <h2
          style={{
            fontFamily: "var(--font-display)",
            fontSize: 21,
            color: "var(--ink)",
            lineHeight: 1.25,
            marginBottom: 8,
          }}
        >
          {article.headline}
        </h2>

        {/* Standfirst */}
        <p
          style={{
            fontSize: 14,
            fontWeight: 300,
            fontStyle: "italic",
            color: "var(--ink-3)",
            lineHeight: 1.55,
            marginBottom: 14,
            paddingBottom: 14,
            borderBottom: "1px solid var(--rule)",
          }}
        >
          {article.standfirst}
        </p>

        {/* Body */}
        <div
          style={{
            fontSize: 14,
            color: "var(--ink-2)",
            lineHeight: 1.75,
            textAlign: "justify",
            hyphens: "auto",
            WebkitHyphens: "auto",
          }}
        >
          {article.paragraphs.map((p, i) => (
            <p
              key={i}
              className={i > 0 ? "mt-3" : ""}
              style={i > 0 ? { textIndent: "1.5em" } : {}}
              dangerouslySetInnerHTML={{
                __html: p.replace(
                  /<mark>/g,
                  '<mark style="background:var(--green-wash);padding:1px 2px;border-radius:2px">'
                ),
              }}
            />
          ))}
        </div>
      </motion.div>

      {/* Chart */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        custom={2}
      >
        <MiniChart
          data={quest.chartData}
          label={quest.chartLabel}
          delta={quest.chartDelta}
        />
      </motion.div>

      {/* Buy / Hold / Sell */}
      <motion.div
        className="mt-5 flex"
        style={{
          border: "1px solid var(--rule)",
          borderRadius: "var(--radius-sm)",
          overflow: "hidden",
        }}
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        custom={3}
      >
        {(["buy", "hold", "sell"] as const).map((choice, i) => {
          const colors = {
            buy: { color: "var(--green)", hover: "var(--green-wash)" },
            hold: { color: "var(--ink-3)", hover: "var(--surface)" },
            sell: { color: "var(--coral)", hover: "var(--coral-wash)" },
          };
          return (
            <button
              key={choice}
              className="flex-1 text-center py-3.5 cursor-pointer"
              style={{
                background: "var(--bg)",
                color: colors[choice].color,
                fontSize: 13,
                fontWeight: 500,
                fontFamily: "var(--font-body)",
                letterSpacing: "0.02em",
                border: "none",
                borderRight:
                  i < 2 ? "1px solid var(--rule)" : "none",
                transition: "background 0.15s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = colors[choice].hover)
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "var(--bg)")
              }
              onClick={() =>
                dispatch({ type: "BRIEFING_DECISION", choice })
              }
            >
              {choice.charAt(0).toUpperCase() + choice.slice(1)}
            </button>
          );
        })}
      </motion.div>
    </div>
  );
}