"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import type { MapNode } from "@/types";

const NODES: MapNode[] = [
  { node_id: "node_01", label: "Piggy Bank", subtitle: "Savings basics", difficulty: 1, asset_class: "savings", status: "completed", score: 85, icon: "" },
  { node_id: "node_02", label: "Inflation Trap", subtitle: "Why cash loses value", difficulty: 1, asset_class: "savings", status: "available", icon: "" },
  { node_id: "node_03", label: "Safe Harbor", subtitle: "Bonds introduction", difficulty: 2, asset_class: "bonds", status: "locked", icon: "" },
  { node_id: "node_04", label: "First Stock", subtitle: "Risk meets reward", difficulty: 2, asset_class: "stocks", status: "locked", icon: "" },
  { node_id: "node_05", label: "Bond Bridge", subtitle: "Crossing to safety", difficulty: 2, asset_class: "bonds", status: "locked", icon: "" },
  { node_id: "node_06", label: "Market Storm", subtitle: "Don't panic sell", difficulty: 3, asset_class: "stocks", status: "locked", icon: "" },
  { node_id: "node_07", label: "Diversify!", subtitle: "Eggs in many baskets", difficulty: 3, asset_class: "mixed", status: "locked", icon: "" },
  { node_id: "node_08", label: "ETF Express", subtitle: "The easy button", difficulty: 2, asset_class: "etf", status: "locked", icon: "" },
  { node_id: "node_09", label: "Crypto Canyon", subtitle: "High risk territory", difficulty: 4, asset_class: "crypto", status: "locked", icon: "" },
  { node_id: "node_10", label: "The Summit", subtitle: "20 years in 5 minutes", difficulty: 5, asset_class: "mixed", status: "locked", icon: "" },
];

const PLAYER = { lives: 3, coins: 10000, level: 1 };

// Simple repeating left/center/right offsets in px
const OFFSETS = [0, -60, 60];
const getOffset = (i: number) => OFFSETS[i % OFFSETS.length];

export function MapView() {
  const router = useRouter();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);

  useEffect(() => {
    const idx = NODES.findIndex((n) => n.status === "available");
    if (idx >= 0 && scrollRef.current) {
      const nodeEls = scrollRef.current.querySelectorAll("[data-node]");
      if (nodeEls[idx]) {
        nodeEls[idx].scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  }, []);

  const handleTap = (node: MapNode) => {
    if (node.status === "locked") return;
    setSelectedNode(selectedNode === node.node_id ? null : node.node_id);
  };

  return (
    <div className="game-viewport flex flex-col">
      {/* ─── HUD ─── */}
      <div className="game-topbar">
        <div className="mx-auto flex max-w-lg items-center justify-between">
          <div className="flex items-center gap-1">
            {[0, 1, 2].map((i) => (
              <span key={i} style={{ fontSize: 18, opacity: i < PLAYER.lives ? 1 : 0.2 }}>❤️</span>
            ))}
          </div>
          <div className="badge badge-level">Lv. {PLAYER.level}</div>
          <div className="flex items-center gap-1.5 rounded-full px-4 py-1.5" style={{ background: "var(--game-wheat)" }}>
            <span style={{ fontSize: 14 }}>🪙</span>
            <span className="font-mono text-sm font-bold" style={{ color: "#6B4D1A" }}>{PLAYER.coins.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* ─── Map ─── */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto overflow-x-hidden"
        style={{
          background: `linear-gradient(180deg,
            #EDF3E8 0%,
            #E6EDE0 25%,
            #E0E8DA 50%,
            #DAE3D4 75%,
            #D4DDCE 100%
          )`,
        }}
      >
        <div className="mx-auto flex max-w-sm flex-col items-center gap-10 px-6 pb-40 pt-8">
          {/* Begin label */}
          <span
            className="rounded-full px-5 py-2 text-xs font-bold uppercase tracking-wider"
            style={{ background: "var(--game-primary)", color: "white" }}
          >
            Begin journey
          </span>

          {/* Nodes — just a flex column with offsets */}
          {NODES.map((node, i) => {
            const offset = getOffset(i);
            const isAvail = node.status === "available";
            const isComp = node.status === "completed";
            const isLocked = node.status === "locked";
            const isSelected = selectedNode === node.node_id;
            const size = isAvail ? 72 : 60;

            return (
              <motion.div
                key={node.node_id}
                data-node
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className="flex flex-col items-center"
                style={{ transform: `translateX(${offset}px)` }}
              >
                {/* Node button */}
                <motion.button
                  onClick={() => handleTap(node)}
                  disabled={isLocked}
                  whileTap={isLocked ? {} : { scale: 0.9 }}
                  className="relative"
                >
                  {/* Pulse for available */}
                  {isAvail && (
                    <motion.div
                      animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0, 0.4] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                      className="absolute inset-[-6px] rounded-full"
                      style={{ border: "3px solid var(--game-primary)" }}
                    />
                  )}

                  {/* Selection ring */}
                  {isSelected && (
                    <motion.div
                      layoutId="sel"
                      className="absolute inset-[-8px] rounded-full"
                      style={{ border: "3px solid var(--game-accent)" }}
                    />
                  )}

                  {/* Circle */}
                  <div
                    className="flex items-center justify-center rounded-full"
                    style={{
                      width: size,
                      height: size,
                      background: isLocked ? "#D5D8D2" : "var(--game-primary)",
                      border: `3px solid ${isLocked ? "#C0C4BC" : "var(--game-primary-dark)"}`,
                      boxShadow: isAvail
                        ? "0 6px 20px rgba(123,168,106,0.35)"
                        : isComp
                        ? "0 3px 10px rgba(123,168,106,0.15)"
                        : "none",
                      opacity: isLocked ? 0.5 : 1,
                    }}
                  >
                    {isComp ? (
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                        <path d="M6 12.5L10 16.5L18 8.5" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    ) : (
                      <span
                        className="font-mono text-base font-bold"
                        style={{ color: isLocked ? "#A0A49D" : "white" }}
                      >
                        {i + 1}
                      </span>
                    )}
                  </div>

                  {/* Score badge */}
                  {isComp && node.score != null && (
                    <div
                      className="absolute -right-1 -top-1 flex h-5 min-w-[20px] items-center justify-center rounded-full px-1 text-[9px] font-bold text-white"
                      style={{ background: "var(--game-accent)" }}
                    >
                      {node.score}
                    </div>
                  )}
                </motion.button>

                {/* Label below */}
                <p
                  className="mt-2 text-center text-xs font-semibold leading-tight"
                  style={{
                    color: isLocked ? "var(--game-text-dim)" : "var(--game-secondary)",
                    opacity: isLocked ? 0.4 : 1,
                  }}
                >
                  {node.label}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* ─── Bottom tabs ─── */}
      {!selectedNode && (
        <div
          className="sticky bottom-0 z-30 flex items-center justify-around py-2 pb-[max(8px,env(safe-area-inset-bottom))]"
          style={{
            background: "rgba(254,252,246,0.92)",
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
            borderTop: "1px solid var(--game-border)",
          }}
        >
          {[
            { icon: "🗺️", label: "Map", active: true },
            { icon: "💼", label: "Portfolio", active: false },
            { icon: "👤", label: "Profile", active: false },
            { icon: "🏆", label: "Leagues", active: false },
          ].map((tab) => (
            <button key={tab.label} className="flex flex-col items-center gap-0.5 px-4 py-1">
              <span style={{ fontSize: 20, opacity: tab.active ? 1 : 0.4 }}>{tab.icon}</span>
              <span className="text-[10px] font-semibold" style={{ color: tab.active ? "var(--game-primary)" : "var(--game-text-dim)" }}>{tab.label}</span>
            </button>
          ))}
        </div>
      )}

      {/* ─── Bottom sheet ─── */}
      <AnimatePresence>
        {selectedNode && (() => {
          const node = NODES.find((n) => n.node_id === selectedNode)!;
          const index = NODES.findIndex((n) => n.node_id === selectedNode) + 1;
          return (
            <>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-40" style={{ background: "rgba(59,90,58,0.15)" }} onClick={() => setSelectedNode(null)} />
              <motion.div
                initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="fixed inset-x-0 bottom-0 z-50 rounded-t-3xl pb-[max(24px,env(safe-area-inset-bottom))]"
                style={{ background: "var(--game-bg)", borderTop: "1px solid var(--game-border)", boxShadow: "0 -8px 32px rgba(0,0,0,0.08)" }}
              >
                <div className="mx-auto max-w-lg p-6">
                  <div className="mx-auto mb-5 h-1 w-10 rounded-full" style={{ background: "var(--game-border)" }} />
                  <div className="flex items-center gap-4">
                    <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl font-mono text-xl font-bold text-white" style={{ background: node.status === "completed" ? "var(--game-primary)" : "var(--game-accent)" }}>
                      {index}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-lg leading-tight" style={{ fontFamily: "var(--font-display)", color: "var(--game-secondary)" }}>{node.label}</h3>
                      <p className="text-sm" style={{ color: "var(--game-text-dim)" }}>{node.subtitle}</p>
                      <div className="mt-2 flex items-center gap-3">
                        <div className="flex gap-1">
                          {[1, 2, 3, 4, 5].map((d) => (
                            <div key={d} className="h-1.5 w-4 rounded-full" style={{ background: d <= node.difficulty ? "var(--game-accent)" : "var(--game-border)" }} />
                          ))}
                        </div>
                        {node.status === "completed" && node.score != null && <span className="badge badge-score text-[11px]">Score: {node.score}</span>}
                      </div>
                    </div>
                  </div>
                  <button className="btn-primary mt-5 w-full py-4 text-base" onClick={() => router.push(`/game?node=${selectedNode}`)}>
                    {node.status === "completed" ? "Replay" : "Start"} Level {index} →
                  </button>
                </div>
              </motion.div>
            </>
          );
        })()}
      </AnimatePresence>
    </div>
  );
}