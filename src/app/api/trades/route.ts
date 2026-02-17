import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { trades } from "@/lib/db/schema";
import { eq, sql } from "drizzle-orm";

export async function GET(req: NextRequest) {
  try {
    const user = await requireUser();
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const limit = parseInt(searchParams.get("limit") || "50");

    const conditions = [eq(trades.userId, user.id)];
    if (status) {
      conditions.push(eq(trades.status, status));
    }

    const results = await db
      .select()
      .from(trades)
      .where(sql`${sql.join(conditions, sql` AND `)}`)
      .orderBy(sql`${trades.createdAt} DESC`)
      .limit(limit);

    return NextResponse.json({ trades: results });
  } catch (error) {
    console.error("Failed to fetch trades:", error);
    return NextResponse.json(
      { error: "Failed to fetch trades" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await requireUser();
    const { marketId, boardId, side, amount, price, isPaper = true } = await req.json();

    if (!marketId || !side || !amount || !price) {
      return NextResponse.json(
        { error: "marketId, side, amount, and price are required" },
        { status: 400 }
      );
    }

    if (!["yes", "no"].includes(side)) {
      return NextResponse.json(
        { error: "Side must be 'yes' or 'no'" },
        { status: 400 }
      );
    }

    const [trade] = await db
      .insert(trades)
      .values({
        userId: user.id,
        marketId,
        boardId: boardId || null,
        side,
        amount,
        price,
        isPaper,
        status: isPaper ? "filled" : "pending",
        filledPrice: isPaper ? price : null,
      })
      .returning();

    return NextResponse.json({ trade }, { status: 201 });
  } catch (error) {
    console.error("Failed to place trade:", error);
    return NextResponse.json(
      { error: "Failed to place trade" },
      { status: 500 }
    );
  }
}
