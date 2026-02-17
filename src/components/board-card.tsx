"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LayoutGrid, TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";

export interface BoardCardData {
  id: string;
  name: string;
  description?: string;
  marketCount: number;
  pnl: number;
  paperMode: boolean;
  isArchived: boolean;
}

interface BoardCardProps {
  board: BoardCardData;
}

export function BoardCard({ board }: BoardCardProps) {
  const isPositive = board.pnl >= 0;

  return (
    <Link href={`/boards/${board.id}`}>
      <Card className="group border-border/50 bg-card transition-all hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 cursor-pointer">
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                <LayoutGrid className="h-4 w-4 text-primary" />
              </div>
              <CardTitle className="text-base">{board.name}</CardTitle>
            </div>
            <div className="flex items-center gap-1.5">
              {board.paperMode && (
                <Badge variant="outline" className="text-[10px]">
                  Paper
                </Badge>
              )}
              {board.isArchived && (
                <Badge variant="secondary" className="text-[10px]">
                  Archived
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {board.description && (
            <p className="mb-3 text-xs text-muted-foreground line-clamp-2">
              {board.description}
            </p>
          )}
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">
              {board.marketCount} market{board.marketCount !== 1 ? "s" : ""}
            </span>
            <div
              className={cn(
                "flex items-center gap-1 text-sm font-semibold font-mono tabular-nums",
                isPositive ? "text-emerald-400" : "text-red-400"
              )}
            >
              {isPositive ? (
                <TrendingUp className="h-3.5 w-3.5" />
              ) : (
                <TrendingDown className="h-3.5 w-3.5" />
              )}
              ${Math.abs(board.pnl).toFixed(2)}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
