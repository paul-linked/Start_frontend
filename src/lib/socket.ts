import type { WSMessage, WSMessageType } from "@/types";
import { getAccessToken } from "./api";

type MessageHandler = (message: WSMessage) => void;

const WS_URL = process.env.NEXT_PUBLIC_WS_URL || "wss://api.bonappit.com/ws";
const RECONNECT_DELAY_MS = 2000;
const MAX_RECONNECT_ATTEMPTS = 10;

class GameSocket {
  private ws: WebSocket | null = null;
  private handlers = new Map<WSMessageType | "*", Set<MessageHandler>>();
  private reconnectAttempts = 0;
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  private _gameId: string | null = null;
  private _isConnecting = false;

  get connected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN;
  }

  // ─── Connect ───
  connect(gameId: string) {
    if (this._isConnecting || this.connected) return;
    this._isConnecting = true;
    this._gameId = gameId;
    this.reconnectAttempts = 0;

    const token = getAccessToken();
    const url = `${WS_URL}/game/${gameId}${token ? `?token=${token}` : ""}`;

    this.ws = new WebSocket(url);

    this.ws.onopen = () => {
      this._isConnecting = false;
      this.reconnectAttempts = 0;
      console.log(`[WS] Connected to game ${gameId}`);
    };

    this.ws.onmessage = (event) => {
      try {
        const msg: WSMessage = JSON.parse(event.data);
        this.dispatch(msg);
      } catch (err) {
        console.error("[WS] Failed to parse message:", err);
      }
    };

    this.ws.onclose = (event) => {
      this._isConnecting = false;
      console.log(`[WS] Disconnected (code: ${event.code})`);
      if (!event.wasClean) this.tryReconnect();
    };

    this.ws.onerror = (err) => {
      this._isConnecting = false;
      console.error("[WS] Error:", err);
    };
  }

  // ─── Disconnect ───
  disconnect() {
    if (this.reconnectTimer) clearTimeout(this.reconnectTimer);
    this.reconnectAttempts = MAX_RECONNECT_ATTEMPTS; // prevent reconnect
    this.ws?.close(1000, "client disconnect");
    this.ws = null;
    this._gameId = null;
  }

  // ─── Send ───
  send(type: WSMessageType, payload: unknown) {
    if (!this.connected) {
      console.warn("[WS] Not connected, message dropped");
      return;
    }
    const msg: WSMessage = { type, payload, timestamp: Date.now() };
    this.ws!.send(JSON.stringify(msg));
  }

  // ─── Subscribe / Unsubscribe ───
  on(type: WSMessageType | "*", handler: MessageHandler) {
    if (!this.handlers.has(type)) this.handlers.set(type, new Set());
    this.handlers.get(type)!.add(handler);
    return () => this.off(type, handler);
  }

  off(type: WSMessageType | "*", handler: MessageHandler) {
    this.handlers.get(type)?.delete(handler);
  }

  // ─── Internal ───
  private dispatch(msg: WSMessage) {
    this.handlers.get(msg.type)?.forEach((h) => h(msg));
    this.handlers.get("*")?.forEach((h) => h(msg));
  }

  private tryReconnect() {
    if (this.reconnectAttempts >= MAX_RECONNECT_ATTEMPTS || !this._gameId) return;
    this.reconnectAttempts++;

    const delay = RECONNECT_DELAY_MS * Math.min(this.reconnectAttempts, 5);
    console.log(`[WS] Reconnecting in ${delay}ms (attempt ${this.reconnectAttempts})`);

    this.reconnectTimer = setTimeout(() => {
      this.connect(this._gameId!);
    }, delay);
  }
}

// Singleton
export const gameSocket = new GameSocket();