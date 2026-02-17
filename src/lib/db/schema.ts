import {
  pgSchema,
  uuid,
  text,
  jsonb,
  timestamp,
  boolean,
  numeric,
  integer,
  unique,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const oddsiqSchema = pgSchema("oddsiq");

export const users = oddsiqSchema.table("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  clerkId: text("clerk_id").unique().notNull(),
  kalshiApiKeyEncrypted: text("kalshi_api_key_encrypted"),
  kalshiMemberId: text("kalshi_member_id"),
  settings: jsonb("settings").default({}),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

export const boards = oddsiqSchema.table("boards", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  description: text("description"),
  strategyConfig: jsonb("strategy_config").default({}),
  riskConfig: jsonb("risk_config").default({
    max_wager: 10,
    max_daily_exposure: 100,
    max_concentration_pct: 25,
  }),
  paperMode: boolean("paper_mode").default(true),
  isArchived: boolean("is_archived").default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

export const markets = oddsiqSchema.table("markets", {
  id: uuid("id").primaryKey().defaultRandom(),
  kalshiMarketId: text("kalshi_market_id").unique().notNull(),
  kalshiEventId: text("kalshi_event_id"),
  title: text("title").notNull(),
  category: text("category"),
  subtitle: text("subtitle"),
  yesPrice: numeric("yes_price", { precision: 5, scale: 2 }),
  noPrice: numeric("no_price", { precision: 5, scale: 2 }),
  volume: integer("volume"),
  openInterest: integer("open_interest"),
  closeDate: timestamp("close_date", { withTimezone: true }),
  status: text("status").default("active"),
  lastSyncedAt: timestamp("last_synced_at", { withTimezone: true }).defaultNow(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

export const boardMarkets = oddsiqSchema.table(
  "board_markets",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    boardId: uuid("board_id").references(() => boards.id, { onDelete: "cascade" }),
    marketId: uuid("market_id").references(() => markets.id, { onDelete: "cascade" }),
    notes: text("notes"),
    pinnedAt: timestamp("pinned_at", { withTimezone: true }).defaultNow(),
  },
  (table) => [unique().on(table.boardId, table.marketId)]
);

export const edgeSignals = oddsiqSchema.table("edge_signals", {
  id: uuid("id").primaryKey().defaultRandom(),
  marketId: uuid("market_id").references(() => markets.id, { onDelete: "cascade" }),
  edgeScore: numeric("edge_score", { precision: 5, scale: 2 }).notNull(),
  confidence: numeric("confidence", { precision: 3, scale: 2 }).notNull(),
  modelPrice: numeric("model_price", { precision: 5, scale: 2 }),
  marketPrice: numeric("market_price", { precision: 5, scale: 2 }),
  direction: text("direction"),
  signalSource: text("signal_source"),
  expiresAt: timestamp("expires_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

export const trades = oddsiqSchema.table("trades", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }),
  boardId: uuid("board_id").references(() => boards.id, { onDelete: "set null" }),
  marketId: uuid("market_id").references(() => markets.id),
  kalshiOrderId: text("kalshi_order_id"),
  side: text("side"),
  amount: numeric("amount", { precision: 10, scale: 2 }),
  price: numeric("price", { precision: 5, scale: 2 }),
  filledPrice: numeric("filled_price", { precision: 5, scale: 2 }),
  status: text("status").default("pending"),
  pnl: numeric("pnl", { precision: 10, scale: 2 }),
  strategy: text("strategy"),
  isPaper: boolean("is_paper").default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  settledAt: timestamp("settled_at", { withTimezone: true }),
});

export const marketSnapshots = oddsiqSchema.table("market_snapshots", {
  id: uuid("id").primaryKey().defaultRandom(),
  marketId: uuid("market_id").references(() => markets.id, { onDelete: "cascade" }),
  yesPrice: numeric("yes_price", { precision: 5, scale: 2 }),
  noPrice: numeric("no_price", { precision: 5, scale: 2 }),
  volume: integer("volume"),
  openInterest: integer("open_interest"),
  capturedAt: timestamp("captured_at", { withTimezone: true }).defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  boards: many(boards),
  trades: many(trades),
}));

export const boardsRelations = relations(boards, ({ one, many }) => ({
  user: one(users, { fields: [boards.userId], references: [users.id] }),
  boardMarkets: many(boardMarkets),
  trades: many(trades),
}));

export const marketsRelations = relations(markets, ({ many }) => ({
  boardMarkets: many(boardMarkets),
  edgeSignals: many(edgeSignals),
  trades: many(trades),
  snapshots: many(marketSnapshots),
}));

export const boardMarketsRelations = relations(boardMarkets, ({ one }) => ({
  board: one(boards, { fields: [boardMarkets.boardId], references: [boards.id] }),
  market: one(markets, { fields: [boardMarkets.marketId], references: [markets.id] }),
}));

export const edgeSignalsRelations = relations(edgeSignals, ({ one }) => ({
  market: one(markets, { fields: [edgeSignals.marketId], references: [markets.id] }),
}));

export const tradesRelations = relations(trades, ({ one }) => ({
  user: one(users, { fields: [trades.userId], references: [users.id] }),
  board: one(boards, { fields: [trades.boardId], references: [boards.id] }),
  market: one(markets, { fields: [trades.marketId], references: [markets.id] }),
}));

export const marketSnapshotsRelations = relations(marketSnapshots, ({ one }) => ({
  market: one(markets, { fields: [marketSnapshots.marketId], references: [markets.id] }),
}));
