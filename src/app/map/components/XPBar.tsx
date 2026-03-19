"use client";

const XP_THRESHOLDS = [0, 150, 400, 800, 1500];

interface XPBarProps {
  level: number;
  currentXP: number;
}

export default function XPBar({ level, currentXP }: XPBarProps) {
  const isMaxLevel = level >= XP_THRESHOLDS.length;
  const currentThreshold = XP_THRESHOLDS[level - 1] ?? 0;
  const nextThreshold = isMaxLevel
    ? XP_THRESHOLDS[XP_THRESHOLDS.length - 1]
    : XP_THRESHOLDS[level] ?? XP_THRESHOLDS[XP_THRESHOLDS.length - 1];

  const fillPercent = isMaxLevel
    ? 100
    : Math.min(
        100,
        Math.max(
          0,
          ((currentXP - currentThreshold) / (nextThreshold - currentThreshold)) * 100
        )
      );

  return (
    <div
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        backgroundColor: "#1A1A1A",
        color: "white",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "1rem",
          padding: "0.625rem 1rem",
          maxWidth: "100%",
        }}
      >
        {/* Left: branding */}
        <span style={{ fontWeight: 600, fontSize: "0.875rem", whiteSpace: "nowrap", flexShrink: 0 }}>
          🇨🇭 PostFinance Challenge
        </span>

        {/* Centre: level + XP label */}
        <span
          style={{
            fontSize: "0.8125rem",
            color: "#d1d5db",
            whiteSpace: "nowrap",
            flexShrink: 0,
            marginLeft: "auto",
            marginRight: "auto",
          }}
        >
          Level {level} — {currentXP}/{nextThreshold} XP
        </span>

        {/* Right: progress bar */}
        <div
          style={{
            flexShrink: 0,
            width: "8rem",
            height: "0.625rem",
            backgroundColor: "#3a3a3a",
            borderRadius: "9999px",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              height: "100%",
              width: `${fillPercent}%`,
              backgroundColor: "#FFCC00",
              borderRadius: "9999px",
              transition: "width 0.4s ease",
            }}
          />
        </div>
      </div>
    </div>
  );
}
