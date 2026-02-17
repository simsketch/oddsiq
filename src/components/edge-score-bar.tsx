import { cn } from "@/lib/utils";

interface EdgeScoreBarProps {
  modelPrice: number;
  marketPrice: number;
  direction: "yes" | "no";
  className?: string;
}

export function EdgeScoreBar({
  modelPrice,
  marketPrice,
  direction,
  className,
}: EdgeScoreBarProps) {
  const modelPct = modelPrice * 100;
  const marketPct = marketPrice * 100;

  return (
    <div className={cn("space-y-1.5", className)}>
      <div className="flex items-center justify-between text-xs">
        <span className="text-muted-foreground">Market</span>
        <span className="font-mono">{marketPct.toFixed(0)}¢</span>
      </div>
      <div className="relative h-2 w-full overflow-hidden rounded-full bg-muted">
        <div
          className="absolute inset-y-0 left-0 rounded-full bg-muted-foreground/40 transition-all"
          style={{ width: `${marketPct}%` }}
        />
        <div
          className={cn(
            "absolute inset-y-0 left-0 rounded-full transition-all",
            direction === "yes" ? "bg-emerald-500" : "bg-red-500"
          )}
          style={{ width: `${modelPct}%` }}
        />
      </div>
      <div className="flex items-center justify-between text-xs">
        <span className="text-muted-foreground">Model</span>
        <span className="font-mono font-semibold text-primary">
          {modelPct.toFixed(0)}¢
        </span>
      </div>
    </div>
  );
}
