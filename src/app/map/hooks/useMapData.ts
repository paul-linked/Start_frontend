import { useEffect, useRef, useState } from "react";
import { MapData, UseMapDataResult } from "../types";
import { mockMapData } from "../data/mockMapData";

const USE_MOCK = true; // ← flip to false to use live API

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";
const TIMEOUT_MS = 10_000;

function getOrCreatePlayerId(): string {
  const stored = localStorage.getItem("player_id");
  if (stored) return stored;
  const id = crypto.randomUUID();
  localStorage.setItem("player_id", id);
  return id;
}

export function useMapData(): UseMapDataResult {
  const [data, setData] = useState<MapData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fetchCount, setFetchCount] = useState(0);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    let cancelled = false;

    if (USE_MOCK) {
      setLoading(true);
      setError(null);
      const timer = setTimeout(() => {
        if (!cancelled) {
          setData(mockMapData);
          setLoading(false);
        }
      }, 300);
      return () => {
        cancelled = true;
        clearTimeout(timer);
      };
    }

    // Live mode
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

    setLoading(true);
    setError(null);

    const playerId = getOrCreatePlayerId();

    fetch(`${API_BASE}/game/map?player_id=${playerId}`, {
      signal: controller.signal,
    })
      .then(async (res) => {
        clearTimeout(timeoutId);
        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          throw new Error(body?.message ?? `HTTP ${res.status}`);
        }
        return res.json() as Promise<MapData>;
      })
      .then((json) => {
        if (!cancelled) {
          setData(json);
          setLoading(false);
        }
      })
      .catch((err: Error) => {
        clearTimeout(timeoutId);
        if (cancelled) return;
        if (err.name === "AbortError") {
          setError("Request timed out");
        } else {
          setError(err.message);
        }
        setLoading(false);
      });

    return () => {
      cancelled = true;
      clearTimeout(timeoutId);
      controller.abort();
    };
  }, [fetchCount]);

  const refetch = () => setFetchCount((c) => c + 1);

  return { data, loading, error, refetch };
}
