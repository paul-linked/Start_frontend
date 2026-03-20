"use client";

import { motion } from "framer-motion";

export interface SpiderAxis {
  label: string;
  value: number;
  baseline?: number;
}

interface SpiderChartProps {
  axes: SpiderAxis[];
  size?: number;
  fillColor?: string;
  strokeColor?: string;
  baselineColor?: string;
  animationDelay?: number;
}

export default function SpiderChart({
  axes,
  size = 260,
  fillColor = "rgba(15, 74, 88, 0.18)",
  strokeColor = "#0f4a58",
  baselineColor = "#fecb03",
  animationDelay = 0.3,
}: SpiderChartProps) {
  const cx = size / 2;
  const cy = size / 2;
  const maxRadius = size / 2 - 52;
  const n = axes.length;
  const angleStep = (2 * Math.PI) / n;
  const startAngle = -Math.PI / 2;

  function getPoint(i: number, value: number): [number, number] {
    const angle = startAngle + i * angleStep;
    const r = (value / 100) * maxRadius;
    return [cx + r * Math.cos(angle), cy + r * Math.sin(angle)];
  }

  const rings = [25, 50, 75, 100];

  const valuePoints = axes
    .map((a, i) => getPoint(i, a.value))
    .map(([x, y]) => `${x},${y}`)
    .join(" ");

  const hasBaseline = axes.some((a) => a.baseline !== undefined);
  const baselinePoints = hasBaseline
    ? axes
        .map((a, i) => getPoint(i, a.baseline ?? 50))
        .map(([x, y]) => `${x},${y}`)
        .join(" ")
    : "";

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      style={{ overflow: "visible", display: "block" }}
    >
      {/* Guide rings */}
      {rings.map((level) => {
        const pts = Array.from({ length: n }, (_, i) => {
          const [x, y] = getPoint(i, level);
          return `${x},${y}`;
        }).join(" ");
        return (
          <polygon
            key={level}
            points={pts}
            fill="none"
            stroke="var(--ink-5)"
            strokeWidth={level === 100 ? 1.2 : 0.8}
            opacity={level === 100 ? 0.6 : level === 50 ? 0.5 : 0.3}
          />
        );
      })}

      {/* Axis lines */}
      {axes.map((_, i) => {
        const [x, y] = getPoint(i, 100);
        return (
          <line
            key={i}
            x1={cx} y1={cy} x2={x} y2={y}
            stroke="var(--ink-5)" strokeWidth={0.8} opacity={0.5}
          />
        );
      })}

      {/* Baseline polygon */}
      {hasBaseline && baselinePoints && (
        <polygon
          points={baselinePoints}
          fill={`${baselineColor}15`}
          stroke={baselineColor}
          strokeWidth={1.5}
          strokeDasharray="5 4"
          opacity={0.7}
        />
      )}

      {/* Value polygon */}
      <motion.polygon
        points={valuePoints}
        fill={fillColor}
        stroke={strokeColor}
        strokeWidth={2}
        strokeLinejoin="round"
        initial={{ opacity: 0, scale: 0.3 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: animationDelay, duration: 0.7, ease: "easeOut" }}
        style={{ transformOrigin: `${cx}px ${cy}px` }}
      />

      {/* Value dots */}
      {axes.map((a, i) => {
        const [x, y] = getPoint(i, a.value);
        return (
          <motion.circle
            key={i}
            cx={x} cy={y} r={4}
            fill={strokeColor}
            stroke="#FFF9E5"
            strokeWidth={2}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: animationDelay + 0.4 + i * 0.08, duration: 0.3 }}
          />
        );
      })}

      {/* Axis labels */}
      {axes.map((a, i) => {
        const angle = startAngle + i * angleStep;
        const labelR = maxRadius + 28;
        const lx = cx + labelR * Math.cos(angle);
        const ly = cy + labelR * Math.sin(angle);

        let anchor: "start" | "middle" | "end" = "middle";
        if (Math.cos(angle) > 0.3) anchor = "start";
        else if (Math.cos(angle) < -0.3) anchor = "end";

        return (
          <text
            key={i}
            x={lx}
            y={ly}
            textAnchor={anchor}
            dominantBaseline="central"
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 9,
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              fill: "var(--ink-2)",
            }}
          >
            {a.label}
          </text>
        );
      })}

      {/* Center dot */}
      <circle cx={cx} cy={cy} r={2} fill="var(--ink-5)" />
    </svg>
  );
}