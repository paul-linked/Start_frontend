"use client";

export default function AlpineBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      <div className="absolute inset-0" style={{ background: "var(--bg)" }} />

      <svg
        className="absolute bottom-0 w-full"
        style={{ opacity: 0.035 }}
        viewBox="0 0 1200 300"
        preserveAspectRatio="xMidYMax meet"
        fill="none"
      >
        <path
          d="M0 300 L0 230 L80 195 L160 215 L260 150 L340 175 L440 100 L520 140 L600 75 L680 120 L760 65 L840 110 L940 80 L1020 135 L1100 95 L1200 145 L1200 300Z"
          fill="var(--ink)"
        />
        <path
          d="M0 300 L0 255 L120 230 L220 245 L340 200 L440 218 L560 175 L660 200 L780 160 L880 190 L980 165 L1080 205 L1200 185 L1200 300Z"
          fill="var(--ink)"
          opacity="0.4"
        />
      </svg>
    </div>
  );
}