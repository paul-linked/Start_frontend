"use client";

import { motion } from "framer-motion";

interface ResultsScreenProps {
  nodeLabel: string;
  xpEarned: number;
  lessons: string[];
  achievements: string[];
  onContinue: () => void;
}

export function ResultsScreen({
  nodeLabel,
  xpEarned,
  lessons,
  achievements,
  onContinue,
}: ResultsScreenProps) {
  return (
    <div className="game-container flex min-h-full flex-col items-center justify-center py-10">
      {/* Decorative confetti dots */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: -20 }}
            animate={{
              opacity: [0, 0.6, 0],
              y: [-(20 + i * 10), 200 + i * 30],
              x: Math.sin(i * 1.2) * 60,
            }}
            transition={{
              delay: 0.3 + i * 0.08,
              duration: 2 + i * 0.15,
              ease: "easeOut",
            }}
            className="absolute rounded-full"
            style={{
              width: 6 + (i % 3) * 3,
              height: 6 + (i % 3) * 3,
              left: `${15 + (i * 7) % 70}%`,
              background:
                i % 3 === 0
                  ? "var(--game-primary)"
                  : i % 3 === 1
                  ? "var(--game-accent)"
                  : "var(--game-wheat)",
            }}
          />
        ))}
      </div>

      {/* Completion icon */}
      <motion.div
        initial={{ scale: 0, rotate: -30 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ delay: 0.1, type: "spring", stiffness: 200, damping: 12 }}
        className="relative mb-6"
      >
        <div
          className="flex h-24 w-24 items-center justify-center rounded-full text-5xl"
          style={{ background: "var(--game-primary-light)", border: "4px solid var(--game-primary)" }}
        >
          🌱
        </div>
        {/* Glow ring */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1.3, opacity: 0 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="absolute inset-0 rounded-full"
          style={{ border: "3px solid var(--game-primary)" }}
        />
      </motion.div>

      {/* Title */}
      <motion.h2
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="mb-1 text-center text-2xl"
        style={{ fontFamily: "var(--font-display)" }}
      >
        Level complete!
      </motion.h2>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.35 }}
        className="mb-8 text-center text-sm text-dim"
      >
        {nodeLabel}
      </motion.p>

      {/* XP display */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.45, type: "spring" }}
        className="mb-8 w-full overflow-hidden rounded-2xl p-6 text-center"
        style={{ background: "var(--game-wheat)" }}
      >
        <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: "#9A7630" }}>
          Experience earned
        </p>
        <motion.p
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6, type: "spring", stiffness: 150 }}
          className="my-2 font-mono text-4xl font-bold"
          style={{ color: "#5A4310" }}
        >
          +{xpEarned}
        </motion.p>
        <p className="text-xs" style={{ color: "#9A7630" }}>XP</p>
      </motion.div>

      {/* Lessons learned */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="mb-6 w-full"
      >
        <h3 className="mb-3 text-center text-xs font-semibold uppercase tracking-wider text-dim">
          What you learned
        </h3>
        <div className="space-y-3">
          {lessons.map((lesson, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 + i * 0.12 }}
              className="card-game flex items-start gap-3"
            >
              <span
                className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold text-white"
                style={{ background: "var(--game-primary)" }}
              >
                ✓
              </span>
              <p className="text-sm leading-relaxed" style={{ color: "var(--game-text-body)" }}>
                {lesson}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Achievements */}
      {achievements.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1 }}
          className="mb-8 flex flex-wrap justify-center gap-2"
        >
          {achievements.map((ach, i) => (
            <motion.span
              key={i}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 1.2 + i * 0.1, type: "spring" }}
              className="badge badge-level"
            >
              🌼 {ach}
            </motion.span>
          ))}
        </motion.div>
      )}

      {/* Continue */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.3 }}
        className="w-full"
      >
        <button className="btn-primary w-full py-4 text-base" onClick={onContinue}>
          Continue to map →
        </button>
      </motion.div>
    </div>
  );
}