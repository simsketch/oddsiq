"use client";

import { useState, useEffect, use } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  Pin,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Target,
  BarChart3,
  Search,
  Clock,
  Settings,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface BoardData {
  id: string;
  name: string;
  description: string | null;
  paperMode: boolean;
  riskConfig: {
    max_wager: number;
    max_daily_exposure: number;
    max_concentration_pct: number;
  };
}

interface PinnedMarket {
  id: string;
  title: string;
  category: string | null;
  yesPrice: string | null;
  noPrice: string | null;
  volume: number | null;
  closeDate: string | null;
  pinnedAt: string;
}

interface BoardStats {
  totalExposure: number;
  totalPnl: number;
  tradeCount: number;
  winCount: number;
}

// Demo data
const DEMO_BOARD: BoardData = {
  id: "demo-b1",
  name: "Fed Watchers",
  description: "Interest rate decisions and economic policy markets",
  paperMode: true,
  riskConfig: {
    max_wager: 10,
    max_daily_exposure: 100,
    max_concentration_pct: 25,
  },
};

const DEMO_MARKETS: PinnedMarket[] = [
  {
    id: "demo-pm1",
    title: "Will the Fed cut interest rates at the March meeting?",
    category: "Economics",
    yesPrice: "0.42",
    noPrice: "0.58",
    volume: 128450,
    closeDate: new Date(Date.now() + 86400000 * 3).toISOString(),
    pinnedAt: new Date().toISOString(),
  },
  {
    id: "demo-pm2",
    title: "Fed holds rates steady through Q2 2026?",
    category: "Economics",
    yesPrice: "0.68",
    noPrice: "0.32",
    volume: 84200,
    closeDate: new Date(Date.now() + 86400000 * 90).toISOString(),
    pinnedAt: new Date().toISOString(),
  },
  {
    id: "demo-pm3",
    title: "US CPI above 3% in February report?",
    category: "Economics",
    yesPrice: "0.35",
    noPrice: "0.65",
    volume: 52100,
    closeDate: new Date(Date.now() + 86400000 * 14).toISOString(),
    pinnedAt: new Date().toISOString(),
  },
];

const DEMO_STATS: BoardStats = {
  totalExposure: 85.0,
  totalPnl: 42.5,
  tradeCount: 12,
  winCount: 8,
};

export default function BoardDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [board, setBoard] = useState<BoardData>(DEMO_BOARD);
  const [pinnedMarkets, setPinnedMarkets] = useState<PinnedMarket[]>(DEMO_MARKETS);
  const [stats, setStats] = useState<BoardStats>(DEMO_STATS);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (id.startsWith("demo-")) return;
    fetch(`/api/boards/${id}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.board) {
          setBoard(data.board);
          setPinnedMarkets(data.pinnedMarkets || []);
          setStats(data.stats || DEMO_STATS);
        }
      })
      .catch(() => {});
  }, [id]);

  const winRate =
    stats.tradeCount > 0
      ? ((stats.winCount / stats.tradeCount) * 100).toFixed(0)
      : "0";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Link href="/boards">
              <Button variant="ghost" size="icon" className="h-7 w-7">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <h1 className="text-2xl font-bold tracking-tight">{board.name}</h1>
            {board.paperMode && (
              <Badge variant="outline" className="text-xs">
                Paper Trading
              </Badge>
            )}
          </div>
          {board.description && (
            <p className="text-sm text-muted-foreground pl-9">
              {board.description}
            </p>
          )}
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <Card className="border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <DollarSign className="h-3.5 w-3.5" />
              Total Exposure
            </div>
            <p className="mt-1 text-xl font-bold font-mono tabular-nums">
              ${stats.totalExposure.toFixed(2)}
            </p>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              {stats.totalPnl >= 0 ? (
                <TrendingUp className="h-3.5 w-3.5" />
              ) : (
                <TrendingDown className="h-3.5 w-3.5" />
              )}
              P&L
            </div>
            <p
              className={cn(
                "mt-1 text-xl font-bold font-mono tabular-nums",
                stats.totalPnl >= 0 ? "text-emerald-400" : "text-red-400"
              )}
            >
              {stats.totalPnl >= 0 ? "+" : ""}${stats.totalPnl.toFixed(2)}
            </p>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Target className="h-3.5 w-3.5" />
              Win Rate
            </div>
            <p className="mt-1 text-xl font-bold font-mono tabular-nums">
              {winRate}%
            </p>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <BarChart3 className="h-3.5 w-3.5" />
              Trades
            </div>
            <p className="mt-1 text-xl font-bold font-mono tabular-nums">
              {stats.tradeCount}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Risk Settings */}
      <Card className="border-border/50">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-sm">
              <Settings className="h-4 w-4 text-muted-foreground" />
              Risk Settings
            </CardTitle>
            <div className="flex items-center gap-2">
              <Label htmlFor="paper" className="text-xs text-muted-foreground">
                Paper Mode
              </Label>
              <Switch id="paper" checked={board.paperMode} />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-xs text-muted-foreground">Max Wager</span>
              <p className="font-mono font-semibold">
                ${board.riskConfig.max_wager}
              </p>
            </div>
            <div>
              <span className="text-xs text-muted-foreground">
                Daily Exposure
              </span>
              <p className="font-mono font-semibold">
                ${board.riskConfig.max_daily_exposure}
              </p>
            </div>
            <div>
              <span className="text-xs text-muted-foreground">
                Max Concentration
              </span>
              <p className="font-mono font-semibold">
                {board.riskConfig.max_concentration_pct}%
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Pinned Markets */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Pin className="h-4 w-4 text-primary" />
            Pinned Markets
            <Badge variant="secondary" className="text-xs">
              {pinnedMarkets.length}
            </Badge>
          </h2>
          <div className="relative w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search markets to pin..."
              className="h-9 pl-9 text-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-2">
          {pinnedMarkets.map((market) => (
            <Card key={market.id} className="border-border/50">
              <CardContent className="flex items-center justify-between p-4">
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    {market.category && (
                      <Badge
                        variant="secondary"
                        className="text-[10px] uppercase tracking-wider"
                      >
                        {market.category}
                      </Badge>
                    )}
                    {market.closeDate && (
                      <span className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {new Date(market.closeDate).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                  <p className="text-sm font-medium">{market.title}</p>
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <div className="text-right">
                    <div className="text-xs text-muted-foreground">Yes</div>
                    <div className="font-mono font-semibold text-emerald-400">
                      {market.yesPrice
                        ? `${(Number(market.yesPrice) * 100).toFixed(0)}¢`
                        : "—"}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-muted-foreground">No</div>
                    <div className="font-mono font-semibold text-red-400">
                      {market.noPrice
                        ? `${(Number(market.noPrice) * 100).toFixed(0)}¢`
                        : "—"}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-muted-foreground">Vol</div>
                    <div className="font-mono text-xs">
                      {market.volume?.toLocaleString() || "—"}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {pinnedMarkets.length === 0 && (
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border py-12 text-center">
            <Pin className="mb-3 h-8 w-8 text-muted-foreground/30" />
            <p className="text-sm text-muted-foreground">
              No markets pinned yet
            </p>
            <p className="text-xs text-muted-foreground/70">
              Search and pin markets from the Edge Feed
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
