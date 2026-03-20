"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useCallback } from "react";
import { useChallenge } from "@/lib/ChallengeContext";
import { CHALLENGE_PHASES } from "@/lib/challengeData";

// ─── Panic Ticker ───
const TICKER_ITEMS = [
  "BREAKING: Crisis deepens across European markets",
  "Investors flee to safety — record outflows",
  "Central banks in emergency consultations",
  "\"Sell everything\" trending globally",
  "Volatility index hits 3-year high",
  "Trading halted on multiple exchanges",
];

function PanicTicker() {
  const text = TICKER_ITEMS.join("   ●   ");
  return (
    <div className="overflow-hidden" style={{ background: "var(--coral)", padding: "5px 0" }}>
      <motion.div
        className="whitespace-nowrap"
        style={{ fontFamily: "var(--font-mono)", fontSize: 9, fontWeight: 500, color: "#fff", letterSpacing: "0.03em" }}
        animate={{ x: [0, -2000] }}
        transition={{ duration: 35, repeat: Infinity, ease: "linear" }}
      >
        {text}   ●   {text}
      </motion.div>
    </div>
  );
}

// ─── App Icon ───
function AppIcon({ color, children }: { color: string; children: string }) {
  return (
    <div className="shrink-0 flex items-center justify-center" style={{
      width: 28, height: 28, borderRadius: 7, background: color, fontSize: 14,
    }}>
      {children}
    </div>
  );
}

// ─── Notification ───
function Notification({ source, headline, time, icon, iconColor, isRead, onTap, delay }: {
  source: string; headline: string; time: string; icon: string; iconColor: string; isRead: boolean; onTap: () => void; delay: number;
}) {
  return (
    <motion.button
      className="w-full text-left cursor-pointer"
      style={{
        background: "rgba(255, 249, 229, 0.82)",
        backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
        borderRadius: 16, padding: "12px 14px", border: "none",
        boxShadow: "0 1px 4px rgba(0,0,0,0.04), 0 0.5px 1px rgba(0,0,0,0.03)",
      }}
      initial={{ opacity: 0, x: 70, scale: 0.92 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      transition={{ delay, duration: 0.4, type: "spring", stiffness: 200, damping: 22 }}
      whileTap={{ scale: 0.97 }}
      onClick={onTap}
    >
      <div className="flex gap-3">
        <AppIcon color={iconColor}>{icon}</AppIcon>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-0.5">
            <span style={{ fontFamily: "var(--font-body)", fontSize: 12, fontWeight: 500, color: isRead ? "var(--ink-4)" : "var(--ink)" }}>{source}</span>
            <div className="flex items-center gap-1.5">
              <span style={{ fontFamily: "var(--font-body)", fontSize: 11, color: "var(--ink-5)" }}>{time}</span>
              {!isRead && <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#0f4a58" }} />}
            </div>
          </div>
          <div style={{
            fontSize: 13, color: isRead ? "var(--ink-3)" : "var(--ink-2)", lineHeight: 1.35,
            display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" as const, overflow: "hidden",
          }}>{headline}</div>
        </div>
      </div>
    </motion.button>
  );
}

// ─── Expanded Overlay ───
function ExpandedNotification({ source, headline, body, time, icon, iconColor, onClose }: {
  source: string; headline: string; body: string; time: string; icon: string; iconColor: string; onClose: () => void;
}) {
  return (
    <>
      <motion.div className="fixed inset-0 z-40" style={{ background: "rgba(0,0,0,0.15)", backdropFilter: "blur(2px)" }}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} />
      <motion.div className="fixed left-4 right-4 z-50" style={{
        top: 100, maxWidth: 420, margin: "0 auto", background: "rgba(255,249,229,0.96)",
        backdropFilter: "blur(30px)", WebkitBackdropFilter: "blur(30px)",
        borderRadius: 20, padding: "18px 18px 22px",
        boxShadow: "0 8px 40px rgba(0,0,0,0.10), 0 2px 10px rgba(0,0,0,0.06)",
      }}
        initial={{ opacity: 0, y: 30, scale: 0.92 }} animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.95 }} transition={{ type: "spring", stiffness: 280, damping: 24 }}
      >
        <div className="flex gap-3 items-start mb-3">
          <AppIcon color={iconColor}>{icon}</AppIcon>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <span style={{ fontFamily: "var(--font-body)", fontSize: 13, fontWeight: 500, color: "var(--ink)" }}>{source}</span>
              <span style={{ fontFamily: "var(--font-body)", fontSize: 11, color: "var(--ink-5)" }}>{time}</span>
            </div>
          </div>
        </div>
        <h3 style={{ fontFamily: "var(--font-display)", fontSize: 17, color: "var(--ink)", lineHeight: 1.3, marginBottom: 10 }}>{headline}</h3>
        <div style={{ height: 1, background: "var(--rule-light)", marginBottom: 10 }} />
        <p style={{ fontSize: 14, color: "var(--ink-2)", lineHeight: 1.75 }}
          dangerouslySetInnerHTML={{
            __html: body.replace(/<mark>/g, '<mark style="background:rgba(15,74,88,0.08);padding:1px 3px;border-radius:2px;color:var(--ink)">')
          }} />
        <div className="mt-4 text-center">
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: "var(--ink-5)", letterSpacing: "0.08em", textTransform: "uppercase" }}>Tap outside to close</span>
        </div>
      </motion.div>
    </>
  );
}

// ─── Chart ───
function CrashChart({ data, label, delta }: { data: number[]; label: string; delta: string }) {
  const min = Math.min(...data) * 0.85;
  const max = Math.max(...data) * 1.05;
  const range = max - min || 1;
  const w = 300; const h = 56;
  const isPositive = delta.startsWith("+");
  const color = isPositive ? "#0f4a58" : "var(--coral)";

  const points = data.map((val, i) => {
    const px = (i / (data.length - 1)) * w;
    const py = h - 6 - ((val - min) / range) * (h - 12);
    return `${px},${py}`;
  }).join(" ");
  const lastY = Number(points.split(" ").pop()?.split(",")[1]) || h / 2;

  return (
    <div style={{
      background: isPositive ? "rgba(15,74,88,0.04)" : "rgba(184,112,96,0.04)",
      border: `1px solid ${isPositive ? "rgba(15,74,88,0.12)" : "rgba(184,112,96,0.12)"}`,
      borderRadius: 14, padding: "10px 12px 6px",
    }}>
      <div className="flex items-baseline justify-between mb-1.5">
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 9, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--ink-4)" }}>{label}</span>
        <motion.span style={{ fontFamily: "var(--font-mono)", fontSize: 12, fontWeight: 600, color }}
          animate={{ opacity: [1, 0.5, 1] }} transition={{ duration: 1.5, repeat: Infinity }}
        >{delta}</motion.span>
      </div>
      <svg width="100%" height={h} viewBox={`0 0 ${w} ${h}`}>
        <polyline points={points} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx={w} cy={lastY} r="3" fill={color} />
      </svg>
    </div>
  );
}

// ─── Product config ───
const PRODUCT_COLORS: Record<string, string> = { savings: "#0f4a58", bonds: "#fecb03", etf: "#5C8A4E", gold: "#D4915A" };
const PRODUCT_ICONS: Record<string, string> = { savings: "🏦", bonds: "📜", etf: "📊", gold: "🥇" };

// ─── Main ───
export default function ChallengePhasePlay() {
  const { state, dispatch } = useChallenge();
  const phase = CHALLENGE_PHASES[state.currentPhase - 1];
  if (!phase) return null;

  const [expandedIdx, setExpandedIdx] = useState<number | null>(null);
  const [readSet, setReadSet] = useState<Set<number>>(new Set());
  const [showAllocation, setShowAllocation] = useState(false);
  const [alloc, setAlloc] = useState({ ...state.allocation });

  const products = Object.keys(state.allocation);

  function handleNotifTap(idx: number) {
    setExpandedIdx(idx);
    if (!readSet.has(idx)) {
      setReadSet((prev) => new Set(prev).add(idx));
      dispatch({ type: "READ_NOTIFICATION" });
    }
    if (!showAllocation) setTimeout(() => setShowAllocation(true), 200);
  }

  const handleSlider = useCallback((id: string, newVal: number) => {
    const clamped = Math.max(0, Math.min(100, Math.round(newVal)));
    if (clamped === (alloc[id] || 0)) return;
    const others = products.filter((p) => p !== id);
    const othersTotal = others.reduce((s, p) => s + (alloc[p] || 0), 0);
    const updated = { ...alloc, [id]: clamped };
    if (othersTotal === 0) {
      const each = Math.floor((100 - clamped) / others.length);
      others.forEach((p, i) => { updated[p] = i === others.length - 1 ? 100 - clamped - each * (others.length - 1) : each; });
    } else {
      let rem = 100 - clamped;
      others.forEach((p, i) => {
        if (i === others.length - 1) { updated[p] = Math.max(0, rem); }
        else { const v = Math.max(0, Math.round(((alloc[p] || 0) / othersTotal) * (100 - clamped))); updated[p] = v; rem -= v; }
      });
    }
    setAlloc(updated);
  }, [alloc, products]);

  return (
    <div className="pb-6">
      {/* Breaking banner */}
      <div className="flex items-center justify-center gap-2 py-2"
        style={{ background: "rgba(184,112,96,0.05)", borderBottom: "1px solid rgba(184,112,96,0.1)" }}>
        <motion.span style={{
          background: "var(--coral)", color: "#fff", fontFamily: "var(--font-mono)", fontSize: 8,
          fontWeight: 600, letterSpacing: "0.14em", padding: "2px 7px", borderRadius: 3, textTransform: "uppercase",
        }} animate={{ opacity: [1, 0.5, 1] }} transition={{ duration: 1.2, repeat: Infinity }}>
          Phase {state.currentPhase}
        </motion.span>
        <span style={{ fontFamily: "var(--font-display)", fontSize: 12, color: "var(--ink)", fontStyle: "italic" }}>
          {phase.title}
        </span>
      </div>

      <PanicTicker />

      <div className="px-5 pt-4">
        {/* Notifications */}
        <div className="flex flex-col gap-2">
          {phase.notifications.map((n, i) => (
            <Notification key={i} source={n.source} headline={n.headline} time={n.time}
              icon={n.icon} iconColor={n.iconColor} isRead={readSet.has(i)}
              onTap={() => handleNotifTap(i)} delay={0.3 + i * 0.35} />
          ))}
        </div>

        {/* Expanded overlay */}
        <AnimatePresence>
          {expandedIdx !== null && phase.notifications[expandedIdx] && (
            <ExpandedNotification
              source={phase.notifications[expandedIdx].source}
              headline={phase.notifications[expandedIdx].headline}
              body={phase.notifications[expandedIdx].body}
              time={phase.notifications[expandedIdx].time}
              icon={phase.notifications[expandedIdx].icon}
              iconColor={phase.notifications[expandedIdx].iconColor}
              onClose={() => setExpandedIdx(null)}
            />
          )}
        </AnimatePresence>

        {/* Chart */}
        <div className="mt-4">
          <CrashChart data={phase.chartData} label={phase.chartLabel} delta={phase.chartDelta} />
        </div>

        {/* Reallocation */}
        <AnimatePresence>
          {showAllocation && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }} className="mt-5">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: 9, textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--ink-4)" }}>
                    Your allocation
                  </span>
                  <motion.p style={{ fontFamily: "var(--font-display)", fontSize: 15, fontStyle: "italic", color: "var(--ink)", marginTop: 2 }}
                    animate={{ opacity: [0.7, 1, 0.7] }} transition={{ duration: 2.5, repeat: Infinity }}>
                    How do you react?
                  </motion.p>
                </div>
                <div style={{ fontFamily: "var(--font-display)", fontSize: 18, color: "var(--ink)" }}>
                  CHF {state.portfolioValue.toFixed(0)}
                </div>
              </div>

              <div style={{ border: "1px solid var(--rule)", borderRadius: "var(--radius)", overflow: "hidden" }}>
                {products.map((id, i) => {
                  const pct = alloc[id] || 0;
                  const origPct = state.allocation[id] || 0;
                  const delta = pct - origPct;
                  const color = PRODUCT_COLORS[id] || "var(--ink-3)";
                  return (
                    <div key={id} className="flex items-center gap-3" style={{
                      padding: "10px 14px", background: "#FFF9E5",
                      borderBottom: i < products.length - 1 ? "1px solid var(--rule-light)" : "none",
                    }}>
                      <span style={{ fontSize: 14, width: 20, textAlign: "center" }}>{PRODUCT_ICONS[id] || "💰"}</span>
                      <span style={{ fontSize: 12, fontWeight: 500, color: "var(--ink)", width: 56, flexShrink: 0, textTransform: "capitalize" }}>{id}</span>
                      <div className="flex-1 relative h-6 flex items-center">
                        <div className="absolute left-0 right-0 h-1.5 rounded-full" style={{ background: "var(--rule-light)" }} />
                        <div className="absolute left-0 h-1.5 rounded-full" style={{ width: `${pct}%`, background: color, opacity: 0.5, transition: "width 0.15s" }} />
                        <input type="range" min={0} max={100} step={1} value={pct}
                          onChange={(e) => handleSlider(id, parseInt(e.target.value))}
                          className="relative z-10 w-full"
                          style={{ WebkitAppearance: "none", appearance: "none", background: "transparent", height: 24, cursor: "pointer" }} />
                      </div>
                      <div className="flex items-baseline gap-1 shrink-0" style={{ width: 54, justifyContent: "flex-end" }}>
                        <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, fontWeight: 500, color: "var(--ink-2)" }}>{pct}%</span>
                        {delta !== 0 && (
                          <span style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: delta > 0 ? "#0f4a58" : "var(--coral)" }}>
                            {delta > 0 ? "+" : ""}{delta}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              <button className="mt-4 w-full cursor-pointer active:scale-[0.97] transition-transform" style={{
                background: "var(--ink)", color: "var(--bg)", border: "none", borderRadius: "var(--radius-sm)",
                padding: "14px 24px", fontSize: 14, fontWeight: 500, fontFamily: "var(--font-body)",
              }} onClick={() => dispatch({ type: "SUBMIT_ALLOCATION", allocation: alloc })}>
                Lock In Allocation
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {!showAllocation && (
          <p className="mt-5 text-center" style={{
            fontFamily: "var(--font-mono)", fontSize: 9, textTransform: "uppercase",
            letterSpacing: "0.1em", color: "var(--ink-5)",
            animation: "pulse 2s ease-in-out infinite",
          }}>
            Tap a notification to read more
          </p>
        )}
      </div>
    </div>
  );
}