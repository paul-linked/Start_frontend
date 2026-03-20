"use client";

import { motion } from "framer-motion";
import { useState, useMemo, useCallback } from "react";
import { useExtendedGame, CHAOS_ROUNDS, EXTENDED_ASSET_TIPS } from "@/lib/GameContext2";

const fadeUp = {
  hidden: { opacity: 0, y: 14 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: 0.08 + i * 0.08, duration: 0.4, ease: "easeOut" },
  }),
};

const ASSET_COLORS: Record<string, string> = {
  stocks: "#B87060",
  bonds: "#0f4a58",
  etf: "#5C8A4E",
  gold: "#D4915A",
  cash: "#8B6EA4",
  reits: "#6B8FA4",
};

const ASSET_ICONS: Record<string, string> = {
  stocks: "📈",
  bonds: "📜",
  etf: "📊",
  gold: "🥇",
  cash: "🏦",
  reits: "🏠",
};

const ASSET_ORDER = ["etf", "bonds", "stocks", "gold", "reits", "cash"];

export default function ChaosAllocation() {
  const { state, dispatch } = useExtendedGame();
  const round = CHAOS_ROUNDS[state.currentRound - 1];
  if (!round) return null;

  const assets = ASSET_ORDER;
  const [alloc, setAlloc] = useState<Record<string, number>>(() => {
    const even = Math.floor(100 / assets.length);
    const init: Record<string, number> = {};
    assets.forEach((id, i) => {
      init[id] = i === assets.length - 1 ? 100 - even * (assets.length - 1) : even;
    });
    return init;
  });

  const handleSlider = useCallback((changedId: string, newVal: number) => {
    const clamped = Math.max(0, Math.min(100, Math.round(newVal)));
    const oldVal = alloc[changedId] || 0;
    const diff = clamped - oldVal;
    if (diff === 0) return;

    const others = assets.filter((id) => id !== changedId);
    const othersTotal = others.reduce((s, id) => s + (alloc[id] || 0), 0);
    const updated: Record<string, number> = { ...alloc, [changedId]: clamped };

    if (othersTotal === 0) {
      const each = Math.floor((100 - clamped) / others.length);
      others.forEach((id, i) => {
        updated[id] = i === others.length - 1 ? 100 - clamped - each * (others.length - 1) : each;
      });
    } else {
      let remaining = 100 - clamped;
      others.forEach((id, i) => {
        if (i === others.length - 1) {
          updated[id] = Math.max(0, remaining);
        } else {
          const proportion = (alloc[id] || 0) / othersTotal;
          const v = Math.max(0, Math.round(proportion * (100 - clamped)));
          updated[id] = v;
          remaining -= v;
        }
      });
    }
    setAlloc(updated);
  }, [alloc, assets]);

  // Risk alignment check
  const highRiskIds = ["stocks"];
  const highRiskPct = highRiskIds.reduce((s, id) => s + (alloc[id] ?? 0), 0);
  const riskTarget = round.riskTarget;
  const overRisk = highRiskPct > riskTarget.maxHighRiskPct;

  const nextRound = CHAOS_ROUNDS[state.currentRound]; // may be undefined for last round
  const yearsInRound = nextRound ? nextRound.age - round.age : 2;
  const annualContribution = round.monthlyIncome * 12 * round.investableIncomePct;
  const totalContributions = annualContribution * yearsInRound;

  // Projected return: compound existing portfolio + contributions over yearsInRound
  const projectedReturn = useMemo(() => {
    let annualRet = 0;
    for (const id of assets) {
      annualRet += ((alloc[id] || 0) / 100) * (round.marketReturns[id] ?? 0);
    }
    const compounded = state.portfolioValue * Math.pow(1 + annualRet, yearsInRound);
    let contribGrowth = 0;
    for (let y = 0; y < yearsInRound; y++) {
      contribGrowth += annualContribution * Math.pow(1 + annualRet, yearsInRound - y - 1);
    }
    return compounded + contribGrowth - state.portfolioValue - totalContributions;
  }, [alloc, assets, round, state.portfolioValue, yearsInRound, annualContribution, totalContributions]);

  const projectedPct = useMemo(() => {
    let annualRet = 0;
    for (const id of assets) {
      annualRet += ((alloc[id] || 0) / 100) * (round.marketReturns[id] ?? 0);
    }
    return (Math.pow(1 + annualRet, yearsInRound) - 1) * 100;
  }, [alloc, assets, round, yearsInRound]);

  const investableIncome = totalContributions;

  return (
    <div className="px-5 pb-8 pt-4">
      <motion.span
        style={{ fontFamily: "var(--font-mono)", fontSize: 9, textTransform: "uppercase", letterSpacing: "0.14em", color: "var(--ink-4)" }}
        variants={fadeUp} initial="hidden" animate="visible" custom={0}
      >
        Allocate Your Portfolio
      </motion.span>

      {/* Income injection notice */}
      <motion.div
        className="mt-3 mb-4"
        style={{
          padding: "10px 14px", borderRadius: "var(--radius-sm)",
          background: "rgba(92,138,78,0.08)", border: "1px solid rgba(92,138,78,0.25)",
        }}
        variants={fadeUp} initial="hidden" animate="visible" custom={1}
      >
        <span style={{ fontSize: 12, color: "#3A6B2A", lineHeight: 1.6 }}>
          💰 PPF {investableIncome.toLocaleString(undefined, { maximumFractionDigits: 0 })} invested over {yearsInRound} years (PPF {annualContribution.toLocaleString(undefined, { maximumFractionDigits: 0 })}/yr).
        </span>
      </motion.div>

      {/* Risk target warning */}
      {overRisk && (
        <motion.div
          className="mb-4"
          style={{
            padding: "10px 14px", borderRadius: "var(--radius-sm)",
            background: "rgba(184,112,96,0.08)", border: "1px solid rgba(184,112,96,0.3)",
          }}
          variants={fadeUp} initial="hidden" animate="visible" custom={2}
        >
          <span style={{ fontSize: 12, color: "#8B3A2A", lineHeight: 1.6 }}>
            ⚠️ At age {state.age}, your risk profile suggests max {riskTarget.maxHighRiskPct}% in high-risk assets. You're at {highRiskPct}%.
          </span>
        </motion.div>
      )}

      {/* Sliders */}
      <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={3}>
        {assets.map((id) => {
          const color = ASSET_COLORS[id] ?? "#0f4a58";
          const icon = ASSET_ICONS[id] ?? "💰";
          const tip = EXTENDED_ASSET_TIPS[id];
          const pct = alloc[id] || 0;
          const ret = (round.marketReturns[id] ?? 0) * 100;

          return (
            <div key={id} className="mb-3" style={{
              background: "#FFF9E5", border: "1px solid var(--rule)",
              borderRadius: "var(--radius)", padding: "14px 16px",
            }}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2.5">
                  <span style={{
                    width: 32, height: 32, borderRadius: "50%",
                    background: `${color}14`, fontSize: 16,
                    border: `1.5px solid ${color}30`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    {icon}
                  </span>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 500, color: "var(--ink)" }}>{tip?.name ?? id}</div>
                    <div style={{ fontSize: 10, color: "var(--ink-4)", marginTop: 1 }}>Risk: {tip?.risk ?? "—"}</div>
                  </div>
                </div>
                <span style={{
                  fontFamily: "var(--font-mono)", fontSize: 11, fontWeight: 500,
                  padding: "2px 8px", borderRadius: 20,
                  background: ret >= 0 ? "rgba(15,74,88,0.06)" : "rgba(184,112,96,0.08)",
                  color: ret >= 0 ? "#0f4a58" : "var(--coral)",
                }}>
                  {ret >= 0 ? "+" : ""}{ret.toFixed(1)}%
                </span>
              </div>

              <div className="flex items-center gap-3 mt-1">
                <div className="flex-1 relative h-8 flex items-center">
                  <div className="absolute left-0 right-0 h-2 rounded-full" style={{ background: "var(--rule-light)" }} />
                  <div className="absolute left-0 h-2 rounded-full" style={{
                    width: `${pct}%`, background: color, opacity: 0.5, transition: "width 0.15s ease",
                  }} />
                  <input
                    type="range" min={0} max={100} step={1} value={pct}
                    onChange={(e) => handleSlider(id, parseInt(e.target.value))}
                    style={{ WebkitAppearance: "none", appearance: "none", background: "transparent", height: 32, cursor: "pointer", position: "relative", zIndex: 10, width: "100%" }}
                  />
                </div>
                <div style={{
                  width: 48, height: 32, borderRadius: "var(--radius-xs)",
                  background: pct > 0 ? `${color}10` : "var(--surface-dim)",
                  border: `1px solid ${pct > 0 ? color + "30" : "var(--rule)"}`,
                  fontFamily: "var(--font-mono)", fontSize: 13, fontWeight: 500,
                  color: pct > 0 ? color : "var(--ink-4)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  transition: "all 0.2s ease",
                }}>
                  {pct}%
                </div>
              </div>
            </div>
          );
        })}
      </motion.div>

      {/* Projected return */}
      <motion.div
        className="mt-2 flex items-center justify-between px-1"
        variants={fadeUp} initial="hidden" animate="visible" custom={4}
      >
        <div className="flex items-center gap-2">
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 9, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--ink-4)" }}>
            Projected market gain
          </span>
          <span style={{
            fontFamily: "var(--font-mono)", fontSize: 13, fontWeight: 500,
            color: projectedReturn >= 0 ? "#0f4a58" : "var(--coral)",
          }}>
            {projectedReturn >= 0 ? "+" : ""}PPF {projectedReturn.toFixed(0)}
            <span style={{ fontSize: 10, opacity: 0.7, marginLeft: 3 }}>
              ({projectedPct >= 0 ? "+" : ""}{projectedPct.toFixed(1)}%)
            </span>
          </span>
        </div>
      </motion.div>

      <motion.button
        className="mt-6 w-full cursor-pointer"
        style={{
          background: "var(--ink)", color: "var(--bg)",
          border: "none", borderRadius: "var(--radius-sm)",
          padding: "14px 24px", fontSize: 14, fontWeight: 500,
          fontFamily: "var(--font-body)",
        }}
        variants={fadeUp} initial="hidden" animate="visible" custom={5}
        whileTap={{ scale: 0.97 }}
        onClick={() => dispatch({ type: "CONFIRM_ALLOCATION", allocation: alloc })}
      >
        Confirm Allocation
      </motion.button>
    </div>
  );
}
