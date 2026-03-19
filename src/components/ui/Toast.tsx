"use client";

import { create } from "zustand";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useEffect } from "react";

// ─── Store ───
type ToastType = "info" | "success" | "error" | "warning";

interface Toast {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}

interface ToastStore {
  toasts: Toast[];
  add: (message: string, type?: ToastType, duration?: number) => void;
  remove: (id: string) => void;
}

export const useToastStore = create<ToastStore>((set) => ({
  toasts: [],
  add: (message, type = "info", duration = 3000) => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    set((s) => ({ toasts: [...s.toasts, { id, message, type, duration }] }));
  },
  remove: (id) =>
    set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
}));

// Convenience
export const toast = {
  info: (msg: string) => useToastStore.getState().add(msg, "info"),
  success: (msg: string) => useToastStore.getState().add(msg, "success"),
  error: (msg: string) => useToastStore.getState().add(msg, "error"),
  warning: (msg: string) => useToastStore.getState().add(msg, "warning"),
};

// ─── Single Toast ───
function ToastItem({ id, message, type, duration = 3000 }: Toast) {
  const remove = useToastStore((s) => s.remove);

  useEffect(() => {
    const timer = setTimeout(() => remove(id), duration);
    return () => clearTimeout(timer);
  }, [id, duration, remove]);

  const typeStyles: Record<ToastType, string> = {
    info: "border-game-primary/40 text-game-primary",
    success: "border-game-success/40 text-game-success",
    error: "border-game-danger/40 text-game-danger",
    warning: "border-game-accent/40 text-game-accent",
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 50, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 50, scale: 0.95 }}
      className={cn(
        "pointer-events-auto rounded-lg border bg-game-surface/95 px-4 py-3 shadow-game backdrop-blur-sm",
        "font-body text-sm",
        typeStyles[type]
      )}
      onClick={() => remove(id)}
    >
      {message}
    </motion.div>
  );
}

// ─── Toast Container (mount once in layout) ───
export function ToastContainer() {
  const toasts = useToastStore((s) => s.toasts);

  return (
    <div className="pointer-events-none fixed right-4 top-4 z-[100] flex flex-col gap-2">
      <AnimatePresence mode="popLayout">
        {toasts.map((t) => (
          <ToastItem key={t.id} {...t} />
        ))}
      </AnimatePresence>
    </div>
  );
}
