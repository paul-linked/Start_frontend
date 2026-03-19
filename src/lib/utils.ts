import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Merge Tailwind classes without conflicts */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Format seconds as mm:ss */
export function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

/** Simple sound manager using Howler (lazy-loaded) */
const sounds = new Map<string, Howl>();

export async function playSound(name: string, src?: string) {
  if (typeof window === "undefined") return;

  if (!sounds.has(name) && src) {
    const { Howl } = await import("howler");
    sounds.set(name, new Howl({ src: [src], volume: 0.5 }));
  }

  sounds.get(name)?.play();
}

/** Vibrate device (mobile PWA) */
export function haptic(ms: number | number[] = 50) {
  if (typeof navigator !== "undefined" && "vibrate" in navigator) {
    navigator.vibrate(ms);
  }
}
