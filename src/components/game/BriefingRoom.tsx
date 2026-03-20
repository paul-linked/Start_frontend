"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useMemo, useCallback } from "react";
import { useGame } from "@/lib/GameContext";
import { getRound } from "@/lib/GameContext";
import type { PortfolioAllocation } from "../../types";

// ─── Panic Ticker ───
const TICKER_ITEMS = [
  "BREAKING: Markets plunge across Europe",
  "SMI records worst day since 2008",
  "Investors flee to cash amid recession fears",
  "Central banks signal emergency meeting",
  "Retail investors selling at record pace",
  "\"Sell everything\" trends on social media",
  "Gold surges as stocks collapse",
  "Trading platforms report outages",
];

function PanicTicker() {
  const text = TICKER_ITEMS.join("   ●   ");
  return (
    <div className="overflow-hidden" style={{ background: "var(--coral)", padding: "5px 0" }}>
      <motion.div
        className="whitespace-nowrap"
        style={{
          fontFamily: "var(--font-mono)", fontSize: 9, fontWeight: 500,
          color: "#fff", letterSpacing: "0.03em",
        }}
        animate={{ x: [0, -2000] }}
        transition={{ duration: 35, repeat: Infinity, ease: "linear" }}
      >
        {text}   ●   {text}
      </motion.div>
    </div>
  );
}

// ─── Source App Icons (mini rounded squares, Apple-style) ───
function AppIcon({ color, children }: { color: string; children: string }) {
  return (
    <div className="shrink-0 flex items-center justify-center" style={{
      width: 28, height: 28, borderRadius: 7,
      background: color, fontSize: 14,
    }}>
      {children}
    </div>
  );
}

// ─── Notification (collapsed, Apple-style) ───
function Notification({
  source,
  headline,
  time,
  icon,
  iconColor,
  isRead,
  onTap,
  delay,
}: {
  source: string;
  headline: string;
  time: string;
  icon: string;
  iconColor: string;
  isRead: boolean;
  onTap: () => void;
  delay: number;
}) {
  return (
    <motion.button
      className="w-full text-left cursor-pointer"
      style={{
        background: "rgba(255, 249, 229, 0.82)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderRadius: 16,
        padding: "12px 14px",
        border: "none",
        boxShadow: "0 1px 4px rgba(0,0,0,0.04), 0 0.5px 1px rgba(0,0,0,0.03)",
      }}
      initial={{ opacity: 0, x: 70, scale: 0.92 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      transition={{
        delay,
        duration: 0.4,
        type: "spring",
        stiffness: 200,
        damping: 22,
      }}
      whileTap={{ scale: 0.97 }}
      onClick={onTap}
    >
      <div className="flex gap-3">
        <AppIcon color={iconColor}>{icon}</AppIcon>
        <div className="flex-1 min-w-0">
          {/* Source + time row */}
          <div className="flex items-center justify-between mb-0.5">
            <span style={{
              fontFamily: "var(--font-body)", fontSize: 12, fontWeight: 500,
              color: isRead ? "var(--ink-4)" : "var(--ink)",
            }}>
              {source}
            </span>
            <div className="flex items-center gap-1.5">
              <span style={{
                fontFamily: "var(--font-body)", fontSize: 11,
                color: "var(--ink-5)",
              }}>
                {time}
              </span>
              {!isRead && (
                <div style={{
                  width: 7, height: 7, borderRadius: "50%",
                  background: "#0f4a58",
                }} />
              )}
            </div>
          </div>
          {/* Headline */}
          <div style={{
            fontSize: 13, color: isRead ? "var(--ink-3)" : "var(--ink-2)",
            lineHeight: 1.35,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical" as const,
            overflow: "hidden",
          }}>
            {headline}
          </div>
        </div>
      </div>
    </motion.button>
  );
}

// ─── Expanded Notification Overlay ───
function ExpandedNotification({
  source,
  headline,
  body,
  time,
  icon,
  iconColor,
  onClose,
}: {
  source: string;
  headline: string;
  body: string;
  time: string;
  icon: string;
  iconColor: string;
  onClose: () => void;
}) {
  return (
    <>
      {/* Backdrop */}
      <motion.div
        className="fixed inset-0 z-40"
        style={{ background: "rgba(0,0,0,0.15)", backdropFilter: "blur(2px)" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        onClick={onClose}
      />

      {/* Card */}
      <motion.div
        className="fixed left-4 right-4 z-50"
        style={{
          top: 100,
          maxWidth: 420,
          margin: "0 auto",
          background: "rgba(255, 249, 229, 0.96)",
          backdropFilter: "blur(30px)",
          WebkitBackdropFilter: "blur(30px)",
          borderRadius: 20,
          padding: "18px 18px 22px",
          boxShadow: "0 8px 40px rgba(0,0,0,0.10), 0 2px 10px rgba(0,0,0,0.06)",
        }}
        initial={{ opacity: 0, y: 30, scale: 0.92 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.95 }}
        transition={{ type: "spring", stiffness: 280, damping: 24 }}
      >
        {/* Header */}
        <div className="flex gap-3 items-start mb-3">
          <AppIcon color={iconColor}>{icon}</AppIcon>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <span style={{
                fontFamily: "var(--font-body)", fontSize: 13, fontWeight: 500,
                color: "var(--ink)",
              }}>
                {source}
              </span>
              <span style={{
                fontFamily: "var(--font-body)", fontSize: 11,
                color: "var(--ink-5)",
              }}>
                {time}
              </span>
            </div>
          </div>
        </div>

        {/* Headline */}
        <h3 style={{
          fontFamily: "var(--font-display)", fontSize: 17,
          color: "var(--ink)", lineHeight: 1.3, marginBottom: 10,
        }}>
          {headline}
        </h3>

        {/* Divider */}
        <div style={{ height: 1, background: "var(--rule-light)", marginBottom: 10 }} />

        {/* Body */}
        <p
          style={{ fontSize: 14, color: "var(--ink-2)", lineHeight: 1.75 }}
          dangerouslySetInnerHTML={{
            __html: body.replace(
              /<mark>/g,
              '<mark style="background:rgba(15,74,88,0.08);padding:1px 3px;border-radius:2px;color:var(--ink)">'
            ),
          }}
        />

        {/* Close hint */}
        <div className="mt-4 text-center">
          <span style={{
            fontFamily: "var(--font-mono)", fontSize: 9,
            color: "var(--ink-5)", letterSpacing: "0.08em", textTransform: "uppercase",
          }}>
            Tap outside to close
          </span>
        </div>
      </motion.div>
    </>
  );
}

// ─── Compact Chart ───
function CrashChart({ data, label, delta }: { data: number[]; label: string; delta: string }) {
  const min = Math.min(...data) * 0.85;
  const max = Math.max(...data) * 1.05;
  const range = max - min || 1;
  const w = 300;
  const h = 56;

  const points = data.map((val, i) => {
    const px = (i / (data.length - 1)) * w;
    const py = h - 6 - ((val - min) / range) * (h - 12);
    return `${px},${py}`;
  }).join(" ");

  const lastY = Number(points.split(" ").pop()?.split(",")[1]) || h / 2;

  return (
    <div style={{
      background: "rgba(184,112,96,0.04)",
      border: "1px solid rgba(184,112,96,0.12)",
      borderRadius: 14, padding: "10px 12px 6px",
    }}>
      <div className="flex items-baseline justify-between mb-1.5">
        <span style={{
          fontFamily: "var(--font-mono)", fontSize: 9,
          textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--ink-4)",
        }}>{label}</span>
        <motion.span
          style={{ fontFamily: "var(--font-mono)", fontSize: 12, fontWeight: 600, color: "var(--coral)" }}
          animate={{ opacity: [1, 0.5, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >{delta}</motion.span>
      </div>
      <svg width="100%" height={h} viewBox={`0 0 ${w} ${h}`}>
        <defs>
          <linearGradient id="cGrad2" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--coral)" stopOpacity="0.1" />
            <stop offset="100%" stopColor="var(--coral)" stopOpacity="0" />
          </linearGradient>
        </defs>
        <polygon points={`0,${h} ${points} ${w},${h}`} fill="url(#cGrad2)" />
        <polyline points={points} fill="none" stroke="var(--coral)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx={w} cy={lastY} r="3" fill="var(--coral)" />
      </svg>
    </div>
  );
}

// ─── Product config ───
const PRODUCT_COLORS: Record<string, string> = {
  savings: "#0f4a58", bonds: "#fecb03", etf: "#5C8A4E",
  stocks: "#B87060", gold: "#D4915A", reits: "#8B6EA4",
};
const PRODUCT_ICONS: Record<string, string> = {
  savings: "🏦", bonds: "📜", etf: "📊", stocks: "📈", gold: "🥇", reits: "🏠",
};

// ─── Mini Donut ───
function MiniDonut({ segments, size = 56 }: {
  segments: { id: string; pct: number; color: string }[];
  size?: number;
}) {
  const cx = size / 2;
  const cy = size / 2;
  const r = size / 2 - 5;
  const c = 2 * Math.PI * r;
  let acc = 0;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="var(--rule-light)" strokeWidth={6} />
      {segments.filter((s) => s.pct > 0).map((seg) => {
        const d = (seg.pct / 100) * c;
        const o = -(acc / 100) * c;
        acc += seg.pct;
        return (
          <circle key={seg.id} cx={cx} cy={cy} r={r} fill="none" stroke={seg.color}
            strokeWidth={6} strokeDasharray={`${d} ${c - d}`}
            strokeDashoffset={o} transform={`rotate(-90 ${cx} ${cy})`}
            style={{ transition: "all 0.3s ease" }} />
        );
      })}
    </svg>
  );
}

// ─── Source config for notification icons ───
const SOURCE_CONFIG = [
  { icon: "📰", color: "#C0392B", time: "now" },
  { icon: "💬", color: "#3498DB", time: "2m ago" },
  { icon: "📊", color: "#0f4a58", time: "8m ago" },
  { icon: "🎙️", color: "#8E44AD", time: "14m ago" },
];

// ─── Main Component ───
export default function BriefingRoom() {
  const { state, dispatch } = useGame();
  const round = getRound(state.currentRound);
  if (!round || round.quest.type !== "briefing_room") return null;
  const quest = round.quest as import("../../types").BriefingRoomQuest;


//   const quest = round.quest;
  const [expandedIdx, setExpandedIdx] = useState<number | null>(null);
  const [readSet, setReadSet] = useState<Set<number>>(new Set());
  const [showAllocation, setShowAllocation] = useState(false);

  // Build notifications from article data
  const notifications = useMemo(() => {
    if (quest.articles.length === 1) {
      const a = quest.articles[0];
      const names = [a.source, "Social Media", "Market Analysis", "Expert Commentary"];
      const headlines = [
        a.headline,
        "\"Sell everything\" — panic spreads across platforms",
        "What the numbers actually show",
        "Analysts weigh in on the sell-off",
      ];
      return a.paragraphs.map((p, i) => ({
        source: names[i] || a.source,
        headline: headlines[i] || a.headline,
        body: p,
        ...SOURCE_CONFIG[i],
      }));
    }
    return quest.articles.map((a, i) => ({
      source: a.source,
      headline: a.headline,
      body: a.paragraphs.join(" "),
      ...SOURCE_CONFIG[i],
    }));
  }, [quest.articles]);

  function handleNotifTap(idx: number) {
    setExpandedIdx(idx);
    setReadSet((prev) => new Set(prev).add(idx));
    if (!showAllocation) {
      setTimeout(() => setShowAllocation(true), 200);
    }
  }

  // Allocation logic
  const availableProducts = useMemo(() => {
    for (let i = state.currentRound - 1; i >= 1; i--) {
      const r = getRound(i);
      if (r?.quest.type === "allocation") {
        return (r.quest as import("../../types").AllocationQuest).products;
      }
    }
    return [];
  }, [state.currentRound]);


  const [alloc, setAlloc] = useState<PortfolioAllocation>(() => {
    const init: PortfolioAllocation = {};
    availableProducts.forEach((p) => { init[p.id] = state.allocation[p.id] || 0; });
    const total = Object.values(init).reduce((s, v) => s + v, 0);
    if (total === 0 && availableProducts.length > 0) {
      const even = Math.floor(100 / availableProducts.length);
      availableProducts.forEach((p, i) => {
        init[p.id] = i === availableProducts.length - 1
          ? 100 - even * (availableProducts.length - 1) : even;
      });
    }
    return init;
  });

  const originalAlloc = useMemo(() => {
    const o: PortfolioAllocation = {};
    availableProducts.forEach((p) => { o[p.id] = state.allocation[p.id] || 0; });
    return o;
  }, [availableProducts, state.allocation]);

  const handleSlider = useCallback((id: string, newVal: number) => {
    const clamped = Math.max(0, Math.min(100, Math.round(newVal)));
    if (clamped === (alloc[id] || 0)) return;
    const others = availableProducts.filter((p) => p.id !== id);
    const othersTotal = others.reduce((s, p) => s + (alloc[p.id] || 0), 0);
    const updated: PortfolioAllocation = { ...alloc, [id]: clamped };
    if (othersTotal === 0) {
      const each = Math.floor((100 - clamped) / others.length);
      others.forEach((p, i) => {
        updated[p.id] = i === others.length - 1 ? 100 - clamped - each * (others.length - 1) : each;
      });
    } else {
      let rem = 100 - clamped;
      others.forEach((p, i) => {
        if (i === others.length - 1) { updated[p.id] = Math.max(0, rem); }
        else {
          const v = Math.max(0, Math.round(((alloc[p.id] || 0) / othersTotal) * (100 - clamped)));
          updated[p.id] = v;
          rem -= v;
        }
      });
    }
    setAlloc(updated);
  }, [alloc, availableProducts]);

  function handleConfirm() {
    const safeIds = ["savings", "bonds"];
    const riskIds = ["etf", "stocks"];
    const origSafe = safeIds.reduce((s, id) => s + (originalAlloc[id] || 0), 0);
    const newSafe = safeIds.reduce((s, id) => s + (alloc[id] || 0), 0);
    const newRisk = riskIds.reduce((s, id) => s + (alloc[id] || 0), 0);
    const origRisk = riskIds.reduce((s, id) => s + (originalAlloc[id] || 0), 0);

    let choice: "buy" | "hold" | "sell";
    if (newRisk - origRisk > 8) choice = "buy";
    else if (newSafe - origSafe > 8) choice = "sell";
    else choice = "hold";

    dispatch({ type: "BRIEFING_DECISION", choice });
  }

  const donutSegments = availableProducts.map((p) => ({
    id: p.id, pct: alloc[p.id] || 0, color: PRODUCT_COLORS[p.id] || "var(--ink-4)",
  }));

  return (
    <div className="pb-6">
      {/* ── BREAKING BANNER ── */}
      <motion.div
        className="flex items-center justify-center gap-2 py-2"
        style={{ background: "rgba(184,112,96,0.05)", borderBottom: "1px solid rgba(184,112,96,0.1)" }}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      >
        <motion.span
          style={{
            background: "var(--coral)", color: "#fff",
            fontFamily: "var(--font-mono)", fontSize: 8, fontWeight: 600,
            letterSpacing: "0.14em", padding: "2px 7px", borderRadius: 3,
            textTransform: "uppercase",
          }}
          animate={{ opacity: [1, 0.5, 1] }}
          transition={{ duration: 1.2, repeat: Infinity }}
        >Breaking</motion.span>
        <span style={{
          fontFamily: "var(--font-display)", fontSize: 12,
          color: "var(--ink)", fontStyle: "italic",
        }}>
          {quest.articles[0].headline.split(":")[0]}
        </span>
      </motion.div>

      <PanicTicker />

      <div className="px-5 pt-4">
        {/* ── NOTIFICATION STACK ── */}
        <div className="flex flex-col gap-2">
          {notifications.map((n, i) => (
            <Notification
              key={i}
              source={n.source}
              headline={n.headline}
              time={n.time}
              icon={n.icon}
              iconColor={n.color}
              isRead={readSet.has(i)}
              onTap={() => handleNotifTap(i)}
              delay={0.3 + i * 0.35}
            />
          ))}
        </div>

        {/* ── EXPANDED OVERLAY ── */}
        <AnimatePresence>
          {expandedIdx !== null && notifications[expandedIdx] && (
            <ExpandedNotification
              source={notifications[expandedIdx].source}
              headline={notifications[expandedIdx].headline}
              body={notifications[expandedIdx].body}
              time={notifications[expandedIdx].time}
              icon={notifications[expandedIdx].icon}
              iconColor={notifications[expandedIdx].color}
              onClose={() => setExpandedIdx(null)}
            />
          )}
        </AnimatePresence>

        {/* ── CHART ── */}
        <motion.div
          className="mt-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 + notifications.length * 0.35 }}
        >
          <CrashChart data={quest.chartData} label={quest.chartLabel} delta={quest.chartDelta} />
        </motion.div>

        {/* ── REALLOCATION ── */}
        <AnimatePresence>
          {showAllocation && availableProducts.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="mt-5"
            >
              <div className="flex items-center justify-between mb-3">
                <div>
                  <span style={{
                    fontFamily: "var(--font-mono)", fontSize: 9,
                    textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--ink-4)",
                  }}>Your allocation</span>
                  <motion.p
                    style={{
                      fontFamily: "var(--font-display)", fontSize: 15,
                      fontStyle: "italic", color: "var(--ink)", marginTop: 2,
                    }}
                    animate={{ opacity: [0.7, 1, 0.7] }}
                    transition={{ duration: 2.5, repeat: Infinity }}
                  >How do you react?</motion.p>
                </div>
                <MiniDonut segments={donutSegments} />
              </div>

              <div style={{
                border: "1px solid var(--rule)", borderRadius: "var(--radius)",
                overflow: "hidden",
              }}>
                {availableProducts.map((product, i) => {
                  const pct = alloc[product.id] || 0;
                  const origPct = originalAlloc[product.id] || 0;
                  const delta = pct - origPct;
                  const color = PRODUCT_COLORS[product.id] || "var(--ink-3)";

                  return (
                    <div key={product.id} className="flex items-center gap-3" style={{
                      padding: "10px 14px", background: "#FFF9E5",
                      borderBottom: i < availableProducts.length - 1 ? "1px solid var(--rule-light)" : "none",
                    }}>
                      <span style={{ fontSize: 14, width: 20, textAlign: "center" }}>
                        {PRODUCT_ICONS[product.id] || "💰"}
                      </span>
                      <span style={{
                        fontSize: 12, fontWeight: 500, color: "var(--ink)",
                        width: 56, flexShrink: 0,
                      }}>
                        {product.name.split(" ")[0]}
                      </span>
                      <div className="flex-1 relative h-6 flex items-center">
                        <div className="absolute left-0 right-0 h-1.5 rounded-full" style={{ background: "var(--rule-light)" }} />
                        <div className="absolute left-0 h-1.5 rounded-full" style={{
                          width: `${pct}%`, background: color, opacity: 0.5, transition: "width 0.15s",
                        }} />
                        <input type="range" min={0} max={100} step={1} value={pct}
                          onChange={(e) => handleSlider(product.id, parseInt(e.target.value))}
                          className="relative z-10 w-full"
                          style={{
                            WebkitAppearance: "none", appearance: "none",
                            background: "transparent", height: 24, cursor: "pointer",
                          }} />
                      </div>
                      <div className="flex items-baseline gap-1 shrink-0" style={{ width: 54, justifyContent: "flex-end" }}>
                        <span style={{
                          fontFamily: "var(--font-mono)", fontSize: 12,
                          fontWeight: 500, color: "var(--ink-2)",
                        }}>{pct}%</span>
                        {delta !== 0 && (
                          <span style={{
                            fontFamily: "var(--font-mono)", fontSize: 9,
                            color: delta > 0 ? "#0f4a58" : "var(--coral)",
                          }}>{delta > 0 ? "+" : ""}{delta}</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              <button
                className="mt-4 w-full cursor-pointer active:scale-[0.97] transition-transform"
                style={{
                  background: "var(--ink)", color: "var(--bg)",
                  border: "none", borderRadius: "var(--radius-sm)",
                  padding: "14px 24px", fontSize: 14, fontWeight: 500,
                  fontFamily: "var(--font-body)",
                }}
                onClick={handleConfirm}
              >
                Confirm Reallocation
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {!showAllocation && (
          <motion.p
            className="mt-5 text-center"
            style={{
              fontFamily: "var(--font-mono)", fontSize: 9,
              textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--ink-5)",
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.3, 0.7, 0.3] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            Tap a notification to read more
          </motion.p>
        )}
      </div>
    </div>
  );
}