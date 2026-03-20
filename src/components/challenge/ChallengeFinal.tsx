"use client";

import { useEffect } from "react";
import { useChallenge, calculateInvestorScore } from "@/lib/ChallengeContext";
import SpiderChart from "@/components/game/SpiderChart";
import type { SpiderAxis } from "@/components/game/SpiderChart";

const SCORE_MAP: { key: string; label: string }[] = [
  { key: "composure", label: "Composure" },
  { key: "dueDiligence", label: "Due Diligence" },
  { key: "discipline", label: "Discipline" },
  { key: "diversification", label: "Diversification" },
  { key: "returns", label: "Returns" },
];

export default function ChallengeFinal() {
  const { state, actions } = useChallenge();
  const investorScore = calculateInvestorScore(state.scores);
  const totalReturn = state.portfolioValue - 500;
  const totalReturnPct = (totalReturn / 500) * 100;

  // Fetch leaderboard + submit score on mount
  useEffect(() => {
    actions.fetchLeaderboard();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const spiderAxes: SpiderAxis[] = SCORE_MAP.map(({ key, label }) => ({
    label,
    value: Math.round((state.scores as Record<string, number>)[key] ?? 50),
  }));

  let profileTitle: string;
  let profileSub: string;
  if (investorScore >= 80) {
    profileTitle = "Nerves of Steel";
    profileSub = "You read past every headline, held your nerve, and came out ahead. Exceptional.";
  } else if (investorScore >= 65) {
    profileTitle = "The Composed Investor";
    profileSub = "Mostly rational under pressure. A few wobbles, but your strategy held.";
  } else if (investorScore >= 50) {
    profileTitle = "The Hesitant Hand";
    profileSub = "You felt the pressure and it showed. Some good instincts, but the panic won a few rounds.";
  } else {
    profileTitle = "The Panic Seller";
    profileSub = "The headlines got to you. But now you know — and knowing is the first step.";
  }

  return (
    <div className="px-5 pb-10 pt-8">
      <div className="text-center">
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 9, textTransform: "uppercase", letterSpacing: "0.16em", color: "var(--ink-4)" }}>
          Gauntlet Complete
        </span>
      </div>

      <h1 className="text-center mt-3" style={{
        fontFamily: "var(--font-display)", fontSize: 28, fontWeight: 400,
        fontStyle: "italic", color: "var(--ink)", lineHeight: 1.15,
      }}>{profileTitle}</h1>

      <p className="text-center mt-2 mx-auto" style={{
        fontSize: 14, fontWeight: 300, color: "var(--ink-3)", maxWidth: 300, lineHeight: 1.6,
      }}>{profileSub}</p>

      {/* Investor Score */}
      <div className="text-center mt-6">
        <div style={{ fontFamily: "var(--font-mono)", fontSize: 9, textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--ink-4)", marginBottom: 4 }}>
          Investor Score
        </div>
        <div style={{ fontFamily: "var(--font-display)", fontSize: 48, color: "#0f4a58", lineHeight: 1 }}>
          {investorScore}
        </div>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--ink-4)", marginTop: 2 }}>
          out of 100
          {state.percentile !== null && ` · top ${state.percentile}%`}
        </div>
      </div>

      {/* Spider Chart */}
      <div className="flex justify-center mt-5">
        <SpiderChart axes={spiderAxes} size={260} animationDelay={0.3} />
      </div>

      <div className="mx-auto my-5" style={{ width: 24, height: 1, background: "var(--rule-heavy)" }} />

      {/* Portfolio */}
      <div className="text-center">
        <div style={{ fontFamily: "var(--font-display)", fontSize: 26, color: "var(--ink)" }}>
          PPF {state.portfolioValue.toFixed(2)}
        </div>
        <div className="mt-1" style={{
          fontFamily: "var(--font-mono)", fontSize: 11,
          color: totalReturnPct >= 0 ? "#0f4a58" : "var(--coral)",
        }}>
          {totalReturnPct >= 0 ? "+" : ""}{totalReturnPct.toFixed(1)}% total return
        </div>
      </div>

      {/* Journey */}
      {state.portfolioHistory.length > 1 && (
        <div className="mt-4 px-2 py-3" style={{
          background: "var(--surface-dim)", border: "1px solid var(--rule-light)", borderRadius: "var(--radius-sm)",
        }}>
          <div className="mb-2" style={{ fontFamily: "var(--font-mono)", fontSize: 9, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--ink-4)" }}>
            Your gauntlet journey
          </div>
          <svg width="100%" height="60" viewBox="0 0 300 60">
            {(() => {
              const data = state.portfolioHistory;
              const min = Math.min(...data) * 0.9; const max = Math.max(...data) * 1.05;
              const range = max - min || 1;
              const points = data.map((v, i) => `${(i / Math.max(data.length - 1, 1)) * 300},${52 - ((v - min) / range) * 44}`).join(" ");
              return (
                <>
                  <polygon points={`0,52 ${points} 300,52`} fill="#0f4a58" opacity="0.05" />
                  <polyline points={points} fill="none" stroke="#0f4a58" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  {data.map((v, i) => {
                    const x = (i / Math.max(data.length - 1, 1)) * 300;
                    const y = 52 - ((v - min) / range) * 44;
                    return <circle key={i} cx={x} cy={y} r={i === data.length - 1 ? 3.5 : 2}
                      fill={i === data.length - 1 ? "#0f4a58" : "#FFF9E5"} stroke="#0f4a58" strokeWidth={1.5} />;
                  })}
                  {data.map((_, i) => (
                    <text key={i} x={(i / Math.max(data.length - 1, 1)) * 300} y={60} textAnchor="middle"
                      style={{ fontSize: 7, fontFamily: "var(--font-mono)", fill: "var(--ink-5)" }}>
                      {i === 0 ? "Start" : `P${i}`}
                    </text>
                  ))}
                </>
              );
            })()}
          </svg>
        </div>
      )}

      {/* Leaderboard */}
      <div className="mt-5" style={{ border: "1px solid var(--rule)", borderRadius: "var(--radius)", overflow: "hidden" }}>
        <div className="px-4 py-3" style={{ background: "var(--surface-dim)", borderBottom: "1px solid var(--rule-light)" }}>
          <div className="flex items-center justify-between">
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 9, textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--ink-4)" }}>
              Leaderboard
            </span>
            {state.totalPlayers > 0 && (
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: "var(--ink-5)" }}>
                {state.totalPlayers} players
              </span>
            )}
          </div>
        </div>

        {/* Your entry (highlighted) */}
        <div className="flex items-center gap-3 px-4 py-3" style={{
          background: "rgba(15,74,88,0.04)", borderBottom: "1px solid var(--rule-light)",
        }}>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 14, fontWeight: 500, color: "#0f4a58", width: 24 }}>
            {state.rank ?? "—"}
          </span>
          <span style={{ flex: 1, fontSize: 14, fontWeight: 500, color: "var(--ink)" }}>
            {state.playerName} (you)
          </span>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 13, fontWeight: 500, color: "#0f4a58" }}>
            {investorScore}
          </span>
        </div>

        {/* Other entries */}
        {state.leaderboard.length > 0 ? (
          state.leaderboard
            .filter((e) => e.name !== state.playerName)
            .slice(0, 9)
            .map((entry) => (
              <div key={entry.rank} className="flex items-center gap-3 px-4 py-2.5" style={{
                borderBottom: "1px solid var(--rule-light)",
              }}>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--ink-4)", width: 24 }}>
                  {entry.rank}
                </span>
                <span style={{ flex: 1, fontSize: 13, color: "var(--ink-2)" }}>
                  {entry.name}
                </span>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--ink-3)" }}>
                  {entry.investorScore}
                </span>
              </div>
            ))
        ) : (
          <div className="px-4 py-4 text-center" style={{ fontSize: 12, color: "var(--ink-4)" }}>
            {state.playerId ? "Loading leaderboard..." : "Leaderboard available when connected to server"}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="mt-6">
        <button className="w-full cursor-pointer active:scale-[0.97] transition-transform" style={{
          background: "var(--ink)", color: "var(--bg)", border: "none", borderRadius: "var(--radius-sm)",
          padding: "14px 24px", fontSize: 14, fontWeight: 500, fontFamily: "var(--font-body)",
        }} onClick={actions.reset}>
          Try Again
        </button>

        <button className="w-full mt-2.5 cursor-pointer active:scale-[0.97] transition-transform" style={{
          background: "#fecb03", color: "var(--ink)", border: "none", borderRadius: "var(--radius-sm)",
          padding: "14px 24px", fontSize: 14, fontWeight: 500, fontFamily: "var(--font-body)",
        }}>
          Open PostFinance Account
        </button>

        <div className="text-center mt-3">
          <button className="cursor-pointer" style={{
            background: "none", border: "none", color: "var(--ink-3)", fontSize: 13,
            fontFamily: "var(--font-body)", textDecoration: "underline",
            textUnderlineOffset: 3, textDecorationColor: "var(--rule)", cursor: "pointer",
          }} onClick={() => window.location.href = "/"}>
            Back to home
          </button>
        </div>
      </div>

      <div className="text-center mt-8" style={{
        fontFamily: "var(--font-mono)", fontSize: 8, letterSpacing: "0.14em",
        textTransform: "uppercase", color: "var(--ink-5)",
      }}>
        Wealth Manager Arena · The Gauntlet · PostFinance × START Hackathon 2026
      </div>
    </div>
  );
}