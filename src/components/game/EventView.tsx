"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { EventScenario, EventOption } from "@/types";
import { FeedbackFlash } from "./FeedbackFlash";

interface EventViewProps {
  scenario: EventScenario;
  onComplete: (totalXp: number) => void;
}

export function EventView({ scenario, onComplete }: EventViewProps) {
  const { prompt, description, options, time_limit_seconds } = scenario;
  const [selected, setSelected] = useState<EventOption | null>(null);
  const [timeLeft, setTimeLeft] = useState(time_limit_seconds ?? 0);
  const [feedback, setFeedback] = useState<{
    type: "good" | "bad";
    message: string;
    xp: number;
    lesson: string;
  } | null>(null);

  useEffect(() => {
    if (!time_limit_seconds || selected) return;
    if (timeLeft <= 0) {
      const worst = options.reduce((a, b) => (a.xp < b.xp ? a : b));
      handleSelect(worst);
      return;
    }
    const timer = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, time_limit_seconds, selected]);

  const handleSelect = useCallback(
    (option: EventOption) => {
      if (selected) return;
      setSelected(option);
      setFeedback({
        type: option.correct ? "good" : "bad",
        message: option.correct ? "Smart move!" : "Not the best choice",
        xp: option.xp,
        lesson: option.feedback,
      });
    },
    [selected]
  );

  const timerPct = time_limit_seconds ? (timeLeft / time_limit_seconds) * 100 : 100;
  const timerUrgent = time_limit_seconds ? timeLeft <= 5 : false;

  return (
    <div className="game-container flex h-full flex-col justify-center py-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
      >
        {/* Event card */}
        <div className="card-game card-warm relative overflow-hidden">
          {/* Timer bar */}
          {time_limit_seconds && !selected && (
            <div className="absolute left-0 top-0 right-0 h-1.5" style={{ background: "var(--game-border)" }}>
              <motion.div
                className="h-full rounded-r-full"
                animate={{ width: `${timerPct}%` }}
                transition={{ duration: 1, ease: "linear" }}
                style={{
                  background: timerUrgent
                    ? "var(--game-danger)"
                    : "var(--game-accent)",
                }}
              />
            </div>
          )}

          {/* Event header */}
          <div className="mb-5 pt-2 text-center">
            <motion.div
              animate={timerUrgent && !selected ? { scale: [1, 1.1, 1] } : {}}
              transition={{ repeat: Infinity, duration: 0.6 }}
              className="icon-circle icon-circle-coral mx-auto mb-4"
            >
              ⚡
            </motion.div>
            <h2
              className="mb-2 text-xl"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {prompt}
            </h2>
            <p className="text-sm leading-relaxed" style={{ color: "var(--game-text-body)" }}>
              {description}
            </p>
          </div>

          {/* Timer countdown text */}
          {time_limit_seconds && !selected && (
            <div className="mb-4 text-center">
              <span
                className="font-mono text-lg font-bold"
                style={{ color: timerUrgent ? "var(--game-danger)" : "var(--game-accent)" }}
              >
                {timeLeft}s
              </span>
            </div>
          )}

          {/* Options */}
          <div className="space-y-3">
            {options.map((option, i) => {
              const isSelected = selected === option;
              const isOther = selected && !isSelected;

              let bg = "var(--game-bg)";
              let border = "var(--game-border)";
              let color = "var(--game-secondary)";

              if (isSelected && option.correct) {
                bg = "var(--feedback-good-bg)";
                border = "var(--game-primary)";
                color = "var(--feedback-good-text)";
              } else if (isSelected && !option.correct) {
                bg = "var(--feedback-bad-bg)";
                border = "var(--game-danger)";
                color = "var(--feedback-bad-text)";
              }

              return (
                <motion.button
                  key={i}
                  initial={{ opacity: 0, x: -15 }}
                  animate={{
                    opacity: isOther ? 0.35 : 1,
                    x: 0,
                    scale: isSelected ? 1.02 : 1,
                  }}
                  transition={{ delay: i * 0.08 }}
                  onClick={() => handleSelect(option)}
                  disabled={!!selected}
                  className="btn-choice"
                  style={{ background: bg, borderColor: border, color }}
                >
                  <span
                    className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-sm font-semibold"
                    style={{
                      background: isSelected
                        ? option.correct ? "var(--game-primary)" : "var(--game-danger)"
                        : "var(--game-surface)",
                      color: isSelected ? "white" : "var(--game-text-dim)",
                    }}
                  >
                    {isSelected ? (option.correct ? "✓" : "✗") : String.fromCharCode(65 + i)}
                  </span>
                  {option.label}
                </motion.button>
              );
            })}
          </div>
        </div>
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