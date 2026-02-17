import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { boards, boardMarkets } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireUser();
    const { id } = await params;
    const { marketId, notes } = await req.json();

    if (!marketId) {
      return NextResponse.json(
        { error: "Market ID is required" },
        { status: 400 }
      );
    }

    // Verify board belongs to user
    const [board] = await db
      .select()
      .from(boards)
      .where(and(eq(boards.id, id), eq(boards.userId, user.id)))
      .limit(1);

    if (!board) {
      return NextResponse.json({ error: "Board not found" }, { status: 404 });
    }

    const [pinned] = await db
      .insert(boardMarkets)
      .values({
        boardId: id,
        marketId,
        notes,
      })
      .onConflictDoNothing()
      .returning();

    return NextResponse.json({ pinned: pinned || null }, { status: 201 });
  } catch (error) {
    console.error("Failed to pin market:", error);
    return NextResponse.json(
      { error: "Failed to pin market to board" },
      { status: 500 }
    );
  }
}
