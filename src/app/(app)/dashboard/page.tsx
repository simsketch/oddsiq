"use client";

import { useState, useEffect } from "react";
import { MarketCard, type MarketCardData } from "@/components/market-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Activity, SlidersHorizontal, RefreshCw } from "lucide-react";

const CATEGORIES = ["All", "Politics", "Economics", "Sports", "Science", "Crypto", "Weather"];

// Demo data for when DB is empty
const DEMO_MARKETS: MarketCardData[] = [
  {
    id: "demo-1",
    title: "Will the Fed cut interest rates at the March meeting?",
    category: "Economics",
    yesPrice: 0.42,
    noPrice: 0.58,
    volume: 128450,
    closeDate: new Date(Date.now() + 86400000 * 3).toISOString(),
    edgeScore: 18.5,
    confidence: 0.82,
    modelPrice: 0.61,
    marketPrice: 0.42,
    direction: "yes",
  },
  {
    id: "demo-2",
    title: "Bitcoin above $100K on March 1st?",
    category: "Crypto",
    yesPrice: 0.65,
    noPrice: 0.35,
    volume: 95200,
    closeDate: new Date(Date.now() + 86400000 * 12).toISOString(),
    edgeScore: 12.3,
    confidence: 0.71,
    modelPrice: 0.77,
    marketPrice: 0.65,
    direction: "yes",
  },
  {
    id: "demo-3",
    title: "Will a Category 5 hurricane hit the US in 2026?",
    category: "Weather",
    yesPrice: 0.28,
    noPrice: 0.72,
    volume: 41300,
    closeDate: new Date(Date.now() + 86400000 * 120).toISOString(),
    edgeScore: 15.1,
    confidence: 0.65,
    modelPrice: 0.13,
    marketPrice: 0.28,
    direction: "no",
  },
  {
    id: "demo-4",
    title: "S&P 500 closes above 6,200 this week?",
    category: "Economics",
    yesPrice: 0.55,
    noPrice: 0.45,
    volume: 78900,
    closeDate: new Date(Date.now() + 86400000 * 5).toISOString(),
    edgeScore: 9.8,
    confidence: 0.58,
    modelPrice: 0.65,
    marketPrice: 0.55,
    direction: "yes",
  },
  {
    id: "demo-5",
    title: "Presidential approval rating above 45% in next poll?",
    category: "Politics",
    yesPrice: 0.38,
    noPrice: 0.62,
    volume: 156000,
    closeDate: new Date(Date.now() + 86400000 * 7).toISOString(),
    edgeScore: 22.4,
    confidence: 0.88,
    modelPrice: 0.60,
    marketPrice: 0.38,
    direction: "yes",
  },
  {
    id: "demo-6",
    title: "SpaceX Starship reaches orbit before April?",
    category: "Science",
    yesPrice: 0.72,
    noPrice: 0.28,
    volume: 62100,
    closeDate: new Date(Date.now() + 86400000 * 45).toISOString(),
    edgeScore: 8.2,
    confidence: 0.55,
    modelPrice: 0.80,
    marketPrice: 0.72,
    direction: "yes",
  },
];

export default function EdgeFeedPage() {
  const [markets, setMarkets] = useState<MarketCardData[]>(DEMO_MARKETS);
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("edge");
  const [loading, setLoading] = useState(false);

  const fetchMarkets = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ sort });
      if (category !== "All") params.set("category", category);
      const res = await fetch(`/api/markets/edge?${params}`);
      const data = await res.json();
      if (data.markets && data.markets.length > 0) {
        setMarkets(
          data.markets.map((m: Record<string, unknown>) => ({
            ...m,
            edgeScore: Number(m.edgeScore),
            confidence: Number(m.confidence),
            modelPrice: Number(m.modelPrice),
            marketPrice: Number(m.marketPrice),
            yesPrice: Number(m.yesPrice),
            noPrice: Number(m.noPrice),
          }))
        );
      }
    } catch {
      // Keep demo data on error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMarkets();
  }, [category, sort]);

  const filtered =
    category === "All"
      ? markets
      : markets.filter((m) => m.category === category);

  const sorted = [...filtered].sort((a, b) => {
    switch (sort) {
      case "confidence":
        return b.confidence - a.confidence;
      case "volume":
        return b.volume - a.volume;
      case "closing":
        return new Date(a.closeDate).getTime() - new Date(b.closeDate).getTime();
      default:
        return b.edgeScore - a.edgeScore;
    }
  });

  return (
    <div className="space-y-6">
      {/* Hero */}
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight">
          Where the odds are{" "}
          <span className="text-primary">wrong</span>
        </h1>
        <p className="text-sm text-muted-foreground">
          Markets with the highest predicted edge, ranked by our models.
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-1.5">
          <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Filters</span>
        </div>
        <Separator orientation="vertical" className="h-5" />
        <div className="flex flex-wrap gap-1.5">
          {CATEGORIES.map((cat) => (
            <Badge
              key={cat}
              variant={category === cat ? "default" : "outline"}
              className="cursor-pointer text-xs transition-colors"
              onClick={() => setCategory(cat)}
            >
              {cat}
            </Badge>
          ))}
        </div>
        <div className="ml-auto flex items-center gap-2">
          <Select value={sort} onValueChange={setSort}>
            <SelectTrigger className="h-8 w-[140px] text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="edge">Edge Score</SelectItem>
              <SelectItem value="confidence">Confidence</SelectItem>
              <SelectItem value="volume">Volume</SelectItem>
              <SelectItem value="closing">Closing Soon</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={fetchMarkets}
            disabled={loading}
          >
            <RefreshCw
              className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
            />
          </Button>
        </div>
      </div>

      {/* Feed */}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {sorted.map((market) => (
          <MarketCard
            key={market.id}
            market={market}
            onPin={(id) => console.log("Pin", id)}
            onWager={(id) => console.log("Wager", id)}
            onDismiss={(id) =>
              setMarkets((prev) => prev.filter((m) => m.id !== id))
            }
          />
        ))}
      </div>

      {sorted.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Activity className="mb-4 h-12 w-12 text-muted-foreground/30" />
          <p className="text-lg font-medium text-muted-foreground">
            No markets match your filters
          </p>
          <p className="text-sm text-muted-foreground/70">
            Try adjusting your category or sort filters
          </p>
        </div>
      )}
    </div>
  );
}
