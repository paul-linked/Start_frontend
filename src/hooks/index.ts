import { useEffect, useRef, useCallback, useState } from "react";
import { gameSocket } from "@/lib/socket";
import { useGameStore } from "@/stores/gameStore";
import type { WSMessage, WSMessageType } from "@/types";

// ─── WebSocket Hook ───
export function useWebSocket(gameId: string | null) {
  const { setSession, setState, addPlayer, removePlayer, updatePlayer } =
    useGameStore();

  useEffect(() => {
    if (!gameId) return;

    gameSocket.connect(gameId);

    const unsubs = [
      gameSocket.on("game:state", (msg: WSMessage) => {
        setSession(msg.payload as any);
      }),
      gameSocket.on("player:join", (msg: WSMessage) => {
        addPlayer(msg.payload as any);
      }),
      gameSocket.on("player:leave", (msg: WSMessage) => {
        removePlayer((msg.payload as any).id);
      }),
      gameSocket.on("player:ready", (msg: WSMessage) => {
        const { id, is_ready } = msg.payload as any;
        updatePlayer(id, { is_ready });
      }),
    ];

    return () => {
      unsubs.forEach((unsub) => unsub());
      gameSocket.disconnect();
    };
  }, [gameId]);

  const sendAction = useCallback(
    (type: WSMessageType, payload: unknown) => {
      gameSocket.send(type, payload);
    },
    []
  );

  return { sendAction, connected: gameSocket.connected };
}

// ─── Game Loop Hook ───
export function useGameLoop(
  callback: (delta: number) => void,
  active = true
) {
  const callbackRef = useRef(callback);
  const frameRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);

  callbackRef.current = callback;

  useEffect(() => {
    if (!active) return;

    const loop = (time: number) => {
      if (lastTimeRef.current) {
        const delta = (time - lastTimeRef.current) / 1000; // seconds
        callbackRef.current(Math.min(delta, 0.1)); // cap at 100ms
      }
      lastTimeRef.current = time;
      frameRef.current = requestAnimationFrame(loop);
    };

    frameRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frameRef.current);
  }, [active]);
}

// ─── Generic API Hook ───
export function useApi<T>(
  fetcher: () => Promise<{ data: T }>,
  deps: unknown[] = []
) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetcher();
      setData(res.data);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }, deps);

  useEffect(() => {
    load();
  }, [load]);

  return { data, error, loading, refetch: load };
}
