"use client";

export default function AlpineBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Mountain range */}
      <svg
        className="absolute bottom-0 w-[110%] -left-[5%]"
        style={{ opacity: 0.025 }}
        viewBox="0 0 1200 300"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M0 300 L0 230 L80 195 L160 215 L260 150 L340 175 L440 100 L520 140 L600 75 L680 120 L760 65 L840 110 L940 80 L1020 135 L1100 95 L1200 145 L1200 300Z"
          fill="var(--ink)"
        />
        <path
          d="M0 300 L0 255 L120 230 L220 245 L340 200 L440 218 L560 175 L660 200 L780 160 L880 190 L980 165 L1080 205 L1200 185 L1200 300Z"
          fill="var(--ink)"
          opacity="0.35"
        />
      </svg>

      {/* Alpine hut */}
      <svg
        className="absolute bottom-7 right-6 w-14"
        style={{ opacity: 0.02 }}
        viewBox="0 0 80 60"
        fill="var(--ink)"
        xmlns="http://www.w3.org/2000/svg"
      >
        <polygon points="40,8 72,34 8,34" />
        <rect x="18" y="34" width="44" height="20" />
        <rect x="32" y="38" width="12" height="16" fill="var(--bg)" />
      </svg>

      {/* Pine trees */}
      <svg
        className="absolute bottom-2 left-4 w-20"
        style={{ opacity: 0.018 }}
        viewBox="0 0 120 80"
        fill="var(--ink)"
        xmlns="http://www.w3.org/2000/svg"
      >
        <polygon points="18,14 32,48 4,48" />
        <polygon points="48,22 60,48 36,48" />
        <polygon points="82,8 98,52 66,52" />
      </svg>
    </div>
  );
}