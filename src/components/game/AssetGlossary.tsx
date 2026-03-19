"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ROUNDS } from "@/lib/gameData";
import { useGame } from "@/lib/GameContext";

const ASSET_DEFINITIONS: Record<string, { name: string; definition: string; risk: string }> = {
  savings: {
    name: "Savings Account",
    definition: "A bank account that holds your money safely and pays a small fixed interest rate. Your capital is guaranteed — but at 0.5%, inflation often eats your real returns.",
    risk: "Low",
  },
  bonds: {
    name: "Gov. Bonds",
    definition: "A loan you give to the government. They pay you back with interest over a fixed period. Safer than stocks, but returns are modest. Bonds often rise when stocks fall.",
    risk: "Low",
  },
  etf: {
    name: "Broad Market ETF",
    definition: "A single fund that tracks hundreds of companies at once. You get instant diversification without picking individual stocks. The whole market goes up — and down — together.",
    risk: "Medium",
  },
  stocks: {
    name: "Individual Stocks",
    definition: "A share of ownership in one specific company. High upside if the company does well, but a single bad quarter can wipe out months of gains. Concentration risk is real.",
    risk: "High",
  },
  gold: {
    name: "Gold",
    definition: "A physical commodity used as a store of value for thousands of years. Doesn't pay dividends or interest, but tends to hold value when currencies weaken or markets panic.",
    risk: "Medium",
  },
  reits: {
    name: "REITs",
    definition: "Real Estate Investment Trusts — funds that own income-producing properties. You get property exposure and regular dividends without buying a flat. Sensitive to interest rates.",
    risk: "Medium",
  },
};

const RISK_COLOR: Record<string, string> = {
  Low: "var(--green)",
  Medium: "var(--gold)",
  High: "var(--coral)",
};

export default function AssetGlossary() {
  const [open, setOpen] = useState(false);
  const { state } = useGame();

  const round = ROUNDS[state.currentRound - 1];
  if (!round) return null;

  // Collect available asset IDs from the current round's market returns
  const availableIds = Object.keys(round.marketReturns);
  const assets = availableIds
    .map((id) => ASSET_DEFINITIONS[id])
    .filter(Boolean);

  if (assets.length === 0) return null;

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen(true)}
        className="fixed z-30 flex items-center gap-1.5 cursor-pointer"
        style={{
          bottom: 24,
          right: 16,
          background: "var(--surface)",
          border: "1px solid var(--rule)",
          borderRadius: "var(--radius-pill)",
          padding: "8px 14px",
          fontFamily: "var(--font-mono)",
          fontSize: 10,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          color: "var(--ink-3)",
          boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
        }}
        aria-label="Open asset glossary"
      >
        <span style={{ fontSize: 13 }}>📖</span>
        Assets
      </button>

      {/* Modal */}
      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 z-40"
              style={{ background: "rgba(26,26,24,0.4)" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
            />

            {/* Sheet */}
            <motion.div
              className="fixed z-50"
              style={{
                bottom: 0,
                left: "50%",
                width: "100%",
                maxWidth: 440,
                background: "var(--bg)",
                borderRadius: "var(--radius) var(--radius) 0 0",
                borderTop: "1px solid var(--rule)",
                padding: "20px 20px 36px",
                maxHeight: "75dvh",
                overflowY: "auto",
              }}
              initial={{ y: "100%", x: "-50%" }}
              animate={{ y: 0, x: "-50%" }}
              exit={{ y: "100%", x: "-50%" }}
              transition={{ type: "spring", damping: 28, stiffness: 300 }}
            >
              {/* Handle */}
              <div
                className="mx-auto mb-4"
                style={{
                  width: 36,
                  height: 3,
                  borderRadius: 2,
                  background: "var(--rule)",
                }}
              />

              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 9,
                    textTransform: "uppercase",
                    letterSpacing: "0.14em",
                    color: "var(--ink-4)",
                  }}
                >
                  Available Assets · Round {state.currentRound}
                </span>
                <button
                  onClick={() => setOpen(false)}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "var(--ink-4)",
                    fontSize: 18,
                    lineHeight: 1,
                    padding: "0 4px",
                  }}
                  aria-label="Close"
                >
                  ×
                </button>
              </div>

              {/* Asset list */}
              <div style={{ borderTop: "1px solid var(--rule)" }}>
                {assets.map((asset) => (
                  <div
                    key={asset.name}
                    style={{
                      padding: "14px 0",
                      borderBottom: "1px solid var(--rule-light)",
                    }}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span
                        style={{
                          fontFamily: "var(--font-display)",
                          fontSize: 15,
                          color: "var(--ink)",
                        }}
                      >
                        {asset.name}
                      </span>
                      <span
                        style={{
                          fontFamily: "var(--font-mono)",
                          fontSize: 9,
                          letterSpacing: "0.06em",
                          textTransform: "uppercase",
                          color: RISK_COLOR[asset.risk],
                        }}
                      >
                        {asset.risk} risk
                      </span>
                    </div>
                    <p
                      style={{
                        fontSize: 13,
                        color: "var(--ink-3)",
                        lineHeight: 1.6,
                        margin: 0,
                      }}
                    >
                      {asset.definition}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
