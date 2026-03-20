"use client";

import { useState } from "react";
import { useChallenge } from "@/lib/ChallengeContext";

export default function ChallengeJoin() {
  const { actions } = useChallenge();
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleStart() {
    if (name.trim().length < 1 || loading) return;
    setLoading(true);
    await actions.startChallenge(name.trim());
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[70dvh] px-6 text-center">
      <span style={{
        fontFamily: "var(--font-mono)", fontSize: 9,
        textTransform: "uppercase", letterSpacing: "0.16em", color: "var(--ink-4)",
      }}>Challenge Mode</span>

      <h2 className="mt-3" style={{
        fontFamily: "var(--font-display)", fontSize: 26, fontWeight: 400,
        fontStyle: "italic", color: "var(--ink)", lineHeight: 1.2,
      }}>The Gauntlet</h2>

      <p className="mt-2" style={{
        fontSize: 14, color: "var(--ink-3)", maxWidth: 280, lineHeight: 1.6,
      }}>
        One crisis. Five phases. Every decision counts.
        <br />How will you handle the pressure?
      </p>

      <div className="mx-auto my-5" style={{ width: 24, height: 1, background: "var(--rule-heavy)" }} />

      <div className="w-full max-w-xs">
        <label style={{
          fontFamily: "var(--font-mono)", fontSize: 9,
          textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--ink-4)",
          display: "block", marginBottom: 6, textAlign: "left",
        }}>Your name for the leaderboard</label>
        <input
          type="text" value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleStart()}
          placeholder="Enter your name" maxLength={20} autoFocus
          style={{
            width: "100%", padding: "13px 16px", fontSize: 15,
            fontFamily: "var(--font-body)", color: "var(--ink)",
            background: "#FFF9E5", border: "1px solid var(--rule)",
            borderRadius: "var(--radius-sm)", outline: "none",
          }}
          onFocus={(e) => (e.currentTarget.style.borderColor = "#0f4a58")}
          onBlur={(e) => (e.currentTarget.style.borderColor = "var(--rule)")}
        />
      </div>

      <button
        className="mt-5 w-full max-w-xs cursor-pointer active:scale-[0.97] transition-transform"
        style={{
          background: name.trim() && !loading ? "var(--ink)" : "var(--ink-5)",
          color: "var(--bg)", border: "none", borderRadius: "var(--radius-sm)",
          padding: "14px 24px", fontSize: 14, fontWeight: 500, fontFamily: "var(--font-body)",
          opacity: name.trim() && !loading ? 1 : 0.5,
          pointerEvents: name.trim() && !loading ? "auto" : "none",
        }}
        onClick={handleStart}
      >
        {loading ? "Connecting..." : "Enter The Gauntlet"}
      </button>

      <p className="mt-3" style={{ fontSize: 12, color: "var(--ink-5)" }}>
        ~5 minutes · your score joins the leaderboard
      </p>
    </div>
  );
}