"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TradeRow, type TradeRowData } from "@/components/trade-row";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Activity,
  BarChart3,
  Briefcase,
} from "lucide-react";
import { cn } from "@/lib/utils";

const DEMO_TRADES: TradeRowData[] = [
  {
    id: "t1",
    marketTitle: "Will the Fed cut rates in March?",
    side: "yes",
    amount: 10,
    price: 0.42,
    filledPrice: 0.42,
    status: "filled",
    pnl: 5.8,
    isPaper: true,
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    boardName: "Fed Watchers",
  },
  {
    id: "t2",
    marketTitle: "Bitcoin above $100K on March 1st?",
    side: "yes",
    amount: 15,
    price: 0.65,
    filledPrice: 0.65,
    status: "filled",
    pnl: -8.25,
    isPaper: true,
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    boardName: "Crypto Plays",
  },
  {
    id: "t3",
    marketTitle: "S&P 500 closes above 6,200 this week?",
    side: "no",
    amount: 8,
    price: 0.45,
    filledPrice: 0.45,
    status: "filled",
    pnl: 12.4,
    isPaper: true,
    createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
    boardName: "Fed Watchers",
  },
  {
    id: "t4",
    marketTitle: "Presidential approval rating above 45%?",
    side: "yes",
    amount: 5,
    price: 0.38,
    status: "pending",
    isPaper: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: "t5",
    marketTitle: "US CPI above 3% in February?",
    side: "no",
    amount: 12,
    price: 0.65,
    filledPrice: 0.65,
    status: "filled",
    pnl: 18.6,
    isPaper: false,
    createdAt: new Date(Date.now() - 86400000 * 8).toISOString(),
    boardName: "Fed Watchers",
  },
];

export default function PortfolioPage() {
  const [trades, setTrades] = useState<TradeRowData[]>(DEMO_TRADES);

  useEffect(() => {
    fetch("/api/kalshi/portfolio")
      .then((r) => r.json())
      .then((data) => {
        if (data.positions && data.positions.length > 0) {
          setTrades(
            data.positions.map((t: Record<string, unknown>) => ({
              id: t.id,
              marketTitle: t.marketTitle,
              side: t.side,
              amount: Number(t.amount),
              price: Number(t.price),
              filledPrice: t.filledPrice ? Number(t.filledPrice) : undefined,
              status: t.status,
              pnl: t.pnl ? Number(t.pnl) : undefined,
              isPaper: t.isPaper,
              createdAt: t.createdAt,
            }))
          );
        }
      })
      .catch(() => {});
  }, []);

  const activeTrades = trades.filter(
    (t) => t.status === "filled" || t.status === "pending"
  );
  const historyTrades = trades.filter(
    (t) => t.status === "cancelled" || t.status === "expired" || t.pnl !== undefined
  );

  const totalPnl = trades.reduce((sum, t) => sum + (t.pnl || 0), 0);
  const totalExposure = activeTrades.reduce((sum, t) => sum + t.amount, 0);
  const winCount = trades.filter((t) => (t.pnl || 0) > 0).length;
  const tradeCount = trades.filter((t) => t.pnl !== undefined).length;
  const winRate = tradeCount > 0 ? ((winCount / tradeCount) * 100).toFixed(0) : "0";

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight">Portfolio</h1>
        <p className="text-sm text-muted-foreground">
          Track your positions and performance across all boards
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <Card className="border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <DollarSign className="h-3.5 w-3.5" />
              Total P&L
            </div>
            <p
              className={cn(
                "mt-1 text-xl font-bold font-mono tabular-nums",
                totalPnl >= 0 ? "text-emerald-400" : "text-red-400"
              )}
            >
              {totalPnl >= 0 ? "+" : ""}${totalPnl.toFixed(2)}
            </p>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Activity className="h-3.5 w-3.5" />
              Active Positions
            </div>
            <p className="mt-1 text-xl font-bold font-mono tabular-nums">
              {activeTrades.length}
            </p>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <BarChart3 className="h-3.5 w-3.5" />
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
              <Briefcase className="h-3.5 w-3.5" />
              Exposure
            </div>
            <p className="mt-1 text-xl font-bold font-mono tabular-nums">
              ${totalExposure.toFixed(2)}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Trades Table */}
      <Tabs defaultValue="active">
        <TabsList>
          <TabsTrigger value="active" className="gap-1.5">
            Active
            <span className="ml-1 rounded bg-primary/10 px-1.5 py-0.5 text-[10px] font-mono">
              {activeTrades.length}
            </span>
          </TabsTrigger>
          <TabsTrigger value="history" className="gap-1.5">
            History
            <span className="ml-1 rounded bg-muted px-1.5 py-0.5 text-[10px] font-mono">
              {historyTrades.length}
            </span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="mt-4">
          {activeTrades.length > 0 ? (
            <Card className="border-border/50">
              <Table>
                <TableHeader>
                  <TableRow className="border-border/50">
                    <TableHead>Market</TableHead>
                    <TableHead>Side</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>P&L</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {activeTrades.map((trade) => (
                    <TradeRow key={trade.id} trade={trade} />
                  ))}
                </TableBody>
              </Table>
            </Card>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <Activity className="mb-4 h-10 w-10 text-muted-foreground/30" />
              <p className="text-muted-foreground">No active positions</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="history" className="mt-4">
          {historyTrades.length > 0 ? (
            <Card className="border-border/50">
              <Table>
                <TableHeader>
                  <TableRow className="border-border/50">
                    <TableHead>Market</TableHead>
                    <TableHead>Side</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>P&L</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {historyTrades.map((trade) => (
                    <TradeRow key={trade.id} trade={trade} />
                  ))}
                </TableBody>
              </Table>
            </Card>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <BarChart3 className="mb-4 h-10 w-10 text-muted-foreground/30" />
              <p className="text-muted-foreground">No trade history</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
