// "use client";

// import { useEffect, useRef, useState } from "react";
// import { useRouter } from "next/navigation";
// import { useMapData } from "./hooks/useMapData";
// import ZoneBackground from "./components/ZoneBackground";
// import XPBar from "./components/XPBar";
// import NodeCard from "./components/NodeCard";
// import NodeConnector from "./components/NodeConnector";

// export default function MapPage() {
//   const { data, loading, error, refetch } = useMapData();
//   const router = useRouter();

//   const scrollRef = useRef<HTMLDivElement>(null);
//   const nodeListRef = useRef<HTMLDivElement>(null);
//   const nodeRefs = useRef<(HTMLDivElement | null)[]>([]);

//   const [zoneIndex, setZoneIndex] = useState<0 | 1 | 2 | 3>(0);

//   // Scroll listener — throttled with requestAnimationFrame
//   useEffect(() => {
//     const el = scrollRef.current;
//     if (!el) return;

//     let rafId: number | null = null;

//     function onScroll() {
//       if (rafId !== null) return;
//       rafId = requestAnimationFrame(() => {
//         rafId = null;
//         const el = scrollRef.current;
//         if (!el) return;
//         const { scrollTop, scrollHeight, clientHeight } = el;
//         const max = scrollHeight - clientHeight;
//         const progress = max > 0 ? scrollTop / max : 0;
//         const idx = Math.min(3, Math.floor(progress * 4)) as 0 | 1 | 2 | 3;
//         setZoneIndex(idx);
//       });
//     }

//     el.addEventListener("scroll", onScroll, { passive: true });
//     return () => {
//       el.removeEventListener("scroll", onScroll);
//       if (rafId !== null) cancelAnimationFrame(rafId);
//     };
//   }, []);

//   // Auto-scroll to first available node when data loads
//   useEffect(() => {
//     if (!data) return;
//     const nodes = data.nodes;
//     const firstAvailableIndex = nodes.findIndex((n) => n.status === "available");
//     if (firstAvailableIndex !== -1) {
//       nodeRefs.current[firstAvailableIndex]?.scrollIntoView({
//         behavior: "smooth",
//         block: "center",
//       });
//     }
//   }, [data]);

//   const handleTap = (nodeId: string) => {
//     router.push(`/game/${nodeId}`);
//   };

//   // Loading state
//   if (loading) {
//     return (
//       <div
//         style={{
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "center",
//           height: "100dvh",
//           background: "#f9fafb",
//         }}
//       >
//         <div
//           style={{
//             width: 48,
//             height: 48,
//             borderRadius: "50%",
//             border: "5px solid #e5e7eb",
//             borderTopColor: "#FFCC00",
//             animation: "spin 0.8s linear infinite",
//           }}
//         />
//         <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
//       </div>
//     );
//   }

//   // Error state
//   if (error) {
//     return (
//       <div
//         style={{
//           display: "flex",
//           flexDirection: "column",
//           alignItems: "center",
//           justifyContent: "center",
//           height: "100dvh",
//           gap: "1rem",
//           padding: "2rem",
//           textAlign: "center",
//         }}
//       >
//         <span style={{ fontSize: "3rem" }}>⚠️</span>
//         <p style={{ color: "#1A1A1A", fontWeight: 600, fontSize: "1.1rem" }}>
//           {error}
//         </p>
//         <button
//           onClick={refetch}
//           style={{
//             background: "#FFCC00",
//             color: "#1A1A1A",
//             border: "none",
//             borderRadius: "0.75rem",
//             padding: "0.75rem 2rem",
//             fontWeight: 700,
//             fontSize: "1rem",
//             cursor: "pointer",
//           }}
//         >
//           Retry
//         </button>
//       </div>
//     );
//   }

//   // Empty state
//   if (!data || data.nodes.length === 0) {
//     return (
//       <div
//         style={{
//           display: "flex",
//           flexDirection: "column",
//           alignItems: "center",
//           justifyContent: "center",
//           height: "100dvh",
//           gap: "0.75rem",
//           padding: "2rem",
//           textAlign: "center",
//         }}
//       >
//         <span style={{ fontSize: "3rem" }}>🗺️</span>
//         <p style={{ color: "#1A1A1A", fontWeight: 600, fontSize: "1.1rem" }}>
//           No levels yet — check back soon
//         </p>
//       </div>
//     );
//   }

//   const { nodes, player_progress } = data;
//   const allCompleted = nodes.every((n) => n.status === "completed");

//   return (
//     <div
//       ref={scrollRef}
//       style={{
//         overflowY: "auto",
//         height: "100dvh",
//         position: "relative",
//       }}
//     >
//       {/* Fixed background */}
//       <ZoneBackground zoneIndex={zoneIndex} />

//       {/* Sticky XP bar */}
//       <XPBar
//         level={player_progress.level}
//         currentXP={player_progress.current_xp}
//       />

//       {/* Scrollable content */}
//       <div
//         style={{
//           position: "relative",
//           padding: "2rem 1rem",
//           minHeight: "100%",
//         }}
//       >
//         {/* Header */}
//         <div
//           style={{
//             textAlign: "center",
//             marginBottom: "2rem",
//           }}
//         >
//           <div
//             style={{
//               display: "inline-block",
//               background: "rgba(255, 255, 255, 0.75)",
//               backdropFilter: "blur(8px)",
//               WebkitBackdropFilter: "blur(8px)",
//               borderRadius: "1.5rem",
//               padding: "1.25rem 2rem",
//               boxShadow: "0 4px 24px rgba(0,0,0,0.10)",
//             }}
//           >
//             <div style={{ fontSize: "3.5rem", lineHeight: 1, marginBottom: "0.5rem" }}>
//               🇨🇭
//             </div>
//             <h1
//               style={{
//                 fontSize: "1.5rem",
//                 fontWeight: 800,
//                 color: "#1A1A1A",
//                 margin: 0,
//                 textShadow: "0 1px 4px rgba(255,255,255,0.6)",
//                 letterSpacing: "-0.01em",
//               }}
//             >
//               PostFinance Challenge
//             </h1>
//             <p
//               style={{
//                 fontSize: "0.9rem",
//                 color: "#6b7280",
//                 margin: "0.25rem 0 0",
//               }}
//             >
//               Your financial journey
//             </p>
//           </div>
//         </div>

//         {/* Completion banner */}
//         {allCompleted && (
//           <div
//             style={{
//               background: "rgba(255, 204, 0, 0.95)",
//               borderRadius: "1rem",
//               padding: "1rem 1.5rem",
//               textAlign: "center",
//               marginBottom: "1.5rem",
//               boxShadow: "0 4px 16px rgba(255,204,0,0.4)",
//             }}
//           >
//             <div style={{ fontSize: "2rem" }}>🏆</div>
//             <p style={{ fontWeight: 800, color: "#1A1A1A", margin: "0.25rem 0 0" }}>
//               Journey Complete!
//             </p>
//             <p style={{ fontSize: "0.85rem", color: "#1A1A1A", margin: "0.25rem 0 0" }}>
//               You&apos;ve mastered all financial topics.
//             </p>
//           </div>
//         )}

//         {/* Node list */}
//         <div ref={nodeListRef} style={{ position: "relative" }}>
//           <NodeConnector
//             nodeRefs={nodeRefs}
//             nodeCount={nodes.length}
//             containerRef={nodeListRef}
//           />
//           {nodes.map((node, i) => (
//             <NodeCard
//               key={node.node_id}
//               ref={(el: HTMLDivElement | null) => {
//                 nodeRefs.current[i] = el;
//               }}
//               node={node}
//               index={i}
//               onTap={handleTap}
//             />
//           ))}
//         </div>

//         {/* Bottom padding so last node isn't cut off */}
//         <div style={{ height: "6rem" }} />
//       </div>
//     </div>
//   );
// }
