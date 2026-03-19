"use client";

interface ZoneBackgroundProps {
  zoneIndex: 0 | 1 | 2 | 3;
}

const ZONES = [
  {
    name: "Alpine Meadow",
    gradient: "linear-gradient(to bottom, #4ade80, #16a34a)",
    emoji: ["🌸", "🐄", "🌿"],
  },
  {
    name: "Pine Forest",
    gradient: "linear-gradient(to bottom, #166534, #14532d)",
    emoji: ["🌲", "🌲", "🍃"],
  },
  {
    name: "Rocky Highlands",
    gradient: "linear-gradient(to bottom, #9ca3af, #4b5563)",
    emoji: ["🏔️", "🪨", "🌫️"],
  },
  {
    name: "Mountain Peak",
    gradient: "linear-gradient(to bottom, #dbeafe, #ffffff)",
    emoji: ["❄️", "🏔️", "⛄"],
  },
];

const EMOJI_POSITIONS = [
  { top: "10%", left: "15%" },
  { top: "30%", right: "20%" },
  { top: "60%", left: "70%" },
];

export default function ZoneBackground({ zoneIndex }: ZoneBackgroundProps) {
  const zone = ZONES[zoneIndex];

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: -1,
        background: zone.gradient,
        transition: "background 800ms ease-in-out",
      }}
    >
      {zone.emoji.map((em, i) => (
        <span
          key={i}
          style={{
            position: "absolute",
            pointerEvents: "none",
            fontSize: "2rem",
            ...EMOJI_POSITIONS[i],
          }}
          aria-hidden="true"
        >
          {em}
        </span>
      ))}
    </div>
  );
}
