import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { trades, markets } from "@/lib/db/schema";
import { eq, and, sql } from "drizzle-orm";

export async function GET() {
  try {
    const user = await requireUser();

    const positions = await db
      .select({
        id: trades.id,
        marketTitle: markets.title,
        side: trades.side,
        amount: trades.amount,
        price: trades.price,
        filledPrice: trades.filledPrice,
        status: trades.status,
        pnl: trades.pnl,
        isPaper: trades.isPaper,
        createdAt: trades.createdAt,
      })
      .from(trades)
      .innerJoin(markets, eq(trades.marketId, markets.id))
      .where(eq(trades.userId, user.id))
      .orderBy(sql`${trades.createdAt} DESC`);

    const totalPnl = positions.reduce(
      (sum, t) => sum + (Number(t.pnl) || 0),
      0
    );
    const activeCount = positions.filter((t) => t.status === "filled").length;

    return NextResponse.json({
      positions,
      summary: {
        totalPnl,
        activePositions: activeCount,
        totalTrades: positions.length,
      },
    });
  } catch (error) {
    console.error("Failed to fetch portfolio:", error);
    return NextResponse.json(
      { error: "Failed to fetch portfolio" },
      { status: 500 }
    );
  }
}
