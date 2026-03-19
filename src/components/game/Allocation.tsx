"use client";

import { motion } from "framer-motion";
import { useState, useMemo } from "react";
import { useGame } from "@/lib/GameContext";
import { ROUNDS } from "@/lib/gameData";
import type { PortfolioAllocation } from "../../types";

const fadeUp = {
  hidden: { opacity: 0, y: 14 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.08 + i * 0.08, duration: 0.4, ease: "easeOut" },
  }),
};

export default function Allocation() {
  const { state, dispatch } = useGame();
  const round = ROUNDS[state.currentRound - 1];
  if (!round || round.quest.type !== "allocation") return null;

  const quest = round.quest;
  const products = quest.products;

  // Initialize from existing allocation or even split
  const [alloc, setAlloc] = useState<PortfolioAllocation>(() => {
    const init: PortfolioAllocation = {};
    const evenSplit = Math.floor(100 / products.length);
    products.forEach((p, i) => {
      init[p.id] =
        state.allocation[p.id] ??
        (i === products.length - 1
          ? 100 - evenSplit * (products.length - 1)
          : evenSplit);
    });
    return init;
  });

  const total = useMemo(
    () => Object.values(alloc).reduce((sum, v) => sum + v, 0),
    [alloc]
  );

  const projectedReturn = useMemo(() => {
    let ret = 0;
    for (const p of products) {
      ret += ((alloc[p.id] || 0) / 100) * (p.returnPct / 100);
    }
    return ret * state.portfolioValue;
  }, [alloc, products, state.portfolioValue]);

  function handleSlider(productId: string, newVal: number) {
    const others = products.filter((p) => p.id !== productId);
    const otherTotal = others.reduce((s, p) => s + (alloc[p.id] || 0), 0);

    // Clamp to available
    const maxVal = Math.min(100, 100 - 0); // Allow any value, we just show total
    const clamped = Math.max(0, Math.min(maxVal, newVal));

    setAlloc((prev) => ({ ...prev, [productId]: clamped }));
  }

  const isValid = total >= 95 && total <= 105; // Allow small rounding tolerance

  return (
    <div className="px-5 pb-8 pt-4">
      {/* Header */}
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
        Allocate Your Portfolio
      </motion.span>

      {/* Market context */}
      <motion.p
        className="mt-2 mb-4"
        style={{
          fontSize: 13,
          fontStyle: "italic",
          fontWeight: 300,
          color: "var(--ink-3)",
          lineHeight: 1.6,
        }}
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        custom={1}
      >
        {quest.marketContext}
      </motion.p>

      {/* Allocation table */}
      <motion.div
        style={{ borderTop: "2px solid var(--ink)" }}
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        custom={2}
      >
        {products.map((product) => (
          <div
            key={product.id}
            className="flex items-center gap-3"
            style={{
              padding: "14px 0",
              borderBottom: "1px solid var(--rule)",
            }}
          >
            <div className="flex-1 min-w-0">
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 500,
                  color: "var(--ink)",
                }}
              >
                {product.name}
              </div>
              <div
                className="flex items-center gap-2 mt-0.5"
                style={{
                  fontSize: 11,
                  color: "var(--ink-4)",
                }}
              >
                <span>{product.description}</span>
                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 10,
                    color:
                      product.returnPct >= 0
                        ? "var(--green-muted)"
                        : "var(--coral)",
                  }}
                >
                  {product.returnDisplay ||
                    `${product.returnPct >= 0 ? "+" : ""}${product.returnPct}%`}
                </span>
              </div>
            </div>

            {/* Slider */}
            <input
              type="range"
              min={0}
              max={100}
              value={alloc[product.id] || 0}
              onChange={(e) =>
                handleSlider(product.id, parseInt(e.target.value))
              }
              className="w-20"
            />

            {/* Percentage */}
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 12,
                fontWeight: 500,
                color: "var(--ink-2)",
                width: 36,
                textAlign: "right",
              }}
            >
              {alloc[product.id] || 0}%
            </span>
          </div>
        ))}
      </motion.div>

      {/* Total + projected */}
      <motion.div
        className="mt-4 flex items-center justify-between"
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        custom={3}
      >
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 11,
            color: total === 100 ? "var(--ink-3)" : "var(--coral)",
            fontWeight: 500,
          }}
        >
          Total: {total}%
          {total !== 100 && " (must be 100%)"}
        </span>
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 11,
            color: projectedReturn >= 0 ? "var(--green-muted)" : "var(--coral)",
          }}
        >
          Est. return: {projectedReturn >= 0 ? "+" : ""}CHF{" "}
          {projectedReturn.toFixed(2)}
        </span>
      </motion.div>

      {/* Confirm */}
      <motion.button
        className="mt-6 w-full cursor-pointer"
        style={{
          background: isValid ? "var(--ink)" : "var(--ink-5)",
          color: "var(--bg)",
          border: "1px solid var(--ink)",
          borderRadius: "var(--radius-sm)",
          padding: "13px 24px",
          fontSize: 14,
          fontWeight: 500,
          fontFamily: "var(--font-body)",
          opacity: isValid ? 1 : 0.5,
          pointerEvents: isValid ? "auto" : "none",
        }}
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        custom={4}
        whileTap={{ scale: 0.97 }}
        onClick={() =>
          dispatch({ type: "ALLOCATION_CONFIRM", allocation: alloc })
        }
      >
        Confirm Allocation
      </motion.button>
    </div>
  );
}