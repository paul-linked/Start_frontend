"use client";

import React, { useEffect, useState } from "react";

interface NodeConnectorProps {
  nodeRefs: React.RefObject<(HTMLDivElement | null)[]>;
  nodeCount: number;
  containerRef: React.RefObject<HTMLDivElement>;
}

interface Point {
  x: number;
  y: number;
}

function buildPath(points: Point[]): string {
  if (points.length < 2) return "";

  return points
    .slice(0, -1)
    .map((p0, i) => {
      const p1 = points[i + 1];
      const midY = (p0.y + p1.y) / 2;
      return `M ${p0.x} ${p0.y} C ${p0.x} ${midY}, ${p1.x} ${midY}, ${p1.x} ${p1.y}`;
    })
    .join(" ");
}

export default function NodeConnector({
  nodeRefs,
  nodeCount,
  containerRef,
}: NodeConnectorProps) {
  const [pathD, setPathD] = useState("");

  useEffect(() => {
    function computePath() {
      const refs = nodeRefs.current;
      const container = containerRef.current;
      if (!refs || !container || refs.length < 2) {
        setPathD("");
        return;
      }

      const containerRect = container.getBoundingClientRect();
      const points: Point[] = [];

      for (let i = 0; i < refs.length; i++) {
        const el = refs[i];
        if (!el) continue;
        const rect = el.getBoundingClientRect();
        points.push({
          x: rect.left - containerRect.left + rect.width / 2,
          y: rect.top - containerRect.top + rect.height / 2,
        });
      }

      if (points.length < 2) {
        setPathD("");
        return;
      }

      setPathD(buildPath(points));
    }

    computePath();

    window.addEventListener("resize", computePath);
    return () => window.removeEventListener("resize", computePath);
  }, [nodeRefs, containerRef, nodeCount]);

  if (!pathD) return null;

  return (
    <svg
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
      }}
      width="100%"
      height="100%"
    >
      <path d={pathD} stroke="#FFCC00" strokeWidth={3} fill="none" />
    </svg>
  );
}
