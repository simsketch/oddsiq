import { Badge } from "@/components/ui/badge";
import { TableCell, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";

export interface TradeRowData {
  id: string;
  marketTitle: string;
  side: "yes" | "no";
  amount: number;
  price: number;
  filledPrice?: number;
  status: "pending" | "filled" | "cancelled" | "expired";
  pnl?: number;
  isPaper: boolean;
  createdAt: string;
  boardName?: string;
}

interface TradeRowProps {
  trade: TradeRowData;
}

const statusColors: Record<string, string> = {
  pending: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  filled: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  cancelled: "bg-muted text-muted-foreground",
  expired: "bg-muted text-muted-foreground",
};

export function TradeRow({ trade }: TradeRowProps) {
  return (
    <TableRow className="border-border/50">
      <TableCell className="max-w-[200px]">
        <div className="truncate text-sm font-medium">{trade.marketTitle}</div>
        {trade.boardName && (
          <div className="text-xs text-muted-foreground">{trade.boardName}</div>
        )}
      </TableCell>
      <TableCell>
        <Badge
          variant="outline"
          className={cn(
            "text-[10px] uppercase",
            trade.side === "yes"
              ? "border-emerald-500/30 text-emerald-400"
              : "border-red-500/30 text-red-400"
          )}
        >
          {trade.side}
        </Badge>
      </TableCell>
      <TableCell className="font-mono text-sm tabular-nums">
        ${trade.amount.toFixed(2)}
      </TableCell>
      <TableCell className="font-mono text-sm tabular-nums">
        {(trade.price * 100).toFixed(0)}¢
      </TableCell>
      <TableCell>
        <Badge variant="outline" className={cn("text-[10px]", statusColors[trade.status])}>
          {trade.status}
        </Badge>
      </TableCell>
      <TableCell>
        {trade.pnl !== undefined && trade.pnl !== null ? (
          <span
            className={cn(
              "font-mono text-sm font-semibold tabular-nums",
              trade.pnl >= 0 ? "text-emerald-400" : "text-red-400"
            )}
          >
            {trade.pnl >= 0 ? "+" : ""}${trade.pnl.toFixed(2)}
          </span>
        ) : (
          <span className="text-muted-foreground">—</span>
        )}
      </TableCell>
      <TableCell className="text-xs text-muted-foreground">
        {new Date(trade.createdAt).toLocaleDateString()}
      </TableCell>
    </TableRow>
  );
}
