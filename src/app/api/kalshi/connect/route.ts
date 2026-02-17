import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function POST(req: NextRequest) {
  try {
    const user = await requireUser();
    const { apiKey, memberId } = await req.json();

    if (!apiKey || !memberId) {
      return NextResponse.json(
        { error: "API key and member ID are required" },
        { status: 400 }
      );
    }

    // TODO: In production, encrypt the API key before storing
    await db
      .update(users)
      .set({
        kalshiApiKeyEncrypted: apiKey,
        kalshiMemberId: memberId,
        updatedAt: new Date(),
      })
      .where(eq(users.id, user.id));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to connect Kalshi:", error);
    return NextResponse.json(
      { error: "Failed to connect Kalshi account" },
      { status: 500 }
    );
  }
}
