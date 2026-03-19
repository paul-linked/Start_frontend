"use client";

import { useRouter } from "next/navigation";
import { GameArena, NODE_01_SCENARIOS } from "@/components/game";

export default function GamePage() {
  const router = useRouter();

  return (
    <GameArena
      nodeId="node_01"
      nodeLabel="Your first $1,000"
      scenarios={NODE_01_SCENARIOS}
      onComplete={() => router.push("/")}
    />
  );
}