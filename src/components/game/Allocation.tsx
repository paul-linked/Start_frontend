"use client";

import { motion } from "framer-motion";
import { useState, useMemo, useCallback } from "react";
import { useGame } from "@/lib/GameContext";
import { getRound } from "@/lib/GameContext";
import type { PortfolioAllocation } from "../../types";

const fadeUp = {
  hidden: { opacity: 0, y: 14 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.08 + i * 0.08, duration: 0.4, ease: "easeOut" },
  }),
};

// ─── Colors for products (cycling through palette) ───
const PRODUCT_COLORS = [
  "#0f4a58", // teal dark
  "#fecb03", // yellow
  "#B87060", // coral
  "#5C8A4E", // green
  "#8B6EA4", // muted purple
  "#D4915A", // warm amber
];

const PRODUCT_ICONS: Record<string, string> = {
  savings: "🏦",
  bonds: "📜",
  etf: "📊",
  stocks: "📈",
  gold: "🥇",
  reits: "🏠",
};

// ─── Donut Chart ───
function DonutChart({
  segments,
  size = 180,
}: {
  segments: { id: string; pct: number; color: string; label: string }[];
  size?: number;
}) {
  const cx = size / 2;
  const cy = size / 2;
  const radius = size / 2 - 16;
  const strokeWidth = 28;
  const circumference = 2 * Math.PI * radius;

  let accumulated = 0;
  const activeSegments = segments.filter((s) => s.pct > 0);

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* Background track */}
        <circle
          cx={cx}
          cy={cy}
          r={radius}
          fill="none"
          stroke="var(--rule-light)"
          strokeWidth={strokeWidth}
        />

        {/* Segments */}
        {activeSegments.map((seg) => {
          const dashLength = (seg.pct / 100) * circumference;
          const dashOffset = -(accumulated / 100) * circumference;
          accumulated += seg.pct;

          return (
            <circle
              key={seg.id}
              cx={cx}
              cy={cy}
              r={radius}
              fill="none"
              stroke={seg.color}
              strokeWidth={strokeWidth}
              strokeDasharray={`${dashLength} ${circumference - dashLength}`}
              strokeDashoffset={dashOffset}
              strokeLinecap="butt"
              transform={`rotate(-90 ${cx} ${cy})`}
              style={{ transition: "stroke-dasharray 0.3s ease, stroke-dashoffset 0.3s ease" }}
            />
          );
        })}
      </svg>

      {/* Center text */}
      <div
        className="absolute inset-0 flex flex-col items-center justify-center"
        style={{ pointerEvents: "none" }}
      >
        <span style={{
          fontFamily: "var(--font-mono)", fontSize: 10,
          textTransform: "uppercase", letterSpacing: "0.1em",
          color: "var(--ink-4)",
        }}>
          Portfolio
        </span>
        <span style={{
          fontFamily: "var(--font-display)", fontSize: 20,
          color: "var(--ink)",
        }}>
          100%
        </span>
      </div>
    </div>
  );
}

// ─── Legend dots ───
function Legend({ segments }: { segments: { id: string; label: string; pct: number; color: string }[] }) {
  return (
    <div className="flex flex-wrap justify-center gap-x-4 gap-y-1.5 mt-3">
      {segments.filter((s) => s.pct > 0).map((seg) => (
        <div key={seg.id} className="flex items-center gap-1.5">
          <div style={{
            width: 8, height: 8, borderRadius: "50%", background: seg.color,
          }} />
          <span style={{
            fontFamily: "var(--font-mono)", fontSize: 9,
            color: "var(--ink-3)", letterSpacing: "0.02em",
          }}>
            {seg.label} {seg.pct}%
          </span>
        </div>
      ))}
    </div>
  );
}

export default function Allocation() {
  const { state, dispatch } = useGame();
  const round = getRound(state.currentRound);
  if (!round || round.quest.type !== "allocation") return null;
  const quest = round.quest as import("../../types").AllocationQuest;

//   const quest = round.quest;
  const products = quest.products;

  // Initialize allocation — even split
  const [alloc, setAlloc] = useState<PortfolioAllocation>(() => {
    const init: PortfolioAllocation = {};
    const even = Math.floor(100 / products.length);
    products.forEach((p, i) => {
      init[p.id] = i === products.length - 1 ? 100 - even * (products.length - 1) : even;
    });
    return init;
  });

  // Auto-balance: when one slider changes, redistribute the difference across others proportionally
  const handleSlider = useCallback(
    (changedId: string, newVal: number) => {
      const clamped = Math.max(0, Math.min(100, Math.round(newVal)));
      const oldVal = alloc[changedId] || 0;
      const diff = clamped - oldVal;

      if (diff === 0) return;

      const others = products.filter((p) => p.id !== changedId);
      const othersTotal = others.reduce((s, p) => s + (alloc[p.id] || 0), 0);

      const updated: PortfolioAllocation = { ...alloc, [changedId]: clamped };

      if (othersTotal === 0) {
        // Edge case: all others are 0, distribute evenly
        const each = Math.floor((100 - clamped) / others.length);
        others.forEach((p, i) => {
          updated[p.id] = i === others.length - 1 ? 100 - clamped - each * (others.length - 1) : each;
        });
      } else {
        // Distribute proportionally
        let remaining = 100 - clamped;
        others.forEach((p, i) => {
          if (i === others.length - 1) {
            updated[p.id] = Math.max(0, remaining);
          } else {
            const proportion = (alloc[p.id] || 0) / othersTotal;
            const newOtherVal = Math.max(0, Math.round(proportion * (100 - clamped)));
            updated[p.id] = newOtherVal;
            remaining -= newOtherVal;
          }
        });
      }

      setAlloc(updated);
    },
    [alloc, products]
  );

  // Projected return
  const projectedReturn = useMemo(() => {
    let ret = 0;
    for (const p of products) {
      ret += ((alloc[p.id] || 0) / 100) * (p.returnPct / 100);
    }
    return ret * state.portfolioValue;
  }, [alloc, products, state.portfolioValue]);

  const projectedPct = useMemo(() => {
    let ret = 0;
    for (const p of products) {
      ret += ((alloc[p.id] || 0) / 100) * p.returnPct;
    }
    return ret;
  }, [alloc, products]);

  // Donut segments
  const donutSegments = products.map((p, i) => ({
    id: p.id,
    pct: alloc[p.id] || 0,
    color: PRODUCT_COLORS[i % PRODUCT_COLORS.length],
    label: p.name.split(" ")[0], // Short label
  }));

  // Diversification hint
  const activeProducts = products.filter((p) => (alloc[p.id] || 0) > 5).length;
  const divHint =
    activeProducts >= products.length
      ? "Well diversified"
      : activeProducts >= 2
      ? "Could diversify more"
      : "Very concentrated";

  return (
    <div className="px-5 pb-8 pt-4">
      {/* Header */}
      <motion.span
        style={{
          fontFamily: "var(--font-mono)", fontSize: 9,
          textTransform: "uppercase", letterSpacing: "0.14em", color: "var(--ink-4)",
        }}
        variants={fadeUp} initial="hidden" animate="visible" custom={0}
      >
        Allocate Your Portfolio
      </motion.span>

      {/* Market context */}
      <motion.p
        className="mt-2 mb-5"
        style={{
          fontSize: 13, fontStyle: "italic", fontWeight: 300,
          color: "var(--ink-3)", lineHeight: 1.6,
        }}
        variants={fadeUp} initial="hidden" animate="visible" custom={1}
      >
        {quest.marketContext}
      </motion.p>

      {/* Donut + Legend */}
      <motion.div
        className="flex flex-col items-center mb-5"
        variants={fadeUp} initial="hidden" animate="visible" custom={2}
      >
        <DonutChart segments={donutSegments} />
        <Legend segments={donutSegments} />
      </motion.div>

      {/* Product sliders */}
      <motion.div
        variants={fadeUp} initial="hidden" animate="visible" custom={3}
      >
        {products.map((product, i) => {
          const color = PRODUCT_COLORS[i % PRODUCT_COLORS.length];
          const pct = alloc[product.id] || 0;
          const icon = PRODUCT_ICONS[product.id] || "💰";

          return (
            <div
              key={product.id}
              className="mb-3"
              style={{
                background: "#FFF9E5",
                border: "1px solid var(--rule)",
                borderRadius: "var(--radius)",
                padding: "14px 16px",
              }}
            >
              {/* Product header */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2.5">
                  <span className="flex items-center justify-center" style={{
                    width: 32, height: 32, borderRadius: "50%",
                    background: `${color}14`, fontSize: 16,
                    border: `1.5px solid ${color}30`,
                  }}>
                    {icon}
                  </span>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 500, color: "var(--ink)" }}>
                      {product.name}
                    </div>
                    <div style={{ fontSize: 11, color: "var(--ink-4)", marginTop: 1 }}>
                      {product.description}
                    </div>
                  </div>
                </div>

                {/* Return badge */}
                <span style={{
                  fontFamily: "var(--font-mono)", fontSize: 11, fontWeight: 500,
                  padding: "2px 8px", borderRadius: 20,
                  background: product.returnPct >= 0 ? "rgba(15,74,88,0.06)" : "rgba(184,112,96,0.08)",
                  color: product.returnPct >= 0 ? "#0f4a58" : "var(--coral)",
                }}>
                  {product.returnDisplay || `${product.returnPct >= 0 ? "+" : ""}${product.returnPct}%`}
                </span>
              </div>

              {/* Slider row */}
              <div className="flex items-center gap-3 mt-1">
                {/* Custom styled range */}
                <div className="flex-1 relative h-8 flex items-center">
                  {/* Track background */}
                  <div className="absolute left-0 right-0 h-2 rounded-full" style={{
                    background: "var(--rule-light)",
                  }} />
                  {/* Filled track */}
                  <div className="absolute left-0 h-2 rounded-full" style={{
                    width: `${pct}%`,
                    background: color,
                    opacity: 0.5,
                    transition: "width 0.15s ease",
                  }} />
                  {/* Actual range input */}
                  <input
                    type="range"
                    min={0}
                    max={100}
                    step={1}
                    value={pct}
                    onChange={(e) => handleSlider(product.id, parseInt(e.target.value))}
                    className="relative z-10 w-full"
                    style={{
                      WebkitAppearance: "none",
                      appearance: "none",
                      background: "transparent",
                      height: 32,
                      cursor: "pointer",
                    }}
                  />
                </div>

                {/* Percentage display */}
                <div
                  className="shrink-0 flex items-center justify-center"
                  style={{
                    width: 48, height: 32,
                    borderRadius: "var(--radius-xs)",
                    background: pct > 0 ? `${color}10` : "var(--surface-dim)",
                    border: `1px solid ${pct > 0 ? color + "30" : "var(--rule)"}`,
                    fontFamily: "var(--font-mono)",
                    fontSize: 13, fontWeight: 500,
                    color: pct > 0 ? color : "var(--ink-4)",
                    transition: "all 0.2s ease",
                  }}
                >
                  {pct}%
                </div>
              </div>
            </div>
          );
        })}
      </motion.div>

      {/* Projected return + diversification */}
      <motion.div
        className="mt-2 flex items-center justify-between px-1"
        variants={fadeUp} initial="hidden" animate="visible" custom={4}
      >
        <div className="flex items-center gap-2">
          <span style={{
            fontFamily: "var(--font-mono)", fontSize: 9,
            textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--ink-4)",
          }}>
            Projected
          </span>
          <span style={{
            fontFamily: "var(--font-mono)", fontSize: 13, fontWeight: 500,
            color: projectedReturn >= 0 ? "#0f4a58" : "var(--coral)",
          }}>
            {projectedReturn >= 0 ? "+" : ""}CHF {projectedReturn.toFixed(2)}
            <span style={{ fontSize: 10, opacity: 0.7, marginLeft: 3 }}>
              ({projectedPct >= 0 ? "+" : ""}{projectedPct.toFixed(1)}%)
            </span>
          </span>
        </div>

        <span style={{
          fontFamily: "var(--font-mono)", fontSize: 9,
          padding: "3px 10px", borderRadius: 20,
          background: activeProducts >= products.length ? "rgba(15,74,88,0.06)" :
            activeProducts >= 2 ? "rgba(254,203,3,0.12)" : "rgba(184,112,96,0.08)",
          color: activeProducts >= products.length ? "#0f4a58" :
            activeProducts >= 2 ? "#6B5010" : "var(--coral)",
          textTransform: "uppercase", letterSpacing: "0.06em",
        }}>
          {divHint}
        </span>
      </motion.div>

      {/* Confirm */}
      <motion.button
        className="mt-6 w-full cursor-pointer"
        style={{
          background: "var(--ink)",
          color: "var(--bg)",
          border: "none",
          borderRadius: "var(--radius-sm)",
          padding: "14px 24px",
          fontSize: 14,
          fontWeight: 500,
          fontFamily: "var(--font-body)",
        }}
        variants={fadeUp} initial="hidden" animate="visible" custom={5}
        whileTap={{ scale: 0.97 }}
        onClick={() => dispatch({ type: "ALLOCATION_CONFIRM", allocation: alloc })}
      >
        Confirm Allocation
      </motion.button>
    </div>
  );
}