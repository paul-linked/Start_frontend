"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { GameButton, GameCard, GameInput, GameBadge, GameModal, ToastContainer, toast } from "@/components/ui";
import { endpoints } from "@/lib/api";
import { useApi } from "@/hooks";
import type { LobbyRoom } from "@/types";

export default function LobbyPage() {
  const router = useRouter();
  const [showCreate, setShowCreate] = useState(false);
  const [newRoomName, setNewRoomName] = useState("");
  const [joining, setJoining] = useState<string | null>(null);

  const { data: rooms, loading, refetch } = useApi<LobbyRoom[]>(
    () => endpoints.lobby.list() as any,
    []
  );

  async function handleCreate() {
    if (!newRoomName.trim()) return;
    try {
      const res = await endpoints.lobby.create(newRoomName.trim());
      setShowCreate(false);
      setNewRoomName("");
      toast.success("Room created!");
      refetch();
    } catch (err: any) {
      toast.error(err.message || "Failed to create room");
    }
  }

  async function handleJoin(roomId: string) {
    setJoining(roomId);
    try {
      await endpoints.lobby.join(roomId);
      router.push(`/game?id=${roomId}`);
    } catch (err: any) {
      toast.error(err.message || "Failed to join");
      setJoining(null);
    }
  }

  return (
    <div className="game-viewport overflow-y-auto bg-gradient-game">
      <ToastContainer />

      <div className="mx-auto max-w-2xl px-4 py-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="font-display text-3xl font-bold uppercase tracking-wider text-game-primary">
              Lobby
            </h1>
            <p className="mt-1 font-body text-sm text-game-text-dim">
              Join a room or create your own
            </p>
          </div>
          <div className="flex gap-3">
            <GameButton variant="ghost" size="sm" onClick={() => router.push("/")}>
              Back
            </GameButton>
            <GameButton
              variant="primary"
              size="sm"
              onClick={() => setShowCreate(true)}
            >
              + New Room
            </GameButton>
          </div>
        </div>

        {/* Room List */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-game-primary/20 border-t-game-primary" />
          </div>
        ) : !rooms?.length ? (
          <GameCard variant="bordered" className="py-16 text-center">
            <p className="font-body text-game-text-dim">
              No rooms yet. Be the first to create one!
            </p>
          </GameCard>
        ) : (
          <motion.div className="flex flex-col gap-3">
            <AnimatePresence>
              {rooms.map((room, i) => (
                <motion.div
                  key={room.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <GameCard
                    variant="default"
                    className="flex items-center justify-between"
                  >
                    <div>
                      <p className="font-display text-lg font-semibold text-game-text">
                        {room.name}
                      </p>
                      <div className="mt-1 flex items-center gap-2">
                        <span className="font-mono text-xs text-game-text-dim">
                          Host: {room.host.username}
                        </span>
                        <GameBadge
                          variant={room.state === "waiting" ? "success" : "default"}
                          pulse={room.state === "waiting"}
                        >
                          {room.state}
                        </GameBadge>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="font-mono text-sm text-game-text-dim">
                        {room.player_count}/{room.max_players}
                      </span>
                      <GameButton
                        size="sm"
                        variant="primary"
                        onClick={() => handleJoin(room.id)}
                        loading={joining === room.id}
                        disabled={
                          room.player_count >= room.max_players ||
                          room.state !== "waiting"
                        }
                      >
                        Join
                      </GameButton>
                    </div>
                  </GameCard>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>

      {/* Create Room Modal */}
      <GameModal
        open={showCreate}
        onClose={() => setShowCreate(false)}
        title="Create Room"
      >
        <div className="flex flex-col gap-4">
          <GameInput
            label="Room Name"
            placeholder="My awesome room"
            value={newRoomName}
            onChange={(e) => setNewRoomName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleCreate()}
            autoFocus
          />
          <GameButton variant="primary" onClick={handleCreate}>
            Create
          </GameButton>
        </div>
      </GameModal>
    </div>
  );
}
