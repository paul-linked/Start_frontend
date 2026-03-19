"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface FeedbackFlashProps {
  type: "good" | "neutral" | "bad";
  message: string;
  xp: number;
  lesson?: string;
  onDone: () => void;
  duration?: number;
}

const tones = {
  good: {
    bg: "var(--feedback-good-bg)",
    text: "var(--feedback-good-text)",
    icon: "✓",
    iconBg: "#7BA86A",
    title: "Nice move!",
  },
  neutral: {
    bg: "var(--feedback-neutral-bg)",
    text: "var(--feedback-neutral-text)",
    icon: "~",
    iconBg: "#D4A05A",
    title: "Not bad",
  },
  bad: {
    bg: "var(--feedback-bad-bg)",
    text: "var(--feedback-bad-text)",
    icon: "✗",
    iconBg: "#C25B4A",
    title: "Hmm...",
  },
};

export function FeedbackFlash({
  type,
  message,
  xp,
  lesson,
  onDone,
  duration = 3000,
}: FeedbackFlashProps) {
  const [visible, setVisible] = useState(true);
  const tone = tones[type];

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onDone, 350);
    }, duration);
    return () => clearTimeout(timer);
  }, [duration, onDone]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-50 flex items-end justify-center px-5 pb-8 sm:items-center sm:pb-0"
          style={{ background: "rgba(59,90,58,0.12)" }}
          onClick={() => { setVisible(false); setTimeout(onDone, 350); }}
        >
          <motion.div
            initial={{ y: 60, scale: 0.95 }}
            animate={{ y: 0, scale: 1 }}
            exit={{ y: 40, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="w-full max-w-sm overflow-hidden rounded-3xl"
            style={{ background: tone.bg, color: tone.text }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top accent strip */}
            <div className="h-1" style={{ background: tone.iconBg }} />

            <div className="p-6 text-center">
              {/* Icon */}
              <motion.div
                initial={{ scale: 0, rotate: -20 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.15, type: "spring", stiffness: 400, damping: 15 }}
                className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full text-xl font-bold text-white"
                style={{ background: tone.iconBg }}
              >
                {tone.icon}
              </motion.div>

              {/* Title */}
              <h3
                className="mb-1 text-xl"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {tone.title}
              </h3>

              {/* Message */}
              <p className="mb-2 text-sm opacity-90">{message}</p>

              {/* Lesson */}
              {lesson && (
                <p className="mb-4 text-sm leading-relaxed opacity-70">{lesson}</p>
              )}

              {/* XP badge */}
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: "spring" }}
                className="badge badge-xp text-base"
              >
                +{xp} XP
              </motion.span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}