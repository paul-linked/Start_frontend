# Game Frontend

Next.js 14 + React game client with PWA support, WebSocket real-time communication, and a game-oriented component library.

## Stack

| Layer | Tech |
|-------|------|
| Framework | Next.js 14 (App Router) |
| Styling | Tailwind CSS 3.4 + CSS variables for theming |
| Animation | Framer Motion 11 |
| State | Zustand (game state + auth + toasts) |
| Audio | Howler.js (lazy-loaded) |
| Real-time | Native WebSocket with auto-reconnect |
| PWA | next-pwa (Workbox under the hood) |

## Quick Start

```bash
cp .env.local.example .env.local   # configure API URL
npm install
npm run dev                        # http://localhost:3000
```

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── layout.tsx          # Root layout (fonts, PWA meta, globals)
│   ├── page.tsx            # Home / Main menu
│   ├── game/page.tsx       # Gameplay screen
│   ├── lobby/page.tsx      # Room browser + create
│   └── menu/page.tsx       # Settings
├── components/
│   ├── ui/                 # Game UI kit (Button, Card, Input, Modal, Badge, Toast, ProgressBar, Spinner)
│   ├── hud/                # In-game HUD overlay
│   ├── game/               # Game-specific components (your game pieces, board, etc.)
│   └── layout/             # Shared layout shells
├── hooks/                  # useWebSocket, useGameLoop, useApi
├── lib/
│   ├── api.ts              # REST client with auth + typed endpoints
│   ├── socket.ts           # WebSocket singleton with reconnect
│   └── utils.ts            # cn(), formatTime(), playSound(), haptic()
├── stores/
│   ├── gameStore.ts        # Game session, players, state
│   └── authStore.ts        # User, tokens
├── styles/
│   └── globals.css         # Theme variables, base styles, utility classes
└── types/
    └── index.ts            # Shared TypeScript types
```

## Backend API Contract

The frontend expects the backend at `NEXT_PUBLIC_API_URL` to expose:

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/v1/auth/login` | POST | Login → `{ access_token }` |
| `/api/v1/auth/register` | POST | Register |
| `/api/v1/auth/me` | GET | Current user |
| `/api/v1/lobby` | GET | List rooms |
| `/api/v1/lobby` | POST | Create room |
| `/api/v1/lobby/:id/join` | POST | Join room |
| `/api/v1/lobby/:id/leave` | POST | Leave room |
| `/api/v1/game` | POST | Create game session |
| `/api/v1/game/:id` | GET | Get game state |
| `/api/v1/game/:id/action` | POST | Send game action |

WebSocket: `ws://<host>/ws/game/:id?token=<jwt>`

Message format:
```json
{ "type": "game:state", "payload": { ... }, "timestamp": 1234567890 }
```

## Theming

All colors are CSS variables in `globals.css`. Swap the `:root` block or use `[data-theme="fantasy"]` for alternate skins. The Tailwind config maps `game-*` colors to these variables so you can use `bg-game-primary`, `text-game-danger`, etc. everywhere.

## PWA

- Auto-registered service worker (disabled in dev)
- Caches API responses (NetworkFirst, 5 min)
- Caches static + game assets (CacheFirst, 30/90 days)
- `overscroll-behavior: none` prevents pull-to-refresh
- `userScalable: false` in viewport for game controls
- Add 192×192 and 512×512 icons to `public/icons/`

## Next Steps

1. Add your 192px and 512px app icons to `public/icons/`
2. Wire up actual game logic in `src/app/game/page.tsx` and `useGameLoop`
3. Build game-specific components in `src/components/game/`
4. Implement auth flow (login/register forms → `authStore`)
5. Add sound files to `public/sounds/` and trigger via `playSound()`
