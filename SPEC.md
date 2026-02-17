# OddsIQ — Prediction Market Auto-Trader

## Overview
OddsIQ connects to your Kalshi account and places informed wagers on your behalf. The core UX revolves around **Boards** (curated market collections) and an **Edge Feed** (disproportionate odds front page).

## Stack
- Next.js 15 (App Router, TypeScript)
- Clerk (auth)
- Vercel Postgres (data, schema prefix: `oddsiq`)
- Tailwind CSS + shadcn/ui
- Vercel (deploy)
- Kalshi API (trading)

## Database Schema Prefix
All tables use the `oddsiq` schema: `oddsiq.users`, `oddsiq.boards`, etc.

## Phase 1 — Foundation + Boards

### Auth & Setup
- Clerk auth (sign up / sign in)
- User onboarding: link Kalshi account via API key
- Store encrypted Kalshi credentials in `oddsiq.users`

### Database Schema (`oddsiq.*`)

```sql
CREATE SCHEMA IF NOT EXISTS oddsiq;

CREATE TABLE oddsiq.users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clerk_id TEXT UNIQUE NOT NULL,
  kalshi_api_key_encrypted TEXT,
  kalshi_member_id TEXT,
  settings JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE oddsiq.boards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES oddsiq.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  strategy_config JSONB DEFAULT '{}',
  risk_config JSONB DEFAULT '{"max_wager": 10, "max_daily_exposure": 100, "max_concentration_pct": 25}',
  paper_mode BOOLEAN DEFAULT true,
  is_archived BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE oddsiq.markets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  kalshi_market_id TEXT UNIQUE NOT NULL,
  kalshi_event_id TEXT,
  title TEXT NOT NULL,
  category TEXT,
  subtitle TEXT,
  yes_price NUMERIC(5,2),
  no_price NUMERIC(5,2),
  volume INTEGER,
  open_interest INTEGER,
  close_date TIMESTAMPTZ,
  status TEXT DEFAULT 'active',
  last_synced_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE oddsiq.board_markets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  board_id UUID REFERENCES oddsiq.boards(id) ON DELETE CASCADE,
  market_id UUID REFERENCES oddsiq.markets(id) ON DELETE CASCADE,
  notes TEXT,
  pinned_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(board_id, market_id)
);

CREATE TABLE oddsiq.edge_signals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  market_id UUID REFERENCES oddsiq.markets(id) ON DELETE CASCADE,
  edge_score NUMERIC(5,2) NOT NULL,
  confidence NUMERIC(3,2) NOT NULL,
  model_price NUMERIC(5,2),
  market_price NUMERIC(5,2),
  direction TEXT CHECK (direction IN ('yes', 'no')),
  signal_source TEXT,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE oddsiq.trades (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES oddsiq.users(id) ON DELETE CASCADE,
  board_id UUID REFERENCES oddsiq.boards(id) ON DELETE SET NULL,
  market_id UUID REFERENCES oddsiq.markets(id),
  kalshi_order_id TEXT,
  side TEXT CHECK (side IN ('yes', 'no')),
  amount NUMERIC(10,2),
  price NUMERIC(5,2),
  filled_price NUMERIC(5,2),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'filled', 'cancelled', 'expired')),
  pnl NUMERIC(10,2),
  strategy TEXT,
  is_paper BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  settled_at TIMESTAMPTZ
);

CREATE TABLE oddsiq.market_snapshots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  market_id UUID REFERENCES oddsiq.markets(id) ON DELETE CASCADE,
  yes_price NUMERIC(5,2),
  no_price NUMERIC(5,2),
  volume INTEGER,
  open_interest INTEGER,
  captured_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Pages & Components

#### Home — Edge Feed (`/`)
- Hero: "Where the odds are wrong"
- Real-time feed of markets with highest edge scores
- Each card shows:
  - Market title & category badge
  - Current odds vs model odds (visual bar)
  - Edge score (big, color-coded: green = strong, yellow = moderate)
  - Confidence meter
  - Volume & time-to-close
  - Quick actions: Pin to Board, Quick Wager, Dismiss
- Filters: category, min edge, min confidence, time horizon
- Sort: edge score (default), confidence, volume, closing soon

#### Boards (`/boards`)
- Grid of board cards with name, market count, P&L summary
- Create new board (modal)
- Click → Board detail

#### Board Detail (`/boards/[id]`)
- Board header: name, description, strategy, risk settings, paper/live toggle
- Pinned markets list with odds, edge, position status
- Board-level stats: total exposure, P&L, win rate
- Add markets (search + pin)

#### Portfolio (`/portfolio`)
- Active positions across all boards
- Trade history
- Overall P&L

#### Settings (`/settings`)
- Kalshi API connection
- Default risk parameters
- Notification preferences

### API Routes
- `POST /api/kalshi/connect` — validate & store Kalshi credentials
- `GET /api/kalshi/portfolio` — fetch positions & balance
- `GET /api/markets` — list/search markets
- `GET /api/markets/edge` — edge feed (sorted by edge score)
- `CRUD /api/boards` — board management
- `POST /api/boards/[id]/pin` — pin market to board
- `POST /api/trades` — place trade (paper or live)
