# Game Frontend

Next.js 16.2 + React 19.2 game client with PWA support, WebSocket real-time communication, and a game-oriented component library.

## Stack

| Layer | Tech |
|-------|------|
| Framework | Next.js 16.2 (App Router, Turbopack) |
| React | React 19.2 (View Transitions, async params) |
| Styling | Tailwind CSS 3.4 + CSS variables for theming |
| Animation | Framer Motion 11 |
| State | Zustand (game state + auth + toasts) |
| Audio | Howler.js (lazy-loaded) |
| Real-time | Native WebSocket with auto-reconnect |
| PWA | Manual service worker (`public/sw.js`) |


## Quick Start

```bash
cp .env.local.example .env.local   # configure API URL
npm install
npm run dev                        # http://localhost:3000
```

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `NEXT_PUBLIC_API_URL` | `https://api.bonappit.com` | Backend REST API base URL |
| `NEXT_PUBLIC_WS_URL` | `wss://api.bonappit.com/ws` | WebSocket endpoint |
| `NEXT_PUBLIC_GAME_TITLE` | `"Game Title"` | Displayed in header and PWA manifest |
| `NEXT_PUBLIC_APP_NAME` | `"Game App"` | PWA app name |

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── layout.tsx          # Root layout (fonts, PWA meta, globals)
│   ├── page.tsx            # Home / Main menu
│   ├── game/page.tsx       # Gameplay screen (Suspense-wrapped)
│   ├── lobby/page.tsx      # Room browser + create
│   └── menu/page.tsx       # Settings
├── components/
│   ├── ui/                 # Game UI kit (Button, Card, Input, Modal, Badge, Toast, ProgressBar, Spinner)
│   ├── hud/                # In-game HUD overlay
│   ├── game/               # Game-specific components (your game pieces, board, etc.)
│   └── layout/             # ClientProviders (service worker registration)
├── hooks/
│   ├── index.ts            # useWebSocket, useGameLoop, useApi
│   └── useServiceWorker.ts # PWA service worker registration
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

## Backend API

The backend lives at `https://api.bonappit.com`. The frontend can either call it directly (CORS) or proxy through Next.js rewrites (`/api/v1/*` → backend).

### REST Endpoints

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

### WebSocket

`wss://api.bonappit.com/ws/game/:id?token=<jwt>`

Message format:
```json
{ "type": "game:state", "payload": { ... }, "timestamp": 1234567890 }
```

## Theming

All colors are CSS variables in `globals.css`. Swap the `:root` block or use `[data-theme="fantasy"]` for alternate skins. The Tailwind config maps `game-*` colors to these variables so you can use `bg-game-primary`, `text-game-danger`, etc. everywhere.

## PWA


The app uses a manual service worker (`public/sw.js`) instead of `next-pwa`, which is incompatible with Next.js 16.

- Service worker registered in production via `useServiceWorker` hook (wired through `ClientProviders`)
- Caches API responses (network-first) and static/game assets (cache-first)
- `overscroll-behavior: none` prevents pull-to-refresh
- `userScalable: false` in viewport for game controls
- Add 192×192 and 512×512 icons to `public/icons/`

## Next.js 16 Notes

A few things to keep in mind when extending this codebase:

- **ESM config**: `package.json` has `"type": "module"`. PostCSS config uses `.cjs` extension. `next.config.js` uses `export default`.
- **Async params**: Server component `params` and `searchParams` props are async in Next.js 16. Use `await props.params` in server components.
- **Suspense for `useSearchParams`**: Any client component using `useSearchParams()` must be wrapped in a `<Suspense>` boundary (see `game/page.tsx` for the pattern).
- **React 19 ref types**: `useRef<HTMLElement>(null)` returns `RefObject<HTMLElement | null>`. Prop types accepting refs need the `| null` union.
- **Turbopack**: Used by default for both `next dev` and `next build`. No `--turbopack` flag needed.

## Next Steps

1. Add your 192px and 512px app icons to `public/icons/`
2. Wire up actual game logic in `src/app/game/page.tsx` and `useGameLoop`
3. Build game-specific components in `src/components/game/`
4. Implement auth flow (login/register forms → `authStore`)
5. Add sound files to `public/sounds/` and trigger via `playSound()`
6. Ensure backend CORS allows your frontend origin
