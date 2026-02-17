import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { markets } from "@/lib/db/schema";
import { sql, ilike, eq } from "drizzle-orm";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search");
    const category = searchParams.get("category");
    const status = searchParams.get("status") || "active";
    const limit = parseInt(searchParams.get("limit") || "50");
    const offset = parseInt(searchParams.get("offset") || "0");

    const conditions = [];

    if (status) {
      conditions.push(eq(markets.status, status));
    }
    if (search) {
      conditions.push(ilike(markets.title, `%${search}%`));
    }
    if (category) {
      conditions.push(eq(markets.category, category));
    }

    const where =
      conditions.length > 0
        ? sql`${sql.join(
            conditions.map((c) => sql`${c}`),
            sql` AND `
          )}`
        : undefined;

    const results = await db
      .select()
      .from(markets)
      .where(where)
      .limit(limit)
      .offset(offset)
      .orderBy(sql`${markets.volume} DESC NULLS LAST`);

    return NextResponse.json({ markets: results });
  } catch (error) {
    console.error("Failed to fetch markets:", error);
    return NextResponse.json(
      { error: "Failed to fetch markets" },
      { status: 500 }
    );
  }
}
