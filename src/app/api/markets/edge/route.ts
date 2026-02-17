import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { markets, edgeSignals } from "@/lib/db/schema";
import { eq, sql, gte, and } from "drizzle-orm";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const minEdge = parseFloat(searchParams.get("minEdge") || "0");
    const minConfidence = parseFloat(searchParams.get("minConfidence") || "0");
    const category = searchParams.get("category");
    const sort = searchParams.get("sort") || "edge";
    const limit = parseInt(searchParams.get("limit") || "20");

    const conditions = [
      gte(edgeSignals.edgeScore, minEdge.toString()),
      gte(edgeSignals.confidence, minConfidence.toString()),
      eq(markets.status, "active"),
    ];

    if (category) {
      conditions.push(eq(markets.category, category));
    }

    let orderBy;
    switch (sort) {
      case "confidence":
        orderBy = sql`${edgeSignals.confidence} DESC`;
        break;
      case "volume":
        orderBy = sql`${markets.volume} DESC NULLS LAST`;
        break;
      case "closing":
        orderBy = sql`${markets.closeDate} ASC NULLS LAST`;
        break;
      default:
        orderBy = sql`${edgeSignals.edgeScore} DESC`;
    }

    const results = await db
      .select({
        id: markets.id,
        title: markets.title,
        category: markets.category,
        yesPrice: markets.yesPrice,
        noPrice: markets.noPrice,
        volume: markets.volume,
        closeDate: markets.closeDate,
        edgeScore: edgeSignals.edgeScore,
        confidence: edgeSignals.confidence,
        modelPrice: edgeSignals.modelPrice,
        marketPrice: edgeSignals.marketPrice,
        direction: edgeSignals.direction,
      })
      .from(edgeSignals)
      .innerJoin(markets, eq(edgeSignals.marketId, markets.id))
      .where(and(...conditions))
      .orderBy(orderBy)
      .limit(limit);

    return NextResponse.json({ markets: results });
  } catch (error) {
    console.error("Failed to fetch edge feed:", error);
    return NextResponse.json(
      { error: "Failed to fetch edge feed" },
      { status: 500 }
    );
  }
}
