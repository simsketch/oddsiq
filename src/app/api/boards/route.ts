import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { boards, boardMarkets, trades } from "@/lib/db/schema";
import { eq, sql, and } from "drizzle-orm";

export async function GET() {
  try {
    const user = await requireUser();

    const results = await db
      .select({
        id: boards.id,
        name: boards.name,
        description: boards.description,
        strategyConfig: boards.strategyConfig,
        riskConfig: boards.riskConfig,
        paperMode: boards.paperMode,
        isArchived: boards.isArchived,
        createdAt: boards.createdAt,
        marketCount: sql<number>`(
          SELECT COUNT(*) FROM oddsiq.board_markets bm WHERE bm.board_id = ${boards.id}
        )::int`,
        pnl: sql<number>`COALESCE((
          SELECT SUM(t.pnl) FROM oddsiq.trades t WHERE t.board_id = ${boards.id}
        ), 0)::float`,
      })
      .from(boards)
      .where(and(eq(boards.userId, user.id), eq(boards.isArchived, false)))
      .orderBy(sql`${boards.createdAt} DESC`);

    return NextResponse.json({ boards: results });
  } catch (error) {
    console.error("Failed to fetch boards:", error);
    return NextResponse.json(
      { error: "Failed to fetch boards" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await requireUser();
    const { name, description, riskConfig } = await req.json();

    if (!name) {
      return NextResponse.json(
        { error: "Board name is required" },
        { status: 400 }
      );
    }

    const [board] = await db
      .insert(boards)
      .values({
        userId: user.id,
        name,
        description,
        riskConfig: riskConfig || {
          max_wager: 10,
          max_daily_exposure: 100,
          max_concentration_pct: 25,
        },
      })
      .returning();

    return NextResponse.json({ board }, { status: 201 });
  } catch (error) {
    console.error("Failed to create board:", error);
    return NextResponse.json(
      { error: "Failed to create board" },
      { status: 500 }
    );
  }
}
