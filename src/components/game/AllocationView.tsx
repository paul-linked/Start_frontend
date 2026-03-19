"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import type { AllocationScenario } from "@/types";
import { FeedbackFlash } from "./FeedbackFlash";

interface AllocationViewProps {
  scenario: AllocationScenario;
  onComplete: (totalXp: number) => void;
}

export function AllocationView({ scenario, onComplete }: AllocationViewProps) {
  const { accounts, starting_balance, optimal, goal } = scenario;

  const [allocation, setAllocation] = useState<Record<string, number>>(() => {
    const init: Record<string, number> = {};
    accounts.forEach((acc, i) => {
      init[acc.id] = i === 0 ? starting_balance : 0;
    });
    return init;
  });

  const [submitted, setSubmitted] = useState(false);
  const [feedback, setFeedback] = useState<{
    type: "good" | "neutral" | "bad";
    message: string;
    xp: number;
    lesson: string;
  } | null>(null);

  const isLocked = (id: string) => id === "investing";

  const handleSlider = useCallback(
    (accountId: string, newValue: number) => {
      if (isLocked(accountId)) return;
      setAllocation((prev) => {
        const updated = { ...prev };
        const diff = newValue - updated[accountId];
        const adjustable = accounts
          .filter((a) => a.id !== accountId && !isLocked(a.id))
          .map((a) => a.id);
        if (adjustable.length === 0) return prev;

        let remaining = -diff;
        for (const id of adjustable) {
          const take = Math.round(remaining / adjustable.length);
          const clamped = Math.max(0, Math.min(starting_balance, updated[id] + take));
          remaining -= clamped - updated[id];
          updated[id] = clamped;
        }
        updated[accountId] = newValue;

        const total = Object.values(updated).reduce((a, b) => a + b, 0);
        if (total !== starting_balance) {
          updated[adjustable[0]] += starting_balance - total;
        }
        return updated;
      });
    },
    [accounts, starting_balance]
  );

  const handleSubmit = () => {
    const maxDiff = starting_balance * 2;
    let totalDiff = 0;
    for (const acc of accounts) {
      totalDiff += Math.abs(allocation[acc.id] - (optimal[acc.id] ?? 0));
    }
    const score = Math.round(Math.max(0, (1 - totalDiff / maxDiff) * 100));
    const xp = Math.round(score * 0.3);
    const type = score >= 70 ? "good" : score >= 40 ? "neutral" : "bad";

    setSubmitted(true);
    setFeedback({
      type,
      message:
        type === "good"
          ? "Great allocation!"
          : type === "neutral"
          ? "Not bad, but room to improve"
          : "Most of your money isn't working for you",
      xp,
      lesson:
        "Keep enough in checking for daily expenses. Put the rest where it grows — even 1.5% adds up over time.",
    });
  };

  const yearlyReturn = accounts.reduce(
    (sum, acc) => sum + (allocation[acc.id] * acc.interest) / 100,
    0
  );

  return (
    <div className="game-container flex h-full flex-col justify-center py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {/* Header */}
        <div className="mb-2 text-center">
          <div className="icon-circle icon-circle-green mx-auto mb-4">🏦</div>
          <h2
            className="mb-1 text-xl"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {goal}
          </h2>
          <p className="text-sm text-dim">
            Drag the sliders to split your ${starting_balance}
          </p>
        </div>

        {/* Visual bar showing allocation proportions */}
        <div className="my-6 flex h-4 overflow-hidden rounded-full" style={{ background: "var(--game-surface)" }}>
          {accounts.map((acc) => {
            const pct = (allocation[acc.id] / starting_balance) * 100;
            if (pct === 0) return null;
            return (
              <motion.div
                key={acc.id}
                layout
                className="h-full first:rounded-l-full last:rounded-r-full"
                style={{
                  width: `${pct}%`,
                  background: isLocked(acc.id) ? "var(--game-border)" : acc.color === "#E8F2E0" ? "var(--game-primary)" : "#6BA3C7",
                  opacity: isLocked(acc.id) ? 0.3 : 1,
                }}
              />
            );
          })}
        </div>

        {/* Account sliders */}
        <div className="mb-6 space-y-4">
          {accounts.map((acc) => {
            const locked = isLocked(acc.id);
            const value = allocation[acc.id];
            const pct = Math.round((value / starting_balance) * 100);
            const barColor = acc.color === "#E8F2E0" ? "var(--game-primary)" : "#6BA3C7";

            return (
              <motion.div
                key={acc.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="card-game"
                style={{ opacity: locked ? 0.45 : 1 }}
              >
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="h-3 w-3 rounded-full"
                      style={{
                        background: locked ? "var(--game-border)" : barColor,
                      }}
                    />
                    <div>
                      <span className="text-sm font-semibold" style={{ color: "var(--game-secondary)" }}>
                        {acc.label}
                      </span>
                      <span className="ml-2 text-xs text-dim">{acc.interest > 0 ? `${acc.interest}% interest` : "0% interest"}</span>
                    </div>
                  </div>
                  <span className="rounded-lg px-3 py-1 font-mono text-sm font-semibold" style={{ background: "var(--game-surface)", color: "var(--game-secondary)" }}>
                    ${value}
                  </span>
                </div>

                {locked ? (
                  <div
                    className="flex h-10 items-center justify-center rounded-xl text-sm"
                    style={{ background: "var(--game-surface)", color: "var(--game-text-dim)" }}
                  >
                    🔒 You&apos;ll unlock this soon
                  </div>
                ) : (
                  <input
                    type="range"
                    min={0}
                    max={starting_balance}
                    step={50}
                    value={value}
                    onChange={(e) => handleSlider(acc.id, Number(e.target.value))}
                    disabled={submitted}
                    className="w-full"
                    style={{
                      background: `linear-gradient(to right, ${barColor} ${pct}%, var(--game-border) ${pct}%)`,
                    }}
                  />
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Projected return card */}
        <motion.div
          layout
          className="mb-6 overflow-hidden rounded-2xl p-5 text-center"
          style={{ background: yearlyReturn > 0 ? "var(--feedback-good-bg)" : "var(--game-surface)" }}
        >
          <p className="text-xs font-medium text-dim">
            Projected yearly return
          </p>
          <p
            className="my-1 font-mono text-3xl font-bold"
            style={{ color: yearlyReturn > 0 ? "var(--game-primary-dark)" : "var(--game-text-dim)" }}
          >
            +${yearlyReturn.toFixed(0)}
          </p>
          <p className="text-xs text-dim">per year, risk-free</p>
        </motion.div>

        {!submitted && (
          <motion.button
            whileTap={{ scale: 0.97 }}
            className="btn-primary w-full py-4 text-base"
            onClick={handleSubmit}
          >
            Lock in allocation
          </motion.button>
        )}
      </motion.div>

      {feedback && (
        <FeedbackFlash
          type={feedback.type}
          message={feedback.message}
          xp={feedback.xp}
          lesson={feedback.lesson}
          onDone={() => { setFeedback(null); onComplete(feedback.xp); }}
        />
      )}
    </div>
  );
}