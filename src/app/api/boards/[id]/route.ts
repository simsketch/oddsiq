import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { boards, boardMarkets, markets, edgeSignals, trades } from "@/lib/db/schema";
import { eq, and, sql } from "drizzle-orm";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireUser();
    const { id } = await params;

    const [board] = await db
      .select()
      .from(boards)
      .where(and(eq(boards.id, id), eq(boards.userId, user.id)))
      .limit(1);

    if (!board) {
      return NextResponse.json({ error: "Board not found" }, { status: 404 });
    }

    const pinnedMarkets = await db
      .select({
        id: markets.id,
        title: markets.title,
        category: markets.category,
        yesPrice: markets.yesPrice,
        noPrice: markets.noPrice,
        volume: markets.volume,
        closeDate: markets.closeDate,
        pinnedAt: boardMarkets.pinnedAt,
        notes: boardMarkets.notes,
        boardMarketId: boardMarkets.id,
      })
      .from(boardMarkets)
      .innerJoin(markets, eq(boardMarkets.marketId, markets.id))
      .where(eq(boardMarkets.boardId, id))
      .orderBy(sql`${boardMarkets.pinnedAt} DESC`);

    const stats = await db
      .select({
        totalExposure: sql<number>`COALESCE(SUM(${trades.amount}), 0)::float`,
        totalPnl: sql<number>`COALESCE(SUM(${trades.pnl}), 0)::float`,
        tradeCount: sql<number>`COUNT(*)::int`,
        winCount: sql<number>`COUNT(*) FILTER (WHERE ${trades.pnl} > 0)::int`,
      })
      .from(trades)
      .where(eq(trades.boardId, id));

    return NextResponse.json({
      board,
      pinnedMarkets,
      stats: stats[0] || {
        totalExposure: 0,
        totalPnl: 0,
        tradeCount: 0,
        winCount: 0,
      },
    });
  } catch (error) {
    console.error("Failed to fetch board:", error);
    return NextResponse.json(
      { error: "Failed to fetch board" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireUser();
    const { id } = await params;
    const updates = await req.json();

    const [board] = await db
      .update(boards)
      .set({ ...updates, updatedAt: new Date() })
      .where(and(eq(boards.id, id), eq(boards.userId, user.id)))
      .returning();

    if (!board) {
      return NextResponse.json({ error: "Board not found" }, { status: 404 });
    }

    return NextResponse.json({ board });
  } catch (error) {
    console.error("Failed to update board:", error);
    return NextResponse.json(
      { error: "Failed to update board" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireUser();
    const { id } = await params;

    const [board] = await db
      .update(boards)
      .set({ isArchived: true, updatedAt: new Date() })
      .where(and(eq(boards.id, id), eq(boards.userId, user.id)))
      .returning();

    if (!board) {
      return NextResponse.json({ error: "Board not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete board:", error);
    return NextResponse.json(
      { error: "Failed to delete board" },
      { status: 500 }
    );
  }
}
