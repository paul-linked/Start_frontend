# Backend Integration Reference — swiss-postfinance-map

## API Base URL

All requests use the base URL from the environment variable:

```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

Default (if unset): `http://localhost:8000`

Set this in `.env.local` for local development and in your deployment environment for production.

---

## Switching from Mock Data to Live API

Open `src/app/map/hooks/useMapData.ts` and change the single flag at the top of the file:

```ts
// src/app/map/hooks/useMapData.ts
const USE_MOCK = false; // ← was true; no other changes needed
```

No other files need to be modified.

---

## Player Identity

The current player is identified by a UUID stored in `localStorage` under the key `player_id`.

- On first visit, if `player_id` is absent, call `POST /game/start` to obtain one and store it.
- All subsequent requests include `player_id` as a query parameter or request header.

---

## Endpoints

### `POST /game/start`

Creates a new player session. Call this once on first app load if no `player_id` exists in `localStorage`.

**Request**

```http
POST /game/start
Content-Type: application/json

{}
```

**Response `200 OK`**

```json
{
  "player_id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
}
```

Store `player_id` in `localStorage`:

```ts
localStorage.setItem("player_id", data.player_id);
```

---

### `GET /game/map`

Fetches the full map state for the current player, including all nodes and player progress.

**Request**

```http
GET /game/map?player_id=a1b2c3d4-e5f6-7890-abcd-ef1234567890
```

**Response `200 OK`**

```json
{
  "nodes": [
    {
      "node_id": "node_01",
      "label": "Your first deposit",
      "subtitle": "Learn about savings",
      "difficulty": 1,
      "asset_class": "savings",
      "status": "completed",
      "score": 85,
      "icon": "💰"
    },
    {
      "node_id": "node_02",
      "label": "Inflation trap",
      "subtitle": "Why cash loses value",
      "difficulty": 2,
      "asset_class": "savings",
      "status": "available",
      "icon": "📉"
    },
    {
      "node_id": "node_03",
      "label": "Bonds intro",
      "subtitle": "Safe lending basics",
      "difficulty": 2,
      "asset_class": "bonds",
      "status": "locked",
      "icon": "📜"
    }
  ],
  "player_progress": {
    "completed_nodes": ["node_01"],
    "current_xp": 85,
    "level": 1
  }
}
```

**Field reference**

| Field | Type | Description |
|---|---|---|
| `node_id` | `string` | Unique node identifier, e.g. `"node_01"` |
| `label` | `string` | Display name shown on the node card |
| `subtitle` | `string` | Short description shown below the label |
| `difficulty` | `number` | 1–5 difficulty rating |
| `asset_class` | `string` | One of `savings`, `bonds`, `stocks`, `etf`, `mixed` |
| `status` | `string` | One of `locked`, `available`, `completed` |
| `score` | `number?` | 0–100, present only when `status === "completed"` |
| `icon` | `string` | Emoji or icon key displayed on the node |
| `player_progress.completed_nodes` | `string[]` | Array of completed `node_id` values |
| `player_progress.current_xp` | `number` | Total XP earned by the player |
| `player_progress.level` | `number` | Current player level (1–5) |

---

### `POST /game/node/{node_id}/complete`

Marks a node as completed after the player finishes the game. Call this from the game page (`/game/[node_id]`) when the session ends, then redirect back to `/map` — the map will call `refetch()` on mount.

**Request**

```http
POST /game/node/node_02/complete
Content-Type: application/json

{
  "player_id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "score": 92
}
```

**Response `200 OK`**

```json
{
  "xp_earned": 50,
  "total_xp": 135,
  "level": 1,
  "score": 92,
  "lessons": [
    { "id": "lesson_01", "title": "What is inflation?", "completed": true }
  ],
  "next_node_unlocked": "node_03"
}
```

**Field reference**

| Field | Type | Description |
|---|---|---|
| `xp_earned` | `number` | XP awarded for this node completion |
| `total_xp` | `number` | Player's new total XP after this completion |
| `level` | `number` | Player's new level after this completion |
| `score` | `number` | Final score for this node (0–100) |
| `lessons` | `array` | Lesson breakdown (optional, for results screen) |
| `next_node_unlocked` | `string` | `node_id` of the newly unlocked node |

---

## Error Responses

All endpoints return standard error shapes on failure:

```json
{
  "status": 404,
  "message": "Player not found",
  "detail": "No player with id a1b2c3d4-... exists"
}
```

The `useMapData` hook surfaces the `message` field as its `error` string.

---

## Level XP Thresholds

These are hardcoded in the frontend (`XPBar.tsx`) and should match the backend:

| Level | XP required |
|---|---|
| 1 | 0 |
| 2 | 150 |
| 3 | 400 |
| 4 | 800 |
| 5 | 1500 |
