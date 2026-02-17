"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EdgeScoreBar } from "@/components/edge-score-bar";
import { Pin, Zap, X, Clock, BarChart3 } from "lucide-react";
import { cn } from "@/lib/utils";

export interface MarketCardData {
  id: string;
  title: string;
  category: string;
  yesPrice: number;
  noPrice: number;
  volume: number;
  closeDate: string;
  edgeScore: number;
  confidence: number;
  modelPrice: number;
  marketPrice: number;
  direction: "yes" | "no";
}

interface MarketCardProps {
  market: MarketCardData;
  onPin?: (id: string) => void;
  onWager?: (id: string) => void;
  onDismiss?: (id: string) => void;
  compact?: boolean;
}

function getEdgeColor(score: number) {
  if (score >= 15) return "text-emerald-400";
  if (score >= 8) return "text-amber-400";
  return "text-muted-foreground";
}

function getEdgeBg(score: number) {
  if (score >= 15) return "bg-emerald-500/10 border-emerald-500/20";
  if (score >= 8) return "bg-amber-500/10 border-amber-500/20";
  return "bg-muted border-border";
}

function getTimeRemaining(closeDate: string) {
  const diff = new Date(closeDate).getTime() - Date.now();
  if (diff <= 0) return "Closed";
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(hours / 24);
  if (days > 0) return `${days}d`;
  return `${hours}h`;
}

export function MarketCard({
  market,
  onPin,
  onWager,
  onDismiss,
  compact,
}: MarketCardProps) {
  return (
    <Card
      className={cn(
        "group border-border/50 bg-card transition-all hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5",
        compact && "p-0"
      )}
    >
      <CardHeader className={cn("pb-2", compact && "px-4 py-3")}>
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 space-y-1">
            <div className="flex items-center gap-2">
              <Badge
                variant="secondary"
                className="text-[10px] uppercase tracking-wider"
              >
                {market.category}
              </Badge>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                {getTimeRemaining(market.closeDate)}
              </div>
            </div>
            <h3 className="text-sm font-semibold leading-snug">{market.title}</h3>
          </div>
          <div
            className={cn(
              "flex flex-col items-center rounded-lg border px-3 py-1.5",
              getEdgeBg(market.edgeScore)
            )}
          >
            <span
              className={cn(
                "text-lg font-bold font-mono tabular-nums",
                getEdgeColor(market.edgeScore)
              )}
            >
              {market.edgeScore.toFixed(1)}
            </span>
            <span className="text-[10px] text-muted-foreground uppercase tracking-wider">
              Edge
            </span>
          </div>
        </div>
      </CardHeader>

      <CardContent className={cn("space-y-3", compact && "px-4 pb-3")}>
        <EdgeScoreBar
          modelPrice={market.modelPrice}
          marketPrice={market.marketPrice}
          direction={market.direction}
        />

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <BarChart3 className="h-3 w-3" />
              {market.volume.toLocaleString()} vol
            </span>
            <span>
              Confidence:{" "}
              <span className="font-medium text-foreground">
                {(market.confidence * 100).toFixed(0)}%
              </span>
            </span>
          </div>
          <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
            {onPin && (
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={() => onPin(market.id)}
              >
                <Pin className="h-3.5 w-3.5" />
              </Button>
            )}
            {onWager && (
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-primary hover:text-primary"
                onClick={() => onWager(market.id)}
              >
                <Zap className="h-3.5 w-3.5" />
              </Button>
            )}
            {onDismiss && (
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={() => onDismiss(market.id)}
              >
                <X className="h-3.5 w-3.5" />
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
