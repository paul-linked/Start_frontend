"use client";

import { motion } from "framer-motion";
import { forwardRef } from "react";
import type { MapNode } from "../types";

interface NodeCardProps {
  node: MapNode;
  index: number;
  onTap: (nodeId: string) => void;
}

const NodeCard = forwardRef<HTMLDivElement, NodeCardProps>(
  ({ node, index, onTap }, ref) => {
    const { status, icon, label, subtitle, score } = node;

    // Zigzag layout
    const marginLeft = index % 2 === 0 ? "55%" : "30%";

    // State-specific styles
    const borderStyle =
      status === "completed"
        ? "4px solid #22c55e"
        : status === "available"
        ? "4px solid #FFCC00"
        : "4px solid #9ca3af";

    const bgColor =
      status === "locked" ? "#f3f4f6" : "#ffffff";

    const boxShadow =
      status === "available"
        ? "0 0 12px 4px rgba(255, 204, 0, 0.5)"
        : undefined;

    const opacity = status === "locked" ? 0.4 : 1;
    const cursor = status !== "locked" ? "pointer" : "default";

    // Float animation for completed nodes (merged with entry)
    const animateProps =
      status === "completed"
        ? { y: [0, -4, 0], opacity: 1 }
        : { opacity: 1, y: 0 };

    const transitionProps =
      status === "completed"
        ? { duration: 3, repeat: Infinity, ease: "easeInOut" as const }
        : { delay: index * 0.05, duration: 0.4 };

    const handleClick =
      status !== "locked" ? () => onTap(node.node_id) : undefined;

    return (
      <motion.div
        ref={ref}
        style={{ marginLeft, display: "inline-flex", position: "relative" }}
        initial={{ opacity: 0, y: 20 }}
        animate={animateProps}
        transition={transitionProps}
        whileHover={
          status === "available"
            ? {
                scale: 1.08,
                filter: "drop-shadow(0 0 8px rgba(255, 204, 0, 0.8))",
              }
            : undefined
        }
        onClick={handleClick}
      >
        {/* Pulse ring for available nodes */}
        {status === "available" && (
          <span
            className="absolute inset-0 animate-ping"
            style={{
              border: "4px solid #FFCC00",
              borderRadius: "1rem",
              opacity: 0.5,
            }}
          />
        )}

        {/* Main card */}
        <div
          style={{
            border: borderStyle,
            background: bgColor,
            boxShadow,
            opacity,
            cursor,
            minWidth: 80,
            minHeight: 80,
            width: 88,
            height: 88,
            borderRadius: "1rem",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "6px 4px 4px",
            position: "relative",
            userSelect: "none",
          }}
        >
          {/* Score badge — completed nodes only */}
          {status === "completed" && (
            <div
              style={{
                position: "absolute",
                top: -10,
                right: -10,
                background: "#FFCC00",
                color: "#1A1A1A",
                fontSize: "0.6rem",
                fontWeight: 700,
                borderRadius: "999px",
                padding: "2px 6px",
                whiteSpace: "nowrap",
                lineHeight: 1.4,
                boxShadow: "0 1px 4px rgba(0,0,0,0.2)",
              }}
            >
              {score != null ? `${score}/100` : "—"}
            </div>
          )}

          {/* Icon */}
          <span
            style={{ fontSize: "2rem", lineHeight: 1, marginBottom: 2 }}
            aria-hidden="true"
          >
            {icon}
          </span>

          {/* Label */}
          <span
            style={{
              fontSize: "0.6rem",
              fontWeight: 700,
              textAlign: "center",
              color: "#1A1A1A",
              lineHeight: 1.2,
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              maxWidth: "100%",
              padding: "0 2px",
            }}
          >
            {label}
          </span>

          {/* Subtitle */}
          <span
            style={{
              fontSize: "0.5rem",
              color: "#6b7280",
              textAlign: "center",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              maxWidth: "100%",
              padding: "0 2px",
              marginTop: 1,
            }}
          >
            {subtitle}
          </span>
        </div>
      </motion.div>
    );
  }
);

NodeCard.displayName = "NodeCard";

export default NodeCard;
